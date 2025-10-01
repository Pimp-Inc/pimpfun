# 🎩 Pimp.Fun — Crew / Thug System (Developer Spec, MD)

Version: `v1.0` • Scope: **Crew generation, ranks, promotions, roles, personalities, training, drama, UI hooks, config shape**
Owner: Game Design • Status: **Ready for JSON wiring + implementation**

---

## 0) Design Goals

* **Personality + strategy.** Crews feel like characters, not counters.
* **Buckets, not snowflakes.** Centralized config, simple formulas, emergent combos.
* **Screenshot bait.** Names, drama, and rare titles spark shareable moments.

---

## 1) Ranks, Slots, Promotions

**Rank ladder:** Rookie → Soldier → Enforcer → Lieutenant → Underboss

**Caps (per city, tunable):**

* Lieutenants: `L_cap = 6 + floor(territories/4)`
* Underboss: `UB_cap = 2` (hard cap; seasonal events can raise temporarily)

**Promotion gates** (XP **and** a % roll; only some advance):

| From → To              | XP Gate | Base Promote Chance | Notes                                       |
| ---------------------- | ------: | ------------------: | ------------------------------------------- |
| Rookie → Soldier       |     300 |             **69%** | Apply modifiers (loyalty, traits, training) |
| Soldier → Enforcer     |     900 |             **36%** | Enforcer mastery bonuses apply              |
| Enforcer → Lieutenant  |    1500 |             **21%** | Leadership traits/mentorship help           |
| Lieutenant → Underboss |    3900 |              **3%** | **Hard slot check** required                |

**Promotion roll (server-authoritative):**

```
promote_chance = base
  + sum(positive_mods) - sum(negative_mods)
  + min(0.15, win_streak*0.02)
  - rivalry_block ? 0.15 : 0
  - low_loyalty(<50) ? 0.20 : 0
```

If target rank slots full:

* **Bookmark Promotion:** no rank change, but grant `+10% output` buff for 7 days; auto-promote when slot opens (FIFO).

**Demotion / Injury:**

* SWAT/raid outcomes can **maim** (−random stat, temp sidelined) or **imprison** (cant’ deploy; parole missions can free).

---

## 2) Names & Identity

### 2.1 First/Nick Names

Single shared pool for all ranks **except Underboss** (separate). 

