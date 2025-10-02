# API Documentation

## StoreSystem Module

The `StoreSystem` class provides comprehensive store functionality including quantity management, purchase validation, and cost calculations.

### Constructor

```javascript
const storeSystem = new StoreSystem();
```

### Methods

#### `initializeStores(storeData)`
Initialize store configuration data.

**Parameters:**
- `storeData` (Object) - Store configuration object

**Example:**
```javascript
const stores = {
  "Corner Store": {
    owner: "Tony",
    items: { beer: 2, condoms: 0.1 }
  }
};
storeSystem.initializeStores(stores);
```

#### `adjustQuantity(inputId, change)`
Adjust quantity in an input field by a specified amount.

**Parameters:**
- `inputId` (string) - ID of the quantity input element
- `change` (number) - Amount to change (+1 or -1)

**Example:**
```javascript
storeSystem.adjustQuantity('beer_qty', 1); // Increase beer quantity by 1
storeSystem.adjustQuantity('beer_qty', -1); // Decrease beer quantity by 1
```

#### `updateQuantityDisplays()`
Update all quantity display elements on the page.

**Example:**
```javascript
storeSystem.updateQuantityDisplays();
```

#### `buyWithQuantity(item, unitPrice, qtyInputId, gameState, updateUI, showNotification)`
Process a purchase with specified quantity.

**Parameters:**
- `item` (string) - Type of item being purchased
- `unitPrice` (number) - Price per unit
- `qtyInputId` (string) - ID of quantity input field
- `gameState` (Object) - Current game state object
- `updateUI` (Function) - Function to update the user interface
- `showNotification` (Function) - Function to show notifications

**Returns:** `boolean` - Success status of the purchase

**Example:**
```javascript
const success = storeSystem.buyWithQuantity(
  'beer', 
  2, 
  'beer_qty', 
  gameState, 
  updateUI, 
  showNotification
);
```

#### `calculateBulkSavings(individualPrice, bulkPrice, bulkQuantity)`
Calculate savings from bulk purchase deals.

**Parameters:**
- `individualPrice` (number) - Price per individual item
- `bulkPrice` (number) - Total price for bulk deal
- `bulkQuantity` (number) - Quantity in bulk deal

**Returns:** Object with savings information
```javascript
{
  savings: number,        // Amount saved
  savingsPercent: number, // Percentage saved
  individualTotal: number, // Total if buying individually
  bulkPrice: number       // Bulk deal price
}
```

**Example:**
```javascript
const savings = storeSystem.calculateBulkSavings(2, 300, 200);
// Returns: { savings: 100, savingsPercent: 25, individualTotal: 400, bulkPrice: 300 }
```

#### `validatePurchase(quantity, unitPrice, availableCash, maxQuantity)`
Validate if a purchase can be completed.

**Parameters:**
- `quantity` (number) - Quantity to purchase
- `unitPrice` (number) - Price per unit
- `availableCash` (number) - Available cash for purchase
- `maxQuantity` (number) - Maximum allowed quantity (default: 1000)

**Returns:** Object with validation result
```javascript
{
  valid: boolean,    // Whether purchase is valid
  error?: string,    // Error message if invalid
  totalCost?: number // Total cost if valid
}
```

**Example:**
```javascript
const validation = storeSystem.validatePurchase(10, 2, 1000, 1000);
// Returns: { valid: true, totalCost: 20 }
```

---

## GameStateManager Module

The `GameStateManager` class handles game state initialization, validation, persistence, and core game mechanics.

### Constructor

```javascript
const gameStateManager = new GameStateManager();
```

### Properties

#### `defaultState`
Default game state structure with all required properties and initial values.

### Methods

#### `initializeNewGameState()`
Create a fresh game state with default values.

**Returns:** Object - Complete game state object

**Example:**
```javascript
const newGame = gameStateManager.initializeNewGameState();
```

#### `validateGameState(state)`
Validate the structure and content of a game state object.

**Parameters:**
- `state` (Object) - Game state to validate

**Returns:** Object with validation results
```javascript
{
  valid: boolean,     // Whether state is valid
  errors: string[]    // Array of error messages
}
```

**Example:**
```javascript
const validation = gameStateManager.validateGameState(gameState);
if (!validation.valid) {
  console.log('Errors:', validation.errors);
}
```

#### `migrateGameState(oldState)`
Migrate an old game state format to the current version.

