/**
 * Game State Management Module
 * Handles game state initialization, validation, and persistence
 */

class GameStateManager {
  constructor() {
    this.defaultState = {
      player: {
        name: 'New Player',
        cash: 1000,
        netWorth: 1000,
        heat: 0,
        turns: 200,
        lastLogin: Date.now(),
        district: 'Midtown Market',  // Updated to use new district name
        territory: 'Times Square Center',  // Starting territory
        level: 1,
        experience: 0
      },
      territories: {
        controlled: ['Times Square Center'],  // Array of controlled territories
        controlCount: 1  // Number of territories controlled
      },
      resources: {
        hoes: 0,
        thugs: 0,
        crack: 0,
        weed: 0,
        beer: 0,
        condoms: 0,
        weapons: 0,
        vehicles: 0
      },
      supplies: {
        thugHappiness: 70,
        hoeHappiness: 70,
        protection: 0
      },
      heat: {
        level: 0,
        corruption: 0,
        lastBribe: 0,
        nftKeys: {
          bronze: 0,
          silver: 0,
          gold: 0,
          diamond: 0
        }
      },
      crew: [],
      settings: {
        notifications: true,
        autoSave: true,
        soundEnabled: false
      },
      stats: {
        totalCashEarned: 0,
        totalPurchases: 0,
        combatWins: 0,
        combatLosses: 0,
        timePlayed: 0
      }
    };
  }

  /**
   * Initialize a new game state
   * @returns {Object} Fresh game state
   */
  initializeNewGameState() {
    return JSON.parse(JSON.stringify(this.defaultState));
  }

