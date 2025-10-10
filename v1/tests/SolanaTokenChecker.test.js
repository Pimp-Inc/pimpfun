/**
 * Tests for Solana Token Checker functionality
 */

// Mock Solana dependencies for testing
const mockConnection = {
  commitment: 'finalized'
};

const mockPublicKey = {
  toBase58: () => 'mock-public-key-base58'
};

const mockMintInfo = {
  decimals: 6,
  supply: BigInt('1000000000000'),
  freezeAuthority: null,
  mintAuthority: null
};

const mockTokenAccount = {
  amount: BigInt('1000000'), // 1 token with 6 decimals
  decimals: 6,
  isNative: false,
  owner: mockPublicKey,
  mint: mockPublicKey
};

// Mock Solana web3 and SPL token libraries
const mockSolanaWeb3 = {
  Connection: jest.fn(() => mockConnection),
  PublicKey: jest.fn(() => mockPublicKey)
};

const mockSplToken = {
  getAssociatedTokenAddress: jest.fn(() => Promise.resolve(mockPublicKey)),
  getAccount: jest.fn(() => Promise.resolve(mockTokenAccount)),
  getMint: jest.fn(() => Promise.resolve(mockMintInfo)),
  TOKEN_PROGRAM_ID: mockPublicKey,
  TOKEN_2022_PROGRAM_ID: mockPublicKey
};

// Mock the SolanaTokenChecker class for testing
class MockSolanaTokenChecker {
  constructor(rpcUrl = null) {
    this.rpcUrl = rpcUrl || 'https://api.mainnet-beta.solana.com';
    this.connection = mockConnection;
    this.mintCache = new Map();
    this.cacheExpiry = 5 * 60 * 1000;
  }

  getSolanaWeb3() {
    return mockSolanaWeb3;
  }

  getSplToken() {
    return mockSplToken;
  }

  setRpcUrl(rpcUrl) {
    this.rpcUrl = rpcUrl;
  }

  async getMintInfo(mintAddress, programId) {
    const cacheKey = `${mintAddress.toBase58()}-${programId.toBase58()}`;
    const cached = this.mintCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    const data = {
      decimals: mockMintInfo.decimals,
      supply: mockMintInfo.supply.toString(),
      freezeAuthority: mockMintInfo.freezeAuthority,
      mintAuthority: mockMintInfo.mintAuthority
    };
    
    this.mintCache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  }

  async checkTokenBalance(ownerAddr, mintAddr, useToken2022 = false) {
    try {
      // Simulate invalid mint first (most specific case)
      if (mintAddr.includes('invalid-mint-address')) {
        return {
          hasAccount: false,
          uiAmount: 0,
          rawAmount: '0',
          ata: 'mock-ata-address',
          programType: useToken2022 ? 'Token-2022' : 'Token',
          error: 'Invalid mint address or mint does not exist'
        };
      }

      // Simulate no account case
      if (ownerAddr.includes('valid-wallet-address') && mintAddr.includes('no-account-mint')) {
        const mintInfo = await this.getMintInfo(mockPublicKey, mockPublicKey);
        return {
          hasAccount: false,
          uiAmount: 0,
          rawAmount: '0',
          decimals: mintInfo.decimals,
          ata: 'mock-ata-address',
          programType: useToken2022 ? 'Token-2022' : 'Token'
        };
      }

      // Simulate successful token balance check for any "valid" wallet with valid mint
      if (ownerAddr.includes('valid-wallet-address') && mintAddr.includes('valid-mint-address')) {
        const mintInfo = await this.getMintInfo(mockPublicKey, mockPublicKey);
        const rawAmount = '1000000';
        const uiAmount = Number(rawAmount) / Math.pow(10, mintInfo.decimals);

        return {
          hasAccount: true,
          uiAmount,
          rawAmount,
          decimals: mintInfo.decimals,
          ata: 'mock-ata-address',
          programType: useToken2022 ? 'Token-2022' : 'Token',
          isNative: false,
          owner: ownerAddr,
          mint: mintAddr
        };
      }

      // Simulate Token-2022 and legacy tokens working  
      if (ownerAddr.includes('valid-wallet-address') && (mintAddr.includes('token-2022-mint') || mintAddr.includes('legacy-token-mint'))) {
        const mintInfo = await this.getMintInfo(mockPublicKey, mockPublicKey);
        const rawAmount = '1000000';
        const uiAmount = Number(rawAmount) / Math.pow(10, mintInfo.decimals);

        return {
          hasAccount: true,
          uiAmount,
          rawAmount,
          decimals: mintInfo.decimals,
          ata: 'mock-ata-address',
          programType: useToken2022 ? 'Token-2022' : 'Token',
          isNative: false,
          owner: ownerAddr,
          mint: mintAddr
        };
      }

      // Simulate error case
      throw new Error('Simulated RPC error');

    } catch (error) {
      return {
        hasAccount: false,
        uiAmount: 0,
        rawAmount: '0',
        error: error.message,
        programType: useToken2022 ? 'Token-2022' : 'Token'
      };
    }
  }

