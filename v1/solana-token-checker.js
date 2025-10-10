/**
 * Solana Token Ownership Checker - Browser Compatible Version
 * Checks whether a connected wallet owns a specific SPL token (legacy or Token-2022) and retrieves its balance.
 * 
 * This version is designed to work in browsers with Solana libraries loaded via CDN or bundler.
 * 
 * Dependencies (load these via CDN in your HTML):
 * - @solana/web3.js
 * - @solana/spl-token
 * 
 * Example usage:
 * const checker = new SolanaTokenChecker('https://api.mainnet-beta.solana.com');
 * const result = await checker.checkTokenBalance(walletAddress, mintAddress);
 */

class SolanaTokenChecker {
  constructor(rpcUrl = null) {
    // Check if Solana libraries are available
    if (typeof window !== 'undefined') {
      if (!window.solanaWeb3) {
        console.warn('⚠️ @solana/web3.js not found. Please load it via CDN or bundler.');
      }
      if (!window.splToken) {
        console.warn('⚠️ @solana/spl-token not found. Please load it via CDN or bundler.');
      }
    }

    // Use environment variable, passed URL, or default to public RPC
    this.rpcUrl = rpcUrl || 
                  (typeof process !== 'undefined' && process.env?.SOLANA_RPC) || 
                  'https://api.mainnet-beta.solana.com';
    
    this.connection = null;
    this.initConnection();
    
    // Cache for mint information to improve performance
    this.mintCache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes cache
  }

  /**
   * Initialize Solana connection
   */
  initConnection() {
    try {
      // Try to use Solana web3 from global scope or imports
      const { Connection } = this.getSolanaWeb3();
      this.connection = new Connection(this.rpcUrl, { commitment: 'finalized' });
    } catch (error) {
      console.error('Failed to initialize Solana connection:', error);
      throw new Error('Solana web3.js library not available. Please load @solana/web3.js');
    }
  }

  /**
   * Get Solana web3 library
   */
  getSolanaWeb3() {
    if (typeof window !== 'undefined' && window.solanaWeb3) {
      return window.solanaWeb3;
    }
    // Try to import if in Node.js environment
    try {
      return require('@solana/web3.js');
    } catch {
      throw new Error('@solana/web3.js not available');
    }
  }

  /**
   * Get SPL Token library
   */
  getSplToken() {
    if (typeof window !== 'undefined' && window.splToken) {
      return window.splToken;
    }
    // Try to import if in Node.js environment
    try {
      return require('@solana/spl-token');
    } catch {
      throw new Error('@solana/spl-token not available');
    }
  }

  /**
   * Set a custom RPC URL
   * @param {string} rpcUrl - The Solana RPC URL
   */
  setRpcUrl(rpcUrl) {
    this.rpcUrl = rpcUrl;
    this.initConnection();
  }

  /**
   * Get mint info from cache or fetch from RPC
   * @param {PublicKey} mintAddress - The mint address
   * @param {PublicKey} programId - The token program ID
   * @returns {Promise<Object>} Mint info with decimals
   */
  async getMintInfo(mintAddress, programId) {
    const cacheKey = `${mintAddress.toBase58()}-${programId.toBase58()}`;
    const cached = this.mintCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    try {
      const { getMint } = this.getSplToken();
      const mintInfo = await getMint(this.connection, mintAddress, 'finalized', programId);
      
      const data = {
        decimals: mintInfo.decimals,
        supply: mintInfo.supply?.toString() || '0',
        freezeAuthority: mintInfo.freezeAuthority?.toBase58() || null,
        mintAuthority: mintInfo.mintAuthority?.toBase58() || null
      };
      
      this.mintCache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      return data;
    } catch (error) {
      throw new Error(`Failed to get mint info: ${error.message}`);
    }
  }

