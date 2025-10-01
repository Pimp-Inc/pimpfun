/**
 * Unit tests for GameStateManager module
 */

const GameStateManager = require('../src/modules/GameStateManager');

describe('GameStateManager', () => {
  let gameStateManager;

  beforeEach(() => {
    gameStateManager = new GameStateManager();
  });

  describe('initializeNewGameState', () => {
    test('should return a complete game state structure', () => {
      const state = gameStateManager.initializeNewGameState();

      expect(state).toHaveProperty('player');
      expect(state).toHaveProperty('resources');
      expect(state).toHaveProperty('supplies');
      expect(state).toHaveProperty('heat');
      expect(state).toHaveProperty('crew');
      expect(state).toHaveProperty('settings');
      expect(state).toHaveProperty('stats');
    });

    test('should return default values', () => {
      const state = gameStateManager.initializeNewGameState();

      expect(state.player.cash).toBe(1000);
      expect(state.player.turns).toBe(200);
      expect(state.resources.hoes).toBe(0);
      expect(state.supplies.thugHappiness).toBe(70);
    });

    test('should return a deep copy (not reference to default)', () => {
      const state1 = gameStateManager.initializeNewGameState();
      const state2 = gameStateManager.initializeNewGameState();

      state1.player.cash = 5000;

      expect(state2.player.cash).toBe(1000);
    });
  });

  describe('validateGameState', () => {
    test('should validate a correct game state', () => {
      const validState = gameStateManager.initializeNewGameState();
      const result = gameStateManager.validateGameState(validState);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject null or undefined state', () => {
      const result1 = gameStateManager.validateGameState(null);
      const result2 = gameStateManager.validateGameState(undefined);

      expect(result1.valid).toBe(false);
      expect(result2.valid).toBe(false);
    });

    test('should reject state with negative cash', () => {
      const invalidState = gameStateManager.initializeNewGameState();
      invalidState.player.cash = -100;

      const result = gameStateManager.validateGameState(invalidState);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Player cash must be a non-negative number');
    });

    test('should reject state with negative resources', () => {
      const invalidState = gameStateManager.initializeNewGameState();
      invalidState.resources.hoes = -5;

      const result = gameStateManager.validateGameState(invalidState);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Resource hoes must be a non-negative number');
    });

    test('should reject state missing player data', () => {
      const invalidState = { resources: {}, supplies: {} };

      const result = gameStateManager.validateGameState(invalidState);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Player data is missing or invalid');
    });
  });

  describe('calculateNetWorth', () => {
    test('should calculate net worth correctly', () => {
      const state = {
        player: { cash: 1000 },
        resources: {
          hoes: 2,     // 2 * 1000 = 2000
          thugs: 4,    // 4 * 500 = 2000
          crack: 100,  // 100 * 10 = 1000
          weed: 50,    // 50 * 15 = 750
          beer: 100,   // 100 * 2 = 200
          condoms: 1000 // 1000 * 0.1 = 100
        }
      };

      const netWorth = gameStateManager.calculateNetWorth(state);

      expect(netWorth).toBe(7050); // 1000 + 2000 + 2000 + 1000 + 750 + 200 + 100
    });

    test('should handle missing player cash', () => {
      const state = { resources: { hoes: 1 } };

      const netWorth = gameStateManager.calculateNetWorth(state);

      expect(netWorth).toBe(1000); // Just the hoe value
    });

    test('should handle null state', () => {
      const netWorth = gameStateManager.calculateNetWorth(null);

      expect(netWorth).toBe(0);
    });
  });

  describe('canAfford', () => {
    test('should return true when player can afford purchase', () => {
      const state = { player: { cash: 1000 } };

      const result = gameStateManager.canAfford(state, 500);

      expect(result).toBe(true);
    });

    test('should return false when player cannot afford purchase', () => {
      const state = { player: { cash: 100 } };

      const result = gameStateManager.canAfford(state, 500);

      expect(result).toBe(false);
    });

    test('should handle exact amount', () => {
      const state = { player: { cash: 500 } };

      const result = gameStateManager.canAfford(state, 500);

      expect(result).toBe(true);
    });
  });

  describe('processPurchase', () => {
    test('should process successful purchase', () => {
      const state = gameStateManager.initializeNewGameState();
      state.player.cash = 1000;
      state.resources.beer = 0;

      const result = gameStateManager.processPurchase(state, 100, 'beer', 50);

      expect(result).toBe(true);
      expect(state.player.cash).toBe(900);
      expect(state.resources.beer).toBe(50);
      expect(state.stats.totalPurchases).toBe(1);
    });

    test('should reject purchase when insufficient funds', () => {
      const state = gameStateManager.initializeNewGameState();
      state.player.cash = 50;

      const result = gameStateManager.processPurchase(state, 100, 'beer', 50);

      expect(result).toBe(false);
      expect(state.player.cash).toBe(50); // Unchanged
      expect(state.resources.beer).toBe(0); // Unchanged
    });
  });

  describe('regenerateTurns', () => {
    test('should regenerate turns based on time elapsed', () => {
      const state = gameStateManager.initializeNewGameState();
      const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000); // 30 minutes ago
      state.player.lastLogin = thirtyMinutesAgo;
      state.player.turns = 100;

      const turnsAdded = gameStateManager.regenerateTurns(state);

      expect(turnsAdded).toBe(6); // 30 minutes / 5 minutes per turn
      expect(state.player.turns).toBe(106);
    });

    test('should not exceed maximum turns', () => {
      const state = gameStateManager.initializeNewGameState();
      const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000); // 2 hours ago
      state.player.lastLogin = twoHoursAgo;
      state.player.turns = 195;

      gameStateManager.regenerateTurns(state);

      expect(state.player.turns).toBe(200); // Should cap at 200
    });

    test('should handle missing lastLogin', () => {
      const state = gameStateManager.initializeNewGameState();
      delete state.player.lastLogin;

      const turnsAdded = gameStateManager.regenerateTurns(state);

      expect(turnsAdded).toBe(0);
      expect(state.player.lastLogin).toBeDefined();
    });
  });

  describe('updateStats', () => {
    test('should update existing stats', () => {
      const state = gameStateManager.initializeNewGameState();

      gameStateManager.updateStats(state, 'combatWins', 1);
      gameStateManager.updateStats(state, 'totalCashEarned', 500);

      expect(state.stats.combatWins).toBe(1);
      expect(state.stats.totalCashEarned).toBe(500);
    });

    test('should initialize stats if missing', () => {
      const state = { player: {}, resources: {} };

      gameStateManager.updateStats(state, 'combatWins', 1);

      expect(state.stats).toBeDefined();
      expect(state.stats.combatWins).toBe(1);
    });

    test('should ignore invalid stat types', () => {
      const state = gameStateManager.initializeNewGameState();

      expect(() => {
        gameStateManager.updateStats(state, 'invalidStat', 1);
      }).not.toThrow();
    });
  });

  describe('migrateGameState', () => {
    test('should migrate old state format', () => {
      const oldState = {
        player: { cash: 5000, name: 'Old Player' },
        resources: { hoes: 10, thugs: 5 },
        heat: 50 // Old numeric format
      };

      const migratedState = gameStateManager.migrateGameState(oldState);

      expect(migratedState.player.cash).toBe(5000);
      expect(migratedState.player.name).toBe('Old Player');
      expect(migratedState.resources.hoes).toBe(10);
      expect(migratedState.heat.level).toBe(50);
      expect(migratedState.heat.corruption).toBe(0); // New default
    });

    test('should handle null old state', () => {
      const migratedState = gameStateManager.migrateGameState(null);

      expect(migratedState).toEqual(gameStateManager.initializeNewGameState());
    });
  });
});
