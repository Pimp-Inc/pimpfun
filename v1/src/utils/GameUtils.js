/**
 * Utility functions for game calculations and common operations
 */

class GameUtils {
  /**
   * Format number as currency string
   * @param {number} amount - Amount to format
   * @returns {string} Formatted currency string
   */
  static formatCurrency(amount) {
    if (typeof amount !== 'number') return '$0';
    return `$${amount.toLocaleString()}`;
  }

  /**
   * Format number with appropriate suffix (K, M, B)
   * @param {number} num - Number to format
   * @returns {string} Formatted number string
   */
  static formatNumber(num) {
    if (typeof num !== 'number') return '0';

    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  /**
   * Calculate percentage with bounds checking
   * @param {number} value - Current value
   * @param {number} max - Maximum value
   * @param {number} min - Minimum value (default: 0)
   * @returns {number} Percentage (0-100)
   */
  static calculatePercentage(value, max, min = 0) {
    if (max === min) return 0; // Handle equal max and min
    if (max < min) return 0;   // Handle invalid range
    const bounded = Math.max(min, Math.min(max, value));
    return Math.round(((bounded - min) / (max - min)) * 100);
  }

  /**
   * Generate random number between min and max (inclusive)
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random number
   */
  static randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Get random element from array
   * @param {Array} array - Array to select from
   * @returns {*} Random element
   */
  static randomChoice(array) {
    if (!Array.isArray(array) || array.length === 0) return null;
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Calculate time difference in minutes
   * @param {number} timestamp1 - First timestamp
   * @param {number} timestamp2 - Second timestamp (default: now)
   * @returns {number} Difference in minutes
   */
  static minutesDifference(timestamp1, timestamp2 = Date.now()) {
    return Math.floor(Math.abs(timestamp2 - timestamp1) / (1000 * 60));
  }

  /**
   * Clamp value between min and max
   * @param {number} value - Value to clamp
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Clamped value
   */
  static clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  /**
   * Linear interpolation between two values
   * @param {number} start - Start value
   * @param {number} end - End value
   * @param {number} factor - Interpolation factor (0-1)
   * @returns {number} Interpolated value
   */
  static lerp(start, end, factor) {
    return start + (end - start) * this.clamp(factor, 0, 1);
  }

  /**
   * Calculate exponential growth
   * @param {number} base - Base amount
   * @param {number} rate - Growth rate (as decimal)
   * @param {number} time - Time periods
   * @returns {number} Final amount
   */
  static exponentialGrowth(base, rate, time) {
    return base * Math.pow(1 + rate, time);
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} Valid email
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && !email.includes('..');
  }

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} Validation result
   */
  static validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const score = [
      password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar
    ].filter(Boolean).length;

    let strength = 'Weak';
    if (score >= 4) strength = 'Strong';
    else if (score >= 3) strength = 'Medium';

    return {
      valid: password.length >= minLength,
      strength,
      score,
      requirements: {
        length: password.length >= minLength,
        uppercase: hasUpperCase,
        lowercase: hasLowerCase,
        numbers: hasNumbers,
        special: hasSpecialChar
      }
    };
  }

  /**
   * Debounce function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Deep clone an object
   * @param {Object} obj - Object to clone
   * @returns {Object} Deep cloned object
   */
  static deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    if (typeof obj === 'object') {
      const cloned = {};
      Object.keys(obj).forEach(key => {
        cloned[key] = this.deepClone(obj[key]);
      });
      return cloned;
    }
  }

  /**
   * Check if object is empty
   * @param {Object} obj - Object to check
   * @returns {boolean} Is empty
   */
  static isEmpty(obj) {
    if (obj == null) return true;
    if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
    if (typeof obj === 'number') return false; // Numbers are never "empty"
    return Object.keys(obj).length === 0;
  }

  /**
   * Generate unique ID
   * @returns {string} Unique identifier
   */
  static generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Safe division with default value
   * @param {number} numerator - Numerator
   * @param {number} denominator - Denominator
   * @param {number} defaultValue - Default value if division by zero
   * @returns {number} Division result or default
   */
  static safeDivide(numerator, denominator, defaultValue = 0) {
    return denominator === 0 ? defaultValue : numerator / denominator;
  }
}

// Export for use in tests and main application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameUtils;
}
if (typeof window !== 'undefined') {
  window.GameUtils = GameUtils;
}
