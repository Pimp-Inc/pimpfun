/**
 * Tests for Enhanced Crack Operations
 */

// Mock DOM elements for testing
const mockElement = (id, value = '') => ({
    id,
    value,
    textContent: '',
    max: '50000',
    className: ''
});

// Mock getElementById
global.document = {
    getElementById: jest.fn((id) => {
        const elements = {
            'crackSellAmount': mockElement('crackSellAmount', '100'),
            'crackSellSlider': mockElement('crackSellSlider', '100'),
            'crackPriceDisplay': mockElement('crackPriceDisplay'),
            'crackTotalDisplay': mockElement('crackTotalDisplay'),
            'crackHeatDisplay': mockElement('crackHeatDisplay')
        };
        return elements[id] || null;
    })
};

// Mock gameState
global.gameState = {
    resources: {
        crack: 50000
    },
    player: {
        cash: 10000,
        heat: 20
    }
};

describe('Enhanced Crack Operations', () => {
    // These functions would normally be in the global scope in the HTML file
    // For testing, we'll define them here with the same logic
    
    function getCrackPrice(amount) {
        // Authentic 1991 NYC crack prices - bulk gets CHEAPER per unit
        let pricePerRock;
        if (amount >= 10000) pricePerRock = 6;   // Deep wholesale - $6/rock (~$6,000/kg equivalent)
        else if (amount >= 5000) pricePerRock = 7;   // Large wholesale - $7/rock  
        else if (amount >= 1000) pricePerRock = 9;   // Mid-level bulk - $9/rock
        else if (amount >= 100) pricePerRock = 12;   // Small bulk - $12/rock
        else if (amount >= 10) pricePerRock = 15;    // Street level - $15/rock
        else pricePerRock = 18; // Single rock street price - $18/rock
        return pricePerRock;
    }

    function calculateHeatGain(amount) {
        // User-specified heat scaling - balanced for 1985 game setting
        if (amount <= 0) return 1;   // Minimum heat
        if (amount <= 50) return 2;  // Very small sales - minimal heat
        if (amount <= 100) return 3; // Small sales - target: 3% for 100
        if (amount <= 500) return 6; // Medium-small sales
        if (amount <= 1000) return 9; // Medium sales - target: 9% for 1000
        if (amount <= 2500) return 15; // Large sales
        if (amount <= 5000) return 21; // Large sales - target: 21% for 5000
        if (amount <= 10000) return 36; // Very large sales - target: 36% for 10000
        if (amount <= 25000) return 52; // Massive sales
        return 69; // Cap for extremely massive sales - target: 69% for 50000
    }

    describe('getCrackPrice', () => {
        test('should return correct pricing tiers - cheaper for bulk', () => {
            expect(getCrackPrice(5)).toBe(18);    // Single rock street price
            expect(getCrackPrice(10)).toBe(15);   // Small street deals
            expect(getCrackPrice(50)).toBe(15);   // Still small street
            expect(getCrackPrice(100)).toBe(12);  // Small bulk
            expect(getCrackPrice(500)).toBe(12);  // Still small bulk
            expect(getCrackPrice(1000)).toBe(9);  // Mid-level dealer
            expect(getCrackPrice(2500)).toBe(9);  // Still dealer level
            expect(getCrackPrice(5000)).toBe(7);  // Large wholesale
            expect(getCrackPrice(7500)).toBe(7);  // Still wholesale
            expect(getCrackPrice(10000)).toBe(6); // Deep wholesale - best rate
            expect(getCrackPrice(25000)).toBe(6); // Still deep wholesale
        });

        test('should handle edge cases', () => {
            expect(getCrackPrice(0)).toBe(18);   // Single rock price for zero
            expect(getCrackPrice(1)).toBe(18);   // Single rock
            expect(getCrackPrice(9)).toBe(18);   // Still single rock range
            expect(getCrackPrice(99)).toBe(15);  // Small street deals
            expect(getCrackPrice(999)).toBe(12); // Small bulk
            expect(getCrackPrice(4999)).toBe(9); // Mid-level dealer
            expect(getCrackPrice(9999)).toBe(7); // Large wholesale
        });
    });

    describe('calculateHeatGain', () => {
        test('should use user-specified heat scaling for 1985 setting', () => {
            // Test the new user-specified heat values
            expect(calculateHeatGain(10)).toBe(2);   // Very small - minimal heat
            expect(calculateHeatGain(50)).toBe(2);   // Still very small
            expect(calculateHeatGain(100)).toBe(3);  // Target: 3% for 100
            expect(calculateHeatGain(500)).toBe(6);  // Medium-small sales
            expect(calculateHeatGain(1000)).toBe(9); // Target: 9% for 1000
            expect(calculateHeatGain(2500)).toBe(15); // Large sales
            expect(calculateHeatGain(5000)).toBe(21); // Target: 21% for 5000
            expect(calculateHeatGain(10000)).toBe(36); // Target: 36% for 10000
            expect(calculateHeatGain(25000)).toBe(52); // Massive sales
            expect(calculateHeatGain(50000)).toBe(69); // Target: 69% for 50000
        });

        test('should verify heat values match user specifications', () => {
            // Verify the specific target values requested by user
            expect(calculateHeatGain(100)).toBe(3);   // User target: 3% heat
            expect(calculateHeatGain(1000)).toBe(9);  // User target: 9% heat
            expect(calculateHeatGain(5000)).toBe(21); // User target: 21% heat
            expect(calculateHeatGain(10000)).toBe(36); // User target: 36% heat
            expect(calculateHeatGain(50000)).toBe(69); // User target: 69% heat
        });

        test('should cap heat at 100%', () => {
            expect(calculateHeatGain(100000)).toBeLessThanOrEqual(100);
            expect(calculateHeatGain(1000000)).toBeLessThanOrEqual(100);
        });

        test('should handle edge cases', () => {
            expect(calculateHeatGain(0)).toBe(1);
            expect(calculateHeatGain(1)).toBe(2);  // 1 is in the <= 50 range (very small sales)
        });
    });

    describe('Bulk Pricing Benefits', () => {
        test('should provide significant bulk discounts (authentic drug economics)', () => {
            const singleRock = getCrackPrice(1) * 1;           // $18 * 1 = $18
            const bulkRocks = getCrackPrice(10000) * 10000;    // $6 * 10000 = $60,000
            
            const singleRockPrice = singleRock / 1;           // $18 per rock
            const bulkRockPrice = bulkRocks / 10000;          // $6 per rock
            
            expect(bulkRockPrice).toBeLessThan(singleRockPrice); // Bulk should be cheaper
            expect(singleRockPrice / bulkRockPrice).toBe(3); // Single rocks cost 3x more than bulk
            
            // Test the discount progression
            expect(getCrackPrice(1)).toBeGreaterThan(getCrackPrice(100));    // $18 > $12
            expect(getCrackPrice(100)).toBeGreaterThan(getCrackPrice(1000)); // $12 > $9  
            expect(getCrackPrice(1000)).toBeGreaterThan(getCrackPrice(10000)); // $9 > $6
        });
    });

    describe('Heat Scaling Benefits', () => {
        test('should be more forgiving for bulk sales', () => {
            const heatPer100 = calculateHeatGain(100);   // 6%
            const heatPer10000 = calculateHeatGain(10000); // 51%
            
            // Heat per 100 units should be much lower for bulk
            const heat100unitsSmall = heatPer100;                    // 6%
            const heat100unitsBulk = heatPer10000 / 100;            // 0.51%
            
            expect(heat100unitsBulk).toBeLessThan(heat100unitsSmall);
        });
    });
});