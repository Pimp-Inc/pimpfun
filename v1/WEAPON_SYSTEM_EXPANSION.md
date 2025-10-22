# Weapon System Expansion - 9-Tier System with Ammo Costs

## Priority: HIGH - Core Game Mechanic Expansion

### Proposed 9-Tier Weapon System

| Tier | Weapon | Cost | Ammo Cost (9% rule) | Type | Notes |
|------|--------|------|---------------------|------|-------|
| 0 | **Bat** | $100 | — | Melee | Starter weapon, no ammo |
| 1 | **Glock** | $250 | $23 | Pistol | Entry firearm, low upkeep |
| 2 | **.44 Magnum** | $750 | $68 | Revolver | High power, expensive per shot |
| 3 | **Tec-9** | $1,250 | $113 | SMG | Burst-fire street weapon |
| 4 | **12-Gauge Shotgun** | $1,800 | $162 | Shotgun | Short-range powerhouse |
| 5 | **Tommy Gun** | $4,500 | $405 | SMG | Iconic mafia weapon |
| 6 | **AK-47** | $5,500 | $495 | Assault Rifle | Criminal workhorse |
| 7 | **M249** | $7,500 | $675 | Machine Gun | Heavy suppression |
| 8 | **Sniper Rifle** | $9,000 | $810 | Sniper | Long-range precision |

### Ammo System Mechanics

**9% Ammo Cost Rule:**
- Ammo costs ≈ 9% of weapon purchase price
- Prevents infinite firing while keeping use feasible
- Based on CS:GO and tiered RPG economy design

**Ammo Consumption:**
- Each combat action consumes 1 ammo clip per weapon
- Weapons without ammo cannot be used
- Must buy ammo from stores
- Separate ammo inventory (e.g., 325 weapons, 150 ammo clips)

### Implementation Phases

1. **Data Model** - Add weapon tiers, ammo inventory system
2. **Store Integration** - Update gun stores with all 9 tiers + ammo purchasing
3. **Combat Integration** - Consume ammo per action, check availability
4. **UI Updates** - Show weapon/ammo breakdown, warnings
5. **Economy Balancing** - Adjust rewards, add ammo drops

### Estimated Time: 11-16 hours
