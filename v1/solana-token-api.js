/**
 * Solana Token API Module
 * Provides API-style endpoints for checking Solana token ownership
 * 
 * This module provides the API structure mentioned in the requirements:
 * POST /api/check-solana-token
 * Body: { walletAddress: string, mintAddress: string }
 * Response: { hasAccount: boolean, uiAmount: number, decimals?: number }
 */

class SolanaTokenAPI {
  constructor(rpcUrl = null) {
    // Load the SolanaTokenChecker class
    if (typeof SolanaTokenChecker === 'undefined') {
      console.error('SolanaTokenChecker not found. Please load solana-token-checker.js first.');
      throw new Error('SolanaTokenChecker dependency not found');
    }
    
    this.tokenChecker = new SolanaTokenChecker(rpcUrl);
    this.defaultRpcUrls = {
      mainnet: 'https://api.mainnet-beta.solana.com',
      devnet: 'https://api.devnet.solana.com',
      testnet: 'https://api.testnet.solana.com'
    };
  }

  /**
   * Set RPC URL for different networks
   * @param {string} network - 'mainnet', 'devnet', 'testnet', or custom URL
   */
  setNetwork(network) {
    const rpcUrl = this.defaultRpcUrls[network] || network;
    this.tokenChecker.setRpcUrl(rpcUrl);
  }

  /**
   * API endpoint simulation for checking Solana token ownership
   * Simulates: POST /api/check-solana-token
   * @param {Object} requestBody - { walletAddress: string, mintAddress: string, useToken2022?: boolean }
   * @returns {Promise<Object>} API response format
   */
  async checkSolanaToken(requestBody) {
    try {
      // Validate request body
      const validationResult = this.validateRequest(requestBody);
      if (!validationResult.valid) {
        return {
          success: false,
          error: validationResult.error,
          statusCode: 400
        };
      }

      const { walletAddress, mintAddress, useToken2022 = false } = requestBody;

      // Check token balance
      const result = await this.tokenChecker.checkTokenBalance(
        walletAddress, 
        mintAddress, 
        useToken2022
      );

      // Format API response
      const apiResponse = {
        success: true,
        hasAccount: result.hasAccount,
        uiAmount: result.uiAmount,
        statusCode: 200
      };

      // Add optional fields if available
      if (result.decimals !== undefined) {
        apiResponse.decimals = result.decimals;
      }
      
      if (result.programType) {
        apiResponse.programType = result.programType;
      }

      if (result.ata) {
        apiResponse.ata = result.ata;
      }

      if (result.rawAmount) {
        apiResponse.rawAmount = result.rawAmount;
      }

      // Include error message if there was an issue but still return data
      if (result.error) {
        apiResponse.warning = result.error;
      }

      return apiResponse;

    } catch (error) {
      console.error('Error in checkSolanaToken API:', error);
      return {
        success: false,
        error: error.message || 'Internal server error',
        statusCode: 500
      };
    }
  }

  /**
   * Auto-detect token program and check balance
   * @param {Object} requestBody - { walletAddress: string, mintAddress: string }
   * @returns {Promise<Object>} API response format
   */
  async checkSolanaTokenAuto(requestBody) {
    try {
      const validationResult = this.validateRequest(requestBody);
      if (!validationResult.valid) {
        return {
          success: false,
          error: validationResult.error,
          statusCode: 400
        };
      }

      const { walletAddress, mintAddress } = requestBody;

      const result = await this.tokenChecker.checkTokenBalanceAuto(walletAddress, mintAddress);

      return {
        success: true,
        hasAccount: result.hasAccount,
        uiAmount: result.uiAmount,
        decimals: result.decimals,
        programType: result.programType,
        ata: result.ata,
        rawAmount: result.rawAmount,
        warning: result.error,
        statusCode: 200
      };

    } catch (error) {
      console.error('Error in checkSolanaTokenAuto API:', error);
      return {
        success: false,
        error: error.message || 'Internal server error',
        statusCode: 500
      };
    }
  }

  /**
   * Check multiple tokens for a wallet
   * @param {Object} requestBody - { walletAddress: string, tokens: Array<{mintAddress: string, useToken2022?: boolean}> }
   * @returns {Promise<Object>} API response format
   */
  async checkMultipleSolanaTokens(requestBody) {
    try {
      const { walletAddress, tokens } = requestBody;

      if (!walletAddress || !Array.isArray(tokens)) {
        return {
          success: false,
          error: 'walletAddress and tokens array are required',
          statusCode: 400
        };
      }

      const results = await this.tokenChecker.checkMultipleTokens(walletAddress, tokens);

      return {
        success: true,
        tokens: results,
        totalTokens: results.length,
        statusCode: 200
      };

    } catch (error) {
      console.error('Error in checkMultipleSolanaTokens API:', error);
      return {
        success: false,
        error: error.message || 'Internal server error',
        statusCode: 500
      };
    }
  }