```json
{
  "nicknames": [
    "Tiny","Patches","Cash","Dice","Rook","Ace","Spark","Dash","Quick","Flash","Phoenix","Ice","Diesel","Tank","Blade","Bones","Crow","Fish","Brick","Stone","Rookie","Fresh","Kid","Mouse","Pebble","Chip","Wire","Smoke","Spade","Club","Nudge","Skips","Spry","Zip","Nifty","Shortstack","Razor","Viper","Skull","Steel","Iron","Hammer","Spike","Torch","Frost","Storm","Blaze","Fury","Rage","Shadow","Ghost","Phantom","Shade","Wolf","Bear","Tiger","Hawk","Eagle","Falcon","Cobra","Shark","Bull","Rhino","Gator","Jackal","Mamba","Ruckus","Riot","Havoc","Grip","Knuckles","Big Mike","Heavy","Crusher","Breaker","Smasher","Wrecker","Bruiser","Killer","Slayer","Terminator","Executioner","Reaper","Punisher","Titan","Goliath","Hercules","Atlas","Ares","Mars","Anvil","Mauler","Juggernaut","Boulder","Avalanche","Rampage","Ironhide","Bonecrusher","Haymaker","Freight","Hammerfist","Brickhouse","Tanktop","Bulldozer","Nightstick","Blackout","Flatline","Chief","Boss","Captain","Major","Colonel","General","Marshal","Admiral","Overseer","Shot-Caller","Quartermaster","Foreman","Warden","Taskmaster","Handler","Strategist","Fixer","Coordinator","Watchman","Herald","Viceroy","Regent","Right-Hand","Prime","Alpha","Sigma","Delta","Bishop","Chancellor","Magistrate","Prefect","Provost","Syndic","Comptroller","High Roller","Gatekeeper","Cold Front","No Chaser","Two-Times","Blue Note","Low Voltage","Night Shift","No Witness","Paper Trail","Quiet Money","Right Now","Smooth Operator","Black Ice","Quick Draw","Dark Horse","Iron Grip","Street Cipher","Ghost Hustle","Cash Flow","Sly Fox","Hard Count","Shadow Stack","Midnight Run","Steel Pulse","Low Key","Fast Lane","Silver Tongue","Night Hawk","Cold Cash","Slick Shade","Deep Pockets","Red Ace","Quiet Storm","Bold Cut","Gritty Flash","Hush Money","Sharp Edge","Cool Hand","Dark Tide","Swift Shade","True Grit","Neon Byte","Silk Scar","Crimson Claw","Jade Fang","Circuit Snap","Voodoo Pulse","Copper Sting","Obsidian","Wraith","Banshee","Siren","Raven Lock","Dagger Rose","Chrome Veil","Glitch","Cipher Shade","Saffron","Onyx Blade","Whisper","Smoke Signal","Grit","Cactus Jack","Santo","Lobo","Chico Fuego","Tequila","Machete","Drift","Sable","Velvet Claw","Frostbite","Scorch","Talon","Mako","Panther","Lynx","Crimson Tide","Iron Byte","Hack","Viper Sting","Echo","Mirage","Slate","Cobalt","Dusk","Dawnbreaker","Quicksilver","Riptide","Sandman","Nightshade","Hex"
  ],
  "underboss": [
    "Don","Capo","Consigliere","Underboss","Godfather-Lite","Kingpin","Iron Fist","Dead Eye","The Hammer","The Anvil","The Forge","The Fire","The Ice","The Storm","Black Card","Diamond Dave","Platinum Paul","Gold Gus","Silver Sam","Bronze Ben","Scarface","Blackjack","High Table","Shadow King","Low-Key Lord","Quiet Storm","The Auditor","The Architect","The Broker","The Wisp","Silk Glove","Velvet Rope","Night Mayor","Street Patriarch","Rainmaker","The Signature","The Oracle","Night Baron","Velvet King","Smoke Czar","The Broker","Silver Hand","Ebony Crown","The Fix","Puppetmaster","The Veil","Iron Silk","Shadow Don","Gilded Edge","The Maven","Crimson Lord","The Keeper","Onyx Regent","Sable Throne","The Schemer","Dusk Ruler"
  ]
}
```

**Last names (provided):** Johnson, Smith, Williams, Brown, Jones, Davis, Clark, Lewis, Walker, Harris, Thomas, Jackson, White, Green, King, Scott, Adams, Carter, Turner, Moore, Thompson, Allen, Young, Wright, Hill, Baker, Parker, Price, Phillips, Freeman, Washington, Booker, Douglass, Tubman, Garvey, Malcolm, Robinson, Coleman, Jenkins, Perry, Powell, Bell, Reed, Gray, Alexander, Hayes, Ford, Howard, Ross, Simmons

**Display patterns:**

* Non-UB: `<FirstOrNick> <Last>` or `<First> <Last>` 
* Underboss: `<UnderbossTitle> <Last>` (e.g., **Diamond Dave Wright**)

---

## 3) Roles (Specializations)

Roles are **orthogonal to rank**; each thug has **one primary** role and can learn a **secondary** at −50% efficiency.

| Role                            | Core Perks                                     | Example Abilities                                                   |
| ------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------- |
| **Enforcer** (DPS/Intimidation) | +Corner Defense, +Intimidate                   | “Break Knees” (lower rival morale), “Hold the Line” (reduce losses) |
| **Dealer** (Economy)            | +Sales margin, −Bust chance                    | “Preferred Clients”, “Street Samples” (seed demand)                 |
| **Scout** (Intel)               | Pre-warns raids, −5% Heat gain when active     | “Stakeout” (reveal enemy comp), “Wiretap Lite”                      |
| **Driver** (Mobility)           | +Getaway, +Convoy yield                        | “Burn Rubber” (escape raid), “Carpool Cash” (event bonus)           |
| **Fixer** (Support)             | Convert confiscations → fines, repair vehicles | “Paper Push” (reduce punishment severity)                           |
| **Face** (Negotiation/PR)       | Bribe efficiency, charity success window +10%  | “Smooth Talk” (downgrade bust)                                      |
| **Cleaner** (Recovery)          | −15% losses from punishments, +recovery speed  | “Bleach the Block” (post-raid cooldown cut)                         |

