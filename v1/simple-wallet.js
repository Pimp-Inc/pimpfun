// Simple Phantom Wallet Connection
// No complex libraries - just direct connection

class SimpleWallet {
    constructor() {
        this.connected = false;
        this.publicKey = null;
        this.walletName = null;
    }

    async connectPhantom() {
        try {
            console.log('🔍 Looking for Phantom...');
            
            // Wait for page to fully load
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Check multiple ways Phantom might be available
            let provider = null;
            
            if (window.solana?.isPhantom) {
                provider = window.solana;
                console.log('✅ Found Phantom at window.solana');
            } else if (window.phantom?.solana) {
                provider = window.phantom.solana;
                console.log('✅ Found Phantom at window.phantom.solana');
            } else {
                console.log('❌ Phantom not found. Available objects:', {
                    'window.solana': !!window.solana,
                    'window.phantom': !!window.phantom,
                    'window.solana.isPhantom': window.solana?.isPhantom
                });
                throw new Error('Phantom wallet not detected');
            }

            console.log('🔗 Attempting connection...');
            const response = await provider.connect();
            
            this.connected = true;
            this.publicKey = response.publicKey.toString();
            this.walletName = 'Phantom';
            
            console.log('✅ Connected successfully:', this.publicKey);
            
            return {
                success: true,
                publicKey: this.publicKey,
                walletName: this.walletName
            };
            
        } catch (error) {
            console.error('❌ Connection failed:', error);
            
            if (error.code === 4001) {
                return { success: false, error: 'User rejected connection' };
            } else if (error.message.includes('not detected')) {
                return { success: false, error: 'Phantom wallet not installed' };
            } else {
                return { success: false, error: error.message };
            }
        }
    }

    async disconnect() {
        try {
            if (window.solana?.disconnect) {
                await window.solana.disconnect();
            }
            this.connected = false;
            this.publicKey = null;
            this.walletName = null;
            return { success: true };
        } catch (error) {
            console.error('Disconnect error:', error);
            return { success: false, error: error.message };
        }
    }

    isConnected() {
        return this.connected && this.publicKey;
    }

    getPublicKey() {
        return this.publicKey;
    }
}

// Make it globally available
window.SimpleWallet = SimpleWallet; 