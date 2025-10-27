/**
 * Turn Manager - Client-Side Turn System Interface
 *
 * This module provides a clean interface for the client to interact with
 * the server-authoritative turn system. All turn operations go through
 * the server - NEVER TRUST THE CLIENT.
 *
 * Key Features:
 * - Server-authoritative turn tracking
 * - Auto-sync every 60 seconds
 * - Sync on page focus
 * - Real-time turn updates
 * - Audit logging
 * - Error recovery
 */

class TurnManager {
    constructor() {
        // Current turn count (cached from server)
        // Start with default value before server sync
        this.currentTurns = 150; // Default starting turns
        this.maxTurns = 200;
        this.regenRate = 0.2; // Turns per minute

        // Sync state
        this.lastSyncTime = null;
        this.syncInProgress = false;
        this.syncIntervalId = null;

        // Player ID
        this.playerId = null;

        // Real-time subscription
        this.turnSubscription = null;

        // Callbacks for turn updates
        this.onTurnUpdateCallbacks = [];

        // Error state
        this.lastError = null;

        console.log('🎯 TurnManager initialized');
    }

    /**
     * Initialize the turn manager for a player
     * @param {string} playerId - Player UUID
     */
    async initialize(playerId) {
        try {
            console.log('🔄 Initializing TurnManager for wallet:', playerId);
            this.playerId = playerId; // Stores wallet address (auth user ID)

            // Get initial turn count from server
            await this.syncFromServer();

            // Start auto-sync every 10 minutes (turns accrue every 10 min)
            this.startAutoSync();

            // Sync on page focus (user returns to tab)
            this.setupFocusSync();

            // Subscribe to real-time turn updates
            this.setupRealtimeSync();

            console.log('✅ TurnManager initialized successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize TurnManager:', error);
            this.lastError = error;
            return false;
        }
    }

    /**
     * Sync turns from server (pulls latest turn count)
     */
    async syncFromServer() {
        if (this.syncInProgress) {
            console.log('⏳ Sync already in progress, skipping...');
            return this.currentTurns;
        }

        try {
            this.syncInProgress = true;
            console.log('🔄 Syncing turns from server...');

            const result = await SupabaseAPI.getTurns(this.playerId);

            if (!result.success) {
                throw new Error(result.error || 'Failed to sync turns');
            }

            this.currentTurns = result.turns;
            this.lastSyncTime = Date.now();
            this.lastError = null;

            console.log(`✅ Synced turns: ${this.currentTurns}${result.accrued > 0 ? ` (accrued: ${result.accrued})` : ''}`);

            // Notify all listeners
            this.notifyTurnUpdate();

            return this.currentTurns;
        } catch (error) {
            console.error('❌ Failed to sync turns from server:', error);
            this.lastError = error;
            throw error;
        } finally {
            this.syncInProgress = false;
        }
    }

    /**
     * Get current turn count (returns cached value, use syncFromServer() to refresh)
     */
    getTurns() {
        return this.currentTurns;
    }

    /**
     * Spend turns (with server-side validation)
     * @param {number} amount - Number of turns to spend
     * @param {string} reason - Reason for spending (e.g., 'scout', 'crack_production')
     * @param {object} metadata - Optional metadata for audit log
     * @returns {Promise<{success: boolean, turns: number, message: string}>}
     */
    async spendTurns(amount, reason, metadata = null) {
        try {
            console.log(`🔄 Spending ${amount} turns for ${reason}`);

            // Quick client-side check (not authoritative)
            if (this.currentTurns < amount) {
                console.log(`❌ Not enough turns (have ${this.currentTurns}, need ${amount})`);
                return {
                    success: false,
                    turns: this.currentTurns,
                    message: `Not enough turns (have ${this.currentTurns}, need ${amount})`
                };
            }

            // Call server to spend turns
            const result = await SupabaseAPI.spendTurns(this.playerId, amount, reason, metadata);

            if (result.success) {
                this.currentTurns = result.turns;
                this.lastSyncTime = Date.now();
                console.log(`✅ Spent ${amount} turns. New count: ${this.currentTurns}`);

                // Notify all listeners
                this.notifyTurnUpdate();
            } else {
                console.log(`❌ Failed to spend turns: ${result.message}`);
            }

            return result;
        } catch (error) {
            console.error('❌ Error spending turns:', error);
            this.lastError = error;
            return {
                success: false,
                turns: this.currentTurns,
                message: error.message
            };
        }
    }

    /**
     * Grant bonus turns (for vote bonus, offline bonus, etc.)
     * @param {number} amount - Number of turns to grant
     * @param {string} reason - Reason for granting
     * @param {object} metadata - Optional metadata
     */
    async grantTurns(amount, reason, metadata = null) {
        try {
            console.log(`🔄 Granting ${amount} turns for ${reason}`);

            const result = await SupabaseAPI.grantTurns(this.playerId, amount, reason, metadata);

            if (result.success) {
                this.currentTurns = result.turns;
                this.lastSyncTime = Date.now();
                console.log(`✅ Granted ${amount} turns. New count: ${this.currentTurns}`);

                // Notify all listeners
                this.notifyTurnUpdate();
            }

            return result;
        } catch (error) {
            console.error('❌ Error granting turns:', error);
            this.lastError = error;
            return {
                success: false,
                turns: this.currentTurns,
                message: error.message
            };
        }
    }