**Synergy examples (multiplicative, clamp total bonus ≤ +25%):**

* **Scout + Face** on charity: widen Success band (+10%) and bump partial to 0.7x.
* **Driver + Enforcer** in ambush jobs: +15% job success.
* **Fixer + Cleaner** during punishments: additional −10% seized.

---

## 4) Personalities (Quirks)

Each thug rolls **1–2** quirks. They matter for promotions, outcomes, and drama.

| Personality             | Effects                                                                 |
| ----------------------- | ----------------------------------------------------------------------- |
| **Hothead**             | +10% DPS, +Heat on fights (+5%), −15% chance to promote into leadership |
| **Loyalist**            | +10% promote chance, immune to rival bribes                             |
| **Clown**               | Crew morale aura +2, −10% promote                                       |
| **Zen**                 | Heat gain ×0.95, DPS −5%                                                |
| **Professional**        | +5% to all income tasks, morale − if paired with Clown                  |
| **Schemer**             | +2% passive cash side-hustle, 1% skim chance (triggers trust events)    |
| **Germaphobe**          | Blacklist “messy” charities; morale − if forced                         |
| **Romantic**            | Random entanglement events (tiny stat swings, funny modals)             |
| **Historian**           | PR bonus on Literacy/Bookbag events                                     |
| **Driver’s Ed Dropout** | Must train before high-tier vehicles                                    |

---

## 5) XP, Loyalty, Morale, Salaries

* **XP gains:**

  * Job success: `base 30–60` (+role bonus)
  * Charity assist: `+20` (Face +10)
  * Survived raid: `+25` (Cleaner +10)
  * Personal mission: `+50`
* **Loyalty (0–100):** rises with pay, wins, backing them in drama; drops with benching, broken promises.

  * Effects: promotion modifier, betrayal resistance, event outcomes.
* **Morale (−10 to +10):** short-term performance buff/debuff; resets if rested.
* **Salaries (per day, example baseline):** Rookie 250, Soldier 400, Enforcer 1500, Lieutenant 650 (plus leadership cut), Underboss 2000.

---

## 6) Training & Gear

**Facilities:** Combat School, Sales Academy, Defensive Driving, Logistics Depot, Charm School.

* Training grants **badges** (permanent mini-mods) and **role mastery** tiers (I–III).

**Gear Mastery:**

* **Weapons:** Pistols, SMGs, ARs, Shotguns, Melee (each +accuracy / +DPS scaling).
* **Vehicles:** Sedan, SUV, Lowrider, Limo, Bike (affects mobility, luxury PR, convoy).
* **Armor/Tools:** Vests (survivability), Radios (intel), Briefcases (white-collar missions).

---

## 7) Crew Drama (Micro-Events)

\*\* cadence:\*\* 0–2/day at city scale; weight by personalities and proximity.

* **Rivalry Flare:** Pick Mediate (turns, +loyalty) or Let Cook (+morale, +tiny heat).
* **Personal Mission:** “Ice Cold Tony wants payback…” → allocate 6–12 turns; reward XP + loyalty + small cash.
* **Hero Moment (Driver):** saves a charity convoy → bonus PR, promo odds + for 24h.
* **Inside Joke (Clown):** morale +2 squad-wide, productivity −5% for 6h.
* **Refusal (Germaphobe):** won’t do messy charity; swap or accept −morale.

**Underboss Power:** 1×/week **Pardon**: convert a Yellow/Orange punishment to a fine-only outcome.

---

## 8) Punishments Integration (hooks)

If Heat system triggers punishment (see separate spec), apply crew mitigations:

* **Cleaner:** losses ×0.85 (stacks with Fixer → ×0.75 cap).
* **Face:** downgrade one **Minor Bust** per 7d to **fine only**.
* **Scout:** −20% chance of **Kia Boys** event; pre-warn popup.
* **Driver:** +escape odds during raids (+15%).

---

## 9) UI / Modals

**Crew Card (list):** avatar • name • rank badge • role icon • XP bar • loyalty/morale pips • gear mini-icons.
**Detail Panel:** stats, traits, role mastery, badges, gear slots, relationships, promotion odds.
**Promotion Modal:**

* Header: `<Rank> → <Next>` • **Odd:** `21%` (why: breakdown)
* Buttons: **Train (+10% for 24h)** • **Roll** • **Pass**
* Flavor: one-liner based on personality.