  /**
   * Validate game state structure
   * @param {Object} state - Game state to validate
   * @returns {Object} Validation result with status and errors
   */
  validateGameState(state) {
    const errors = [];

    if (!state || typeof state !== 'object') {
      return { valid: false, errors: ['Game state must be an object'] };
    }

    // Validate player section
    if (!state.player || typeof state.player !== 'object') {
      errors.push('Player data is missing or invalid');
    } else {
      if (typeof state.player.cash !== 'number' || state.player.cash < 0) {
        errors.push('Player cash must be a non-negative number');
      }
      if (typeof state.player.turns !== 'number' || state.player.turns < 0) {
        errors.push('Player turns must be a non-negative number');
      }
    }

    // Validate resources section
    if (!state.resources || typeof state.resources !== 'object') {
      errors.push('Resources data is missing or invalid');
    } else {
      const resourceKeys = ['hoes', 'thugs', 'crack', 'weed', 'beer', 'condoms'];
      resourceKeys.forEach(key => {
        if (typeof state.resources[key] !== 'number' || state.resources[key] < 0) {
          errors.push(`Resource ${key} must be a non-negative number`);
        }
      });
    }

    // Validate territories section
    if (!state.territories || typeof state.territories !== 'object') {
      errors.push('Territories data is missing or invalid');
    } else {
      if (!Array.isArray(state.territories.controlled)) {
        errors.push('Controlled territories must be an array');
      }
      if (typeof state.territories.controlCount !== 'number' || state.territories.controlCount < 0) {
        errors.push('Territory control count must be a non-negative number');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Migrate old game state to current version
   * @param {Object} oldState - Old game state format
   * @returns {Object} Migrated game state
   */
  migrateGameState(oldState) {
    const newState = this.initializeNewGameState();

    if (!oldState) return newState;

    // Merge old state into new structure, preserving existing data
    if (oldState.player) {
      Object.assign(newState.player, oldState.player);

      // Migrate old district names to new format if needed
      if (oldState.player.district === 'Midtown') {
        newState.player.district = 'Midtown Market';
        newState.player.territory = 'Times Square Center';
      } else if (oldState.player.district === 'Uptown') {
        newState.player.district = 'Uptown Plaza';
        newState.player.territory = 'South Bronx Strip';
      } else if (oldState.player.district === 'Crooklyn') {
        newState.player.district = 'Crooklyn Heights';
        newState.player.territory = 'Downtown Brooklyn';
      }

      // Ensure territory is set if district exists
      if (newState.player.district && !newState.player.territory) {
        // Import GameConstants if available
        if (typeof window !== 'undefined' && window.GameConstants) {
          const territories = window.GameConstants.getTerritoriesForDistrict(newState.player.district);
          if (territories.length > 0) {
            newState.player.territory = territories[0];
          }
        }
      }
    }

    if (oldState.resources) {
      Object.assign(newState.resources, oldState.resources);
    }

    if (oldState.supplies) {
      Object.assign(newState.supplies, oldState.supplies);
    }

    // Handle legacy heat format
    if (typeof oldState.heat === 'number') {
      newState.heat.level = oldState.heat;
    } else if (oldState.heat && typeof oldState.heat === 'object') {
      Object.assign(newState.heat, oldState.heat);
    }

    // Handle territories migration
    if (oldState.territories) {
      Object.assign(newState.territories, oldState.territories);
    } else if (newState.player.territory) {
      // Initialize territories based on current player territory
      newState.territories.controlled = [newState.player.territory];
      newState.territories.controlCount = 1;
    }

    return newState;
  }

  /**
   * Calculate net worth from current state
   * @param {Object} state - Current game state
   * @returns {number} Total net worth
   */
  calculateNetWorth(state) {
    if (!state) return 0;

    let netWorth = state.player?.cash || 0;

    // Add resource values
    const resourceValues = {
      hoes: 1000,
      thugs: 500,
      crack: 10,
      weed: 15,
      beer: 2,
      condoms: 0.1,
      weapons: 100,
      vehicles: 2000
    };

    if (state.resources) {
      Object.entries(resourceValues).forEach(([resource, value]) => {
        netWorth += (state.resources[resource] || 0) * value;
      });
    }

    return Math.floor(netWorth);
  }

  /**
   * Update player statistics
   * @param {Object} state - Current game state
   * @param {string} statType - Type of stat to update
   * @param {number} value - Value to add
   */
  updateStats(state, statType, value = 1) {
    if (!state.stats) {
      state.stats = this.defaultState.stats;
    }

    if (state.stats[statType] !== undefined) {
      state.stats[statType] += value;
    }
  }

  /**
   * Check if player can afford a purchase
   * @param {Object} state - Current game state
   * @param {number} cost - Cost of purchase
   * @returns {boolean} Can afford status
   */
  canAfford(state, cost) {
    return state.player && state.player.cash >= cost;
  }

  /**
   * Process a purchase transaction
   * @param {Object} state - Current game state
   * @param {number} cost - Cost of purchase
   * @param {string} item - Item being purchased
   * @param {number} quantity - Quantity being purchased
   * @returns {boolean} Transaction success
   */
  processPurchase(state, cost, item, quantity = 1) {
    if (!this.canAfford(state, cost)) {
      return false;
    }

    state.player.cash -= cost;

    if (state.resources[item] !== undefined) {
      state.resources[item] += quantity;
    }

    this.updateStats(state, 'totalPurchases', 1);
    this.updateStats(state, 'totalCashEarned', -cost);

    return true;
  }

  /**
   * Regenerate turns based on time elapsed
   * @param {Object} state - Current game state
   * @returns {number} Turns added
   */
  regenerateTurns(state) {
    if (!state.player.lastLogin) {
      state.player.lastLogin = Date.now();
      return 0;
    }

    const timeElapsed = Date.now() - state.player.lastLogin;
    const minutesElapsed = Math.floor(timeElapsed / (1000 * 60));
    const turnsToAdd = Math.floor(minutesElapsed / 5); // 1 turn per 5 minutes

    if (turnsToAdd > 0) {
      const maxTurns = 200;
      const currentTurns = state.player.turns || 0;
      state.player.turns = Math.min(maxTurns, currentTurns + turnsToAdd);
      state.player.lastLogin = Date.now();
    }

    return turnsToAdd;
  }

  /**
   * Add a territory to player control
   * @param {Object} state - Current game state
   * @param {string} territoryName - Name of territory to add
   * @returns {boolean} Success status
   */
  addTerritory(state, territoryName) {
    if (!state.territories) {
      state.territories = {
        controlled: [],
        controlCount: 0
      };
    }

    if (!state.territories.controlled.includes(territoryName)) {
      state.territories.controlled.push(territoryName);
      state.territories.controlCount = state.territories.controlled.length;
      return true;
    }
    return false;
  }

  /**
   * Remove a territory from player control
   * @param {Object} state - Current game state
   * @param {string} territoryName - Name of territory to remove
   * @returns {boolean} Success status
   */
  removeTerritory(state, territoryName) {
    if (!state.territories || !state.territories.controlled) {
      return false;
    }

    const index = state.territories.controlled.indexOf(territoryName);
    if (index > -1) {
      state.territories.controlled.splice(index, 1);
      state.territories.controlCount = state.territories.controlled.length;
      return true;
    }
    return false;
  }

  /**
   * Check if player controls a territory
   * @param {Object} state - Current game state
   * @param {string} territoryName - Name of territory to check
   * @returns {boolean} True if controlled
   */
  controlsTerritory(state, territoryName) {
    return !!(state.territories &&
              state.territories.controlled &&
              state.territories.controlled.includes(territoryName));
  }

  /**
   * Get all territories controlled by player
   * @param {Object} state - Current game state
   * @returns {Array} Array of controlled territory names
   */
  getControlledTerritories(state) {
    return state.territories && state.territories.controlled ?
           [...state.territories.controlled] : [];
  }

  /**
   * Get territory count for player
   * @param {Object} state - Current game state
   * @returns {number} Number of controlled territories
   */
  getTerritoryCount(state) {
    return state.territories ? state.territories.controlCount : 0;
  }

  /**
   * Move player to a new territory
   * @param {Object} state - Current game state
   * @param {string} territoryName - Name of new territory
   * @returns {boolean} Success status
   */
  moveToTerritory(state, territoryName) {
    // Import GameConstants if available to validate territory
    if (typeof window !== 'undefined' && window.GameConstants) {
      if (!window.GameConstants.isValidTerritory(territoryName)) {
        return false;
      }
      // Update district based on territory
      const district = window.GameConstants.getDistrictForTerritory(territoryName);
      if (district) {
        state.player.district = district;
      }
    }

    state.player.territory = territoryName;
    return true;
  }
}

// Export for use in tests and main application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameStateManager;
}
if (typeof window !== 'undefined') {
  window.GameStateManager = GameStateManager;
}
