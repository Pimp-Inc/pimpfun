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
      expect(state).toHaveProperty('territories');
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
      expect(state.player.district).toBe('Midtown Market');
      expect(state.player.territory).toBe('Times Square Center');
      expect(state.territories.controlled).toEqual(['Times Square Center']);
      expect(state.territories.controlCount).toBe(1);
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

    test('should reject state with invalid territories data', () => {
      const invalidState = gameStateManager.initializeNewGameState();
      invalidState.territories = null;

      const result = gameStateManager.validateGameState(invalidState);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Territories data is missing or invalid');
    });

    test('should reject state with invalid controlled territories', () => {
      const invalidState = gameStateManager.initializeNewGameState();
      invalidState.territories.controlled = 'not an array';

      const result = gameStateManager.validateGameState(invalidState);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Controlled territories must be an array');
    });

    test('should reject state with negative territory count', () => {
      const invalidState = gameStateManager.initializeNewGameState();
      invalidState.territories.controlCount = -1;

      const result = gameStateManager.validateGameState(invalidState);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Territory control count must be a non-negative number');
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

    test('should migrate old district names', () => {
      const oldState = {
        player: { district: 'Midtown', cash: 1000 }
      };

      const migratedState = gameStateManager.migrateGameState(oldState);

      expect(migratedState.player.district).toBe('Midtown Market');
      expect(migratedState.player.territory).toBe('Times Square Center');
      expect(migratedState.territories.controlled).toEqual(['Times Square Center']);
    });
  });

  describe('Territory Management', () => {
    let state;

    beforeEach(() => {
      state = gameStateManager.initializeNewGameState();
    });

    describe('addTerritory', () => {
      test('should add new territory to control', () => {
        const result = gameStateManager.addTerritory(state, 'Herald Square');

        expect(result).toBe(true);
        expect(state.territories.controlled).toContain('Herald Square');
        expect(state.territories.controlCount).toBe(2);
      });

      test('should not add duplicate territory', () => {
        const result = gameStateManager.addTerritory(state, 'Times Square Center');

        expect(result).toBe(false);
        expect(state.territories.controlCount).toBe(1);
      });

      test('should handle missing territories object', () => {
        delete state.territories;

        const result = gameStateManager.addTerritory(state, 'Herald Square');

        expect(result).toBe(true);
        expect(state.territories.controlled).toEqual(['Herald Square']);
        expect(state.territories.controlCount).toBe(1);
      });
    });

    describe('removeTerritory', () => {
      test('should remove controlled territory', () => {
        gameStateManager.addTerritory(state, 'Herald Square');

        const result = gameStateManager.removeTerritory(state, 'Herald Square');

        expect(result).toBe(true);
        expect(state.territories.controlled).not.toContain('Herald Square');
        expect(state.territories.controlCount).toBe(1);
      });

      test('should not remove uncontrolled territory', () => {
        const result = gameStateManager.removeTerritory(state, 'Unknown Territory');

        expect(result).toBe(false);
        expect(state.territories.controlCount).toBe(1);
      });

      test('should handle missing territories object', () => {
        delete state.territories;

        const result = gameStateManager.removeTerritory(state, 'Any Territory');

        expect(result).toBe(false);
      });
    });

    describe('controlsTerritory', () => {
      test('should return true for controlled territory', () => {
        const result = gameStateManager.controlsTerritory(state, 'Times Square Center');

        expect(result).toBe(true);
      });

      test('should return false for uncontrolled territory', () => {
        const result = gameStateManager.controlsTerritory(state, 'Unknown Territory');

        expect(result).toBe(false);
      });

      test('should handle missing territories object', () => {
        delete state.territories;

        const result = gameStateManager.controlsTerritory(state, 'Any Territory');

        expect(result).toBe(false);
      });
    });

    describe('getControlledTerritories', () => {
      test('should return array of controlled territories', () => {
        gameStateManager.addTerritory(state, 'Herald Square');

        const territories = gameStateManager.getControlledTerritories(state);

        expect(territories).toEqual(['Times Square Center', 'Herald Square']);
      });

      test('should return copy of territories array', () => {
        const territories = gameStateManager.getControlledTerritories(state);
        territories.push('New Territory');

        expect(state.territories.controlled).not.toContain('New Territory');
      });

      test('should handle missing territories object', () => {
        delete state.territories;

        const territories = gameStateManager.getControlledTerritories(state);

        expect(territories).toEqual([]);
      });
    });

    describe('getTerritoryCount', () => {
      test('should return current territory count', () => {
        const count = gameStateManager.getTerritoryCount(state);

        expect(count).toBe(1);
      });

      test('should return updated count after adding territory', () => {
        gameStateManager.addTerritory(state, 'Herald Square');

        const count = gameStateManager.getTerritoryCount(state);

        expect(count).toBe(2);
      });

      test('should handle missing territories object', () => {
        delete state.territories;

        const count = gameStateManager.getTerritoryCount(state);

        expect(count).toBe(0);
      });
    });

    describe('moveToTerritory', () => {
      test('should move player to new territory', () => {
        const result = gameStateManager.moveToTerritory(state, 'Herald Square');

        expect(result).toBe(true);
        expect(state.player.territory).toBe('Herald Square');
      });

      test('should accept any territory name when GameConstants not available', () => {
        const result = gameStateManager.moveToTerritory(state, 'Any Territory Name');

        expect(result).toBe(true);
        expect(state.player.territory).toBe('Any Territory Name');
      });
    });
  });
});
