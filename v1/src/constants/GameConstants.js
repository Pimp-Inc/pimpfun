/**
 * Game Constants - Districts and Territories System
 * Defines the complete territorial structure of Empire City
 */

// District-Territory mapping with 99 total territories - Enhanced with Mafia-Inspired Structure
const DISTRICTS_AND_TERRITORIES = {
  'Uptown High-Rollers': {
    realWorldName: 'Bronx',
    territoryCount: 15,
    vibe: 'A northern enclave of bold gamblers and street kings, where high-stakes bets in coliseums fuel Gotti-era crews and resilient rackets. Uptown High-Rollers pulses with cultural pride and mob muscle, from hip-hop fronts to estate hideouts.',
    whyFits: 'Its "Uptown" geography and Yankee Stadium\'s betting lore make it a natural for "High-Rollers," blending gritty ambition with Bronx tenacity.',
    districtBonus: {
      name: 'Gamble\'s Edge',
      description: '+20% chance for high-risk/high-reward outcomes (e.g., double resources from rackets, but risk betrayal). Inspired by Yankee Stadium bets and Gotti\'s bravado.'
    },
    territories: [
      { name: 'Bronzini', description: 'South Bronx\'s hip-hop hub, where rap battles mask drug rackets under neon murals.', trait: 'Hip-Hop Cipher - Grants rhythmic codes for encrypted messages (+intelligence bonus)' },
      { name: 'Iron Rastelli', description: 'Riverdale\'s wooded estates, a hideout for exiled capos plotting in mansion cellars.' },
      { name: 'Yankee Ward', description: 'Stadium district, where Gambino\'s betting rackets thrive in roaring coliseums.', trait: 'Coliseum Echo - Summons crowd frenzy for morale boosts in turf wars' },
      { name: 'Gotti Crest', description: 'Morrisania\'s cultural heart, fiercely loyal to the Teflon Don\'s flashy legacy.', trait: 'Teflon Aura - Reduces damage from legal heat or snitches' },
      { name: 'Tweed Bloom', description: 'Highbridge\'s corrupt blocks, tied to Tammany Hall\'s bribes and mob fixes.', trait: 'Bribe Ledger - Instant access to political favors' },
      { name: 'Galante', description: 'Fordham\'s gritty markets, where Carmine Galante\'s cigar smoke lingers over drug deals.' },
      { name: 'Massino', description: 'Pelham Bay\'s green ruins, a front for Joseph Massino\'s quiet smuggling ops.' },
      { name: 'Basciano', description: 'Throgs Neck\'s waterfront, where Vinny Basciano\'s crews run dockside rackets.' },
      { name: 'Montagna', description: 'Mott Haven\'s industrial alleys, hiding Sal Montagna\'s chop shops.' },
      { name: 'Draft Shadow', description: 'Fordham\'s student haunts, scarred by 1863 Draft Riots and Lucchese\'s university scams.' },
      { name: 'Polito', description: 'Concourse\'s bustling streets, where Ralph Polito\'s numbers games flourish.' },
      { name: 'Santapaola', description: 'Castle Hill\'s quiet blocks, a front for Sicilian-born mobster hideouts.' },
      { name: 'Cammarata', description: 'Soundview\'s tenements, where local crews run small-time extortion under Gotti\'s shadow.' },
      { name: 'Cotroni', description: 'City Island\'s nautical edge, linked to Canadian mob ties and waterfront drops.' },
      { name: 'Banana Field', description: 'Pelham Bay\'s green expanse, tied to Joe Bonanno\'s Sicilian roots and park hits.' }
    ]
  },
  'Midtown Night Strip': {
    realWorldName: 'Manhattan',
    territoryCount: 20,
    vibe: 'The neon-drenched core of Empire City, where after-dark deals in theaters and bars light up Luciano\'s empire. Midtown Night Strip is a strip of glamour and grit, with skyscrapers hiding hits and high-society scams.',
    whyFits: 'Midtown\'s Times Square "night strip" vibe (neon lights, nightlife) aligns perfectly with Manhattan\'s commercial heart and mobbed-up entertainment rackets.',
    districtBonus: {
      name: 'Neon Veil',
      description: 'Stealth and intrigue boost: +15% to espionage or deal-making rolls, with night-time invisibility for ops. Ties to Times Square\'s shadowy glamour.'
    },
    territories: [
      { name: 'Luciano', description: 'Times Square\'s neon nexus, where Lucky Luciano\'s Commission brokers city-wide deals.', trait: 'Commission Seal - Calls a temporary truce with rival families' },
      { name: 'Lucky Ward', description: 'Financial District\'s vaults, Luciano\'s bootleg empire laundering millions.', trait: 'Bootleg Vault - Hidden stash for emergency cash infusions' },
      { name: 'Iron Gotti', description: 'Harlem\'s jazzy streets, ruled by John Gotti\'s flashy crews and soulful fronts.', trait: 'Flash Parade - Distracts enemies with ostentatious displays' },
      { name: 'Tweed Spire', description: 'Tammany\'s political hive, fixing votes with mob muscle and Boss Tweed\'s legacy.', trait: 'Vote Rig - Manipulates elections for district-wide buffs' },
      { name: 'Verrazzano Veil', description: 'Lower East Side\'s immigrant alleys, Lansky\'s hub for smuggling and rackets.' },
      { name: 'Genovese', description: 'Hell\'s Kitchen\'s gritty blocks, Vito Genovese\'s stronghold of union shakedowns.' },
      { name: 'Maranzano', description: 'Upper West Side\'s scholarly dens, Salvatore Maranzano\'s old-school mob rule.' },
      { name: 'Profaci', description: 'SoHo\'s artsy lofts, a front for Joe Profaci\'s olive oil smuggling scams.' },
      { name: 'Gagliano', description: 'Chelsea\'s warehouses, Tommy Gagliano\'s quiet territory for garment rackets.' },
      { name: 'Mangano', description: 'Tribeca\'s chic streets, Vincent Mangano\'s turf for high-end extortion.' },
      { name: 'Bonanno', description: 'East Village\'s bohemian haunts, Joe Bonanno\'s front for underground clubs.' },
      { name: 'Astor', description: 'Upper East Side\'s opulent manors, tied to Gilded Age wealth and mob fronts.' },
      { name: 'Carnegie', description: 'Midtown West\'s theaters, a Carnegie-inspired front for mobbed-up shows.' },
      { name: 'Vanderbilt', description: 'Flatiron\'s grand avenues, Vanderbilt\'s legacy masking modern mob deals.' },
      { name: 'Rockefeller', description: 'Rockefeller Center\'s plaza, a hub for high-stakes mob negotiations.' },
      { name: 'Valachi', description: 'Chinatown\'s crowded alleys, Joe Valachi\'s snitch-haunted smuggling dens.' },
      { name: 'Costello', description: 'Murray Hill\'s quiet bars, Frank Costello\'s base for political fixes.' },
      { name: 'Lansky', description: 'NoHo\'s sleek fronts, Meyer Lansky\'s money-laundering art galleries.' },
      { name: 'Siegel', description: 'Greenwich Village\'s cafes, Bugsy Siegel\'s flashy gambling dens.' },
      { name: 'Capone', description: 'Battery Park\'s waterfront, Al Capone\'s brief NYC haunt for dockside rackets.' }
    ]
  },
  'Crooklyn Heights': {
    realWorldName: 'Brooklyn',
    territoryCount: 30,
    vibe: 'A sprawling web of street scams and waterfront hustles, where Gambino bosses and stoop enforcers run the show. Crooklyn Heights is Brooklyn\'s crooked heartbeat, from carnival cons to bridge-side betrayals.',
    whyFits: '"Crooklyn" captures its cultural swagger and mob history, with elevated scheming vibe, like mob bosses plotting from Heights brownstones while overseeing rackets below.',
    districtBonus: {
      name: 'Stoop Network',
      description: 'Community resilience: +25% defense against raids, plus ally recruitment from diverse ethnic crews. Evokes Brooklyn\'s stoop culture and Gambino loyalty.'
    },
    territories: [
      { name: 'Gambino', description: 'Brooklyn Heights\' waterfront, Carlo Gambino\'s smuggling empire under the bridge.', trait: 'Bridge Toll - Controls chokepoints for toll-based income' },
      { name: 'Iron Castellano', description: 'Williamsburg\'s artsy lofts, scarred by Paul Castellano\'s steakhouse betrayal.', trait: 'Betrayal Blade - Backstab mechanic for turning enemy spies' },
      { name: 'Corny Island', description: 'Coney Island\'s carnival rackets, where rigged games and boardwalk stalls hide mob scams.', trait: 'Rigged Wheel - Random luck spinner for surprise power-ups' },
      { name: 'Tammany Forge', description: 'Bed-Stuy\'s resilient blocks, tied to corrupt unions and Tammany\'s graft.', trait: 'Union Hammer - Boosts labor rackets for resource multipliers' },
      { name: 'Ellis Veil', description: 'Bay Ridge\'s immigrant haunts, Profaci\'s olive oil scams in old-world taverns.' },
      { name: 'Colombo', description: 'Carroll Gardens\' Italian enclave, Joe Colombo\'s base for community fronts.' },
      { name: 'Anastasia', description: 'Sheepshead Bay\'s docks, Albert Anastasia\'s brutal waterfront rackets.' },
      { name: 'Scaletta', description: 'Bushwick\'s gritty streets, a lesser capo\'s turf for chop shops and drugs.' },
      { name: 'Profaci', description: 'Bensonhurst\'s tight-knit blocks, Joe Profaci\'s old-school extortion hub.' },
      { name: 'Gravano', description: 'Gravesend\'s quiet corners, Sammy Gravano\'s snitch-tainted betting dens.' },
      { name: 'Persico', description: 'Red Hook\'s warehouses, Carmine Persico\'s smuggling and labor rackets.' },
      { name: 'Gallo', description: 'Cobble Hill\'s narrow streets, Joey Gallo\'s rebellious crew hangout.' },
      { name: 'Maranzano', description: 'Fort Greene\'s brownstones, Salvatore Maranzano\'s historic mob stronghold.' },
      { name: 'Bonanno', description: 'Greenpoint\'s Polish taverns, Joe Bonanno\'s front for waterfront deals.' },
      { name: 'Gigante', description: 'Crown Heights\' cultural crossroads, Vinny Gigante\'s unassuming rackets.' },
      { name: 'Lucchese', description: 'East New York\'s tough blocks, Tommy Lucchese\'s outer drug turf.' },
      { name: 'D\'Aquila Vale', description: 'Park Slope\'s lush streets, Ignazio D\'Aquila\'s early mob territory.' },
      { name: 'Morello', description: 'Clinton Hill\'s historic blocks, Giuseppe Morello\'s old-school rackets.' },
      { name: 'Reina', description: 'Dyker Heights\' quiet homes, Gaetano Reina\'s subtle extortion ops.' },
      { name: 'Draft Riots', description: 'Crown Heights\' scarred streets, tied to 1863 riots and mob labor wars.' },
      { name: 'Schiro', description: 'Borough Park\'s insular community, Nicola Schiro\'s low-key smuggling.' },
      { name: 'Tramunti', description: 'Sunset Park\'s industrial edge, Carmine Tramunti\'s dockside rackets.' },
      { name: 'Iron Corleone', description: 'DUMBO\'s artistic docks, a fictional nod to mob royalty and Gambino rackets.' },
      { name: 'DeCavalcante', description: 'Flatbush\'s Caribbean pulse, Sam DeCavalcante\'s outer crew territory.' },
      { name: 'Zicarelli', description: 'Canarsie\'s marshy edges, Anthony Zicarelli\'s smuggling hideout.' },
      { name: 'Trafficante', description: 'Midwood\'s quiet streets, Santo Trafficante\'s distant mob influence.' },
      { name: 'Bonventre', description: 'Brighton Beach\'s Slavic shores, Giovanni Bonventre\'s vodka-soaked rackets.' },
      { name: 'Bronx Eagle', description: 'Bushwick\'s rebellious sprawl, tied to the Eagle newspaper and Lucchese press scams.' },
      { name: 'Magliocco', description: 'Marine Park\'s suburban calm, Joseph Magliocco\'s quiet extortion turf.' },
      { name: 'Galante', description: 'Brownsville\'s tough blocks, Carmine Galante\'s drug-running stronghold.' }
    ]
  },
  'Harbor Docks': {
    realWorldName: 'Staten Island',
    territoryCount: 6,
    vibe: 'A foggy, isolated outpost of pier-side smuggling and exiled capos, where Anastasia\'s crews stash goods under lighthouses. Harbor Docks is Empire City\'s shadowy edge, perfect for quiet dumps and secret sails.',
    whyFits: 'Its ferry harbors and Verrazzano Narrows scream "Harbor Docks," fitting the borough\'s maritime seclusion and outer-borough mob hideouts.',
    districtBonus: {
      name: 'Fog Shroud',
      description: 'Evasion mastery: +30% escape/sabotage success, ideal for smuggling or hit-and-runs. Reflects Staten Island\'s misty isolation.'
    },
    territories: [
      { name: 'Ferry Hold', description: 'St. George\'s port, Albert Anastasia\'s smuggling hub under foggy lighthouses.', trait: 'Smuggler\'s Ghost - Invisible transport for goods or agents' },
      { name: 'Narrows Veil', description: 'Tottenville\'s quiet shores, tied to Verrazzano\'s strait and Mangano\'s dock wars.', trait: 'Strait Curse - Hazards enemies crossing into the district' },
      { name: 'Verrazzano', description: 'A coastal cove, early mob dock rackets under the explorer\'s name.', trait: 'Explorer\'s Cache - Ancient relic for navigation bonuses' },
      { name: 'Lovelace', description: 'Richmondtown\'s colonial relics, a front for old-money mob operations.', trait: 'Colonial Deed - Legal loophole for claiming neutral turf' },
      { name: 'Colve', description: 'Great Kills\' suburban calm, named for Dutch colonial ties and quiet rackets.' },
      { name: 'Nicolls', description: 'South Beach\'s boardwalks, tied to colonial governor and waterfront scams.' }
    ]
  },
  'Financial District': {
    realWorldName: 'Queens',
    territoryCount: 28,
    vibe: 'A sprawling mosaic of global money flows and airport heists, where Lucchese bosses launder fortunes through markets and skyscrapers. Financial District reimagines Queens as a diverse banking empire of ethnic crews and offshore scams.',
    whyFits: 'Long Island City\'s finance boom and JFK/LaGuardia rackets make it a "Financial District" proxy, tying to garment laundering and international hustles.',
    districtBonus: {
      name: 'Launder Flow',
      description: 'Economic surge: +10% income from all rackets, with global trade links for rare imports. Draws from Queens\' multicultural markets and airport heists.'
    },
    territories: [
      { name: 'Lucchese', description: 'Flushing\'s vibrant bazaars, Tommy Lucchese\'s garment scams weave global deals.', trait: 'Garment Web - Global spy network for intel on foreign threats' },
      { name: 'Jade Profaci', description: 'Jackson Heights\' cultural mix, Joe Profaci\'s extortion in South Asian markets.', trait: 'Extortion Ledger - Debt collection for passive income' },
      { name: 'Airport Ward', description: 'Long Island City\'s skyline, Genovese\'s airport heists via LaGuardia.', trait: 'Heist Jet - Fast travel or aerial strikes' },
      { name: 'Wave Gambino', description: 'Rockaway\'s salty shores, Carlo Gambino\'s waterfront smuggling drops.' },
      { name: 'Iron Valachi', description: 'Astoria\'s Greek taverns, haunted by Joe Valachi\'s snitch legacy.' },
      { name: 'Bonanno', description: 'Ridgewood\'s working-class blocks, Joe Bonanno\'s quiet drug fronts.' },
      { name: 'Rastelli', description: 'Maspeth\'s industrial yards, Philip Rastelli\'s chop shop operations.' },
      { name: 'Massino', description: 'Howard Beach\'s suburban hideouts, Joseph Massino\'s low-key rackets.' },
      { name: 'Gigante', description: 'Woodside\'s Irish pubs, Vinny Gigante\'s betting dens.' },
      { name: 'Eboli', description: 'Elmhurst\'s pan-Asian stalls, Tommy Eboli\'s street-level extortion.' },
      { name: 'Tieri', description: 'Corona\'s crowded markets, Frank Tieri\'s numbers rackets.' },
      { name: 'Franzese', description: 'DiGregorio\'s quiet streets, Paul DiGregorio\'s smuggling fronts.' },
      { name: 'Sciacca', description: 'Ozone Park\'s hidden dens, Frank Sciacca\'s gambling rackets.' },
      { name: 'Chimento', description: 'Richmond Hill\'s South Asian enclave, John Chimento\'s loan-sharking turf.' },
      { name: 'Silk Maranzano', description: 'Elmhurst\'s silk trade, Salvatore Maranzano\'s early mob foundings.' },
      { name: 'Mancuso', description: 'Bayside\'s suburban calm, Anthony Mancuso\'s quiet extortion ops.' },
      { name: 'Banana Hold', description: 'Jamaica\'s reggae markets, Joe Bonanno\'s fruit racket fronts.', trait: 'Fruit Cartel - Exotic goods trade for rare upgrades' },
      { name: 'Pistone', description: 'Whitestone\'s waterfront, Donnie Brasco\'s undercover scars linger.' },
      { name: 'Worlds Fair', description: 'Forest Hills\' suburban plots, tied to 1939 Fair and Colombo\'s scams.' },
      { name: 'DeSimone', description: 'Kew Gardens\' quiet streets, Tommy DeSimone\'s erratic mob hits.' },
      { name: 'Testa', description: 'Rego Park\'s commercial strips, Philip Testa\'s distant Philly influence.' },
      { name: 'Consolidation Crest', description: 'Corona\'s melting pot, marking 1898\'s borough merge and Mangano\'s turf.' },
      { name: 'Cirillo', description: 'Sunnyside\'s cozy blocks, Dominick Cirillo\'s low-key rackets.' },
      { name: 'Croc Veil', description: 'Ozone Park\'s quiet menace, Fat Tony Salerno\'s nickname-inspired hideout.' },
      { name: 'Mori', description: 'Flushing Meadows\' parklands, Alphonse Mori\'s subtle smuggling ops.' },
      { name: 'Gotti Plains', description: 'Fresh Meadows\' open fields, John Gotti\'s Queens-based hideouts.' },
      { name: 'Riggi', description: 'Rosedale\'s suburban edges, John Riggi\'s outer smuggling turf.' },
      { name: 'Franzese', description: 'Woodhaven\'s quiet homes, Michael Franzese\'s flashy loan-sharking.' }
    ]
  }
};

