/**
 * Unit tests for GameUtils utility functions
 */

const GameUtils = require('../src/utils/GameUtils');

describe('GameUtils', () => {
  describe('formatCurrency', () => {
    test('should format positive numbers correctly', () => {
      expect(GameUtils.formatCurrency(1000)).toBe('$1,000');
      expect(GameUtils.formatCurrency(1234567)).toBe('$1,234,567');
      expect(GameUtils.formatCurrency(0)).toBe('$0');
    });

    test('should handle invalid inputs', () => {
      expect(GameUtils.formatCurrency(null)).toBe('$0');
      expect(GameUtils.formatCurrency(undefined)).toBe('$0');
      expect(GameUtils.formatCurrency('invalid')).toBe('$0');
    });

    test('should format negative numbers', () => {
      expect(GameUtils.formatCurrency(-1000)).toBe('$-1,000');
    });
  });

  describe('formatNumber', () => {
    test('should format large numbers with suffixes', () => {
      expect(GameUtils.formatNumber(1500)).toBe('1.5K');
      expect(GameUtils.formatNumber(1500000)).toBe('1.5M');
      expect(GameUtils.formatNumber(1500000000)).toBe('1.5B');
    });

    test('should handle small numbers', () => {
      expect(GameUtils.formatNumber(999)).toBe('999');
      expect(GameUtils.formatNumber(0)).toBe('0');
    });

    test('should handle invalid inputs', () => {
      expect(GameUtils.formatNumber(null)).toBe('0');
      expect(GameUtils.formatNumber(undefined)).toBe('0');
    });
  });

  describe('calculatePercentage', () => {
    test('should calculate percentage correctly', () => {
      expect(GameUtils.calculatePercentage(50, 100)).toBe(50);
      expect(GameUtils.calculatePercentage(75, 100)).toBe(75);
      expect(GameUtils.calculatePercentage(0, 100)).toBe(0);
      expect(GameUtils.calculatePercentage(100, 100)).toBe(100);
    });

    test('should handle values outside bounds', () => {
      expect(GameUtils.calculatePercentage(150, 100)).toBe(100);
      expect(GameUtils.calculatePercentage(-10, 100)).toBe(0);
    });

    test('should handle custom min values', () => {
      expect(GameUtils.calculatePercentage(60, 100, 50)).toBe(20); // (60-50)/(100-50) * 100
    });

    test('should handle edge cases', () => {
      expect(GameUtils.calculatePercentage(50, 50, 50)).toBe(0); // max = min case
      expect(GameUtils.calculatePercentage(50, 40, 50)).toBe(0); // max < min case
    });
  });

  describe('randomBetween', () => {
    test('should generate numbers within range', () => {
      for (let i = 0; i < 100; i++) {
        const result = GameUtils.randomBetween(1, 10);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(10);
        expect(Number.isInteger(result)).toBe(true);
      }
    });

    test('should handle single value range', () => {
      expect(GameUtils.randomBetween(5, 5)).toBe(5);
    });
  });

  describe('randomChoice', () => {
    test('should return element from array', () => {
      const array = ['a', 'b', 'c', 'd'];
      for (let i = 0; i < 50; i++) {
        const result = GameUtils.randomChoice(array);
        expect(array).toContain(result);
      }
    });

    test('should handle single element array', () => {
      expect(GameUtils.randomChoice(['single'])).toBe('single');
    });

    test('should handle invalid inputs', () => {
      expect(GameUtils.randomChoice([])).toBe(null);
      expect(GameUtils.randomChoice(null)).toBe(null);
      expect(GameUtils.randomChoice(undefined)).toBe(null);
      expect(GameUtils.randomChoice('not-array')).toBe(null);
    });
  });

  describe('minutesDifference', () => {
    test('should calculate time difference correctly', () => {
      const now = Date.now();
      const oneHourAgo = now - (60 * 60 * 1000);
      
      expect(GameUtils.minutesDifference(oneHourAgo, now)).toBe(60);
    });

    test('should use current time as default', () => {
      const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
      const result = GameUtils.minutesDifference(fiveMinutesAgo);
      
      expect(result).toBeGreaterThanOrEqual(4);
      expect(result).toBeLessThanOrEqual(6);
    });

    test('should handle absolute values', () => {
      const now = Date.now();
      const future = now + (30 * 60 * 1000);
      
      expect(GameUtils.minutesDifference(now, future)).toBe(30);
      expect(GameUtils.minutesDifference(future, now)).toBe(30);
    });
  });

  describe('clamp', () => {
    test('should clamp values within bounds', () => {
      expect(GameUtils.clamp(5, 0, 10)).toBe(5);
      expect(GameUtils.clamp(-5, 0, 10)).toBe(0);
      expect(GameUtils.clamp(15, 0, 10)).toBe(10);
    });

    test('should handle edge cases', () => {
      expect(GameUtils.clamp(0, 0, 10)).toBe(0);
      expect(GameUtils.clamp(10, 0, 10)).toBe(10);
    });
  });

  describe('lerp', () => {
    test('should interpolate correctly', () => {
      expect(GameUtils.lerp(0, 10, 0.5)).toBe(5);
      expect(GameUtils.lerp(0, 10, 0)).toBe(0);
      expect(GameUtils.lerp(0, 10, 1)).toBe(10);
    });

    test('should clamp factor to 0-1 range', () => {
      expect(GameUtils.lerp(0, 10, -0.5)).toBe(0);
      expect(GameUtils.lerp(0, 10, 1.5)).toBe(10);
    });
  });

  describe('exponentialGrowth', () => {
    test('should calculate exponential growth', () => {
      expect(GameUtils.exponentialGrowth(100, 0.1, 1)).toBeCloseTo(110, 5);
      expect(GameUtils.exponentialGrowth(100, 0.1, 0)).toBe(100);
    });

    test('should handle negative growth', () => {
      expect(GameUtils.exponentialGrowth(100, -0.1, 1)).toBeCloseTo(90, 5);
    });
  });

  describe('isValidEmail', () => {
    test('should validate correct email formats', () => {
      expect(GameUtils.isValidEmail('test@example.com')).toBe(true);
      expect(GameUtils.isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(GameUtils.isValidEmail('test+tag@example.org')).toBe(true);
    });

    test('should reject invalid email formats', () => {
      expect(GameUtils.isValidEmail('invalid')).toBe(false);
      expect(GameUtils.isValidEmail('test@')).toBe(false);
      expect(GameUtils.isValidEmail('@example.com')).toBe(false);
      expect(GameUtils.isValidEmail('test..test@example.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    test('should validate strong passwords', () => {
      const result = GameUtils.validatePassword('StrongPass123!');
      
      expect(result.valid).toBe(true);
      expect(result.strength).toBe('Strong');
      expect(result.score).toBe(5);
      expect(result.requirements.length).toBe(true);
      expect(result.requirements.uppercase).toBe(true);
      expect(result.requirements.lowercase).toBe(true);
      expect(result.requirements.numbers).toBe(true);
      expect(result.requirements.special).toBe(true);
    });

    test('should validate medium passwords', () => {
      const result = GameUtils.validatePassword('password123'); // lowercase + numbers only
      
      expect(result.valid).toBe(true);
      expect(result.strength).toBe('Medium');
      expect(result.score).toBe(3);
    });

    test('should reject weak passwords', () => {
      const result = GameUtils.validatePassword('weak');
      
      expect(result.valid).toBe(false);
      expect(result.strength).toBe('Weak');
      expect(result.requirements.length).toBe(false);
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    test('should debounce function calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = GameUtils.debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    afterAll(() => {
      jest.useRealTimers();
    });
  });

  describe('deepClone', () => {
    test('should deep clone objects', () => {
      const original = {
        name: 'test',
        nested: { value: 42 },
        array: [1, 2, { inner: true }]
      };

      const cloned = GameUtils.deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.nested).not.toBe(original.nested);
      expect(cloned.array).not.toBe(original.array);
    });

    test('should handle primitive values', () => {
      expect(GameUtils.deepClone(42)).toBe(42);
      expect(GameUtils.deepClone('string')).toBe('string');
      expect(GameUtils.deepClone(null)).toBe(null);
      expect(GameUtils.deepClone(undefined)).toBe(undefined);
    });

    test('should handle Date objects', () => {
      const date = new Date();
      const cloned = GameUtils.deepClone(date);
      
      expect(cloned).toEqual(date);
      expect(cloned).not.toBe(date);
    });
  });

  describe('isEmpty', () => {
    test('should detect empty values', () => {
      expect(GameUtils.isEmpty({})).toBe(true);
      expect(GameUtils.isEmpty([])).toBe(true);
      expect(GameUtils.isEmpty('')).toBe(true);
      expect(GameUtils.isEmpty(null)).toBe(true);
      expect(GameUtils.isEmpty(undefined)).toBe(true);
    });

    test('should detect non-empty values', () => {
      expect(GameUtils.isEmpty({ key: 'value' })).toBe(false);
      expect(GameUtils.isEmpty([1, 2, 3])).toBe(false);
      expect(GameUtils.isEmpty('string')).toBe(false);
      expect(GameUtils.isEmpty(0)).toBe(false);
    });
  });

  describe('generateId', () => {
    test('should generate unique IDs', () => {
      const id1 = GameUtils.generateId();
      const id2 = GameUtils.generateId();
      
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });
  });

  describe('safeDivide', () => {
    test('should perform safe division', () => {
      expect(GameUtils.safeDivide(10, 2)).toBe(5);
      expect(GameUtils.safeDivide(7, 3)).toBeCloseTo(2.33, 2);
    });

    test('should handle division by zero', () => {
      expect(GameUtils.safeDivide(10, 0)).toBe(0);
      expect(GameUtils.safeDivide(10, 0, 99)).toBe(99);
    });
  });
});