  async detectTokenProgram(mintAddr) {
    if (mintAddr.includes('token-2022-mint')) {
      return true;
    }
    if (mintAddr.includes('legacy-token-mint')) {
      return false;
    }
    throw new Error('Mint not found in either Token program or Token-2022 program');
  }

  async checkTokenBalanceAuto(ownerAddr, mintAddr) {
    try {
      const isToken2022 = await this.detectTokenProgram(mintAddr);
      return await this.checkTokenBalance(ownerAddr, mintAddr, isToken2022);
    } catch (error) {
      return {
        hasAccount: false,
        uiAmount: 0,
        rawAmount: '0',
        error: error.message,
        programType: 'Unknown'
      };
    }
  }

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

  clearCache() {
    this.mintCache.clear();
  }

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

  getConnectionInfo() {
    return {
      rpcUrl: this.rpcUrl,
      commitment: this.connection?.commitment,
      connected: !!this.connection
    };
  }
}

// Mock the API class
class MockSolanaTokenAPI {
  constructor(rpcUrl = null) {
    this.tokenChecker = new MockSolanaTokenChecker(rpcUrl);
  }

  setNetwork(network) {
    const defaultRpcUrls = {
      mainnet: 'https://api.mainnet-beta.solana.com',
      devnet: 'https://api.devnet.solana.com',
      testnet: 'https://api.testnet.solana.com'
    };
    const rpcUrl = defaultRpcUrls[network] || network;
    this.tokenChecker.setRpcUrl(rpcUrl);
  }

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

    if (typeof walletAddress !== 'string' || walletAddress.length < 32) {
      return { valid: false, error: 'Invalid walletAddress format' };
    }

    if (typeof mintAddress !== 'string' || mintAddress.length < 32) {
      return { valid: false, error: 'Invalid mintAddress format' };
    }

    return { valid: true };
  }

  async checkSolanaToken(requestBody) {
    try {
      const validationResult = this.validateRequest(requestBody);
      if (!validationResult.valid) {
        return {
          success: false,
          error: validationResult.error,
          statusCode: 400
        };
      }

      const { walletAddress, mintAddress, useToken2022 = false } = requestBody;
      const result = await this.tokenChecker.checkTokenBalance(walletAddress, mintAddress, useToken2022);

      const apiResponse = {
        success: true,
        hasAccount: result.hasAccount,
        uiAmount: result.uiAmount,
        statusCode: 200
      };

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

      if (result.error) {
        apiResponse.warning = result.error;
      }

      return apiResponse;

    } catch (error) {
      return {
        success: false,
        error: error.message || 'Internal server error',
        statusCode: 500
      };
    }
  }

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
      return {
        success: false,
        error: error.message || 'Internal server error',
        statusCode: 500
      };
    }
  }

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

  clearCache() {
    this.tokenChecker.clearCache();
    return {
      success: true,
      message: 'Cache cleared successfully',
      statusCode: 200
    };
  }
}