// Simple district names array for backward compatibility
const DISTRICT_NAMES = Object.keys(DISTRICTS_AND_TERRITORIES);

// Get all territories as a flat array (extract just names for compatibility)
const ALL_TERRITORIES = Object.values(DISTRICTS_AND_TERRITORIES)
  .flatMap(district => district.territories.map(t => typeof t === 'string' ? t : t.name));

// Territory lookup - maps territory name to district
const TERRITORY_TO_DISTRICT = {};
Object.entries(DISTRICTS_AND_TERRITORIES).forEach(([district, data]) => {
  data.territories.forEach(territory => {
    const territoryName = typeof territory === 'string' ? territory : territory.name;
    TERRITORY_TO_DISTRICT[territoryName] = district;
  });
});

// Resource values for net worth calculation
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

// Store names
const STORE_NAMES = [
  'Corner Store',
  'Pew Pew Jimmy\'s',
  'Reggie\'s Plug',
  'Tony\'s Chop Shop'
];

// Utility functions
const GameConstants = {
  DISTRICTS_AND_TERRITORIES,
  DISTRICT_NAMES,
  DISTRICTS: DISTRICT_NAMES, // For backward compatibility with tests
  ALL_TERRITORIES,
  TERRITORY_TO_DISTRICT,
  RESOURCE_VALUES,
  STORE_NAMES,
  STORES: STORE_NAMES, // For backward compatibility with tests

  /**
   * Get district info by name
   * @param {string} districtName - Name of the district
   * @returns {Object|null} District information or null if not found
   */
  getDistrictInfo(districtName) {
    return DISTRICTS_AND_TERRITORIES[districtName] || null;
  },

  /**
   * Get district name for a territory
   * @param {string} territoryName - Name of the territory
   * @returns {string|null} District name or null if not found
   */
  getDistrictForTerritory(territoryName) {
    return TERRITORY_TO_DISTRICT[territoryName] || null;
  },

  /**
   * Get all territories for a district
   * @param {string} districtName - Name of the district
   * @returns {Array} Array of territory names
   */
  getTerritoriesForDistrict(districtName) {
    const district = this.getDistrictInfo(districtName);
    if (!district) return [];
    return district.territories.map(t => typeof t === 'string' ? t : t.name);
  },

  /**
   * Get detailed territories for a district (with descriptions and traits)
   * @param {string} districtName - Name of the district
   * @returns {Array} Array of territory objects
   */
  getDetailedTerritoriesForDistrict(districtName) {
    const district = this.getDistrictInfo(districtName);
    return district ? district.territories : [];
  },

  /**
   * Validate territory name
   * @param {string} territoryName - Territory name to validate
   * @returns {boolean} True if valid territory
   */
  isValidTerritory(territoryName) {
    return ALL_TERRITORIES.includes(territoryName);
  },

  /**
   * Validate district name
   * @param {string} districtName - District name to validate
   * @returns {boolean} True if valid district
   */
  isValidDistrict(districtName) {
    return DISTRICT_NAMES.includes(districtName);
  },

  /**
   * Get total territory count
   * @returns {number} Total number of territories
   */
  getTotalTerritoryCount() {
    return ALL_TERRITORIES.length;
  },

  /**
   * Get territory count for district
   * @param {string} districtName - Name of the district
   * @returns {number} Number of territories in district
   */
  getTerritoryCountForDistrict(districtName) {
    const district = this.getDistrictInfo(districtName);
    return district ? district.territoryCount : 0;
  }
};

// Export for use in tests and main application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameConstants;
}
if (typeof window !== 'undefined') {
  window.GameConstants = GameConstants;
}