  /**
   * Get token program type for a mint
   * @param {Object} requestBody - { mintAddress: string }
   * @returns {Promise<Object>} API response format
   */
  async detectTokenProgram(requestBody) {
    try {
      const { mintAddress } = requestBody;

      if (!mintAddress) {
        return {
          success: false,
          error: 'mintAddress is required',
          statusCode: 400
        };
      }

      const isToken2022 = await this.tokenChecker.detectTokenProgram(mintAddress);

      return {
        success: true,
        mintAddress,
        isToken2022,
        programType: isToken2022 ? 'Token-2022' : 'Token',
        statusCode: 200
      };

    } catch (error) {
      console.error('Error in detectTokenProgram API:', error);
      return {
        success: false,
        error: error.message || 'Failed to detect token program',
        statusCode: 500
      };
    }
  }

  /**
   * Get API health and statistics
   * @returns {Object} Health check response
   */
  getHealth() {
    const cacheStats = this.tokenChecker.getCacheStats();
    const connectionInfo = this.tokenChecker.getConnectionInfo();

    return {
      success: true,
      healthy: true,
      connection: connectionInfo,
      cache: cacheStats,
      timestamp: new Date().toISOString(),
      statusCode: 200
    };
  }

  /**
   * Validate API request body
   * @param {Object} requestBody - Request body to validate
   * @returns {Object} Validation result
   */
  validateRequest(requestBody) {
    if (!requestBody) {
      return { valid: false, error: 'Request body is required' };
    }

    const { walletAddress, mintAddress } = requestBody;

    if (!walletAddress) {
      return { valid: false, error: 'walletAddress is required' };
    }

    if (!mintAddress) {
      return { valid: false, error: 'mintAddress is required' };
    }

    // Basic format validation
    if (typeof walletAddress !== 'string' || walletAddress.length < 32) {
      return { valid: false, error: 'Invalid walletAddress format' };
    }

    if (typeof mintAddress !== 'string' || mintAddress.length < 32) {
      return { valid: false, error: 'Invalid mintAddress format' };
    }

    return { valid: true };
  }

  /**
   * Clear cache
   * @returns {Object} API response
   */
  clearCache() {
    this.tokenChecker.clearCache();
    return {
      success: true,
      message: 'Cache cleared successfully',
      statusCode: 200
    };
  }
}

// Example usage functions for easy integration
const SolanaTokenAPIHelpers = {
  /**
   * Quick check if wallet owns a specific token
   * @param {string} walletAddress - Wallet address
   * @param {string} mintAddress - Token mint address
   * @param {string} rpcUrl - Optional RPC URL
   * @returns {Promise<boolean>} True if wallet owns the token
   */
  async hasToken(walletAddress, mintAddress, rpcUrl = null) {
    const api = new SolanaTokenAPI(rpcUrl);
    const result = await api.checkSolanaTokenAuto({ walletAddress, mintAddress });
    return result.success && result.hasAccount && result.uiAmount > 0;
  },

  /**
   * Get token balance
   * @param {string} walletAddress - Wallet address
   * @param {string} mintAddress - Token mint address
   * @param {string} rpcUrl - Optional RPC URL
   * @returns {Promise<number>} Token balance
   */
  async getTokenBalance(walletAddress, mintAddress, rpcUrl = null) {
    const api = new SolanaTokenAPI(rpcUrl);
    const result = await api.checkSolanaTokenAuto({ walletAddress, mintAddress });
    return result.success ? result.uiAmount : 0;
  },

  /**
   * Check if wallet has minimum token amount
   * @param {string} walletAddress - Wallet address
   * @param {string} mintAddress - Token mint address
   * @param {number} minAmount - Minimum required amount
   * @param {string} rpcUrl - Optional RPC URL
   * @returns {Promise<boolean>} True if wallet has at least minAmount
   */
  async hasMinimumTokens(walletAddress, mintAddress, minAmount, rpcUrl = null) {
    const balance = await this.getTokenBalance(walletAddress, mintAddress, rpcUrl);
    return balance >= minAmount;
  }
};

// Make available globally for browser usage
if (typeof window !== 'undefined') {
  window.SolanaTokenAPI = SolanaTokenAPI;
  window.SolanaTokenAPIHelpers = SolanaTokenAPIHelpers;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SolanaTokenAPI, SolanaTokenAPIHelpers };
}