**Parameters:**
- `oldState` (Object) - Old format game state

**Returns:** Object - Migrated game state

**Example:**
```javascript
const migratedState = gameStateManager.migrateGameState(oldSaveData);
```

#### `calculateNetWorth(state)`
Calculate total net worth from current game state.

**Parameters:**
- `state` (Object) - Current game state

**Returns:** number - Total net worth value

**Example:**
```javascript
const netWorth = gameStateManager.calculateNetWorth(gameState);
console.log(`Net Worth: $${netWorth.toLocaleString()}`);
```

#### `updateStats(state, statType, value)`
Update player statistics in the game state.

**Parameters:**
- `state` (Object) - Current game state
- `statType` (string) - Type of statistic to update
- `value` (number) - Value to add (default: 1)

**Example:**
```javascript
gameStateManager.updateStats(gameState, 'totalCashEarned', 1000);
gameStateManager.updateStats(gameState, 'combatWins', 1);
```

#### `canAfford(state, cost)`
Check if the player can afford a specific purchase.

**Parameters:**
- `state` (Object) - Current game state
- `cost` (number) - Cost of the purchase

**Returns:** boolean - Whether the player can afford it

**Example:**
```javascript
if (gameStateManager.canAfford(gameState, 500)) {
  // Process purchase
}
```

#### `processPurchase(state, cost, item, quantity)`
Process a purchase transaction and update game state.

**Parameters:**
- `state` (Object) - Current game state
- `cost` (number) - Total cost of purchase
- `item` (string) - Item being purchased
- `quantity` (number) - Quantity being purchased (default: 1)

**Returns:** boolean - Transaction success

**Example:**
```javascript
const success = gameStateManager.processPurchase(gameState, 100, 'beer', 50);
```

#### `regenerateTurns(state)`
Regenerate turns based on time elapsed since last login.

**Parameters:**
- `state` (Object) - Current game state

**Returns:** number - Number of turns added

**Example:**
```javascript
const turnsAdded = gameStateManager.regenerateTurns(gameState);
if (turnsAdded > 0) {
  console.log(`Regenerated ${turnsAdded} turns`);
}
```

---

## Game State Structure

### Complete Game State Object

```javascript
{
  player: {
    name: string,           // Player name
    cash: number,          // Available cash
    netWorth: number,      // Total net worth
    heat: number,          // Police heat level
    turns: number,         // Available turns
    lastLogin: number,     // Last login timestamp
    district: string,      // Current district
    territory: string,     // Current territory
    level: number,         // Player level
    experience: number     // Experience points
  },
  territories: {
    controlled: Array,     // Array of controlled territory names
    controlCount: number   // Number of territories controlled
  },
  resources: {
    hoes: number,          // Number of hoes
    thugs: number,         // Number of thugs
    crack: number,         // Crack inventory
    weed: number,          // Weed inventory (ounces)
    beer: number,          // Beer inventory
    condoms: number,       // Condom inventory
    weapons: number,       // Weapon count
    vehicles: number       // Vehicle count
  },
  supplies: {
    thugHappiness: number, // Thug happiness percentage
    hoeHappiness: number,  // Hoe happiness percentage
    protection: number     // Protection level
  },
  heat: {
    level: number,         // Current heat level
    corruption: number,    // Corruption level
    lastBribe: number,     // Last bribe timestamp
    nftKeys: {
      bronze: number,      // Bronze keys owned
      silver: number,      // Silver keys owned
      gold: number,        // Gold keys owned
      diamond: number      // Diamond keys owned
    }
  },
  crew: Array,            // Crew member objects
  settings: {
    notifications: boolean, // Notifications enabled
    autoSave: boolean,     // Auto-save enabled
    soundEnabled: boolean  // Sound enabled
  },
  stats: {
    totalCashEarned: number,  // Lifetime cash earned
    totalPurchases: number,   // Total purchases made
    combatWins: number,       // Combat victories
    combatLosses: number,     // Combat defeats
    timePlayed: number        // Total play time
  }
}
```

---

## Constants and Enums

### Resource Values (for net worth calculation)
```javascript
const RESOURCE_VALUES = {
  hoes: 1000,
  thugs: 500,
  crack: 10,
  weed: 15,
  beer: 2,
  condoms: 0.1,
  weapons: 100,
  vehicles: 2000
};
```