  /**
   * Check token balance for a specific wallet and mint
   * @param {string} ownerAddr - Owner wallet address
   * @param {string} mintAddr - Token mint address  
   * @param {boolean} useToken2022 - Whether to use Token-2022 program
   * @returns {Promise<Object>} Token balance information
   */
  async checkTokenBalance(ownerAddr, mintAddr, useToken2022 = false) {
    try {
      const { PublicKey } = this.getSolanaWeb3();
      const { 
        getAssociatedTokenAddress, 
        getAccount, 
        TOKEN_PROGRAM_ID, 
        TOKEN_2022_PROGRAM_ID 
      } = this.getSplToken();

      const OWNER = new PublicKey(ownerAddr);
      const MINT = new PublicKey(mintAddr);
      const PROGRAM_ID = useToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID;

      // Get the Associated Token Address
      const ata = await getAssociatedTokenAddress(MINT, OWNER, false, PROGRAM_ID);

      try {
        // Try to get both mint info and token account in parallel
        const [mintInfo, tokenAccount] = await Promise.all([
          this.getMintInfo(MINT, PROGRAM_ID),
          getAccount(this.connection, ata, 'finalized', PROGRAM_ID)
        ]);

        // Calculate UI amount using decimals
        const rawAmount = tokenAccount.amount.toString();
        const uiAmount = Number(rawAmount) / Math.pow(10, mintInfo.decimals);

        return {
          hasAccount: true,
          uiAmount,
          rawAmount,
          decimals: mintInfo.decimals,
          ata: ata.toBase58(),
          programType: useToken2022 ? 'Token-2022' : 'Token',
          isNative: tokenAccount.isNative || false,
          owner: tokenAccount.owner.toBase58(),
          mint: tokenAccount.mint.toBase58()
        };

      } catch (accountError) {
        // ATA doesn't exist or other account-specific error
        if (accountError.name === 'TokenAccountNotFoundError' || 
            accountError.message.includes('could not find account') ||
            accountError.message.includes('Invalid param: could not find account')) {
          
          // Still try to get mint info for metadata
          try {
            const mintInfo = await this.getMintInfo(MINT, PROGRAM_ID);
            return {
              hasAccount: false,
              uiAmount: 0,
              rawAmount: '0',
              decimals: mintInfo.decimals,
              ata: ata.toBase58(),
              programType: useToken2022 ? 'Token-2022' : 'Token'
            };
          } catch (mintError) {
            // Even mint doesn't exist or invalid
            return {
              hasAccount: false,
              uiAmount: 0,
              rawAmount: '0',
              ata: ata.toBase58(),
              programType: useToken2022 ? 'Token-2022' : 'Token',
              error: 'Invalid mint address or mint does not exist'
            };
          }
        }
        
        // Re-throw other unexpected errors
        throw accountError;
      }

    } catch (error) {
      console.error('Error checking token balance:', error);
      
      // Return error response
      return {
        hasAccount: false,
        uiAmount: 0,
        rawAmount: '0',
        error: error.message || 'Failed to check token balance',
        programType: useToken2022 ? 'Token-2022' : 'Token'
      };
    }
  }

  /**
   * Auto-detect if a mint uses Token-2022 program
   * @param {string} mintAddr - Token mint address
   * @returns {Promise<boolean>} True if Token-2022, false if legacy Token program
   */
  async detectTokenProgram(mintAddr) {
    try {
      const { PublicKey } = this.getSolanaWeb3();
      const { getMint, TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } = this.getSplToken();
      
      const MINT = new PublicKey(mintAddr);
      
      // Try Token-2022 first
      try {
        await getMint(this.connection, MINT, 'finalized', TOKEN_2022_PROGRAM_ID);
        return true; // It's Token-2022
      } catch (token2022Error) {
        // Try legacy Token program
        try {
          await getMint(this.connection, MINT, 'finalized', TOKEN_PROGRAM_ID);
          return false; // It's legacy Token program
        } catch (tokenError) {
          throw new Error('Mint not found in either Token program or Token-2022 program');
        }
      }
    } catch (error) {
      throw new Error(`Failed to detect token program: ${error.message}`);
    }
  }

  /**
   * Check token balance with auto-detection of Token program
   * @param {string} ownerAddr - Owner wallet address
   * @param {string} mintAddr - Token mint address
   * @returns {Promise<Object>} Token balance information
   */
  async checkTokenBalanceAuto(ownerAddr, mintAddr) {
    try {
      const isToken2022 = await this.detectTokenProgram(mintAddr);
      return await this.checkTokenBalance(ownerAddr, mintAddr, isToken2022);
    } catch (error) {
      console.error('Error in auto token balance check:', error);
      return {
        hasAccount: false,
        uiAmount: 0,
        rawAmount: '0',
        error: error.message || 'Failed to check token balance with auto-detection'
      };
    }
  }

  /**
   * Check multiple tokens at once
   * @param {string} ownerAddr - Owner wallet address
   * @param {Array<{mintAddress: string, useToken2022?: boolean}>} tokens - Array of token info
   * @returns {Promise<Array<Object>>} Array of token balance information
   */
  async checkMultipleTokens(ownerAddr, tokens) {
    const results = await Promise.allSettled(
      tokens.map(token => 
        this.checkTokenBalance(ownerAddr, token.mintAddress, token.useToken2022 || false)
      )
    );

    return results.map((result, index) => ({
      mintAddress: tokens[index].mintAddress,
      ...(result.status === 'fulfilled' ? result.value : {
        hasAccount: false,
        uiAmount: 0,
        rawAmount: '0',
        error: result.reason?.message || 'Failed to check token'
      })
    }));
  }

  /**
   * Clear the mint info cache
   */
  clearCache() {
    this.mintCache.clear();
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getCacheStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const [key, value] of this.mintCache.entries()) {
      if (now - value.timestamp < this.cacheExpiry) {
        validEntries++;
      } else {
        expiredEntries++;
      }
    }

    return {
      totalEntries: this.mintCache.size,
      validEntries,
      expiredEntries,
      cacheExpiryMs: this.cacheExpiry
    };
  }

  /**
   * Get connection info
   * @returns {Object} Connection information
   */
  getConnectionInfo() {
    return {
      rpcUrl: this.rpcUrl,
      commitment: this.connection?.commitment,
      connected: !!this.connection
    };
  }
}

// Export for both browser and Node.js environments
if (typeof window !== 'undefined') {
  window.SolanaTokenChecker = SolanaTokenChecker;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SolanaTokenChecker;
}