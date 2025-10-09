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
        // Reasonable tiered heat scaling - not too punitive for bulk sales
        if (amount <= 0) return 1;   // Minimum heat
        if (amount <= 50) return 2;  // Very small sales - minimal heat
        if (amount <= 200) return 4; // Small sales
        if (amount <= 1000) return 8; // Medium sales  
        if (amount <= 5000) return 15; // Large sales
        if (amount <= 15000) return 25; // Very large sales
        return 35; // Cap for massive sales - still manageable
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
        test('should use reasonable tiered heat scaling', () => {
            // Test the new reasonable heat tiers
            expect(calculateHeatGain(10)).toBe(2);   // Very small - minimal heat
            expect(calculateHeatGain(50)).toBe(2);   // Still very small
            expect(calculateHeatGain(100)).toBe(4);  // Small sales
            expect(calculateHeatGain(500)).toBe(8);  // Medium sales
            expect(calculateHeatGain(1000)).toBe(8); // Still medium
            expect(calculateHeatGain(2500)).toBe(15); // Large sales
            expect(calculateHeatGain(5000)).toBe(15); // Still large
            expect(calculateHeatGain(10000)).toBe(25); // Very large
            expect(calculateHeatGain(25000)).toBe(35); // Massive - capped
        });

        test('should verify heat values are reasonable for gameplay', () => {
            // Verify the new reasonable heat system
            expect(calculateHeatGain(10)).toBe(2);   // +2% heat - very manageable
            expect(calculateHeatGain(100)).toBe(4);  // +4% heat - reasonable
            expect(calculateHeatGain(1000)).toBe(8); // +8% heat - fair for large sales
            expect(calculateHeatGain(5000)).toBe(15); // +15% heat - still reasonable
            expect(calculateHeatGain(50000)).toBe(35); // +35% heat - capped at manageable level
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