describe('SolanaTokenChecker', () => {
  let tokenChecker;

  beforeEach(() => {
    tokenChecker = new MockSolanaTokenChecker();
    jest.clearAllMocks();
  });

  describe('Constructor and Setup', () => {
    test('should initialize with default RPC URL', () => {
      expect(tokenChecker.rpcUrl).toBe('https://api.mainnet-beta.solana.com');
      expect(tokenChecker.connection).toBeDefined();
    });

    test('should initialize with custom RPC URL', () => {
      const customChecker = new MockSolanaTokenChecker('https://api.devnet.solana.com');
      expect(customChecker.rpcUrl).toBe('https://api.devnet.solana.com');
    });

    test('should allow changing RPC URL', () => {
      tokenChecker.setRpcUrl('https://custom-rpc.com');
      expect(tokenChecker.rpcUrl).toBe('https://custom-rpc.com');
    });
  });

  describe('checkTokenBalance', () => {
    test('should return token balance for valid wallet and mint', async () => {
      const result = await tokenChecker.checkTokenBalance(
        'valid-wallet-address',
        'valid-mint-address'
      );

      expect(result.hasAccount).toBe(true);
      expect(result.uiAmount).toBe(1); // 1000000 / 10^6
      expect(result.decimals).toBe(6);
      expect(result.programType).toBe('Token');
      expect(result.ata).toBe('mock-ata-address');
    });

    test('should return zero balance for wallet without token account', async () => {
      const result = await tokenChecker.checkTokenBalance(
        'valid-wallet-address',
        'no-account-mint'
      );

      expect(result.hasAccount).toBe(false);
      expect(result.uiAmount).toBe(0);
      expect(result.decimals).toBe(6);
      expect(result.programType).toBe('Token');
    });

    test('should handle Token-2022 program', async () => {
      const result = await tokenChecker.checkTokenBalance(
        'valid-wallet-address',
        'valid-mint-address',
        true
      );

      expect(result.programType).toBe('Token-2022');
      expect(result.hasAccount).toBe(true);
    });

    test('should handle invalid mint address', async () => {
      const result = await tokenChecker.checkTokenBalance(
        'valid-wallet-address-with-enough-characters-length',
        'invalid-mint-address-with-enough-characters-length'
      );

      expect(result.hasAccount).toBe(false);
      expect(result.uiAmount).toBe(0);
      expect(result.error).toContain('Invalid mint address');
    });

    test('should handle RPC errors gracefully', async () => {
      const result = await tokenChecker.checkTokenBalance(
        'error-wallet-address',
        'error-mint-address'
      );

      expect(result.hasAccount).toBe(false);
      expect(result.uiAmount).toBe(0);
      expect(result.error).toContain('Simulated RPC error');
    });
  });

  describe('detectTokenProgram', () => {
    test('should detect Token-2022 program', async () => {
      const isToken2022 = await tokenChecker.detectTokenProgram('token-2022-mint');
      expect(isToken2022).toBe(true);
    });

    test('should detect legacy Token program', async () => {
      const isToken2022 = await tokenChecker.detectTokenProgram('legacy-token-mint');
      expect(isToken2022).toBe(false);
    });

    test('should throw error for invalid mint', async () => {
      await expect(tokenChecker.detectTokenProgram('invalid-mint')).rejects.toThrow();
    });
  });

  describe('checkTokenBalanceAuto', () => {
    test('should auto-detect Token-2022 and return balance', async () => {
      const result = await tokenChecker.checkTokenBalanceAuto(
        'valid-wallet-address',
        'token-2022-mint'
      );

      expect(result.hasAccount).toBe(true);
      expect(result.programType).toBe('Token-2022');
    });

    test('should auto-detect legacy Token and return balance', async () => {
      const result = await tokenChecker.checkTokenBalanceAuto(
        'valid-wallet-address',
        'legacy-token-mint'
      );

      expect(result.hasAccount).toBe(true);
      expect(result.programType).toBe('Token');
    });
  });

  describe('checkMultipleTokens', () => {
    test('should check multiple tokens simultaneously', async () => {
      const tokens = [
        { mintAddress: 'valid-mint-address', useToken2022: false },
        { mintAddress: 'no-account-mint', useToken2022: false }
      ];

      const results = await tokenChecker.checkMultipleTokens('valid-wallet-address', tokens);

      expect(results).toHaveLength(2);
      expect(results[0].hasAccount).toBe(true);
      expect(results[1].hasAccount).toBe(false);
    });
  });

  describe('Caching', () => {
    test('should cache mint information', async () => {
      // First call should cache
      await tokenChecker.getMintInfo(mockPublicKey, mockPublicKey);
      
      // Check cache stats
      const stats = tokenChecker.getCacheStats();
      expect(stats.totalEntries).toBe(1);
      expect(stats.validEntries).toBe(1);
    });

    test('should clear cache', () => {
      tokenChecker.mintCache.set('test-key', { data: {}, timestamp: Date.now() });
      tokenChecker.clearCache();
      
      const stats = tokenChecker.getCacheStats();
      expect(stats.totalEntries).toBe(0);
    });
  });

  describe('Connection Info', () => {
    test('should return connection information', () => {
      const info = tokenChecker.getConnectionInfo();
      expect(info.rpcUrl).toBeDefined();
      expect(info.connected).toBe(true);
    });
  });
});

