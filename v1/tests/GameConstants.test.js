/**
 * Tests for GameConstants module
 */

const GameConstants = require('../src/constants/GameConstants');

describe('GameConstants', () => {
  describe('District and Territory Structure', () => {
    test('should have exactly 5 districts', () => {
      expect(GameConstants.DISTRICTS).toHaveLength(5);
      expect(GameConstants.DISTRICTS).toEqual([
        'Uptown Plaza',
        'Midtown Market',
        'Crooklyn Heights',
        'Harbor Docks',
        'Financial District'
      ]);
    });

    test('should have exactly 99 total territories', () => {
      expect(GameConstants.ALL_TERRITORIES).toHaveLength(99);
      expect(GameConstants.getTotalTerritoryCount()).toBe(99);
    });

    test('should have correct territory counts per district', () => {
      expect(GameConstants.getTerritoryCountForDistrict('Uptown Plaza')).toBe(15);
      expect(GameConstants.getTerritoryCountForDistrict('Midtown Market')).toBe(20);
      expect(GameConstants.getTerritoryCountForDistrict('Crooklyn Heights')).toBe(30);
      expect(GameConstants.getTerritoryCountForDistrict('Harbor Docks')).toBe(6);
      expect(GameConstants.getTerritoryCountForDistrict('Financial District')).toBe(28);
    });

    test('should have territories that sum to 99', () => {
      const totalFromDistricts = GameConstants.DISTRICTS
        .reduce((sum, district) => sum + GameConstants.getTerritoryCountForDistrict(district), 0);
      expect(totalFromDistricts).toBe(99);
    });
  });

  describe('District Information', () => {
    test('should return correct district info', () => {
      const uptownInfo = GameConstants.getDistrictInfo('Uptown Plaza');
      expect(uptownInfo).toEqual({
        realWorldName: 'Bronx',
        territoryCount: 15,
        territories: expect.any(Array)
      });
      expect(uptownInfo.territories).toHaveLength(15);
    });

    test('should return null for invalid district', () => {
      expect(GameConstants.getDistrictInfo('Invalid District')).toBeNull();
    });

    test('should have correct real world names', () => {
      expect(GameConstants.getDistrictInfo('Uptown Plaza').realWorldName).toBe('Bronx');
      expect(GameConstants.getDistrictInfo('Midtown Market').realWorldName).toBe('Manhattan');
      expect(GameConstants.getDistrictInfo('Crooklyn Heights').realWorldName).toBe('Brooklyn');
      expect(GameConstants.getDistrictInfo('Harbor Docks').realWorldName).toBe('Staten Island');
      expect(GameConstants.getDistrictInfo('Financial District').realWorldName).toBe('Queens');
    });
  });

  describe('Territory Validation', () => {
    test('should validate known territories', () => {
      expect(GameConstants.isValidTerritory('South Bronx Strip')).toBe(true);
      expect(GameConstants.isValidTerritory('Times Square Center')).toBe(true);
      expect(GameConstants.isValidTerritory('Downtown Brooklyn')).toBe(true);
      expect(GameConstants.isValidTerritory('St. George Terminal')).toBe(true);
      expect(GameConstants.isValidTerritory('Long Island City')).toBe(true);
    });

    test('should reject invalid territories', () => {
      expect(GameConstants.isValidTerritory('Invalid Territory')).toBe(false);
      expect(GameConstants.isValidTerritory('')).toBe(false);
      expect(GameConstants.isValidTerritory(null)).toBe(false);
    });

    test('should validate known districts', () => {
      expect(GameConstants.isValidDistrict('Uptown Plaza')).toBe(true);
      expect(GameConstants.isValidDistrict('Midtown Market')).toBe(true);
      expect(GameConstants.isValidDistrict('Crooklyn Heights')).toBe(true);
      expect(GameConstants.isValidDistrict('Harbor Docks')).toBe(true);
      expect(GameConstants.isValidDistrict('Financial District')).toBe(true);
    });

    test('should reject invalid districts', () => {
      expect(GameConstants.isValidDistrict('Invalid District')).toBe(false);
      expect(GameConstants.isValidDistrict('')).toBe(false);
      expect(GameConstants.isValidDistrict(null)).toBe(false);
    });
  });

  describe('Territory-District Mapping', () => {
    test('should correctly map territories to districts', () => {
      expect(GameConstants.getDistrictForTerritory('South Bronx Strip')).toBe('Uptown Plaza');
      expect(GameConstants.getDistrictForTerritory('Times Square Center')).toBe('Midtown Market');
      expect(GameConstants.getDistrictForTerritory('Downtown Brooklyn')).toBe('Crooklyn Heights');
      expect(GameConstants.getDistrictForTerritory('St. George Terminal')).toBe('Harbor Docks');
      expect(GameConstants.getDistrictForTerritory('Long Island City')).toBe('Financial District');
    });

    test('should return null for invalid territory', () => {
      expect(GameConstants.getDistrictForTerritory('Invalid Territory')).toBeNull();
    });

    test('should get all territories for a district', () => {
      const uptownTerritories = GameConstants.getTerritoriesForDistrict('Uptown Plaza');
      expect(uptownTerritories).toHaveLength(15);
      expect(uptownTerritories).toContain('South Bronx Strip');
      expect(uptownTerritories).toContain('Yankee Stadium Block');

      const harborTerritories = GameConstants.getTerritoriesForDistrict('Harbor Docks');
      expect(harborTerritories).toHaveLength(6);
      expect(harborTerritories).toContain('St. George Terminal');
    });

    test('should return empty array for invalid district', () => {
      expect(GameConstants.getTerritoriesForDistrict('Invalid District')).toEqual([]);
    });
  });

  describe('Specific Territory Verification', () => {
    test('Uptown Plaza should have correct territories', () => {
      const territories = GameConstants.getTerritoriesForDistrict('Uptown Plaza');
      expect(territories).toEqual([
        'South Bronx Strip', 'Yankee Stadium Block', 'Grand Concourse North', 'Grand Concourse South',
        'Bronx River East', 'Bronx River West', 'Mott Haven', 'Melrose Avenue',
        'Hunts Point Market', 'Port Morris', 'Morrisania', 'Crotona Park',
        'Tremont Square', 'Fordham Road', 'Belmont Strip'
      ]);
    });

    test('Harbor Docks should have correct territories', () => {
      const territories = GameConstants.getTerritoriesForDistrict('Harbor Docks');
      expect(territories).toEqual([
        'St. George Terminal', 'Port Richmond', 'New Brighton',
        'Stapleton Docks', 'South Beach', 'Tottenville'
      ]);
    });

    test('Crooklyn Heights should have 30 territories', () => {
      const territories = GameConstants.getTerritoriesForDistrict('Crooklyn Heights');
      expect(territories).toHaveLength(30);
      expect(territories).toContain('Downtown Brooklyn');
      expect(territories).toContain('Coney Island');
      expect(territories).toContain('Clinton Hill');
    });
  });

  describe('Legacy Constants', () => {
    test('should include resource values', () => {
      expect(GameConstants.RESOURCE_VALUES).toEqual({
        hoes: 1000,
        thugs: 500,
        crack: 10,
        weed: 15,
        beer: 2,
        condoms: 0.1,
        weapons: 100,
        vehicles: 2000
      });
    });

    test('should include store names', () => {
      expect(GameConstants.STORES).toEqual([
        'Corner Store',
        'Pew Pew Jimmy\'s',
        'Reggie\'s Plug',
        'Tony\'s Chop Shop'
      ]);
    });
  });
});
