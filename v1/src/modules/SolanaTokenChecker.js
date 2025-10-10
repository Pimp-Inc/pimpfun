/**
 * Solana Token Ownership Checker
 * Checks whether a connected wallet owns a specific SPL token (legacy or Token-2022) and retrieves its balance.
 * 
 * Requirements:
 * - Accept mint address and wallet address as inputs
 * - Query Solana RPC to derive or find the Associated Token Account (ATA)
 * - Verify whether the ATA exists
 * - Return token balance, decimals, and program type (Token or Token-2022)
 * - Handle tokens without existing ATAs
 * - Cache mint info for performance
 */

// Note: These imports will work in a Node.js environment
// For browser usage, these would need to be loaded via CDN or bundler
import { Connection, PublicKey } from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  getAccount,
  getMint,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';

class SolanaTokenChecker {
  constructor(rpcUrl = null) {
    // Use environment variable or default to public RPC
    this.rpcUrl = rpcUrl || process.env.SOLANA_RPC || 'https://api.mainnet-beta.solana.com';
    this.connection = new Connection(this.rpcUrl, { commitment: 'finalized' });
    
    // Cache for mint information to improve performance
    this.mintCache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes cache
  }

  /**
   * Set a custom RPC URL
   * @param {string} rpcUrl - The Solana RPC URL
   */
  setRpcUrl(rpcUrl) {
    this.rpcUrl = rpcUrl;
    this.connection = new Connection(this.rpcUrl, { commitment: 'finalized' });
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
      const mintInfo = await getMint(this.connection, mintAddress, 'finalized', programId);
      const data = {
        decimals: mintInfo.decimals,
        supply: mintInfo.supply,
        freezeAuthority: mintInfo.freezeAuthority,
        mintAuthority: mintInfo.mintAuthority
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
        const uiAmount = Number(tokenAccount.amount) / Math.pow(10, mintInfo.decimals);

        return {
          hasAccount: true,
          uiAmount,
          rawAmount: tokenAccount.amount.toString(),
          decimals: mintInfo.decimals,
          ata: ata.toBase58(),
          programType: useToken2022 ? 'Token-2022' : 'Token',
          isNative: tokenAccount.isNative,
          owner: tokenAccount.owner.toBase58(),
          mint: tokenAccount.mint.toBase58()
        };

      } catch (accountError) {
        // ATA doesn't exist or other account-specific error
        if (accountError.name === 'TokenAccountNotFoundError' || 
            accountError.message.includes('could not find account')) {
          
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
}

// Export for both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SolanaTokenChecker;
} else if (typeof window !== 'undefined') {
  window.SolanaTokenChecker = SolanaTokenChecker;
}

export default SolanaTokenChecker;