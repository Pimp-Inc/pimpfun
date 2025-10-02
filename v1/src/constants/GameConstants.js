/**
 * Game Constants - Districts and Territories System
 * Defines the complete territorial structure of Empire City
 */

// District-Territory mapping with 99 total territories
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

// Simple district names array for backward compatibility
const DISTRICTS = Object.keys(DISTRICTS_AND_TERRITORIES);

// Get all territories as a flat array
const ALL_TERRITORIES = Object.values(DISTRICTS_AND_TERRITORIES)
  .flatMap(district => district.territories);

// Territory lookup - maps territory name to district
const TERRITORY_TO_DISTRICT = {};
Object.entries(DISTRICTS_AND_TERRITORIES).forEach(([district, data]) => {
  data.territories.forEach(territory => {
    TERRITORY_TO_DISTRICT[territory] = district;
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
const STORES = [
  'Corner Store',
  'Pew Pew Jimmy\'s',
  'Reggie\'s Plug',
  'Tony\'s Chop Shop'
];

// Utility functions
const GameConstants = {
  DISTRICTS_AND_TERRITORIES,
  DISTRICTS,
  ALL_TERRITORIES,
  TERRITORY_TO_DISTRICT,
  RESOURCE_VALUES,
  STORES,

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
    return DISTRICTS.includes(districtName);
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
