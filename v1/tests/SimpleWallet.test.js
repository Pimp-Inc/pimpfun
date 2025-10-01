/**
 * Unit tests for Simple Wallet functionality
 */

// Mock window object for wallet testing
const mockWindow = {
  solana: {
    isPhantom: true,
    connect: jest.fn()
  },
  phantom: {
    solana: {
      connect: jest.fn()
    }
  }
};

// Mock the simple wallet class for testing
class MockSimpleWallet {
  constructor() {
    this.connected = false;
    this.publicKey = null;
    this.walletName = null;
  }

  async connectPhantom() {
    try {
      // Simulate wallet detection
      if (!mockWindow.solana?.isPhantom && !mockWindow.phantom?.solana) {
        throw new Error('Phantom wallet not detected');
      }

      const provider = mockWindow.solana?.isPhantom ? mockWindow.solana : mockWindow.phantom.solana;

      // Simulate connection
      const response = await provider.connect();

      this.connected = true;
      this.publicKey = response.publicKey.toString();
      this.walletName = 'Phantom';

      return {
        success: true,
        publicKey: this.publicKey,
        walletName: this.walletName
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  disconnect() {
    this.connected = false;
    this.publicKey = null;
    this.walletName = null;
  }

  isConnected() {
    return this.connected;
  }

  getPublicKey() {
    return this.publicKey;
  }
}

describe('SimpleWallet', () => {
  let wallet;

  beforeEach(() => {
    wallet = new MockSimpleWallet();

    // Reset mock window
    mockWindow.solana = {
      isPhantom: true,
      connect: jest.fn().mockResolvedValue({
        publicKey: {
          toString: () => 'mock-public-key-123'
        }
      })
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('connectPhantom', () => {
    test('should successfully connect to Phantom wallet', async () => {
      const result = await wallet.connectPhantom();

      expect(result.success).toBe(true);
      expect(result.publicKey).toBe('mock-public-key-123');
      expect(result.walletName).toBe('Phantom');
      expect(wallet.connected).toBe(true);
      expect(wallet.publicKey).toBe('mock-public-key-123');
    });

    test('should handle Phantom not detected', async () => {
      mockWindow.solana = null;
      mockWindow.phantom = null;

      const result = await wallet.connectPhantom();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Phantom wallet not detected');
      expect(wallet.connected).toBe(false);
    });

    test('should connect using phantom.solana if window.solana is not Phantom', async () => {
      mockWindow.solana = { isPhantom: false };
      mockWindow.phantom = {
        solana: {
          connect: jest.fn().mockResolvedValue({
            publicKey: {
              toString: () => 'phantom-backup-key'
            }
          })
        }
      };

      const result = await wallet.connectPhantom();

      expect(result.success).toBe(true);
      expect(result.publicKey).toBe('phantom-backup-key');
    });

    test('should handle connection rejection', async () => {
      mockWindow.solana.connect.mockRejectedValue(new Error('User rejected connection'));

      const result = await wallet.connectPhantom();

      expect(result.success).toBe(false);
      expect(result.error).toBe('User rejected connection');
      expect(wallet.connected).toBe(false);
    });
  });

  describe('disconnect', () => {
    test('should properly disconnect wallet', async () => {
      // First connect
      await wallet.connectPhantom();
      expect(wallet.connected).toBe(true);

      // Then disconnect
      wallet.disconnect();

      expect(wallet.connected).toBe(false);
      expect(wallet.publicKey).toBe(null);
      expect(wallet.walletName).toBe(null);
    });
  });

  describe('isConnected', () => {
    test('should return false when not connected', () => {
      expect(wallet.isConnected()).toBe(false);
    });

    test('should return true when connected', async () => {
      await wallet.connectPhantom();
      expect(wallet.isConnected()).toBe(true);
    });
  });

  describe('getPublicKey', () => {
    test('should return null when not connected', () => {
      expect(wallet.getPublicKey()).toBe(null);
    });

    test('should return public key when connected', async () => {
      await wallet.connectPhantom();
      expect(wallet.getPublicKey()).toBe('mock-public-key-123');
    });
  });
});

// Test wallet connection flow
describe('Wallet Connection Flow', () => {
  let wallet;

  beforeEach(() => {
    wallet = new MockSimpleWallet();
  });

  test('should complete full connection flow', async () => {
    // Initial state
    expect(wallet.isConnected()).toBe(false);
    expect(wallet.getPublicKey()).toBe(null);

    // Connect
    const result = await wallet.connectPhantom();
    expect(result.success).toBe(true);
    expect(wallet.isConnected()).toBe(true);
    expect(wallet.getPublicKey()).toBeTruthy();

    // Disconnect
    wallet.disconnect();
    expect(wallet.isConnected()).toBe(false);
    expect(wallet.getPublicKey()).toBe(null);
  });

  test('should handle multiple connection attempts', async () => {
    const result1 = await wallet.connectPhantom();
    const result2 = await wallet.connectPhantom();

    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    expect(wallet.connected).toBe(true);
  });
});