    /**
     * Reset turns to starting amount (admin/recovery function)
     */
    async resetTurns() {
        try {
            console.log('🔄 Resetting turns to starting amount');

            const result = await SupabaseAPI.resetTurns(this.playerId);

            if (result.success) {
                this.currentTurns = result.turns;
                this.lastSyncTime = Date.now();
                console.log(`✅ Reset turns to ${this.currentTurns}`);

                // Notify all listeners
                this.notifyTurnUpdate();
            }

            return result;
        } catch (error) {
            console.error('❌ Error resetting turns:', error);
            this.lastError = error;
            return {
                success: false,
                turns: this.currentTurns,
                message: error.message
            };
        }
    }

    /**
     * Start auto-sync (every 10 minutes to match turn accrual interval)
     */
    startAutoSync() {
        // Clear existing interval if any
        if (this.syncIntervalId) {
            clearInterval(this.syncIntervalId);
        }

        // Sync every 10 minutes (600 seconds) to match turn accrual interval
        this.syncIntervalId = setInterval(async () => {
            try {
                await this.syncFromServer();
            } catch (error) {
                console.error('❌ Auto-sync failed:', error);
            }
        }, 600000); // 10 minutes (600 seconds)

        console.log('✅ Auto-sync started (every 10 minutes to match turn accrual)');
    }

    /**
     * Stop auto-sync
     */
    stopAutoSync() {
        if (this.syncIntervalId) {
            clearInterval(this.syncIntervalId);
            this.syncIntervalId = null;
            console.log('⏹ Auto-sync stopped');
        }
    }

    /**
     * Setup sync on page focus (user returns to tab)
     */
    setupFocusSync() {
        window.addEventListener('focus', async () => {
            console.log('👁 Page focused - syncing turns...');
            try {
                await this.syncFromServer();
            } catch (error) {
                console.error('❌ Focus sync failed:', error);
            }
        });

        console.log('✅ Focus sync enabled');
    }

    /**
     * Setup real-time turn updates via Supabase subscriptions
     */
    setupRealtimeSync() {
        try {
            this.turnSubscription = SupabaseAPI.subscribeToTurnUpdates(
                this.playerId,
                (newTurnCount) => {
                    console.log(`🔔 Real-time turn update: ${this.currentTurns} → ${newTurnCount}`);
                    this.currentTurns = newTurnCount;
                    this.lastSyncTime = Date.now();
                    this.notifyTurnUpdate();
                }
            );

            console.log('✅ Real-time turn updates enabled');
        } catch (error) {
            console.error('❌ Failed to setup real-time sync:', error);
        }
    }

    /**
     * Register a callback for turn updates
     * @param {function} callback - Function to call when turns update
     */
    onTurnUpdate(callback) {
        this.onTurnUpdateCallbacks.push(callback);
    }

    /**
     * Notify all registered callbacks of turn update
     */
    notifyTurnUpdate() {
        this.onTurnUpdateCallbacks.forEach(callback => {
            try {
                callback(this.currentTurns);
            } catch (error) {
                console.error('❌ Error in turn update callback:', error);
            }
        });
    }

    /**
     * Get audit logs for this player
     * @param {number} limit - Number of logs to retrieve
     */
    async getAuditLogs(limit = 50) {
        try {
            const result = await SupabaseAPI.getTurnAuditLogs(this.playerId, limit);
            return result;
        } catch (error) {
            console.error('❌ Error getting audit logs:', error);
            return { success: false, logs: [], error: error.message };
        }
    }

    /**
     * Get sync status (for debugging)
     */
    getStatus() {
        return {
            currentTurns: this.currentTurns,
            maxTurns: this.maxTurns,
            regenRate: this.regenRate,
            lastSyncTime: this.lastSyncTime,
            timeSinceSync: this.lastSyncTime ? Date.now() - this.lastSyncTime : null,
            syncInProgress: this.syncInProgress,
            autoSyncEnabled: !!this.syncIntervalId,
            lastError: this.lastError?.message || null
        };
    }

    /**
     * Cleanup (call when player logs out)
     */
    destroy() {
        console.log('🧹 Destroying TurnManager');

        // Stop auto-sync
        this.stopAutoSync();

        // Unsubscribe from real-time updates
        if (this.turnSubscription) {
            this.turnSubscription.unsubscribe();
            this.turnSubscription = null;
        }

        // Clear callbacks
        this.onTurnUpdateCallbacks = [];

        // Reset state
        this.currentTurns = 0;
        this.playerId = null;
        this.lastSyncTime = null;

        console.log('✅ TurnManager destroyed');
    }
}

// Create global instance
console.log('🔧 Creating TurnManager instance...');
try {
    window.TurnManager = new TurnManager();
    console.log('✅ TurnManager instance created:', typeof window.TurnManager);
    console.log('✅ TurnManager.initialize exists:', typeof window.TurnManager.initialize);
    console.log('✅ TurnManager.getTurns exists:', typeof window.TurnManager.getTurns);
} catch (error) {
    console.error('❌ Failed to create TurnManager instance:', error);
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TurnManager;
}