### Districts and Territories
```javascript
const DISTRICTS_AND_TERRITORIES = {
  'Uptown Plaza': {
    realWorldName: 'Bronx',
    territoryCount: 15,
    territories: [
      'South Bronx Strip', 'Yankee Stadium Block', 'Grand Concourse North', 'Grand Concourse South',
      'Bronx River East', 'Bronx River West', 'Mott Haven', 'Melrose Avenue',
      'Hunts Point Market', 'Port Morris', 'Morrisania', 'Crotona Park',
      'Tremont Square', 'Fordham Road', 'Belmont Strip'
    ]
  },
  'Midtown Market': {
    realWorldName: 'Manhattan', 
    territoryCount: 20,
    territories: [
      'Times Square Center', 'Times Square North', 'Times Square South', 'Herald Square',
      'Penn Station Block', 'Madison Square', 'Garment District', 'Theater District',
      'Hell\'s Kitchen West', 'Hell\'s Kitchen East', 'Chelsea Market', 'Meatpacking District',
      'West Village', 'East Village', 'SoHo North', 'SoHo South',
      'NoLita Strip', 'Little Italy', 'Chinatown', 'Financial Core'
    ]
  },
  'Crooklyn Heights': {
    realWorldName: 'Brooklyn',
    territoryCount: 30, 
    territories: [
      'Downtown Brooklyn', 'Brooklyn Heights', 'DUMBO', 'Williamsburg North',
      'Williamsburg South', 'Greenpoint', 'Bushwick North', 'Bushwick South',
      'Bedford-Stuyvesant North', 'Bedford-Stuyvesant South', 'Crown Heights East', 'Crown Heights West',
      'Prospect Heights', 'Park Slope', 'Gowanus', 'Red Hook',
      'Sunset Park', 'Bay Ridge', 'Bensonhurst', 'Coney Island',
      'Brighton Beach', 'Sheepshead Bay', 'Flatbush North', 'Flatbush South',
      'East Flatbush', 'Canarsie', 'East New York', 'Brownsville',
      'Fort Greene', 'Clinton Hill'
    ]
  },
  'Harbor Docks': {
    realWorldName: 'Staten Island',
    territoryCount: 6,
    territories: [
      'St. George Terminal', 'Port Richmond', 'New Brighton', 
      'Stapleton Docks', 'South Beach', 'Tottenville'
    ]
  },
  'Financial District': {
    realWorldName: 'Queens',
    territoryCount: 28,
    territories: [
      'Long Island City', 'Astoria North', 'Astoria South', 'Sunnyside',
      'Woodside', 'Jackson Heights', 'Corona North', 'Corona South',
      'Elmhurst', 'Rego Park', 'Forest Hills', 'Kew Gardens',
      'Richmond Hill', 'Ozone Park', 'Howard Beach', 'JFK Airport Zone',
      'Jamaica Center', 'Jamaica South', 'Hollis', 'Queens Village',
      'Bayside', 'Whitestone', 'College Point', 'Flushing Meadows',
      'Flushing Downtown', 'Murray Hill', 'Beechhurst', 'Far Rockaway'
    ]
  }
};

// Total: 99 territories across 5 districts
const ALL_TERRITORIES = Object.values(DISTRICTS_AND_TERRITORIES)
  .flatMap(district => district.territories);
```

### Legacy District Names (for backward compatibility)
```javascript
const DISTRICTS = [
  'Uptown Plaza',      // Updated from 'Uptown'
  'Midtown Market',    // Updated from 'Midtown'
  'Crooklyn Heights',  // Updated from 'Crooklyn'
  'Harbor Docks',
  'Financial District'
];
```

### Store Names
```javascript
const STORES = [
  'Corner Store',
  'Pew Pew Jimmy\'s',
  'Reggie\'s Plug',
  'Tony\'s Chop Shop'
];
```

---

## Error Handling

All API methods include comprehensive error handling:

- **Input validation**: All parameters are validated before processing
- **Graceful degradation**: Missing DOM elements don't cause crashes
- **Error reporting**: Clear error messages for debugging
- **State integrity**: Game state remains consistent even on errors

## Browser Compatibility

These modules support:
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Performance Considerations

- **Memory efficient**: Minimal object creation during gameplay
- **Fast calculations**: Optimized algorithms for real-time updates
- **DOM optimization**: Minimal DOM queries and updates
- **Event handling**: Efficient event listeners and cleanup