**Drama Modal:** concise setup, 2–3 choices, clear outcomes.
**Roster Filters:** role, rank, loyalty, on-mission, injured, jailed.

---

## 10) Algorithms (pseudocode)

**Name generation**

```ts
function genName(rank: "underboss" | "other", lastNames: string[]) {
  const first = rank === "underboss" ? pick(cfg.names.underboss) : pick(cfg.names.common);
  const last = pick(lastNames);
  const mid = Math.random() < 0.05 ? ` "${pick(cfg.names.rareMiddleMonikers)}" ` : " ";
  return `${first}${rank==="underboss" ? " " : mid}${last}`;
}
```

**Promotion**

```ts
function tryPromote(thug, targetRank) {
  if (!hasXP(thug, targetRank)) return fail("xp_gate");
  if (!hasSlot(targetRank)) return bookmarkBuff(thug);
  let p = cfg.ranks[targetRank].promoteBase;
  p += modByLoyalty(thug.loyalty);
  p += traitMods(thug.personalities, thug.role, thug.mentorships);
  p += Math.min(0.15, thug.winStreak * 0.02);
  p -= thug.hasRivalry ? 0.15 : 0;
  p = clamp01(p);
  return rng() < p ? promote(thug) : fail("roll_fail");
}
```

**Synergy clamp**

```ts
totalBonus = clamp(base * (1 + sum(bonuses)), base * 0.5, base * 1.25);
```

---

## 11) Minimal Config Shape (JSON)

```json
{
  "crew": {
    "ranks": [
      { "id": "rookie", "xpGate": 300, "promoteBase": 0.69, "salary": 250 },
      { "id": "soldier", "xpGate": 900, "promoteBase": 0.36, "salary": 400 },
      { "id": "enforcer", "xpGate": 1500, "promoteBase": 0.21, "salary": 1500 },
      { "id": "lieutenant", "xpGate": 3900, "promoteBase": 0.03, "salary": 650, "capFormula": "6+floor(territories/4)" },
      { "id": "underboss", "xpGate": 99999, "promoteBase": 0.00, "salary": 2000, "capPerCity": 2 }
    ],
    "roles": ["enforcer","dealer","scout","driver","fixer","face","cleaner"],
    "personalities": ["hothead","loyalist","clown","zen","professional","schemer","germaphobe","romantic","historian","drivers_ed_dropout"],
    "names": { "…": "as defined in section 2.1" },
    "lastNames": ["Johnson","Smith","Williams","Brown","Jones","Davis","Clark","Lewis","Walker","Harris","Thomas","Jackson","White","Green","King","Scott","Adams","Carter","Turner","Moore","Thompson","Allen","Young","Wright","Hill","Baker","Parker","Price","Phillips","Freeman","Washington","Booker","Douglass","Tubman","Garvey","Malcolm","Robinson","Coleman","Jenkins","Perry","Powell","Bell","Reed","Gray","Alexander","Hayes","Ford","Howard","Ross","Simmons"]
  }
}
```

---

## 12) Tuning Knobs (where design will iterate)

* `promoteBase` per step, loyalty/trait modifiers, win-streak cap.
* Role synergy ceilings (`+25%` global).
* Drama frequency weights; punishment hooks strength.
* Salaries vs. city income to keep payroll meaningful.
* Underboss cap + “Pardon”/“Appeal” cooldowns.

---

## 13) QA Checklist

* Promotion odds reflect UI explanation (tooltips match math).
* Slot-full path yields Bookmark Buff + queue logic works.
* Traits blacklist/whitelist events (e.g., Germaphobe) respected.
* Synergy clamp applied once (no double-dipping across systems).
* Punishment hooks (Face/Fixer/Cleaner/Scout/Driver) trigger only in valid tiers.

---

## 14) Flavor Snippets (sprinkle in UI)

* **Promotion tease:** “Boss says you’re ready. Dice says roll.”
* **Rivalry pop:** “Clown just called Professional ‘Spreadsheet Papi.’”
* **Underboss crown:** “Night Mayor steps from the limo. Street lights dim.”

---

This is ready to hand off. If you want, I’ll convert sections **2.1, 11** into a single `crew-system.json` and wire a tiny `crew-rolls.ts` for name gen + promotions so your UI can call it cleanly.