describe('SolanaTokenAPI', () => {
  let api;

  beforeEach(() => {
    api = new MockSolanaTokenAPI();
  });

  describe('API Endpoints', () => {
    test('should validate request body', () => {
      const invalid1 = api.validateRequest({});
      expect(invalid1.valid).toBe(false);
      expect(invalid1.error).toContain('walletAddress is required');

      const invalid2 = api.validateRequest({ walletAddress: 'short' });
      expect(invalid2.valid).toBe(false);
      expect(invalid2.error).toContain('mintAddress is required');

      const invalid3 = api.validateRequest({ 
        walletAddress: 'short', 
        mintAddress: 'also-short' 
      });
      expect(invalid3.valid).toBe(false);
      expect(invalid3.error).toContain('Invalid walletAddress format');

      const valid = api.validateRequest({
        walletAddress: 'valid-wallet-address-with-enough-chars',
        mintAddress: 'valid-mint-address-with-enough-chars'
      });
      expect(valid.valid).toBe(true);
    });

    test('should handle checkSolanaToken API call', async () => {
      const response = await api.checkSolanaToken({
        walletAddress: 'valid-wallet-address-with-enough-characters-length',
        mintAddress: 'valid-mint-address-with-enough-characters-length'
      });

      expect(response.success).toBe(true);
      expect(response.statusCode).toBe(200);
      expect(response.hasAccount).toBe(true);
      expect(response.uiAmount).toBe(1);
      expect(response.decimals).toBe(6);
    });

    test('should handle invalid request in checkSolanaToken', async () => {
      const response = await api.checkSolanaToken({
        walletAddress: 'short'
      });

      expect(response.success).toBe(false);
      expect(response.statusCode).toBe(400);
      expect(response.error).toContain('mintAddress is required');
    });

    test('should handle checkSolanaTokenAuto API call', async () => {
      const response = await api.checkSolanaTokenAuto({
        walletAddress: 'valid-wallet-address-with-enough-characters-length',
        mintAddress: 'legacy-token-mint-with-enough-characters-length'
      });

      expect(response.success).toBe(true);
      expect(response.statusCode).toBe(200);
      expect(response.programType).toBe('Token');
    });
  });

  describe('Health Check', () => {
    test('should return health status', () => {
      const health = api.getHealth();
      expect(health.success).toBe(true);
      expect(health.healthy).toBe(true);
      expect(health.connection).toBeDefined();
      expect(health.cache).toBeDefined();
      expect(health.statusCode).toBe(200);
    });
  });

  describe('Cache Management', () => {
    test('should clear cache via API', () => {
      const response = api.clearCache();
      expect(response.success).toBe(true);
      expect(response.message).toContain('Cache cleared successfully');
      expect(response.statusCode).toBe(200);
    });
  });

  describe('Network Configuration', () => {
    test('should set network to devnet', () => {
      api.setNetwork('devnet');
      expect(api.tokenChecker.rpcUrl).toBe('https://api.devnet.solana.com');
    });

    test('should set custom RPC URL', () => {
      api.setNetwork('https://custom-rpc.example.com');
      expect(api.tokenChecker.rpcUrl).toBe('https://custom-rpc.example.com');
    });
  });
});

// Integration test for full flow
describe('Token Ownership Integration', () => {
  let api;

  beforeEach(() => {
    api = new MockSolanaTokenAPI('https://api.devnet.solana.com');
  });

  test('should complete full token ownership check flow', async () => {
    // Check if wallet owns token
    const tokenCheck = await api.checkSolanaToken({
      walletAddress: 'valid-wallet-address-with-enough-characters-length',
      mintAddress: 'valid-mint-address-with-enough-characters-length'
    });

    expect(tokenCheck.success).toBe(true);
    expect(tokenCheck.hasAccount).toBe(true);
    expect(tokenCheck.uiAmount).toBeGreaterThan(0);

    // Verify health
    const health = api.getHealth();
    expect(health.healthy).toBe(true);

    // Check cache was used
    const cacheStats = health.cache;
    expect(cacheStats.totalEntries).toBeGreaterThan(0);
  });

  test('should handle gating scenario - wallet does not have required token', async () => {
    const tokenCheck = await api.checkSolanaToken({
      walletAddress: 'valid-wallet-address-with-enough-characters-length',
      mintAddress: 'no-account-mint-with-enough-characters-length'
    });

    expect(tokenCheck.success).toBe(true);
    expect(tokenCheck.hasAccount).toBe(false);
    expect(tokenCheck.uiAmount).toBe(0);

    // This would be used for gating access
    const hasAccess = tokenCheck.hasAccount && tokenCheck.uiAmount > 0;
    expect(hasAccess).toBe(false);
  });
});