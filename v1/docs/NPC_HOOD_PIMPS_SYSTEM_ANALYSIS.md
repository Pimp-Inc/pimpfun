# NPC Hood Pimps System - Complete Analysis

## Executive Summary

This document provides a comprehensive breakdown of the current NPC Hood Pimps combat system, including generation, scaling, attack mechanics, and reward calculations.

**Date Generated:** 2025-10-26
**Player Observation:** Level 16 player facing NPCs with seemingly mismatched power levels

---

## Table of Contents

1. [NPC Generation & Tiers](#1-npc-generation--tiers)
2. [Power Calculation System](#2-power-calculation-system)
3. [Level Scaling Issues](#3-level-scaling-issues)
4. [Attack & Combat Mechanics](#4-attack--combat-mechanics)
5. [Loot & Reward System](#5-loot--reward-system)
6. [Turn Cost System](#6-turn-cost-system)
7. [Victory Conditions & Domination](#7-victory-conditions--domination)
8. [Identified Issues](#8-identified-issues)

---

## 1. NPC Generation & Tiers

### 1.1 Three-Tier System

The game generates NPCs across three difficulty tiers:

| Tier | Count | Level Req | Spawn Rate | Max Active |
|------|-------|-----------|------------|------------|
| **Rookies** | 21 NPCs | Level 0+ | 5 minutes | 10 at once |
| **Mid-Tier** | 15 NPCs | Level 20+ | 15 minutes | 5 at once |
| **Bosses** | 6 NPCs | Level 50+ | 60 minutes | 1 at once |

### 1.2 Rookie Tier Stats (Street Level)

**Example NPCs:**
- Slick Ricky (Corner Hustler)
- Baby Face Marcus (New Jack)
- Skinny Pete (Wannabe)

**Stat Ranges:**
```javascript
{
    cash: $1,200 - $8,000
    hoes: 5 - 15
    thugs: 2 - 10
    weapons: { pistols: 2-10, glocks: 0-4, shotguns: 0-2 }
    vehicles: { bicycles: 0-4, lowriders: 0-2 }
    respect: 2 - 15
    netWorth: $20,000 - $45,000
}
```

### 1.3 Mid-Tier Stats (District Level)

**Example NPCs:**
- Diamond Dallas (District King)
- Silk Santana (Smooth Operator)
- Big Bear (The Enforcer)

**Stat Ranges:**
```javascript
{
    cash: $20,000 - $60,000
    hoes: 40 - 80
    thugs: 20 - 45
    weapons: { glocks: 10-20, uzis: 8-20, ak47s: 0-12 }
    vehicles: { lowriders: 2-6, escalades: 1-4 }
    respect: 50 - 85
    netWorth: $180,000 - $300,000
}
```

### 1.4 Boss Tier Stats (City Kingpins)

**Example NPCs:**
- Don Valentino (The Godfather)
- Emperor X (Supreme Overlord)
- Scarface Supreme (Cartel King)

**Stat Ranges:**
```javascript
{
    cash: $500,000 - $1,500,000
    hoes: 500 - 1,000
    thugs: 300 - 600
    weapons: { uzis: 100-250, ak47s: 150-300 }
    vehicles: { lowriders: 15-35, escalades: 10-40 }
    respect: 500 - 1,000
    netWorth: $5,000,000 - $12,000,000
    specialAbility: "Mob reinforcements", "Territory lockdown", etc.
}
```

---

## 2. Power Calculation System

### 2.1 Player Power Formula

**Location:** `index.html:2886-2913`

```javascript
function calculatePower(resources) {
    const weaponPower = {
        pistols: 1,
        shotguns: 2,
        tek9s: 9,
        ak47s: 30
    };

    let power = resources.thugs * 10;

    // Add weapon power
    Object.entries(weapons).forEach(([type, count]) => {
        power += count * weaponPower[type];
    });

    return power;
}
```

**Breakdown:**
- **Thugs:** Each thug = 10 power
- **Pistols:** Each pistol = 1 power
- **Shotguns:** Each shotgun = 2 power
- **Tek-9s:** Each Tek-9 = 9 power
- **AK-47s:** Each AK-47 = 30 power

**Example Calculation (Level 16 player from screenshot):**
```
Player Stats: 5 thugs, 5 guns (assume mix)
Power = (5 thugs × 10) + (5 guns × avg 2) = 50 + 10 = 60 power
```

### 2.2 NPC Power Formula

**Location:** `index.html:2915-2924`

```javascript
function calculateNPCPower(stats) {
    let power = stats.thugs * 10;

    if (stats.weapons) {
        Object.entries(stats.weapons).forEach(([type, count]) => {
            const weaponPower = {
                pistols: 1,
                shotguns: 2,
                tek9s: 9,
                ak47s: 30
            };
            power += count * weaponPower[type];
        });
    }

    return power;
}
```

**Example Calculation (Tiger Woods from screenshot):**
```
NPC Stats: 5 thugs, 5 guns (unknown types)
Assuming pistols: Power = (5 × 10) + (5 × 1) = 55 power

NPC Stats: 36 hoes, 5 thugs (as shown)
ISSUE: Hoes are NOT counted in power calculation!
Power = (5 × 10) + (5 × 1) = 55 power only
```

### 2.3 Difficulty Multiplier (Escalation)

**Location:** `index.html:2729`

```javascript
const difficultyMultiplier = 1 + (pimp.attackCount - 1) * 0.2;
```

**Scaling per attack:**
- **1st Attack:** ×1.0 (100% base power)
- **2nd Attack:** ×1.2 (120% power)
- **3rd Attack:** ×1.4 (140% power)
- **4th Attack:** ×1.6 (160% power)
- **5th Attack:** ×1.8 (180% power)

---

## 3. Level Scaling Issues

### 🚨 CRITICAL ISSUE #1: NPCs Do Not Scale with Player Level

**Current Behavior:**
- NPCs are spawned with **static stats** from `NPC_Hood_pimps.JSON`
- Player level is **never considered** in NPC generation
- A Level 1 player faces the same Rookie NPCs as a Level 16 player

**Example Problem:**
```
Player Level 16:
- Likely has: 20-50 thugs, 30-100 weapons
- Power: 200+ (thugs × 10) + (weapons × avg 5) = 350+ power

Rookie NPC (Tiger Woods):
- Has: 5 thugs, 5 guns
- Power: 50 + 5 = 55 power
- Success Rate: 350/(350+55) = 86% guaranteed win

Expected Result: Way too easy for Level 16 player
```

### 🚨 CRITICAL ISSUE #2: Hoes Not Counted in Power

**Current Formula Ignores:**
- Hoe count (player has 36 hoes)
- Vehicle count (player has 3 rides)
- Cash reserves
- Crack inventory
- Player level

**Only Counted:**
- Thugs (×10 each)
- Weapons (pistols ×1, shotguns ×2, tek9s ×9, AK-47s ×30)

### 🚨 CRITICAL ISSUE #3: No Territory Bonuses Applied

**Expected Behavior:**
The game has territory bonuses defined:
- Crooklyn Heights: +25% Stoop Network (+10% attack success)
- Uptown Plaza: +20% Gamble's Edge
- Midtown Market: +15% Neon Veil
- Harbor Docks: +30% Fog Shroud
- Financial District: +10% Launder Flow

**Current Behavior:**
These bonuses are **never applied** to combat calculations.

---

## 4. Attack & Combat Mechanics

### 4.1 Attack Flow

**Location:** `index.html:2711-2884`

```javascript
function attackHoodPimp(pimpId) {
    // 1. Spend 2 turns
    if (!useTurns(2)) return fail;

    // 2. Check target exists
    const pimp = ACTIVE_HOOD_PIMPS.get(pimpId);
    if (!pimp || pimp.defeated) return fail;

    // 3. Increment attack count
    pimp.attackCount = (pimp.attackCount || 0) + 1;

    // 4. Calculate difficulty escalation
    const difficultyMultiplier = 1 + (pimp.attackCount - 1) * 0.2;

    // 5. Calculate powers
    const playerPower = calculatePower(gameState.resources);
    const basePimpPower = calculateNPCPower(pimp.stats);
    const scaledPimpPower = Math.floor(basePimpPower * difficultyMultiplier);

    // 6. Determine success
    const successChance = playerPower / (playerPower + scaledPimpPower);
    const success = Math.random() < successChance;

    // 7. Process result
    if (success) {
        // Victory: calculate loot, apply rewards
        const loot = calculateEnhancedLoot(pimp, isRepeatedAttack, isDomination);
        applyLootToPlayer(loot);

        // Check for domination
        if (attackCount >= maxAttacks) {
            pimp.defeated = true;
            pimp.respawnAt = Date.now() + (24-72 hours);
        }
    } else {
        // Defeat: NO LOSSES for player
        // (Single-player mode = no asset penalties)
        handleNPCBehavior(pimp);
    }
}
```

### 4.2 Success Probability Formula

**Location:** `index.html:2735`

```javascript
const successChance = playerPower / (playerPower + scaledPimpPower);
```

**Example Calculations:**

| Player Power | NPC Power | Success Chance | Interpretation |
|--------------|-----------|----------------|----------------|
| 100 | 100 | 50% | Even match |
| 200 | 100 | 67% | Player favored |
| 100 | 200 | 33% | NPC favored |
| 350 | 55 | 86% | Player dominates (Level 16 vs Rookie) |
| 60 | 300 | 17% | NPC dominates (Early game vs Mid-Tier) |

### 4.3 Defeat Consequences

**For Player (on loss):**
```javascript
// NO ASSET LOSSES in single-player mode!
// Original PimpWar only penalized losses to OTHER PLAYERS
// Since this is vs NPCs, player never loses assets
```

**For NPC (on loss):**
- Loses cash (3-25%)
- Loses crack (50-99%)
- Loses hoes (0-15%, low chance)
- Loses thugs (0-12%, low chance)
- Loses weapons (5-20%, moderate chance)
- Loses vehicles (3% chance, higher on domination)

---

## 5. Loot & Reward System

### 5.1 Loot Tables by Tier

**Location:** `NPC_Hood_pimps.JSON:805-834`

#### Rookie Loot Table
```javascript
{
    cashMultiplier: 0.8,      // Get 80% of their cash
    weaponChance: 0.2,        // 20% chance to loot weapons
    crackSteal: 0.5,          // Steal 50% of their crack
    respectGain: 5,           // Base respect gain
    expGain: 100              // Base experience
}
```

#### Mid-Tier Loot Table
```javascript
{
    cashMultiplier: 0.6,      // Get 60% of their cash
    weaponChance: 0.3,        // 30% chance to loot weapons
    crackSteal: 0.4,          // Steal 40% of their crack
    vehicleChance: 0.1,       // 10% chance to jack a vehicle
    respectGain: 25,          // Base respect gain
    expGain: 500,             // Base experience
    nftFragmentChance: 0.05   // 5% NFT fragment drop
}
```

#### Boss Loot Table
```javascript
{
    cashMultiplier: 0.4,      // Get 40% of their cash
    weaponChance: 0.5,        // 50% chance to loot weapons
    crackSteal: 0.3,          // Steal 30% of their crack
    vehicleChance: 0.3,       // 30% chance to jack vehicles
    respectGain: 100,         // Base respect gain
    expGain: 2000,            // Base experience
    nftFragmentChance: 0.25,  // 25% NFT fragment drop
    guaranteedReward: true    // Always drops something special
}
```

### 5.2 Detailed Loot Calculations

**Location:** `index.html:2927-3073`

#### Cash Theft
```javascript
// Base steal rate: 3% to 18%
const cashStealRate = 0.03 + Math.random() * 0.15;

// Apply bonuses
const bonusMultiplier = isDomination ? 1.8 : isRepeatedAttack ? 1.3 : 1.0;

// Final rate (capped at 25%)
const finalCashRate = Math.min(0.25, cashStealRate * bonusMultiplier);

// Calculate stolen amount
const cashStolen = Math.floor(pimp.stats.cash * finalCashRate);
```

**Example:**
```
NPC has $10,000
Base steal: 10% (randomly rolled between 3-18%)
First attack: $10,000 × 10% = $1,000
Repeated attack: $10,000 × 10% × 1.3 = $1,300
Domination: $10,000 × 10% × 1.8 = $1,800 (capped at $2,500)
```

#### Crack Theft
```javascript
// Steal 50% to 99% of their crack
const crackStealRate = 0.50 + Math.random() * 0.49;

// Apply bonuses
const crackStolen = Math.floor(pimp.stats.crack * crackStealRate * bonusMultiplier);
```

**Example:**
```
NPC has 100 crack
Base steal: 75% (randomly rolled between 50-99%)
First attack: 100 × 75% = 75 crack
Domination: 100 × 75% × 1.8 = 135 crack (would take all 100)
```

#### Hoe Recruitment
```javascript
// 0% to 9% CHANCE to even attempt stealing hoes
const hoeStealChance = Math.random() * 0.09;

// Enhanced chance with bonuses
const enhancedChance = hoeStealChance * (isDomination ? 2.0 : isRepeatedAttack ? 1.5 : 1.0);

if (Math.random() < enhancedChance) {
    // If successful, steal 2% to 9% of their hoes
    const hoeStealRate = 0.02 + Math.random() * 0.07;
    const hoesStolen = Math.max(1, Math.floor(pimp.stats.hoes * hoeStealRate * bonusMultiplier));

    // Capped at 15% max
    const finalHoesStolen = Math.min(hoesStolen, Math.floor(pimp.stats.hoes * 0.15));
}
```

**Example:**
```
NPC has 50 hoes
Base chance: 5% (randomly rolled 0-9%)
Chance succeeds (5% of the time)
Then steal: 5% of their hoes = 2-3 hoes
Max cap: 15% = 7 hoes maximum
```

#### Thug Recruitment
```javascript
// Same mechanics as hoes
const thugStealChance = Math.random() * 0.09; // 0-9% chance

if (succeeds) {
    const thugStealRate = 0.02 + Math.random() * 0.07; // 2-9%
    const finalThugsStolen = Math.min(thugsStolen, Math.floor(pimp.stats.thugs * 0.12)); // Max 12%
}
```

#### Weapon Theft
```javascript
// Use loot table weapon chance (20-50% depending on tier)
const weaponChance = lootTable.weaponChance * attackBonus;

if (Math.random() < weaponChance) {
    // Steal 5% to 15% of total weapons
    const weaponStealRate = 0.05 + Math.random() * 0.10;
    const finalWeaponsStolen = Math.min(weaponsStolen, Math.floor(totalWeapons * 0.2)); // Max 20%
}
```

**Example:**
```
Rookie NPC has 10 weapons total
Weapon chance: 20%
If succeeds (20% of the time):
  Steal: 10% = 1 weapon
  Max cap: 20% = 2 weapons
```

#### Vehicle Jacking
```javascript
// Base 3% chance
const vehicleJackChance = 0.03 * (isDomination ? 3.0 : isRepeatedAttack ? 2.0 : 1.0);

if (Math.random() < vehicleJackChance) {
    // Jack ONE random vehicle from their fleet
    const [vehicleType, count] = randomVehicle;
    loot.vehicleType = vehicleType; // e.g., "lowrider"
}
```

**Example:**
```
First attack: 3% chance
Repeated attack: 6% chance
Domination: 9% chance
```

### 5.3 Loot Multipliers

| Condition | Cash | Crack | Hoes/Thugs | Weapons | Vehicles |
|-----------|------|-------|------------|---------|----------|
| **First Attack** | ×1.0 | ×1.0 | ×1.0 | ×1.0 | 3% chance |
| **Repeated Attack** | ×1.3 | ×1.3 | ×1.5 | ×1.3 | 6% chance |
| **Domination** | ×1.8 | ×1.8 | ×2.0 | ×2.0 | 9% chance |

---

## 6. Turn Cost System

### 6.1 Attack Cost

**Location:** `index.html:2712-2715`

```javascript
if (!useTurns(2)) {
    addConsoleMessage('Not enough turns! (Need 2)', 'red');
    return;
}
```

**Each attack costs:** 2 turns

### 6.2 Turn Generation

Turns are generated based on:
- Player level
- Time elapsed
- Territory bonuses
- Special items/upgrades

---

## 7. Victory Conditions & Domination

### 7.1 Attack Progression

**Max Attacks Before Hiding:**
```javascript
pimp.maxAttacks = 5; // Typically 3-6 depending on tier
```

**Attack States:**
1. **First Attack:** "Attack (2 turns)" button
2. **Attacks 2-4:** "Attack Again" with progress counter (e.g., "2/5 attacks")
3. **Final Attack:** "DOMINATE" button when attackCount >= maxAttacks

### 7.2 Domination Effects

**Location:** `index.html:2794-2803`

```javascript
if (isDomination) {
    pimp.defeated = true;
    pimp.respawnAt = Date.now() + pimp.respawnTime * 2; // Longer respawn

    addConsoleMessage(`🏆 DOMINATED ${pimp.name}! Complete victory!`, 'gold');
    showNotification(`🏆 DOMINATED ${pimp.name}! Major loot gained!`, 'success');
}
```

**Domination Bonuses:**
- ×2.0 cash multiplier
- ×2.0 loot multiplier
- 9% vehicle jack chance (vs 3% normal)
- Double respawn time for NPC

### 7.3 NPC Hiding & Respawn

**Location:** `index.html:2856-2879`

```javascript
if (pimp.attackCount >= pimp.maxAttacks && !pimp.defeated) {
    pimp.defeated = true;
    pimp.inHiding = true;

    // Hiding time: 24-72 hours based on tier + assets lost
    let baseHidingHours = pimp.difficulty === 'street' ? 24 :
                         pimp.difficulty === 'district' ? 48 : 72;

    const additionalHours = Math.min(24, Math.floor(assetsLost / 5000)); // +1hr per $5K lost
    const hidingHours = baseHidingHours + additionalHours;

    pimp.respawnAt = Date.now() + (hidingHours * 60 * 60 * 1000);
    pimp.rebuilding = true; // They'll come back stronger
}
```

**Hiding Duration:**
- **Rookies:** 24 hours base + (assets lost / $5K) = 24-48 hours
- **Mid-Tier:** 48 hours base + (assets lost / $5K) = 48-72 hours
- **Bosses:** 72 hours base + (assets lost / $5K) = 72-96 hours

---

## 8. Identified Issues

### 🚨 Issue #1: No Level-Based NPC Scaling

**Problem:**
NPCs have static stats regardless of player level. A Level 16 player faces the same Rookie NPCs as a Level 1 player.

**Current Behavior:**
```javascript
// NPCs are spawned directly from JSON with no scaling
const npc = NPC_PIMPS.rookies[randomIndex];
ACTIVE_HOOD_PIMPS.set(npc.id, npc);
```

**Expected Behavior:**
```javascript
// NPCs should scale based on player level
const npc = generateScaledNPC(playerLevel, tier);
```

**Impact:**
- Early game: NPCs too hard
- Mid game (Level 10-20): NPCs too easy
- Late game (Level 30+): Rookies completely trivial

### 🚨 Issue #2: Power Calculation Ignores Key Stats

**Problem:**
The power formula only considers thugs and weapons. It ignores:
- Hoes (income generators)
- Vehicles (status/power symbols)
- Cash reserves
- Player level
- Respect/reputation

**Current Formula:**
```javascript
power = (thugs × 10) + (weapons × [1-30])
```

**Missing Factors:**
- Hoes should contribute (e.g., ×1-2 each for "backup")
- Vehicles should contribute (e.g., ×5-20 for drive-bys)
- Cash should enable mercenaries (e.g., +1 power per $1K)
- Level should provide baseline power boost

### 🚨 Issue #3: Territory Bonuses Not Applied

**Problem:**
The game defines territory bonuses like "Crooklyn Heights: +10% attack success" but never applies them in combat.

**Current Bonuses (Defined but Unused):**
```javascript
"Crooklyn Heights": { attackBonus: 0.10 },  // +10% attack success
"Uptown Plaza": { gamblingBonus: 0.20 },    // +20% risk/reward
"Midtown Market": { stealthBonus: 0.15 },   // +15% stealth
"Harbor Docks": { escapeBonus: 0.30 },      // +30% escape
```

**Expected Usage:**
```javascript
// Apply territory bonus to success chance
if (player.territory === "Crooklyn Heights") {
    successChance += 0.10; // +10% from Stoop Network
}
```

### 🚨 Issue #4: Loot Feels Random & Unpredictable

**Problem:**
Multiple layers of RNG make loot highly variable:
1. Random steal rate (3-18% for cash)
2. Random chance to even attempt (0-9% for hoes/thugs)
3. Random multiplier bonuses
4. Random weapon/vehicle selection

**Example Variance:**
```
Same attack on same NPC can yield:
  Low roll: $150, 10 crack, 0 hoes, 0 weapons
  High roll: $2,500, 99 crack, 5 hoes, 8 weapons

That's a 16x variance in cash alone!
```

**Player Experience:**
- Unpredictable rewards
- Hard to plan strategy
- Feels "unfair" when multiple low rolls occur

### 🚨 Issue #5: Attack Difficulty Escalation May Be Too Steep

**Problem:**
Each repeated attack increases difficulty by +20%:

| Attack # | Difficulty | Notes |
|----------|------------|-------|
| 1st | ×1.0 | Fair fight |
| 2nd | ×1.2 | 20% harder |
| 3rd | ×1.4 | 40% harder |
| 4th | ×1.6 | 60% harder |
| 5th | ×1.8 | 80% harder |

**Impact:**
```
Player Power: 100
NPC Power: 50

1st Attack: 100 / (100+50) = 67% success
5th Attack: 100 / (100+90) = 53% success

The NPC gets 80% stronger but player stays the same!
```

### 🚨 Issue #6: No Comeback Mechanic for Defeats

**Problem:**
If player loses an attack:
- They wasted 2 turns
- NPC difficulty is still escalated
- No consolation reward
- No "learning bonus" for next attempt

**Current Behavior:**
```javascript
else {
    // Defeat - NO ASSET LOSSES but also NO BENEFITS
    addConsoleMessage(`Defeated! Try again (${pimp.attackCount}/${pimp.maxAttacks})`);
}
```

**Missing Opportunities:**
- Partial loot on defeat (e.g., steal 10% even on loss)
- "Intel gained" bonus (next attack +5% success)
- Respect/exp for trying (reward effort)

### 🚨 Issue #7: Domination System Incentivizes Grinding

**Problem:**
Players are incentivized to attack the same NPC 5 times for ×2.0 loot multiplier, rather than diversifying targets.

**Current Strategy:**
```
Option A: Attack 5 different NPCs once
  = 5 × base loot

Option B: Attack 1 NPC 5 times (domination)
  = 1×1.0 + 1×1.3 + 1×1.3 + 1×1.3 + 1×2.0 = 6.9× base loot

Domination is 38% more profitable!
```

**Impact:**
- Repetitive gameplay
- Ignores variety
- "Optimal" strategy is boring

---

## Summary Statistics

### NPC Power Ranges (Current System)

| Tier | Avg Thugs | Avg Weapons | Avg Power | Ideal Player Level |
|------|-----------|-------------|-----------|-------------------|
| **Rookies** | 5 | 5 | 55-70 | 1-5 |
| **Mid-Tier** | 30 | 30 | 350-450 | 20-35 |
| **Bosses** | 450 | 450 | 5,500-7,000 | 50+ |

### Player Power by Level (Estimated)

| Level | Typical Thugs | Typical Weapons | Estimated Power | Can Beat |
|-------|---------------|-----------------|-----------------|----------|
| 1 | 0 | 2 | 2 | None (too weak) |
| 5 | 3 | 10 | 40 | Rookies (50/50) |
| 10 | 10 | 30 | 160 | Rookies (easy) |
| 16 | 20 | 60 | 260 | Rookies (trivial), Mid-Tier (hard) |
| 25 | 50 | 150 | 650 | Rookies (trivial), Mid-Tier (easy) |
| 40 | 120 | 350 | 1,550 | All except Bosses |
| 60 | 300 | 800 | 4,000 | All tiers |

### Loot Expectations (Per Attack)

| Tier | Cash | Crack | Hoes | Thugs | Weapons | Exp |
|------|------|-------|------|-------|---------|-----|
| **Rookie** | $200-800 | 25-50 | 0-1 | 0 | 0-2 | 100 |
| **Mid-Tier** | $5K-15K | 150-300 | 0-5 | 0-3 | 3-10 | 500 |
| **Boss** | $100K-300K | 3K-8K | 20-100 | 10-50 | 50-150 | 2000 |

---

## Conclusion

The current NPC Hood Pimps system has a solid foundation with three-tier difficulty scaling, escalating combat challenges, and a comprehensive loot system. However, it suffers from critical scaling issues:

1. **No player level integration** - NPCs don't scale with player progression
2. **Incomplete power calculations** - Ignores hoes, vehicles, cash
3. **Unused territory bonuses** - Defined but never applied
4. **High loot variance** - RNG makes rewards unpredictable
5. **Steep difficulty escalation** - Repeated attacks may be too punishing
6. **No defeat rewards** - Losses feel completely wasteful
7. **Grinding incentives** - Domination system rewards repetition over variety

**Next Steps:**
Run this analysis through your game design engine to identify:
- Optimal power scaling formulas
- Balanced loot ranges
- Territory bonus integration
- Level-based NPC generation
- Improved attack progression mechanics
