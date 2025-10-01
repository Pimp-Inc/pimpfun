/**
 * Store System Module - Core store functionality
 * Handles quantity calculations, purchases, and store interfaces
 */

class StoreSystem {
  constructor() {
    this.stores = {};
  }

  /**
   * Initialize store data
   * @param {Object} storeData - Store configuration data
   */
  initializeStores(storeData) {
    this.stores = storeData;
  }

  /**
   * Adjust quantity in input field
   * @param {string} inputId - ID of the quantity input
   * @param {number} change - Amount to change (+1 or -1)
   */
  adjustQuantity(inputId, change) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const currentValue = parseInt(input.value) || 1;
    const newValue = Math.max(1, currentValue + change);
    const maxValue = parseInt(input.max) || 1000;
    
    input.value = Math.min(newValue, maxValue);
    this.updateQuantityDisplays();
  }

  /**
   * Update all quantity display elements
   */
  updateQuantityDisplays() {
    const inputs = [
      { id: 'beer_qty', unitPrice: 2, totalId: 'beer_total' },
      { id: 'condom_qty', unitPrice: 0.10, totalId: 'condom_total' },
      { id: 'keg_qty', unitPrice: 300, totalId: 'keg_total' },
      { id: 'crate_qty', unitPrice: 700, totalId: 'crate_total' }
    ];

    inputs.forEach(item => {
      const input = document.getElementById(item.id);
      const totalElement = document.getElementById(item.totalId);
      
      if (input && totalElement) {
        const quantity = parseInt(input.value) || 1;
        const total = quantity * item.unitPrice;
        totalElement.textContent = `$${total.toLocaleString()}`;
      }
    });
  }

  /**
   * Process purchase with quantity
   * @param {string} item - Item type being purchased
   * @param {number} unitPrice - Price per unit
   * @param {string} qtyInputId - ID of quantity input field
   * @param {Object} gameState - Current game state
   * @param {Function} updateUI - Function to update UI
   * @param {Function} showNotification - Function to show notifications
   * @returns {boolean} Success status
   */
  buyWithQuantity(item, unitPrice, qtyInputId, gameState, updateUI, showNotification) {
    const quantityInput = document.getElementById(qtyInputId);
    if (!quantityInput) {
      showNotification('❌ Quantity input not found!', 'error');
      return false;
    }

    const quantity = parseInt(quantityInput.value) || 1;
    const totalCost = quantity * unitPrice;

    if (gameState.player.cash < totalCost) {
      showNotification(`❌ Not enough cash! Need $${totalCost.toLocaleString()}`, 'error');
      return false;
    }

    // Process the purchase
    gameState.player.cash -= totalCost;
    
    // Add items to resources
    if (gameState.resources[item] !== undefined) {
      gameState.resources[item] += quantity;
    } else {
      gameState.resources[item] = quantity;
    }

    showNotification(`✅ Bought ${quantity} ${item} for $${totalCost.toLocaleString()}!`, 'success');
    updateUI();
    return true;
  }

  /**
   * Calculate bulk deal savings
   * @param {number} individualPrice - Price per individual item
   * @param {number} bulkPrice - Bulk price
   * @param {number} bulkQuantity - Quantity in bulk deal
   * @returns {Object} Savings information
   */
  calculateBulkSavings(individualPrice, bulkPrice, bulkQuantity) {
    const individualTotal = individualPrice * bulkQuantity;
    const savings = individualTotal - bulkPrice;
    const savingsPercent = Math.round((savings / individualTotal) * 100);
    
    return {
      savings,
      savingsPercent,
      individualTotal,
      bulkPrice
    };
  }

  /**
   * Validate purchase constraints
   * @param {number} quantity - Quantity to purchase
   * @param {number} unitPrice - Price per unit
   * @param {number} availableCash - Available cash
   * @param {number} maxQuantity - Maximum allowed quantity
   * @returns {Object} Validation result
   */
  validatePurchase(quantity, unitPrice, availableCash, maxQuantity = 1000) {
    if (quantity < 1) {
      return { valid: false, error: 'Quantity must be at least 1' };
    }
    
    if (quantity > maxQuantity) {
      return { valid: false, error: `Maximum quantity is ${maxQuantity}` };
    }
    
    const totalCost = quantity * unitPrice;
    if (totalCost > availableCash) {
      return { valid: false, error: `Not enough cash. Need $${totalCost.toLocaleString()}` };
    }
    
    return { valid: true, totalCost };
  }
}

// Export for use in tests and main application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StoreSystem;
}
if (typeof window !== 'undefined') {
  window.StoreSystem = StoreSystem;
}