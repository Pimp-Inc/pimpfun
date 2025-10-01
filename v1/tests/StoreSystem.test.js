/**
 * Unit tests for StoreSystem module
 */

const StoreSystem = require('../src/modules/StoreSystem');

describe('StoreSystem', () => {
  let storeSystem;
  let mockGameState;
  let mockUpdateUI;
  let mockShowNotification;

  beforeEach(() => {
    storeSystem = new StoreSystem();
    mockGameState = {
      player: { cash: 1000 },
      resources: { beer: 0, condoms: 0 }
    };
    mockUpdateUI = jest.fn();
    mockShowNotification = jest.fn();

    // Mock DOM elements
    document.body.innerHTML = `
      <input id="beer_qty" value="10" max="1000" />
      <span id="beer_total"></span>
      <input id="condom_qty" value="5" max="1000" />
      <span id="condom_total"></span>
    `;
  });

  describe('adjustQuantity', () => {
    test('should increase quantity when change is positive', () => {
      const input = document.getElementById('beer_qty');
      input.value = '10';
      
      storeSystem.adjustQuantity('beer_qty', 1);
      
      expect(input.value).toBe('11');
    });

    test('should decrease quantity when change is negative', () => {
      const input = document.getElementById('beer_qty');
      input.value = '10';
      
      storeSystem.adjustQuantity('beer_qty', -1);
      
      expect(input.value).toBe('9');
    });

    test('should not go below 1', () => {
      const input = document.getElementById('beer_qty');
      input.value = '1';
      
      storeSystem.adjustQuantity('beer_qty', -1);
      
      expect(input.value).toBe('1');
    });

    test('should not exceed max value', () => {
      const input = document.getElementById('beer_qty');
      input.value = '1000';
      input.max = '1000';
      
      storeSystem.adjustQuantity('beer_qty', 1);
      
      expect(input.value).toBe('1000');
    });

    test('should handle non-existent input gracefully', () => {
      expect(() => {
        storeSystem.adjustQuantity('nonexistent_qty', 1);
      }).not.toThrow();
    });
  });

  describe('buyWithQuantity', () => {
    test('should successfully purchase items when player has enough cash', () => {
      const input = document.getElementById('beer_qty');
      input.value = '10';
      
      const result = storeSystem.buyWithQuantity(
        'beer', 
        2, 
        'beer_qty', 
        mockGameState, 
        mockUpdateUI, 
        mockShowNotification
      );
      
      expect(result).toBe(true);
      expect(mockGameState.player.cash).toBe(980); // 1000 - (10 * 2)
      expect(mockGameState.resources.beer).toBe(10);
      expect(mockShowNotification).toHaveBeenCalledWith(
        '✅ Bought 10 beer for $20!',
        'success'
      );
      expect(mockUpdateUI).toHaveBeenCalled();
    });

    test('should fail when player has insufficient cash', () => {
      const input = document.getElementById('beer_qty');
      input.value = '1000';
      mockGameState.player.cash = 100;
      
      const result = storeSystem.buyWithQuantity(
        'beer', 
        2, 
        'beer_qty', 
        mockGameState, 
        mockUpdateUI, 
        mockShowNotification
      );
      
      expect(result).toBe(false);
      expect(mockGameState.player.cash).toBe(100); // Should remain unchanged
      expect(mockGameState.resources.beer).toBe(0); // Should remain unchanged
      expect(mockShowNotification).toHaveBeenCalledWith(
        '❌ Not enough cash! Need $2,000',
        'error'
      );
    });

    test('should handle missing quantity input', () => {
      const result = storeSystem.buyWithQuantity(
        'beer', 
        2, 
        'nonexistent_qty', 
        mockGameState, 
        mockUpdateUI, 
        mockShowNotification
      );
      
      expect(result).toBe(false);
      expect(mockShowNotification).toHaveBeenCalledWith(
        '❌ Quantity input not found!',
        'error'
      );
    });
  });

  describe('calculateBulkSavings', () => {
    test('should correctly calculate bulk savings', () => {
      const result = storeSystem.calculateBulkSavings(2, 300, 200);
      
      expect(result.individualTotal).toBe(400); // 2 * 200
      expect(result.bulkPrice).toBe(300);
      expect(result.savings).toBe(100); // 400 - 300
      expect(result.savingsPercent).toBe(25); // 100/400 * 100
    });

    test('should handle no savings scenario', () => {
      const result = storeSystem.calculateBulkSavings(2, 400, 200);
      
      expect(result.savings).toBe(0);
      expect(result.savingsPercent).toBe(0);
    });
  });

  describe('validatePurchase', () => {
    test('should validate successful purchase', () => {
      const result = storeSystem.validatePurchase(10, 2, 1000, 1000);
      
      expect(result.valid).toBe(true);
      expect(result.totalCost).toBe(20);
    });

    test('should reject purchase with insufficient cash', () => {
      const result = storeSystem.validatePurchase(100, 2, 50, 1000);
      
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Not enough cash. Need $200');
    });

    test('should reject purchase exceeding max quantity', () => {
      const result = storeSystem.validatePurchase(1500, 2, 5000, 1000);
      
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Maximum quantity is 1000');
    });

    test('should reject purchase with quantity less than 1', () => {
      const result = storeSystem.validatePurchase(0, 2, 1000, 1000);
      
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Quantity must be at least 1');
    });
  });

  describe('updateQuantityDisplays', () => {
    test('should update display elements correctly', () => {
      const beerInput = document.getElementById('beer_qty');
      const beerTotal = document.getElementById('beer_total');
      
      beerInput.value = '10';
      
      storeSystem.updateQuantityDisplays();
      
      expect(beerTotal.textContent).toBe('$20');
    });

    test('should handle missing elements gracefully', () => {
      document.body.innerHTML = ''; // Clear DOM
      
      expect(() => {
        storeSystem.updateQuantityDisplays();
      }).not.toThrow();
    });
  });
});