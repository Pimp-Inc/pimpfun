// Thug System Constants
// 44 thug types across 5 tiers with stats, abilities, counters, and district bonuses
// DISTRICT BONUSES BALANCED TO MATCH TERRITORY DISTRIBUTION:
// Crooklyn Heights: 30 territories (30%) → 29 bonuses
// Financial District: 28 territories (28%) → 26 bonuses
// Midtown Market: 20 territories (20%) → 18 bonuses
// Uptown Plaza: 15 territories (15%) → 14 bonuses
// Harbor Docks: 6 territories (6%) → 5 bonuses
window.ThugConstants = {
  "schemaVersion": "1.4",
  "notes": "Offense/Defense/Morale/Loyalty scale 1–100. Costs in game-cash. Turn costs are per action. District bonus keys use lowercase handles: uptown, midtown, crooklyn, docks, financial. BONUSES NOW BALANCED TO TERRITORY DISTRIBUTION! UPKEEP REBALANCED WITH 1985 PRICING THEME (v1.4)",
  "thugs": {
    "common": [
      {
        "name": "Street Thug",
        "tier": "common",
        "faction": "Gang",
        "stats": { "offense": 42, "defense": 34, "cost": 1000, "upkeep": 69, "turnCost": 1, "morale": 60, "loyalty": 50 },
        "specialAbility": "Intimidation: +5% protection money in local rackets.",
        "counters": ["Runner"],
        "counteredBy": ["Enforcer"],
        "districtBonus": { "crooklyn": 1.12, "uptown": 1.06 }
      },
      {
        "name": "Runner",
        "tier": "common",
        "faction": "Gang",
        "stats": { "offense": 30, "defense": 26, "cost": 800, "upkeep": 69, "turnCost": 1, "morale": 55, "loyalty": 45 },
        "specialAbility": "Fleet Feet: +15% delivery speed; −5% transport heat.",
        "counters": ["Lookout"],
        "counteredBy": ["Wheelman", "Street Thug"],
        "districtBonus": { "financial": 1.10, "midtown": 1.06 }
      },
      {
        "name": "Lookout",
        "tier": "common",
        "faction": "Gang",
        "stats": { "offense": 20, "defense": 28, "cost": 700, "upkeep": 69, "turnCost": 1, "morale": 50, "loyalty": 50 },
        "specialAbility": "Heads Up: −10% ambush chance on owned tiles.",
        "counters": ["Pickpocket"],
        "counteredBy": ["Runner", "Spy"],
        "districtBonus": { "crooklyn": 1.08, "uptown": 1.05 }
      },
      {
        "name": "Pickpocket",
        "tier": "common",
        "faction": "Independent",
        "stats": { "offense": 24, "defense": 22, "cost": 650, "upkeep": 69, "turnCost": 1, "morale": 48, "loyalty": 40 },
        "specialAbility": "Light Fingers: +150 passive cash/turn (capped by heat).",
        "counters": ["Dealer"],
        "counteredBy": ["Lookout", "Enforcer"],
        "districtBonus": { "financial": 1.08, "midtown": 1.06 }
      },
      {
        "name": "Gatekeeper",
        "tier": "common",
        "faction": "Gang",
        "stats": { "offense": 35, "defense": 44, "cost": 1100, "upkeep": 69, "turnCost": 1, "morale": 62, "loyalty": 55 },
        "specialAbility": "Bouncer: +8% safehouse defense in district.",
        "counters": ["Runner", "Pickpocket"],
        "counteredBy": ["Arsonist", "Hitman"],
        "districtBonus": { "crooklyn": 1.10, "uptown": 1.05 }
      },
      {
        "name": "Dealer",
        "tier": "common",
        "faction": "Gang",
        "stats": { "offense": 33, "defense": 29, "cost": 1200, "upkeep": 69, "turnCost": 1, "morale": 58, "loyalty": 52 },
        "specialAbility": "Street Sales: +4% local drug income.",
        "counters": ["Hustler"],
        "counteredBy": ["Pickpocket", "Crack Guard"],
        "districtBonus": { "financial": 1.08, "crooklyn": 1.06 }
      },
      {
        "name": "Retread",
        "tier": "common",
        "faction": "Independent",
        "stats": { "offense": 38, "defense": 32, "cost": 900, "upkeep": 69, "turnCost": 1, "morale": 52, "loyalty": 42 },
        "specialAbility": "Been Here Before: −10% hire cost if re-hired after desertion.",
        "counters": ["Punk"],
        "counteredBy": ["Sergeant"],
        "districtBonus": { "crooklyn": 1.06, "uptown": 1.04 }
      },
      {
        "name": "Punk",
        "tier": "common",
        "faction": "Gang",
        "stats": { "offense": 36, "defense": 24, "cost": 750, "upkeep": 69, "turnCost": 1, "morale": 45, "loyalty": 35 },
        "specialAbility": "Loose Cannon: +10% offense, −10 morale when damaged.",
        "counters": ["Lookout"],
        "counteredBy": ["Retread", "Enforcer"],
        "districtBonus": { "crooklyn": 1.10, "uptown": 1.04 }
      },
      {
        "name": "Loader",
        "tier": "common",
        "faction": "Independent",
        "stats": { "offense": 22, "defense": 40, "cost": 1050, "upkeep": 69, "turnCost": 1, "morale": 60, "loyalty": 60 },
        "specialAbility": "Backroom Bulk: +10% stash capacity in district.",
        "counters": ["Pickpocket"],
        "counteredBy": ["Spy", "Saboteur"],
        "districtBonus": { "financial": 1.08, "docks": 1.06 }
      },
      {
        "name": "Crack Guard",
        "tier": "common",
        "faction": "Gang",
        "stats": { "offense": 44, "defense": 50, "cost": 1500, "upkeep": 69, "turnCost": 1, "morale": 65, "loyalty": 60 },
        "specialAbility": "Lockdown: +12% defense for production sites.",
        "counters": ["Pickpocket", "Runner"],
        "counteredBy": ["Sicario", "Arsonist"],
        "districtBonus": { "crooklyn": 1.08, "financial": 1.06 }
      }
    ],
    "uncommon": [
      {
        "name": "Enforcer",
        "tier": "uncommon",
        "faction": "Gang",
        "stats": { "offense": 70, "defense": 60, "cost": 6000, "upkeep": 269, "turnCost": 1, "morale": 68, "loyalty": 70 },
        "specialAbility": "Crack Skulls: +15% melee damage.",
        "counters": ["Street Thug", "Punk", "Runner"],
        "counteredBy": ["Hitman", "Sicario"],
        "districtBonus": { "crooklyn": 1.10, "uptown": 1.05 }
      },
      {
        "name": "Wheelman",
        "tier": "uncommon",
        "faction": "Gang",
        "stats": { "offense": 52, "defense": 44, "cost": 3000, "upkeep": 175, "turnCost": 1, "morale": 64, "loyalty": 70 },
        "specialAbility": "Pedal to Metal: +20% escape success.",
        "counters": ["Runner", "Smuggler"],
        "counteredBy": ["Spike Crew (event)"],
        "districtBonus": { "docks": 1.10, "crooklyn": 1.06 }
      },
      {
        "name": "Bodyguard",
        "tier": "uncommon",
        "faction": "Independent",
        "stats": { "offense": 55, "defense": 85, "cost": 7000, "upkeep": 296, "turnCost": 1, "morale": 75, "loyalty": 90 },
        "specialAbility": "Take the Hit: Soak first lethal hit for VIP in squad.",
        "counters": ["Hitman"],
        "counteredBy": ["Sicario", "Ghost"],
        "districtBonus": { "financial": 1.08, "midtown": 1.06 }
      },
      {
        "name": "Hustler",
        "tier": "uncommon",
        "faction": "Independent",
        "stats": { "offense": 55, "defense": 40, "cost": 2500, "upkeep": 150, "turnCost": 1, "morale": 66, "loyalty": 65 },
        "specialAbility": "Recruiter: +6% crew recruitment in district.",
        "counters": ["Dealer"],
        "counteredBy": ["Con Artist", "Extortion Crew"],
        "districtBonus": { "midtown": 1.08, "crooklyn": 1.06 }
      },
      {
        "name": "Fence",
        "tier": "uncommon",
        "faction": "Independent",
        "stats": { "offense": 30, "defense": 36, "cost": 2600, "upkeep": 165, "turnCost": 1, "morale": 62, "loyalty": 72 },
        "specialAbility": "Liquidator: −10% marketplace fees.",
        "counters": ["Pickpocket"],
        "counteredBy": ["Spy"],
        "districtBonus": { "financial": 1.10, "midtown": 1.04 }
      },
      {
        "name": "Scout Driver",
        "tier": "uncommon",
        "faction": "Gang",
        "stats": { "offense": 46, "defense": 40, "cost": 2800, "upkeep": 160, "turnCost": 1, "morale": 60, "loyalty": 60 },
        "specialAbility": "Mobile Recon: +10% recon and +10% escape.",
        "counters": ["Lookout", "Runner"],
        "counteredBy": ["Enforcer"],
        "districtBonus": { "crooklyn": 1.08, "financial": 1.05 }
      },
      {
        "name": "Quartermaster",
        "tier": "uncommon",
        "faction": "Independent",
        "stats": { "offense": 28, "defense": 42, "cost": 2600, "upkeep": 155, "turnCost": 1, "morale": 70, "loyalty": 75 },
        "specialAbility": "Tight Ship: −8% supply costs for squads in district.",
        "counters": ["Saboteur"],
        "counteredBy": ["Spy", "Arsonist"],
        "districtBonus": { "financial": 1.06, "crooklyn": 1.04 }
      },
      {
        "name": "Extortion Crew",
        "tier": "uncommon",
        "faction": "Mafia",
        "stats": { "offense": 58, "defense": 50, "cost": 3600, "upkeep": 200, "turnCost": 1, "morale": 68, "loyalty": 72 },
        "specialAbility": "Protection Tax: +6% steady income; +heat if stacked.",
        "counters": ["Dealer", "Hustler"],
        "counteredBy": ["Briber", "Corrupt Cop"],
        "districtBonus": { "midtown": 1.10, "financial": 1.08 }
      },
      {
        "name": "Carjacker",
        "tier": "uncommon",
        "faction": "Gang",
        "stats": { "offense": 62, "defense": 42, "cost": 3000, "upkeep": 170, "turnCost": 1, "morale": 64, "loyalty": 58 },
        "specialAbility": "Hot Wheels: +12% vehicle theft payoff.",
        "counters": ["Wheelman"],
        "counteredBy": ["Gatekeeper", "Bodyguard"],
        "districtBonus": { "crooklyn": 1.10, "docks": 1.04 }
      },
      {
        "name": "Pick Crew",
        "tier": "uncommon",
        "faction": "Gang",
        "stats": { "offense": 50, "defense": 45, "cost": 2600, "upkeep": 155, "turnCost": 1, "morale": 62, "loyalty": 60 },
        "specialAbility": "Smash & Grab: +10% robbery payout.",
        "counters": ["Fence"],
        "counteredBy": ["Lookout", "Corrupt Cop"],
        "districtBonus": { "midtown": 1.08, "crooklyn": 1.04 }
      }
    ],
    "rare": [
      {
        "name": "Hitman",
        "tier": "rare",
        "faction": "Mafia",
        "stats": { "offense": 90, "defense": 48, "cost": 9000, "upkeep": 420, "turnCost": 2, "morale": 72, "loyalty": 65 },
        "specialAbility": "One Shot: 20% chance to eliminate target leader.",
        "counters": ["Enforcer", "Extortion Crew"],
        "counteredBy": ["Bodyguard", "Ghost"],
        "districtBonus": { "crooklyn": 1.08, "midtown": 1.06 }
      },
      {
        "name": "Sicario",
        "tier": "rare",
        "faction": "Cartel",
        "stats": { "offense": 86, "defense": 70, "cost": 9500, "upkeep": 475, "turnCost": 2, "morale": 78, "loyalty": 80 },
        "specialAbility": "Plata o Plomo: +12% raid damage on drug ops.",
        "counters": ["Crack Guard", "Enforcer", "Bodyguard"],
        "counteredBy": ["Ghost", "OG"],
        "districtBonus": { "financial": 1.08, "docks": 1.06 }
      },
      {
        "name": "Smuggler",
        "tier": "rare",
        "faction": "Cartel",
        "stats": { "offense": 60, "defense": 50, "cost": 4800, "upkeep": 350, "turnCost": 1, "morale": 70, "loyalty": 75 },
        "specialAbility": "Tunnel Vision: −20% transport cost; −10% heat on moves.",
        "counters": ["Runner", "Fence"],
        "counteredBy": ["Wheelman", "Corrupt Cop"],
        "districtBonus": { "docks": 1.10, "financial": 1.08 }
      },
      {
        "name": "Spy",
        "tier": "rare",
        "faction": "Independent",
        "stats": { "offense": 46, "defense": 40, "cost": 3600, "upkeep": 320, "turnCost": 1, "morale": 66, "loyalty": 65 },
        "specialAbility": "Deep Cover: −10% rival defense; reveals squad composition.",
        "counters": ["Quartermaster", "Fence"],
        "counteredBy": ["Hacker", "Lookout"],
        "districtBonus": { "midtown": 1.06, "financial": 1.06 }
      },
      {
        "name": "Arsonist",
        "tier": "rare",
        "faction": "Gang",
        "stats": { "offense": 82, "defense": 44, "cost": 5600, "upkeep": 380, "turnCost": 2, "morale": 64, "loyalty": 60 },
        "specialAbility": "Light It Up: Facility damage over 3 turns.",
        "counters": ["Gatekeeper", "Crack Guard", "Quartermaster"],
        "counteredBy": ["Corrupt Cop", "Bodyguard"],
        "districtBonus": { "crooklyn": 1.08, "uptown": 1.06 }
      },
      {
        "name": "Counterfeiter",
        "tier": "rare",
        "faction": "Independent",
        "stats": { "offense": 30, "defense": 42, "cost": 6000, "upkeep": 400, "turnCost": 2, "morale": 68, "loyalty": 72 },
        "specialAbility": "Funny Money: +1200 clean cash/turn; +heat on crit fails.",
        "counters": ["Fence"],
        "counteredBy": ["Hacker", "Corrupt Cop"],
        "districtBonus": { "financial": 1.12, "midtown": 1.04 }
      },
      {
        "name": "Corrupt Cop",
        "tier": "rare",
        "faction": "Independent",
        "stats": { "offense": 62, "defense": 72, "cost": 9000, "upkeep": 450, "turnCost": 2, "morale": 74, "loyalty": 80 },
        "specialAbility": "Blue Shield: 50% chance to prevent raids.",
        "counters": ["Extortion Crew", "Arsonist"],
        "counteredBy": ["Briber", "Consigliere"],
        "districtBonus": { "financial": 1.10, "midtown": 1.06 }
      },
      {
        "name": "Medic",
        "tier": "rare",
        "faction": "Independent",
        "stats": { "offense": 24, "defense": 50, "cost": 4800, "upkeep": 340, "turnCost": 1, "morale": 76, "loyalty": 85 },
        "specialAbility": "Patch Up: Heal 20% squad HP after combat.",
        "counters": ["Viral Agent"],
        "counteredBy": ["Hitman"],
        "districtBonus": { "crooklyn": 1.06, "uptown": 1.04 }
      },
      {
        "name": "Hacker",
        "tier": "rare",
        "faction": "Independent",
        "stats": { "offense": 52, "defense": 52, "cost": 7000, "upkeep": 430, "turnCost": 2, "morale": 70, "loyalty": 75 },
        "specialAbility": "Wiretap: +10% intel; jam enemy recon.",
        "counters": ["Spy", "Counterfeiter"],
        "counteredBy": ["Ghost", "OG"],
        "districtBonus": { "midtown": 1.06, "financial": 1.06 }
      },
      {
        "name": "Saboteur",
        "tier": "rare",
        "faction": "Gang",
        "stats": { "offense": 66, "defense": 48, "cost": 5600, "upkeep": 390, "turnCost": 2, "morale": 65, "loyalty": 64 },
        "specialAbility": "Break the Chain: −12% enemy supply efficiency.",
        "counters": ["Quartermaster", "Loader"],
        "counteredBy": ["Lookout", "Wheelman"],
        "districtBonus": { "financial": 1.08, "crooklyn": 1.06 }
      }
    ],
    "epic": [
      {
        "name": "OG",
        "tier": "epic",
        "faction": "Gang",
        "stats": { "offense": 82, "defense": 82, "cost": 18000, "upkeep": 669, "turnCost": 2, "morale": 90, "loyalty": 95 },
        "specialAbility": "Respect the Name: +10% crew morale aura.",
        "counters": ["Sicario", "Hitman"],
        "counteredBy": ["Ghost"],
        "districtBonus": { "crooklyn": 1.12, "uptown": 1.08 }
      },
      {
        "name": "Consigliere",
        "tier": "epic",
        "faction": "Mafia",
        "stats": { "offense": 40, "defense": 62, "cost": 14000, "upkeep": 620, "turnCost": 2, "morale": 92, "loyalty": 95 },
        "specialAbility": "Grease the Wheels: −15% heat per turn in district.",
        "counters": ["Corrupt Cop"],
        "counteredBy": ["Spy"],
        "districtBonus": { "midtown": 1.12, "financial": 1.06 }
      },
      {
        "name": "Lieutenant",
        "tier": "epic",
        "faction": "Gang",
        "stats": { "offense": 76, "defense": 70, "cost": 16000, "upkeep": 669, "turnCost": 2, "morale": 80, "loyalty": 80 },
        "specialAbility": "Squad Leader: Commands up to 5 commons for +10% efficiency.",
        "counters": ["Retread", "Punk", "Street Thug"],
        "counteredBy": ["Hitman"],
        "districtBonus": { "crooklyn": 1.08, "uptown": 1.04 }
      },
      {
        "name": "Triad Enforcer",
        "tier": "epic",
        "faction": "Gang",
        "stats": { "offense": 84, "defense": 76, "cost": 17500, "upkeep": 700, "turnCost": 2, "morale": 86, "loyalty": 84 },
        "specialAbility": "Iron Discipline: −10% retreat chance; +5% crit.",
        "counters": ["Enforcer", "Extortion Crew"],
        "counteredBy": ["Hitman", "Ghost"],
        "districtBonus": { "midtown": 1.06, "financial": 1.06 }
      },
      {
        "name": "Yakuza Soldier",
        "tier": "epic",
        "faction": "Gang",
        "stats": { "offense": 80, "defense": 78, "cost": 17000, "upkeep": 680, "turnCost": 2, "morale": 88, "loyalty": 88 },
        "specialAbility": "Code of Honor: Immune to panic; +10% melee.",
        "counters": ["Enforcer", "Carjacker"],
        "counteredBy": ["Hitman"],
        "districtBonus": { "midtown": 1.08, "crooklyn": 1.04 }
      },
      {
        "name": "Veteran Trainer",
        "tier": "epic",
        "faction": "Independent",
        "stats": { "offense": 60, "defense": 64, "cost": 13000, "upkeep": 600, "turnCost": 2, "morale": 88, "loyalty": 92 },
        "specialAbility": "Up-Skill: Promote one common → uncommon every 3 turns.",
        "counters": ["Punk", "Retread"],
        "counteredBy": ["Spy"],
        "districtBonus": { "crooklyn": 1.06, "uptown": 1.05 }
      },
      {
        "name": "Extortion Captain",
        "tier": "epic",
        "faction": "Mafia",
        "stats": { "offense": 78, "defense": 74, "cost": 15500, "upkeep": 640, "turnCost": 2, "morale": 82, "loyalty": 86 },
        "specialAbility": "Tighter Grip: +10% rackets income; +heat if stacked.",
        "counters": ["Hustler", "Dealer"],
        "counteredBy": ["Consigliere", "Briber"],
        "districtBonus": { "midtown": 1.12, "financial": 1.08 }
      },
      {
        "name": "Chemist",
        "tier": "epic",
        "faction": "Cartel",
        "stats": { "offense": 28, "defense": 50, "cost": 15000, "upkeep": 660, "turnCost": 2, "morale": 78, "loyalty": 85 },
        "specialAbility": "Purity: +25% drug yield; −10% detection risk.",
        "counters": ["Crack Guard"],
        "counteredBy": ["Spy", "Arsonist"],
        "districtBonus": { "financial": 1.12, "docks": 1.04 }
      }
    ],
    "legendary": [
      {
        "name": "Boss",
        "tier": "legendary",
        "faction": "Independent",
        "stats": { "offense": 95, "defense": 95, "cost": 60000, "upkeep": 1469, "turnCost": 3, "morale": 100, "loyalty": 100 },
        "specialAbility": "Kingmaker: +20% crew morale & loyalty citywide.",
        "counters": ["OG", "Extortion Captain"],
        "counteredBy": ["Ghost", "Hitman"],
        "districtBonus": { "crooklyn": 1.10, "midtown": 1.08 }
      },
      {
        "name": "Underboss",
        "tier": "legendary",
        "faction": "Independent",
        "stats": { "offense": 84, "defense": 88, "cost": 36000, "upkeep": 1100, "turnCost": 2, "morale": 92, "loyalty": 90 },
        "specialAbility": "Fail-Safe: Auto-issues orders if Boss is jailed.",
        "counters": ["Lieutenant", "Extortion Captain"],
        "counteredBy": ["Hitman"],
        "districtBonus": { "midtown": 1.06, "crooklyn": 1.06 }
      },
      {
        "name": "Kingpin Enforcer",
        "tier": "legendary",
        "faction": "Independent",
        "stats": { "offense": 95, "defense": 90, "cost": 30000, "upkeep": 1000, "turnCost": 2, "morale": 96, "loyalty": 100 },
        "specialAbility": "No Trespass: Prevents theft/raids on your assets for 3 turns.",
        "counters": ["Hitman", "Sicario", "Arsonist"],
        "counteredBy": ["Ghost"],
        "districtBonus": { "crooklyn": 1.08, "financial": 1.06 }
      },
      {
        "name": "Ghost",
        "tier": "legendary",
        "faction": "Independent",
        "stats": { "offense": 88, "defense": 60, "cost": 34000, "upkeep": 1050, "turnCost": 2, "morale": 90, "loyalty": 92 },
        "specialAbility": "Invisible Hand: Immune to recon; +25% stealth missions.",
        "counters": ["Bodyguard", "OG", "Hacker"],
        "counteredBy": ["Triad Enforcer (discipline crit)", "Lookout (lucky event)"],
        "districtBonus": { "docks": 1.10, "midtown": 1.06 }
      },
      {
        "name": "Made Man",
        "tier": "legendary",
        "faction": "Mafia",
        "stats": { "offense": 85, "defense": 92, "cost": 26000, "upkeep": 900, "turnCost": 2, "morale": 94, "loyalty": 98 },
        "specialAbility": "Omertà: Immune to bribery; +10% defense on home turf.",
        "counters": ["Extortion Crew", "Enforcer"],
        "counteredBy": ["Hitman", "Ghost"],
        "districtBonus": { "midtown": 1.06, "crooklyn": 1.06 }
      },
      {
        "name": "Sicario Primo",
        "tier": "legendary",
        "faction": "Cartel",
        "stats": { "offense": 96, "defense": 82, "cost": 32000, "upkeep": 1080, "turnCost": 2, "morale": 94, "loyalty": 94 },
        "specialAbility": "Black Sun Raid: +20% attack on drug facilities; −10 enemy morale on raid.",
        "counters": ["Crack Guard", "Bodyguard", "Lieutenant"],
        "counteredBy": ["OG", "Kingpin Enforcer"],
        "districtBonus": { "financial": 1.10, "crooklyn": 1.06 }
      }
    ]
  },
  "districts": {
    "Uptown Plaza": {
      "aka": "uptown",
      "bonusName": "Plaza Rally",
      "effects": { "moraleFlat": 2, "underdogDefenseMult": 1.08 }
    },
    "Midtown Market": {
      "aka": "midtown",
      "bonusName": "Market Bargain",
      "effects": { "allianceFlipBonus": 1, "incomeMult": 1.15 }
    },
    "Crooklyn Heights": {
      "aka": "crooklyn",
      "bonusName": "Heights Grip",
      "effects": { "stoopDefenseMult": 1.25, "allyRecruitChanceMult": 1.10 }
    },
    "Harbor Docks": {
      "aka": "docks",
      "bonusName": "Dock Shroud",
      "effects": { "evasionMult": 1.30, "sabotageDamageMult": 1.10 }
    },
    "Financial District": {
      "aka": "financial",
      "bonusName": "Flow Launder",
      "effects": { "incomeMult": 1.10, "rareImportChanceMult": 1.20 }
    }
  },

  // Helper function to get all thugs as a flat array
  getAllThugs: function() {
    const allThugs = [];
    for (const tier in this.thugs) {
      allThugs.push(...this.thugs[tier]);
    }
    return allThugs;
  },

  // Helper function to get thug by name
  getThugByName: function(name) {
    const allThugs = this.getAllThugs();
    return allThugs.find(thug => thug.name === name);
  },

  // Helper function to get thugs by tier
  getThugsByTier: function(tier) {
    return this.thugs[tier] || [];
  }
};
