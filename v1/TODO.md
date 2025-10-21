# PIMP.FUN TODO List

## 🎯 CURRENT FOCUS
**Last Updated**: 2025-10-21

### What We're Working On Right Now:
- [x] **COMPLETED**: Turn system refactoring committed (server-authoritative with database persistence)
- [ ] **READY TO START** - Choose next priority task below

### Quick Context (for token limit situations):
- Recent work: Implemented server-authoritative turn system, added turn audit logging, fixed weapons/vehicles data handling
- Git status: Working tree clean - all turn system work committed (commit 0f93f11)
- Top priorities waiting:
  1. Information Architecture (Profile vs Resources separation) - HIGH PRIORITY
  2. Mobile Redesign (CRITICAL - game unusable on mobile)
  3. District/Territory Selection (incomplete flow)
  4. Fix any turn system bugs in testing

---

## 🔴 High Priority - User Experience

### 1. Reorganize Information Architecture: Profile vs Resources
- **Status**: Not Started
- **Priority**: HIGH - Clarify what information goes where
- **Description**: Currently there's confusion between personal stats (Profile) and inventory (Resources). Need to clearly separate these two concepts across the UI.

#### Current Problem:
- Profile and Resources are mixed together
- Unclear what belongs in Profile vs Resources vs Economic Dashboard
- Cash, Hoes, Thugs shown in profile but they're really resources/inventory
- Confusing for users to find information

#### Proposed Information Architecture:

### **PIMP PROFILE** (Identity & Performance Metrics)
**Purpose**: Who you are and how you're performing

**What belongs here:**
- 👤 **Pimp Name**: KingDaddy
- 💰 **Net Worth**: $1,594,854 (calculated total value)
- 🏙️ **District**: Uptown Plaza
- 📍 **Territory**: Yankee Corner
- 👥 **Crew**: None (or crew name)
- ⭐ **Level**: 4
- 🏆 **Respect**: 879 (reputation/street cred - personal stat)
- 🔥 **Heat**: 28% (police attention on YOU - personal risk)
- 💵 **Ho Payout %**: 30% (YOUR business policy/setting)

**Why these belong in Profile:**
- Respect = Your personal reputation
- Heat = Risk/danger level attached to you
- Payout % = Your management decision/policy
- These are personal metrics, not inventory

### **RESOURCES TAB** (Assets & Inventory)
**Purpose**: What you own and control

**Category 1: 💰 Financial Assets**
- **Cash**: $628,445 (liquid/spendable money)
- [Future: Money Laundering Operations - offshore accounts, etc.]

**Category 2: 👥 Human Resources (Crew)**
- **Hoes**: 293
  - Hoe Happiness: 90%
  - Breakdown by type (Street Workers, Sugar Babies, High-End Escorts, OnlyTramps Models)
- **Thugs**: 327
  - Thug Happiness: 100%
  - Breakdown by type (if applicable)

**Category 3: 🔫 Equipment & Assets**
- **Weapons**:
  - Pistols: 12
  - Shotguns: 5
  - Tek-9s: 3
  - AK-47s: 1
- **Vehicles**:
  - Cars: 2
  - SUVs: 1
  - Luxury: 0

**Category 4: 📦 Supplies & Drugs (Inventory)**
- **Crack**: 45 bags
- **Weed**: 120 oz
- **Beer**: 50 cases
- **Condoms**: 200
- **Medicine**: 15

### **ECONOMIC DASHBOARD** (Financial Analytics)
**Purpose**: How your money flows - detailed financial breakdown

**What belongs here:**
- 💵 Daily income breakdown (hoe earnings by type, drug sales, etc.)
- 📊 Income sources pie chart/visualization
- 📈 Expense tracking (supplies, upkeep, etc.)
- 💸 Profit margins and net income
- 📉 Historical trends (income over time)
- 🎰 Risk/reward analysis
- 💰 Net worth calculation details

**Why this separation:**
- Dashboard = Financial analytics and detailed breakdowns
- Resources = Current inventory snapshot
- Profile = Personal performance metrics

#### Visual Layout Examples:

**Desktop Layout (Two Columns):**
```
┌──────────────────┐  ┌──────────────────┐
│ PIMP PROFILE     │  │ RESOURCES        │
│                  │  │                  │
│ 👤 KingDaddy     │  │ 💰 CASH          │
│ 💰 Net Worth     │  │ $628,445         │
│ 🏙️ District      │  │                  │
│ 📍 Territory     │  │ 👥 CREW          │
│ ⭐ Level 4       │  │ Hoes: 293        │
│ ─────────────    │  │ Thugs: 327       │
│ 🏆 Respect: 879  │  │                  │
│ 🔥 Heat: 28%     │  │ 🔫 EQUIPMENT     │
│ 💵 Payout: 30%   │  │ Weapons: 21      │
│                  │  │ Vehicles: 3      │
│ [Edit Profile]   │  │                  │
└──────────────────┘  │ 📦 INVENTORY     │
                      │ Crack: 45        │
                      │ Weed: 120        │
                      │ Beer: 50         │
                      │ Condoms: 200     │
                      │ Medicine: 15     │
                      └──────────────────┘
```

**Mobile Layout (Separate Concepts):**
- **Top Nav Button** `[👤 KingDaddy]` → Opens Profile Modal (shows all profile stats)
- **Bottom Tab** `[💰 Resources]` → Shows only resources/inventory (NOT profile info)
- **Top Nav Button** `[📊 Economic Dashboard]` → Shows financial analytics

#### Implementation Tasks:

- [ ] **Audit current data placement**
  - [ ] List all stats currently shown in "Pimp Profile & Resources" section
  - [ ] Categorize each stat: Profile vs Resources vs Dashboard
  - [ ] Identify any stats that appear in multiple places

- [ ] **Redesign Profile Section**
  - [ ] Remove Cash, Hoes, Thugs from profile display
  - [ ] Add/emphasize Respect, Heat, Payout % in profile
  - [ ] Ensure Net Worth is prominent (after Pimp Name)
  - [ ] Add District and Territory fields
  - [ ] Update profile modal to match new structure
  - [ ] Make profile section more "identity-focused"

- [ ] **Redesign Resources Section**
  - [ ] Create clear category headers (Financial, Crew, Equipment, Inventory)
  - [ ] Group resources logically under categories
  - [ ] Add collapsible sections for each category (mobile-friendly)
  - [ ] Show happiness meters for Hoes/Thugs
  - [ ] Add visual icons for each resource type
  - [ ] Remove profile stats from this section

- [ ] **Update Economic Dashboard**
  - [ ] Ensure all financial analytics live here
  - [ ] Remove redundant basic stats (Cash should show in Resources too)
  - [ ] Focus on breakdowns, trends, and insights
  - [ ] Add "View Details" links from Resources to Dashboard

- [ ] **Update Database Schema (if needed)**
  - [ ] Ensure all new fields (territory, etc.) are in schema
  - [ ] Add any missing stat fields
  - [ ] Verify data types for all stats

- [ ] **Update Mobile Design (when building mobile tabs)**
  - [ ] Profile button in top nav opens full profile modal
  - [ ] Resources tab shows ONLY resources (inventory)
  - [ ] Ensure no overlap between profile modal and resources tab

- [ ] **Testing & Validation**
  - [ ] Verify no stats are lost/missing after reorganization
  - [ ] Test that all stats update correctly in their new locations
  - [ ] Ensure calculations still work (Net Worth, Daily Income, etc.)
  - [ ] Verify mobile experience is clear and intuitive

#### Key Principles:
- **Profile** = Personal identity, performance, and reputation
- **Resources** = Tangible things you own and manage
- **Dashboard** = Financial analytics and detailed breakdowns
- No overlap between these three concepts
- Clear visual separation on desktop, logical separation on mobile

#### Estimated Time:
- Audit & planning: 30 minutes
- Profile section redesign: 1-2 hours
- Resources section redesign: 2-3 hours
- Dashboard updates: 1 hour
- Testing: 1 hour
- **Total**: 5-7 hours

---

### 2. Complete Mobile Redesign with Tab Navigation
- **Status**: Not Started
- **Priority**: CRITICAL - Game is currently unusable on mobile
- **Description**: Mobile experience is broken. Need to completely redesign the layout with a bottom tab navigation system for easy thumb access.

#### Current Issues:
- Layout doesn't fit on mobile screens
- Text and buttons are too small
- Sections overflow and are hard to navigate
- No clear navigation structure
- Profile section takes up too much vertical space

#### Proposed Solution: Dual Navigation System
Create a mobile-first interface with **two navigation levels**:
- **Top thin nav**: Economic Dashboard & Profile (always accessible)
- **Bottom tab nav**: 4 main gameplay tabs

**Mobile Layout Structure:**
```
┌─────────────────────────────────────────┐
│ 🎩 Empire City                          │
│ Pimp to Earn. 5 Districts. One Crown.  │ ← Compact header (80px)
├─────────────────────────────────────────┤
│ [📊 Economic Dashboard] [👤 KingDaddy] │ ← Thin top nav (50px)
├─────────────────────────────────────────┤
│                                         │
│        ACTIVE TAB CONTENT               │
│         (Scrollable area)               │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│  [💪]    [💰]    [🥊]    [🛒]          │ ← Bottom tab nav (60px)
│  Turns  Resources Fights  Shop          │ ← Fixed to bottom
└─────────────────────────────────────────┘
```

**Why This Works Better:**
- ✅ Dashboard & Profile always accessible (not buried in tabs)
- ✅ Header stays compact, maximizes content space
- ✅ Clear visual hierarchy: Meta functions (top) → Gameplay (bottom)
- ✅ Bottom tabs remain thumb-friendly
- ✅ No navigation required to check profile or view dashboard

#### Tab 1: 💪 Use Turns (Turn Actions)
- **Content**: Turn Actions section (SCOUT DISTRICTS, CRACK & DRUG DEALING, ADJUST HO $ PAYOUT, HEAT MANAGEMENT)
- **Layout**:
  - Stack buttons vertically with large touch targets (min 44px height)
  - Show turn count prominently at top
  - Highlight selected action
  - Each button shows cost/benefit preview
- **Features**:
  - Turn counter sticky at top
  - Clear visual feedback when turns are low
  - Disabled state for actions when insufficient turns

#### Tab 2: 💰 Resources (Pimp Profile & Assets)
- **Content**: PIMP PROFILE & RESOURCES section
- **Layout**:
  - Condensed profile card at top (name, district, level)
  - Grid view of resources (2 columns on mobile)
  - Cash/Net Worth prominent
  - Collapsible sections for detailed stats
- **Features**:
  - Quick stats overview
  - "Edit Profile" button easily accessible
  - Visual indicators for happiness levels (color-coded)
  - Resource counts with icons

#### Tab 3: 🥊 Street Fights (Hood Pimps)
- **Content**: HOOD PIMPS - STREET FIGHTS section
- **Layout**:
  - Scrollable list of available opponents
  - Card-based design (one opponent per card)
  - Large "FIGHT" button on each card
  - Show power level, loot potential, and difficulty at a glance
- **Features**:
  - Filter by difficulty (Easy/Medium/Hard/Boss)
  - Sort by potential loot
  - Visual indicators for recommended fights
  - Combat log below (collapsible)

#### Tab 4: 🛒 Buy Shit (Store)
- **Content**: BUY SHIT section (Corners, Reggie's Plug, Tony's Chop Shop)
- **Layout**:
  - Categorized sections (collapsible accordions)
  - Item cards with prices and benefits
  - Shopping cart/quick buy interface
  - Quantity selectors with +/- buttons
- **Features**:
  - Show what you can afford (highlight available items)
  - Bulk purchase options
  - "Most Popular" or "Recommended" tags
  - Purchase confirmation for expensive items

#### Implementation Tasks:
- [ ] **Design mobile tab navigation component**
  - Bottom fixed navigation bar (60px height)
  - Icon + label for each tab
  - Active state highlighting
  - Smooth transitions between tabs
  - Prevent content from being hidden behind nav bar

- [ ] **Create compact mobile header**
  - 🎩 Hat logo (small, 32px)
  - "Empire City" title (condensed font)
  - Tagline below: "Pimp to Earn. 5 Districts. One Crown."
  - Clean, minimal design
  - Max height: 80px on mobile
  - No stats in header (moved to top nav)

- [ ] **Create thin top navigation bar**
  - Two buttons side-by-side
  - Left: `[📊 Economic Dashboard]` button (compact, icon + text)
  - Right: `[👤 {Pimp Name}]` button (shows actual pimp name)
  - Height: 50px (touch-friendly)
  - Subtle background (semi-transparent or gradient)
  - Always visible (sticky below header)
  - Buttons should be full-tap-target width

- [ ] **Refactor content sections into tab panels**
  - Hide/show based on active tab
  - Lazy load content where appropriate
  - Maintain scroll position per tab
  - Add loading states for tab switching

- [ ] **Optimize each tab for mobile**
  - **Turns Tab**:
    - [ ] Increase button sizes (min 48px height)
    - [ ] Add touch-friendly spacing (12px gaps)
    - [ ] Show turn cost badges on buttons
    - [ ] Add quick action tooltips

  - **Resources Tab**:
    - [ ] Create compact profile card
    - [ ] Use icon-based resource display
    - [ ] Add percentage bars for happiness
    - [ ] Implement expandable stat sections

  - **Fights Tab**:
    - [ ] Card-based opponent layout
    - [ ] Large fight buttons
    - [ ] Show difficulty badges
    - [ ] Add pull-to-refresh to get new opponents

  - **Shop Tab**:
    - [ ] Accordion-style store categories
    - [ ] Grid layout for items (2 columns)
    - [ ] Floating "Buy" button
    - [ ] Add to cart functionality

- [ ] **Add mobile-specific features**
  - [ ] Swipe gestures to switch tabs
  - [ ] Pull-to-refresh on all tabs
  - [ ] Haptic feedback on actions (if supported)
  - [ ] Floating action button for common actions
  - [ ] Bottom sheet modals instead of full-screen

- [ ] **Responsive breakpoints**
  - [ ] Mobile (< 768px): Show tab navigation
  - [ ] Tablet (768px - 1024px): Show sidebar + tabs
  - [ ] Desktop (> 1024px): Keep current layout

- [ ] **Testing & Polish**
  - [ ] Test on iPhone (Safari)
  - [ ] Test on Android (Chrome)
  - [ ] Test on various screen sizes (iPhone SE, Pro Max, etc.)
  - [ ] Ensure all touch targets are 44px minimum
  - [ ] Verify tab switching performance
  - [ ] Test with slow network connections

- [ ] **Additional Mobile Improvements**
  - [ ] Add PWA manifest for "Add to Home Screen"
  - [ ] Implement offline detection
  - [ ] Add loading skeletons for better perceived performance
  - [ ] Optimize font sizes for readability
  - [ ] Reduce animation complexity on mobile

#### Technical Considerations:
- Use CSS Grid/Flexbox for responsive layouts
- Implement tab state management (keep track of active tab)
- Use `transform` for tab transitions (better performance)
- Consider using `IntersectionObserver` for lazy loading
- Add `viewport` meta tag optimization
- Test with mobile device emulators AND real devices

#### Estimated Time:
- Design & Planning: 2-3 hours
- Implementation: 8-12 hours
- Testing & Refinement: 3-4 hours
- **Total**: 13-19 hours (spread across multiple sessions)

---

### 2. Enhanced District & Territory Selection System
- **Status**: Not Started
- **Priority**: HIGH - Core game mechanic needs proper implementation
- **Description**: The district selection flow is incomplete. Currently only allows claiming a district, but needs a two-phase modal system: Phase 1 (District Selection) → Phase 2 (Territory Selection within that district). Also need to update Pimp Profile to properly display district and territory information.

#### Current Issues:
- District selection is single-phase (just claims the district)
- No territory selection step after claiming district
- Pimp Profile doesn't show territory information
- Profile layout missing key information hierarchy

#### Phase 1: District Selection Modal (CURRENT)
**Example Districts:**
- 🏙️ **Uptown Plaza** (Bronx-inspired) - 15 territories - "Gamble's Edge" bonus
- 🏭 **The Docks** (Brooklyn-inspired) - 6 territories - "Industrial Control" bonus
- 🌃 **Crooklyn** (Brooklyn-inspired) - 30 territories - "Street Empire" bonus
- 💎 **Diamond District** (Manhattan-inspired) - 12 territories - "Luxury Trade" bonus
- 🎰 **Vegas Strip** (Entertainment) - 20 territories - "High Roller" bonus

**Current Flow:**
```
[Choose District] → Shows district cards with:
  - District name & icon
  - Real-world inspiration (e.g., "Based on Bronx")
  - Number of territories available
  - District bonus/special ability
  - Description/lore
  - "View Details" button
  - "Claim [District Name]" button
```

#### Phase 2: Territory Selection Modal (NEW - TO BUILD)
**Flow After Claiming District:**
```
User clicks "Claim Uptown Plaza"
  ↓
Phase 1 modal closes
  ↓
Phase 2 modal opens: "Choose Your Territory in Uptown Plaza"
  ↓
Shows grid/list of available territories within that district
  ↓
User selects specific territory
  ↓
Confirmation & game starts
```

**Territory Selection UI Design:**

**Modal Structure:**
```
╔════════════════════════════════════════════════════╗
║  🏙️ Choose Your Territory in Uptown Plaza         ║
║  ─────────────────────────────────────────────     ║
║  15 territories available - Choose your starting   ║
║  block. Each territory has unique advantages.      ║
╠════════════════════════════════════════════════════╣
║                                                    ║
║  ┌──────────────────┐  ┌──────────────────┐      ║
║  │ 📍 Yankee Corner │  │ 📍 Stadium Block │      ║
║  │                  │  │                  │      ║
║  │ • High Traffic   │  │ • VIP Access     │      ║
║  │ • +10% Income    │  │ • +15% Respect   │      ║
║  │                  │  │                  │      ║
║  │ 🏢 3 Corners     │  │ 🏢 2 Corners     │      ║
║  │ 👥 Medium Pop    │  │ 👥 High Pop      │      ║
║  │                  │  │                  │      ║
║  │ [Claim Territory]│  │ [Claim Territory]│      ║
║  └──────────────────┘  └──────────────────┘      ║
║                                                    ║
║  ┌──────────────────┐  ┌──────────────────┐      ║
║  │ 📍 East 161st St │  │ 📍 Grand Concrs  │      ║
║  │ ... (15 total)   │  │ ...              │      ║
║  └──────────────────┘  └──────────────────┘      ║
║                                                    ║
║  [← Back to Districts]                            ║
╚════════════════════════════════════════════════════╝
```

**Territory Card Information to Display:**
- 📍 Territory name (e.g., "Yankee Corner", "Stadium Block")
- 🎯 Territory bonus/special ability
  - Income multipliers (+10% Income)
  - Resource bonuses (+15% Respect)
  - Special mechanics (Double Heat Cooldown, Extra Security, etc.)
- 🏢 Number of available corners/spots in that territory
- 👥 Population density (Low/Medium/High/Very High)
- 💰 Starting resources or advantages
- 🎲 Risk level (Low/Medium/High)
- ⭐ Difficulty rating (1-5 stars)
- 🔒 Lock status (some territories locked until higher level?)

**Territory Data Structure Example:**
```javascript
districts: {
  "uptown_plaza": {
    name: "Uptown Plaza",
    territories: [
      {
        id: "yankee_corner",
        name: "Yankee Corner",
        bonus: "+10% Income from all sources",
        corners: 3,
        population: "Medium",
        riskLevel: "Medium",
        difficulty: 2,
        startingBonus: { cash: 5000, respect: 10 },
        description: "High-traffic area near the stadium. Busy game days mean big payouts.",
        locked: false
      },
      {
        id: "stadium_block",
        name: "Stadium Block",
        bonus: "+15% Respect gain",
        corners: 2,
        population: "High",
        riskLevel: "High",
        difficulty: 3,
        startingBonus: { thugs: 2, respect: 25 },
        description: "VIP territory with wealthy clientele. High visibility, high risk.",
        locked: false
      },
      // ... 13 more territories
    ]
  },
  "the_docks": {
    name: "The Docks",
    territories: [
      // ... 6 territories
    ]
  },
  "crooklyn": {
    name: "Crooklyn",
    territories: [
      // ... 30 territories (most territories)
    ]
  }
}
```

#### Updated Pimp Profile Display
**Current Profile Layout:**
```
Pimp Name: KingDaddy
District: Uptown Plaza
Crew: None
Level: 4
```

**NEW Profile Layout (Expanded):**
```
👤 Pimp Name: KingDaddy
💰 Net Worth: $1,594,854
🏙️ District: Uptown Plaza
📍 Territory: Yankee Corner
👥 Crew: None (or "The Kings" if in crew)
⭐ Level: 4
🎯 District Bonus: Gamble's Edge (+20% high-risk outcomes)
🏆 Reputation: Street Legend (879 Respect)
```

**Profile Card Hierarchy (Visual Order):**
1. **Pimp Name** (largest, most prominent)
2. **Net Worth** (second most important - shows success)
3. **District** (where they operate)
4. **Territory** (specific location within district) ← NEW
5. **Crew** (optional - social element)
6. **Level** (progression indicator)
7. **District Bonus** (shows active buff) ← NEW or relocated
8. **Reputation/Respect** (street cred)

#### Implementation Tasks:

- [ ] **Create Phase 2 Territory Selection Modal**
  - [ ] Design modal UI with territory cards
  - [ ] Create territory card component (reusable)
  - [ ] Add territory data structure to GameConstants.js
  - [ ] Populate territories for each district (6-30 per district)
  - [ ] Implement territory selection logic
  - [ ] Save selected territory to gameState.player.territory

- [ ] **Update District Selection Flow**
  - [ ] Modify "Claim District" button behavior
  - [ ] Instead of immediately claiming, open Phase 2 modal
  - [ ] Pass district info to Phase 2 modal
  - [ ] Add "Back to Districts" navigation
  - [ ] Handle edge cases (user closes modal mid-flow)

- [ ] **Implement Territory Data**
  - [ ] Define territory properties (bonuses, risk, population, etc.)
  - [ ] Create realistic territory names per district
    - **Uptown Plaza** (15): Stadium-themed names (Yankee Corner, etc.)
    - **The Docks** (6): Industrial names (Pier 9, Warehouse District, etc.)
    - **Crooklyn** (30): Street-themed names (Bedford Ave, Flatbush Junction, etc.)
    - **Diamond District** (12): Luxury names (Fifth Avenue, Cartier Corner, etc.)
    - **Vegas Strip** (20): Casino-themed names (Lucky Seven, High Roller Blvd, etc.)
  - [ ] Assign unique bonuses to territories (variety, not all the same)
  - [ ] Balance territory advantages (no territory too OP)

- [ ] **Update Pimp Profile Section**
  - [ ] Add "Territory" field to profile display
  - [ ] Add "Net Worth" to top of profile (after Pimp Name)
  - [ ] Reorder profile fields per new hierarchy
  - [ ] Make "District Bonus" more visible
  - [ ] Add territory icon/badge
  - [ ] Update profile edit modal to show territory (read-only or changeable?)

- [ ] **Territory Benefits System**
  - [ ] Implement territory bonus effects in game mechanics
  - [ ] Apply income multipliers from territory bonuses
  - [ ] Apply respect multipliers from territory bonuses
  - [ ] Add territory-specific random events
  - [ ] Create territory upgrade system (future enhancement?)

- [ ] **Save/Load Territory Data**
  - [ ] Add territory field to player database schema
  - [ ] Save selected territory to Supabase
  - [ ] Load territory on game load
  - [ ] Handle migration for existing players (default territory assignment)

- [ ] **UI/UX Polish**
  - [ ] Add transition animation between Phase 1 and Phase 2
  - [ ] Highlight recommended territories for new players
  - [ ] Add search/filter for territories (especially for Crooklyn's 30)
  - [ ] Show territory availability (if some are taken by other players in future multiplayer)
  - [ ] Add "Random Territory" button for quick start
  - [ ] Create territory preview/detail view

- [ ] **Mobile Optimization**
  - [ ] Make territory cards mobile-friendly (stack vertically)
  - [ ] Reduce territory card size on small screens
  - [ ] Add horizontal scrolling for territory grid
  - [ ] Ensure touch targets are 44px minimum
  - [ ] Test on various screen sizes

- [ ] **Testing**
  - [ ] Test district → territory flow for all districts
  - [ ] Verify territory bonuses actually apply
  - [ ] Test back navigation
  - [ ] Test modal closing edge cases
  - [ ] Verify territory data saves to database
  - [ ] Test with existing players (data migration)

#### Technical Considerations:
- Territory selection should happen AFTER district selection (sequential, not nested)
- Territory data should be stored in GameConstants.js with district data
- Profile should show territory as clickable (could open territory details modal)
- Consider allowing territory changes later (with cost/cooldown?)
- Territory system could be foundation for future PvP territory control

#### Data Example (Add to GameConstants.js):
```javascript
export const DISTRICTS = {
  UPTOWN_PLAZA: {
    id: 'uptown_plaza',
    name: 'Uptown Plaza',
    totalTerritories: 15,
    territories: {
      YANKEE_CORNER: {
        id: 'yankee_corner',
        name: 'Yankee Corner',
        bonus: { type: 'income', value: 10, description: '+10% Income' },
        // ... more data
      },
      // ... 14 more territories
    }
  },
  // ... other districts
};
```

#### Estimated Time:
- Territory data creation: 2-3 hours (creating 83 territories across 5 districts)
- Phase 2 modal UI: 3-4 hours
- Flow integration: 2-3 hours
- Profile update: 1-2 hours
- Territory bonus implementation: 2-3 hours
- Testing & polish: 2-3 hours
- **Total**: 12-18 hours

#### Future Enhancements (Post-MVP):
- Territory control PvP (fight for territories)
- Territory upgrades (improve bonuses)
- Territory events (special missions per territory)
- Visual territory map
- Territory leaderboards

---

### 3. Implement proper password change functionality
- **Status**: Not Started
- **Location**: `index.html` line 12171 (showChangePasswordModal function)
- **Description**: Currently just shows "coming soon" alert. Need to implement proper Supabase password change flow.
- **Tasks**:
  - [ ] Create proper password change modal UI
  - [ ] Add current password verification
  - [ ] Implement Supabase `updateUser()` with new password
  - [ ] Add password strength validation
  - [ ] Show success/error notifications

### 2. Add loading states/spinners
- **Status**: Not Started
- **Description**: For auth, save/load operations so users know something is happening
- **Locations**:
  - Sign in/Sign up flows
  - `loadPlayerProfileFromAuth()` (line 8834)
  - `saveGameState()` operations
  - Profile updates
- **Tasks**:
  - [ ] Create reusable loading spinner component
  - [ ] Add to sign in flow
  - [ ] Add to sign up flow
  - [ ] Add to profile data loading
  - [ ] Add to save operations
  - [ ] Add to pimp name updates

### 3. Improve error messages
- **Status**: Not Started
- **Description**: Replace generic `alert()` calls with styled notification system
- **Locations**: Multiple places using `alert()` throughout codebase
- **Tasks**:
  - [ ] Audit all `alert()` calls (found ~20+)
  - [ ] Replace with `showNotification()` system
  - [ ] Add contextual error messages
  - [ ] Implement error recovery suggestions

### 4. Add username uniqueness check BEFORE signup
- **Status**: Partially Implemented
- **Location**: `emailSignUp()` function (line 9710)
- **Description**: Check availability as user types, not after they submit
- **Current**: Checks after form submission
- **Tasks**:
  - [ ] Add real-time username availability check
  - [ ] Show green checkmark when available
  - [ ] Show red X when taken
  - [ ] Add debouncing to prevent excessive DB queries
  - [ ] Display suggested alternatives if taken

---

## 🟡 Medium Priority - Game Mechanics

### 1. Thug Loss System (Crew Exits) - Personality-Driven Event Engine
- **Status**: Not Started
- **Priority**: MEDIUM - Adds depth and unpredictability to gameplay
- **Description**: A lightweight event system that occasionally removes crew members (thugs, hoes) with snarky story beats and silver linings. Makes the game feel more alive and dynamic with personality-driven exits.

#### What This Is:
A personality-driven event engine that:
- Occasionally removes a thug (sometimes a ho, car, or cash too)
- Delivers the loss with a snarky, memeable story beat
- Always includes a twist/silver lining (intel, PR boost, blueprint, vendor unlock, etc.)
- Offers mitigation choices (pay to negotiate, train, mediate)
- Keeps gameplay unpredictable and engaging

#### When It Happens (Frequency):

**Base Trigger:**
- Every **10 turns** spent, roll a check with **21% base chance**
- Multiple blocks at once = multiple rolls (e.g., spending 27 turns = 2 rolls)
- Cooldown of **8 turns** after an exit (prevents back-to-back spam)
- Pity timer: After **60 turns** (6 blocks) with no event, next roll gets **+50% chance** (capped at 75%)

**Tracking Variable:**
```javascript
gameState.crew.turnsSinceLastLossRoll = 0; // Increment as turns are spent
gameState.crew.lastLossEventTime = Date.now(); // For cooldown
gameState.crew.blocksWithoutLossEvent = 0; // For pity timer
```

**Probability Modifiers:**
- **Heat scaling**:
  - Heat ≥ 69% → multiply chance by **1.15**
  - Heat ≤ 20% → multiply by **0.85**
- **Morale/Loyalty scaling**:
  - Avg crew morale ≤ -3 OR loyalty < 50% → multiply by **1.25**
- **Clamp final probability to [0.05, 0.75]** (never below 5%, never above 75%)

#### Why It Happens (Selection Logic):

**Personality-Based Reasons (Weighted Selection):**

Each reason has:
- **Weight** (probability of being selected)
- **Context flags** (conditions that must be met)
- **Bad effects** (what you lose)
- **Silver linings** (what you gain)
- **Mitigation option** (cost and success chance)

**Example Exit Reasons:**

1. **"Professional Spreadsheet Papi"** (Weight: 15)
   - **Context**: No recent charity event
   - **Story**: "Clown just called Professional *Spreadsheet Papi*. One thug walked."
   - **Loss**: 1 thug
   - **Silver lining**: +5 respect (street cred for being organized)
   - **Mitigation**: Pay 3 turns for "Team Building" (70% success)

2. **"Kia Boys Got My Ride"** (Weight: 10)
   - **Context**: Player has at least 1 car
   - **Story**: "Kia Boys struck. Lost a whip but word on the street is they're recruiting."
   - **Loss**: 1 vehicle
   - **Silver lining**: Unlock "Kia Boys Vendor" (cheap stolen cars)
   - **Mitigation**: Pay $5k + 2 turns for "GPS Tracker Recovery" (50% success)

3. **"Loyalty Issues"** (Weight: 20)
   - **Context**: Thug happiness < 60%
   - **Story**: "Your thug said 'This ain't it, chief' and bounced. Left you some intel though."
   - **Loss**: 1 thug
   - **Silver lining**: Gain "Hood Intel" blueprint (reveals rival locations)
   - **Mitigation**: Pay $10k for "Retention Bonus" (80% success)

4. **"Clout Chasing Exit"** (Weight: 12)
   - **Context**: Player has high respect (>500)
   - **Story**: "One of your hoes went viral on OnlyTramps. She's solo now but tagged you (PR +10)."
   - **Loss**: 1 hoe
   - **Silver lining**: +10 respect, -5% heat (good publicity)
   - **Mitigation**: Pay 5 turns for "Contract Negotiation" (60% success)

5. **"Raid Aftermath"** (Weight: 8)
   - **Context**: Recent police raid event
   - **Story**: "Post-raid paranoia. Lost a thug and some cash, but heat cooled off."
   - **Loss**: 1 thug, 10% of cash
   - **Silver lining**: -15% heat
   - **Mitigation**: Pay $20k for "Legal Defense Fund" (75% success)

6. **"Romantic Drama"** (Weight: 18)
   - **Context**: Player has both hoes and thugs
   - **Story**: "Office romance gone wrong. Lost a thug AND a ho but they left you their stash."
   - **Loss**: 1 thug, 1 hoe
   - **Silver lining**: +$15k, +10 crack, +20 weed
   - **Mitigation**: Pay 4 turns for "HR Mediation" (65% success)

7. **"Got That Bag Syndrome"** (Weight: 10)
   - **Context**: Player has > $100k cash
   - **Story**: "Thug hit a lick on his own. He gone but dropped you a connect."
   - **Loss**: 1 thug, $25k
   - **Silver lining**: Unlock "Discount Supplier" (15% off all supplies)
   - **Mitigation**: None (it already happened)

8. **"Went Legit"** (Weight: 5)
   - **Context**: Low heat (< 30%)
   - **Story**: "One thug enrolled in community college. Respect to him tbh."
   - **Loss**: 1 thug
   - **Silver lining**: +3 respect, -3% heat
   - **Mitigation**: Pay $5k for "Tuition Reimbursement" (keeps thug, 90% success)

**Total Weights: 98** (can add more to reach 100)

#### How to Integrate:

**Step 1: Track Turn Spending**
```javascript
function spendTurns(amount) {
  gameState.crew.turnsSinceLastLossRoll += amount;

  // Check for loss events every 10 turns
  const blocksToCheck = Math.floor(gameState.crew.turnsSinceLastLossRoll / 10);

  for (let i = 0; i < blocksToCheck; i++) {
    checkForCrewLossEvent();
  }

  // Keep remainder
  gameState.crew.turnsSinceLastLossRoll %= 10;
}
```

**Step 2: Roll for Loss Event**
```javascript
function checkForCrewLossEvent() {
  // Check cooldown
  const timeSinceLast = Date.now() - (gameState.crew.lastLossEventTime || 0);
  const cooldownPassed = timeSinceLast > (8 * turnDuration); // 8 turns worth

  if (!cooldownPassed) return;

  // Calculate effective probability
  let baseProbability = 0.21;

  // Heat modifier
  if (gameState.player.heat >= 0.69) {
    baseProbability *= 1.15;
  } else if (gameState.player.heat <= 0.20) {
    baseProbability *= 0.85;
  }

  // Morale/Loyalty modifier
  const avgMorale = calculateAverageMorale();
  const avgLoyalty = calculateAverageLoyalty();
  if (avgMorale <= -3 || avgLoyalty < 50) {
    baseProbability *= 1.25;
  }

  // Pity timer (after 6 blocks with no event)
  gameState.crew.blocksWithoutLossEvent++;
  if (gameState.crew.blocksWithoutLossEvent >= 6) {
    baseProbability *= 1.5;
  }

  // Clamp to [0.05, 0.75]
  baseProbability = Math.max(0.05, Math.min(0.75, baseProbability));

  // Roll the dice
  if (Math.random() < baseProbability) {
    triggerCrewLossEvent();
    gameState.crew.lastLossEventTime = Date.now();
    gameState.crew.blocksWithoutLossEvent = 0;
  }
}
```

**Step 3: Select and Fire Event**
```javascript
function triggerCrewLossEvent() {
  // Filter eligible reasons based on context
  const eligibleReasons = CREW_LOSS_REASONS.filter(reason => {
    return reason.contextCheck(gameState);
  });

  // Weighted random selection
  const selectedReason = weightedRandom(eligibleReasons);

  // Show modal with story, effects, and mitigation option
  showCrewLossModal(selectedReason);
}
```

**Step 4: Present Modal**
```javascript
function showCrewLossModal(reason) {
  const modal = `
    <div class="crew-loss-modal">
      <h2>🚨 Crew Exit: ${reason.title}</h2>
      <p class="story">${reason.storyText}</p>

      <div class="effects">
        <div class="bad-effects">
          <strong>Lost:</strong> ${formatLosses(reason.losses)}
        </div>
        <div class="silver-lining">
          <strong>Silver Lining:</strong> ${formatGains(reason.silverLining)}
        </div>
      </div>

      ${reason.mitigation ? `
        <button onclick="attemptMitigation('${reason.id}')">
          ${reason.mitigation.buttonText}
          (Cost: ${reason.mitigation.cost}, ${reason.mitigation.successRate}% success)
        </button>
      ` : ''}

      <button onclick="acceptCrewLoss('${reason.id}')">
        Let 'Em Go
      </button>
    </div>
  `;

  // Show modal and log to feed
  displayModal(modal);
  addToFeed(reason.feedText);
}
```

#### UX Guidelines:

**Modal Design:**
- Keep story text to **1-2 lines max** (punchy and memeable)
- **Bold** key action verbs ("Pay Stipend", "Mediation", "Let 'Em Go")
- Show costs clearly (turns, cash, or both)
- Display success percentage for mitigation attempts
- Always show both bad effects AND silver linings
- Use color coding: Red for losses, Green for gains

**Feed Integration:**
- Post to combat/event log with snarky one-liner
- Make it shareable/memeable
- Example: "Clown just called Professional *Spreadsheet Papi*. One of 'em walked. +5 Respect tho."

**Notification Style:**
- Use styled notifications, not plain alerts
- Icon variations: 🚨 for losses, ✨ for silver linings
- Sound effect (optional): Cash register "cha-ching" for gains, "whomp whomp" for losses

#### Implementation Tasks:

- [ ] **Create data structure for crew loss reasons**
  - [ ] Define CREW_LOSS_REASONS array with all exit scenarios
  - [ ] Add weights, context checks, effects, silver linings
  - [ ] Write snarky story text for each (20-30 reasons total)
  - [ ] Define mitigation options with costs and success rates

- [ ] **Add tracking variables to gameState**
  - [ ] `gameState.crew.turnsSinceLastLossRoll`
  - [ ] `gameState.crew.lastLossEventTime`
  - [ ] `gameState.crew.blocksWithoutLossEvent`
  - [ ] Initialize on new game, load from save

- [ ] **Implement probability system**
  - [ ] Create `checkForCrewLossEvent()` function
  - [ ] Add heat-based probability modifiers
  - [ ] Add morale/loyalty-based modifiers
  - [ ] Implement pity timer logic
  - [ ] Clamp probability to [0.05, 0.75]

- [ ] **Integrate with turn spending**
  - [ ] Hook into all turn-spending actions
  - [ ] Track 10-turn blocks
  - [ ] Trigger multiple rolls for multi-block spends
  - [ ] Keep remainder after division

- [ ] **Build event selection system**
  - [ ] Filter reasons by context flags
  - [ ] Implement weighted random selection
  - [ ] Fallback if no eligible reasons exist

- [ ] **Create crew loss modal UI**
  - [ ] Design modal layout (story + effects + buttons)
  - [ ] Style with appropriate colors and icons
  - [ ] Add mitigation button (conditional)
  - [ ] Add "Let 'Em Go" button (always)
  - [ ] Make mobile-friendly

- [ ] **Implement mitigation system**
  - [ ] Create `attemptMitigation()` function
  - [ ] Roll success/failure based on percentage
  - [ ] Deduct costs (turns, cash) on attempt
  - [ ] Show success or failure notification
  - [ ] Apply/prevent losses based on outcome

- [ ] **Apply effects system**
  - [ ] Lose crew members (thugs, hoes)
  - [ ] Lose cash, vehicles, resources
  - [ ] Grant silver linings (respect, intel, unlocks)
  - [ ] Update gameState accordingly
  - [ ] Save state after event

- [ ] **Add vendor/blueprint unlocks**
  - [ ] Create "unlocked vendors" system
  - [ ] Store unlocked blueprints in gameState
  - [ ] Show new vendors in shop after unlock
  - [ ] Add discount flags for special vendors

- [ ] **Feed/log integration**
  - [ ] Post snarky one-liner to combat log
  - [ ] Format with icons and colors
  - [ ] Make shareable (future feature)

- [ ] **Cooldown system**
  - [ ] Prevent events within 8 turns of last event
  - [ ] Visual indicator if needed (optional)

- [ ] **Testing & Balancing**
  - [ ] Test probability calculations
  - [ ] Verify turn tracking across multiple actions
  - [ ] Test all exit scenarios
  - [ ] Balance losses vs silver linings
  - [ ] Tune weights so variety is good
  - [ ] Test mitigation success rates
  - [ ] Ensure pity timer works

- [ ] **Write content**
  - [ ] 20-30 unique exit scenarios
  - [ ] Snarky, memeable story text
  - [ ] Varied silver linings (not repetitive)
  - [ ] Creative mitigation options

#### Technical Considerations:
- Store all reasons in GameConstants.js for easy tuning
- Use weighted random selection (not pure random)
- Context checks should be simple boolean functions
- Mitigation should always feel like a meaningful choice
- Silver linings should make losses sting less
- Cooldown prevents frustration from rapid-fire losses
- Pity timer ensures content variety (everyone sees events)

#### Balancing Philosophy:
- Losses should sting but not be catastrophic
- Silver linings should be meaningful and varied
- Mitigation should succeed ~60-80% of the time (feels good)
- High-cost mitigations should have higher success rates
- Some events have no mitigation (already happened) for variety
- Pity timer ensures all players experience the content

#### Future Enhancements:
- Track which exit reasons each player has seen
- Rare "legendary" exits with unique unlocks
- Seasonal/event-specific exit reasons
- Player choices that affect future exit probabilities
- Crew member loyalty system affecting exit chances
- "Rehire" option for favorite crew members

#### Estimated Time:
- Data structure & content writing: 3-4 hours (20-30 scenarios)
- Probability & tracking system: 2-3 hours
- Modal UI design: 2-3 hours
- Mitigation system: 1-2 hours
- Effects application: 1-2 hours
- Testing & balancing: 2-3 hours
- **Total**: 11-17 hours

---

### 2. Advanced PvP Combat System: "The Science of Pimpology"
- **Status**: Not Started (Future Feature - Post-MVP)
- **Priority**: MEDIUM - Core multiplayer endgame content
- **Description**: Real crew-vs-crew warfare where you can steal hoes, thugs, and resources from other players. Introduces strategic depth through morale warfare, crew poaching, and territorial control. This is the "science of pimpology" - attacking crews systematically to weaken and steal their assets.

#### Current State (PvE):
- Fight Hood Pimps (NPCs)
- Steal cash, drugs, respect
- No crew stealing mechanics
- No morale/happiness warfare
- Single-player focused

#### Future State (PvP):
**Multi-phase combat where you:**
1. **Weaken** their operation (steal drugs, damage morale)
2. **Poach** their crew (steal unhappy hoes/thugs)
3. **Dominate** their territory (take control of their corners)
4. **Absorb** their empire (full takeover)

---

## 🎯 The Science of Pimpology: Core Mechanics

### Phase 1: Reconnaissance & Target Selection

**Choose Your Target:**
- Browse list of rival pimps (real players)
- See their visible stats:
  - District & Territory
  - Crew size (hoes/thugs count)
  - Estimated power level
  - Recent activity (active/inactive)
  - Territory control (how many corners)
- Can't see: Cash, exact morale, detailed inventory

**Intel Gathering (Optional):**
- Spend turns/cash to scout target
- Reveals: Crew morale %, happiness levels, defenses
- Better intel = better targeting

---

### Phase 2: Strategic Warfare Options

**Option A: Resource Raid (Current System)**
- Steal cash, drugs, supplies
- SIDE EFFECT: Damages target's crew morale
- Formula: `Morale Loss = (Resources Stolen / Total Resources) * 15%`
- Example: Steal 50% of their crack → -7.5% morale to their crew

**Option B: Supply Line Sabotage (NEW)**
- Destroy their supplies (beer, condoms, medicine)
- Direct morale hit: -10% to -25% based on amount destroyed
- Makes their crew unhappier
- Costs turns, no direct loot gain
- Purpose: Soften them up for crew poaching

**Option C: Crew Poaching Raid (NEW - THE BIG ONE)**
- Directly attack to steal hoes/thugs
- Success rate depends on:
  - **Target's crew morale** (lower = easier)
  - **Your charisma/respect** (higher = easier)
  - **Their defenses** (thugs, weapons, security)
  - **Crew happiness differential** (your crew vs theirs)

---

## 🧮 Crew Poaching Math: "The Science"

### Base Poaching Success Formula:

```javascript
// Step 1: Calculate target's crew vulnerability
const targetVulnerability = calculateCrewVulnerability(target);

// Step 2: Calculate your poaching power
const yourPoachingPower = calculatePoachingPower(attacker);

// Step 3: Calculate defense modifier
const defenseModifier = calculateDefenseModifier(target);

// Step 4: Final success rate
const poachSuccessRate = (yourPoachingPower / targetVulnerability) * defenseModifier;

// Clamp to [5%, 85%] (never guaranteed, never impossible)
const finalRate = Math.max(0.05, Math.min(0.85, poachSuccessRate));
```

### Target Vulnerability Calculation:

```javascript
function calculateCrewVulnerability(target) {
  let vulnerability = 1.0; // Base

  // 1. MORALE FACTOR (HUGE IMPACT)
  const avgMorale = (target.hoeHappiness + target.thugHappiness) / 2;

  if (avgMorale <= 30) {
    vulnerability *= 2.5; // Very unhappy = very vulnerable
  } else if (avgMorale <= 50) {
    vulnerability *= 1.8; // Unhappy = vulnerable
  } else if (avgMorale <= 70) {
    vulnerability *= 1.2; // Neutral = slight vulnerability
  } else if (avgMorale >= 90) {
    vulnerability *= 0.6; // Very happy = very loyal
  }

  // 2. SUPPLY DEPRIVATION
  const hasSupplies = target.beer > 10 && target.condoms > 20 && target.medicine > 5;
  if (!hasSupplies) {
    vulnerability *= 1.4; // No supplies = crew is suffering
  }

  // 3. RECENT LOSSES
  if (target.recentlyRaided) { // Within last 24 hours
    vulnerability *= 1.3; // Demoralized from recent attack
  }

  // 4. INACTIVE PIMP
  const daysSinceActive = (Date.now() - target.lastActiveTime) / (1000 * 60 * 60 * 24);
  if (daysSinceActive > 3) {
    vulnerability *= 1.5; // Abandoned crew = easy pickings
  }

  // 5. CREW SIZE (smaller = easier to flip individuals)
  if (target.totalCrew < 20) {
    vulnerability *= 1.2;
  } else if (target.totalCrew > 100) {
    vulnerability *= 0.9; // Large crew = harder to flip
  }

  return vulnerability;
}
```

### Your Poaching Power Calculation:

```javascript
function calculatePoachingPower(attacker) {
  let power = 1.0; // Base

  // 1. RESPECT/CHARISMA (Your reputation matters)
  const respectBonus = Math.min(attacker.respect / 1000, 2.0);
  power *= (1 + respectBonus);

  // 2. YOUR CREW HAPPINESS (Happy crew = attractive to others)
  const avgMorale = (attacker.hoeHappiness + attacker.thugHappiness) / 2;

  if (avgMorale >= 90) {
    power *= 1.5; // Your crew is thriving = desirable to join
  } else if (avgMorale >= 70) {
    power *= 1.2;
  } else if (avgMorale <= 50) {
    power *= 0.8; // Your crew is unhappy = less attractive
  }

  // 3. BETTER OFFER (Resources to offer recruits)
  const cashOffer = attacker.cash > 100000 ? 1.3 : 1.0;
  const suppliesOffer = (attacker.beer > 50 && attacker.condoms > 200) ? 1.2 : 1.0;
  power *= cashOffer * suppliesOffer;

  // 4. DISTRICT BONUS (Operating in same district = easier)
  if (attacker.district === target.district) {
    power *= 1.3; // Same district = know the crew, easier to flip
  }

  // 5. LEVEL/EXPERIENCE
  if (attacker.level >= 10) {
    power *= 1.2; // Experienced pimp = better recruiter
  }

  return power;
}
```

### Defense Modifier Calculation:

```javascript
function calculateDefenseModifier(target) {
  let defense = 1.0; // Base

  // 1. SECURITY LEVEL (Thugs)
  const thugRatio = target.thugs / Math.max(target.hoes, 1);

  if (thugRatio >= 1.5) {
    defense *= 0.6; // Heavy security = hard to poach
  } else if (thugRatio >= 1.0) {
    defense *= 0.8;
  } else if (thugRatio < 0.5) {
    defense *= 1.3; // Light security = easy target
  }

  // 2. WEAPONS & EQUIPMENT
  const totalWeapons = target.weapons.pistols + target.weapons.shotguns +
                       target.weapons.tek9s + target.weapons.ak47s;

  if (totalWeapons > 50) {
    defense *= 0.7; // Well-armed = intimidating
  } else if (totalWeapons < 10) {
    defense *= 1.2; // Lightly armed = vulnerable
  }

  // 3. TERRITORY CONTROL
  if (target.cornersControlled >= 5) {
    defense *= 0.85; // Established = harder to raid
  }

  // 4. CREW SIZE (Bigger = harder to hide poaching)
  if (target.totalCrew > 200) {
    defense *= 1.1; // Large crew = easier to poach individuals unnoticed
  }

  return defense;
}
```

---

## 🎯 Attack Flow: Crew Poaching Raid

### Step 1: Target Selection
```
Player selects rival pimp from list
  ↓
Shows target's visible stats + estimated difficulty
  ↓
Option to spend 5 turns + $10k for "Intel Report"
  ↓
Intel reveals: Crew morale, happiness, supplies, defenses
```

### Step 2: Attack Type Selection
```
Choose attack type:
  [Resource Raid] - Steal cash/drugs (damages morale)
  [Supply Sabotage] - Destroy supplies (direct morale hit)
  [Crew Poaching] - Steal hoes/thugs (requires low morale)
  [Full Assault] - All of the above (high risk, high reward)
```

### Step 3: Crew Poaching Execution
```
IF crew morale < 70%:
  Calculate poaching success rate
    ↓
  Show modal: "Poach {Target}'s Crew?"
    - Estimated success: 45%
    - Cost: 15 turns, $25k
    - Potential gain: 3-8 hoes, 1-4 thugs
    - Risk: Retaliation, heat increase
    ↓
  Player confirms
    ↓
  Roll for success
    ↓
  IF SUCCESS:
    - Steal hoes/thugs (move to your crew)
    - Gain respect (+10 to +30)
    - Target's morale drops further (-10%)
    - Target gets notification + chance to retaliate
    ↓
  IF FAILURE:
    - Lose some cash/respect
    - Target's crew morale increases (+5% - rallied by loyalty)
    - Your reputation takes small hit
    - Still spend turns/cash
```

### Step 4: Post-Attack Effects

**On Target:**
- Crew morale decreases
- May trigger "crew exit" events
- Can retaliate within 48 hours
- Gets defensive buffs for 24 hours

**On Attacker:**
- Gain stolen crew members
- Must integrate new crew (happiness starts at 50%)
- Gain respect if successful
- Heat increases (+5% to +15%)
- Target added to "Rivals" list

---

## 🧪 Morale Warfare: The Strategic Layer

### Softening Up a Target (Multi-Phase Strategy):

**Phase 1: Resource Depletion**
- Raid their drug stash repeatedly
- Each raid: -3% to -7% morale
- 3-4 raids → morale drops to ~60%

**Phase 2: Supply Line Cut**
- Sabotage their supplies
- Direct hit: -10% to -15% morale
- Now at ~45% morale

**Phase 3: Psychological Warfare**
- Send threatening messages (future feature)
- Steal their vehicles (flex)
- Attack their territories
- Morale now at ~30%

**Phase 4: Crew Poaching**
- At 30% morale, poaching success rate is ~65-75%
- Steal their best hoes/thugs
- Remaining crew morale crashes to ~15%

**Phase 5: Territory Takeover**
- With no crew/morale, they can't defend
- Take their corners
- Absorb their entire operation

---

## 🛡️ Defense Strategies

### Protecting Your Crew:

**1. Maintain High Morale**
- Keep happiness above 80% always
- Regular supply purchases (beer, condoms, medicine)
- Avoid resource depletion
- Treat crew well (high payout %)

**2. Heavy Security**
- Maintain 1:1 or higher thug-to-hoe ratio
- Stockpile weapons
- Upgrade security (future: security upgrades)

**3. Active Play**
- Log in daily to prevent "abandoned" status
- Monitor rival activity
- Retaliate quickly

**4. Alliance/Crew System**
- Join a crew (future feature)
- Crew members can help defend
- Shared resources and intelligence

**5. Territory Fortification**
- Control multiple corners (harder to raid)
- Establish dominance in district
- Build reputation (high respect = intimidating)

---

## 🔄 Retaliation & Revenge System

### After Being Attacked:

**Immediate Options:**
1. **Counter-Raid** (revenge attack within 48 hours)
   - 50% discount on turn cost
   - +20% success rate bonus (anger fuels you)
   - Can target same player without cooldown

2. **Fortify Defenses**
   - Emergency crew morale boost ($50k for +20% happiness)
   - Hire mercenary thugs temporarily
   - Lock down operations (prevent further attacks for 24 hours, costs turns)

3. **Call for Backup** (if in crew)
   - Crew members can contribute to defense
   - Shared retaliation attack
   - Pool resources for counter-offensive

### Rivalry System:

**Escalation Levels:**
- **Level 1: Tension** - 1 attack → normal mechanics
- **Level 2: Conflict** - 3+ attacks → both get intel discounts vs each other
- **Level 3: War** - 10+ attacks → reduced cooldowns, higher stakes
- **Level 4: Vendetta** - 25+ attacks → special "Turf War" mode unlocks

---

## 📊 Crew Integration After Poaching

### New Recruits Start Weak:

**Stolen hoes/thugs have:**
- **50% starting happiness** (unhappy about being poached)
- **Low loyalty** (50%, can be re-stolen)
- **-10% productivity** for first 48 hours (adjustment period)

**Building Loyalty:**
- Provide supplies (beer, condoms, medicine)
- Pay good payout %
- Give time (happiness increases +5% per day)
- After 7 days at 80%+ happiness → Loyalty locks to 90% (can't be easily re-stolen)

**Risk:**
- If you don't treat them well, they'll leave (crew exit event)
- Or worse: They'll go back to their original pimp
- Or even worse: They'll join a rival crew

---

## 🎮 UI/UX Design

### PvP Attack Screen:

```
┌─────────────────────────────────────────┐
│ 🎯 RIVAL PIMPS                          │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ 👤 BigDaddy420                      │ │
│ │ 🏙️ Crooklyn - Bedford Ave          │ │
│ │ 👥 Crew: 45 hoes, 30 thugs          │ │
│ │ ⚡ Power: Medium                    │ │
│ │ 🕐 Last active: 2 hours ago         │ │
│ │                                     │ │
│ │ [Scout] [Attack] [View Profile]    │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 👤 QueenB                           │ │
│ │ 🏙️ Uptown Plaza - Stadium Block    │ │
│ │ 👥 Crew: 120 hoes, 85 thugs         │ │
│ │ ⚡ Power: HIGH                      │ │
│ │ 🕐 Last active: 30 mins ago         │ │
│ │ ⚠️ Crew morale: LOW (Intel)        │ │
│ │                                     │ │
│ │ [Scout] [Attack] [View Profile]    │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Attack Modal:

```
┌─────────────────────────────────────────┐
│ 🎯 Attack QueenB                        │
├─────────────────────────────────────────┤
│ Target Intel:                           │
│ • Crew Morale: 35% (VULNERABLE)         │
│ • Security: 85 thugs (Medium)           │
│ • Supplies: LOW                         │
│ • Weapons: 15 total                     │
├─────────────────────────────────────────┤
│ Choose Attack Type:                     │
│                                         │
│ 🎰 [Resource Raid]                      │
│    Steal cash/drugs                     │
│    Cost: 10 turns, $5k                  │
│    Morale hit: -5%                      │
│                                         │
│ 💥 [Supply Sabotage]                    │
│    Destroy supplies                     │
│    Cost: 8 turns, $10k                  │
│    Morale hit: -15%                     │
│                                         │
│ 👥 [CREW POACHING] ⭐                   │
│    Steal hoes/thugs                     │
│    Cost: 15 turns, $25k                 │
│    Success Rate: 68%                    │
│    Est. Gain: 5-12 hoes, 2-6 thugs     │
│    Risk: Retaliation, +10% heat         │
│                                         │
│ [Cancel] [EXECUTE ATTACK]               │
└─────────────────────────────────────────┘
```

---

## 📋 Implementation Tasks

### Core Systems:

- [ ] **PvP Target Selection System**
  - [ ] Create "Rivals" list (shows other players)
  - [ ] Add filters (district, power level, activity, morale)
  - [ ] Implement search by player name
  - [ ] Show visible stats (crew size, territory, power)
  - [ ] Hide sensitive stats (cash, exact morale) unless scouted

- [ ] **Intel/Scouting System**
  - [ ] Create "Scout Player" function (costs turns + cash)
  - [ ] Reveals: Crew morale %, happiness, supplies, defenses, weapons
  - [ ] Intel expires after 24 hours
  - [ ] Store scouted data per player

- [ ] **Crew Vulnerability Calculation**
  - [ ] Implement `calculateCrewVulnerability()` function
  - [ ] Factor in morale, supplies, recent losses, inactivity, crew size
  - [ ] Return vulnerability multiplier (0.5x to 3.0x)

- [ ] **Poaching Power Calculation**
  - [ ] Implement `calculatePoachingPower()` function
  - [ ] Factor in respect, crew happiness, cash/supplies, district, level
  - [ ] Return power multiplier (0.5x to 3.0x)

- [ ] **Defense Modifier Calculation**
  - [ ] Implement `calculateDefenseModifier()` function
  - [ ] Factor in thug ratio, weapons, territory control, crew size
  - [ ] Return defense multiplier (0.5x to 1.5x)

- [ ] **Final Success Rate Calculation**
  - [ ] Combine vulnerability, power, and defense
  - [ ] Clamp to [5%, 85%]
  - [ ] Display to player before attack

- [ ] **Attack Type Selection UI**
  - [ ] Resource Raid option
  - [ ] Supply Sabotage option
  - [ ] Crew Poaching option (only if morale < 70%)
  - [ ] Full Assault option (combines all three)
  - [ ] Show costs, success rates, estimated gains

- [ ] **Crew Poaching Execution**
  - [ ] Deduct turns + cash
  - [ ] Roll for success based on calculated rate
  - [ ] If success: Transfer hoes/thugs to attacker
  - [ ] If failure: Minor penalties (respect, cash loss)
  - [ ] Apply morale changes to both parties
  - [ ] Log event to both players' feeds

- [ ] **Stolen Crew Integration System**
  - [ ] Set stolen crew happiness to 50%
  - [ ] Set loyalty to 50%
  - [ ] Apply -10% productivity debuff
  - [ ] Gradual happiness increase (+5% per day)
  - [ ] Loyalty lock at 90% after 7 days at 80%+ happiness

- [ ] **Morale Impact System**
  - [ ] Resource raid → -3% to -7% morale
  - [ ] Supply sabotage → -10% to -15% morale
  - [ ] Crew poaching → -10% morale to target
  - [ ] Failed defense → +5% morale (rallied)

- [ ] **Retaliation System**
  - [ ] Track "last attacked by" and timestamp
  - [ ] Enable revenge attacks within 48 hours
  - [ ] 50% turn discount for revenge
  - [ ] +20% success bonus for revenge
  - [ ] No cooldown on revenge attacks

- [ ] **Rivalry Tracking**
  - [ ] Track attack count between players
  - [ ] Escalation levels (Tension → Conflict → War → Vendetta)
  - [ ] Unlock special mechanics at higher levels
  - [ ] Display rivalry status in UI

- [ ] **Defense Options**
  - [ ] Emergency morale boost ($50k for +20% happiness)
  - [ ] Hire mercenary thugs (temporary defense)
  - [ ] Lockdown mode (24-hour immunity, costs turns)
  - [ ] Call crew for backup (if in crew)

- [ ] **Notifications System**
  - [ ] Notify when attacked
  - [ ] Notify when crew is poached
  - [ ] Notify when retaliation window opens
  - [ ] Notify when rivalry escalates

- [ ] **PvP UI Design**
  - [ ] Rivals list screen
  - [ ] Attack modal with intel display
  - [ ] Success/failure results modal
  - [ ] Rivalry tracker UI
  - [ ] Defense options UI

### Database & Backend:

- [ ] **Add PvP fields to player schema**
  - [ ] Last active timestamp
  - [ ] Crew morale/happiness
  - [ ] Scouted intel (temporary data)
  - [ ] Rivalries array
  - [ ] Attack history log

- [ ] **Real-time attack system**
  - [ ] Queue attacks for processing
  - [ ] Notify target in real-time (or next login)
  - [ ] Handle concurrent attacks
  - [ ] Prevent abuse (rate limiting)

- [ ] **Leaderboards & Rankings**
  - [ ] Most successful raids
  - [ ] Most crew poached
  - [ ] Biggest rivalries
  - [ ] Territory control rankings

### Balancing & Testing:

- [ ] **Test poaching math with various scenarios**
  - [ ] High morale target (should be hard)
  - [ ] Low morale target (should be easy)
  - [ ] Balanced matchup
  - [ ] Overpowered attacker
  - [ ] Underpowered attacker

- [ ] **Balance cost vs reward**
  - [ ] Poaching cost (turns/cash) feels fair
  - [ ] Stolen crew value is worth the risk
  - [ ] Failure penalties aren't too harsh

- [ ] **Test retaliation loop**
  - [ ] Ensure revenge mechanics feel good
  - [ ] Prevent infinite retaliation spiral
  - [ ] Test cooldowns and windows

- [ ] **Anti-griefing measures**
  - [ ] Prevent targeting same player repeatedly
  - [ ] Protect new players (immunity for first week?)
  - [ ] Limit attacks per day on same target
  - [ ] Bracket players by power level

---

## 🎯 Design Philosophy

### "The Science of Pimpology" Principles:

1. **Morale is King**: Unhappy crew = vulnerable crew
2. **Strategic Depth**: Multi-phase warfare (weaken → poach → dominate)
3. **Risk vs Reward**: Big gains require big risks
4. **Retaliation is Encouraged**: Revenge should feel satisfying
5. **Defense Matters**: Active players can protect themselves
6. **Not Pay-to-Win**: Skill and strategy > just money
7. **Social Dynamics**: Crews, alliances, rivalries add depth

### Avoid These Pitfalls:

- **Don't make it too grindy**: One player shouldn't be able to infinitely grief another
- **Don't make it too easy**: Poaching should be earned, not automatic
- **Don't ignore defense**: Defenders need tools to fight back
- **Don't create death spirals**: Losing shouldn't make you lose forever

---

## ⏱️ Estimated Time

**Phase 1 (Core Poaching Mechanics):**
- Vulnerability/Power/Defense calculations: 3-4 hours
- Attack flow & UI: 4-5 hours
- Crew integration system: 2-3 hours
- **Subtotal**: 9-12 hours

**Phase 2 (Retaliation & Rivalry):**
- Retaliation system: 2-3 hours
- Rivalry tracking: 2-3 hours
- Defense options: 2-3 hours
- **Subtotal**: 6-9 hours

**Phase 3 (PvP UI & Polish):**
- Rivals list screen: 3-4 hours
- Attack modals: 2-3 hours
- Notifications: 2-3 hours
- **Subtotal**: 7-10 hours

**Phase 4 (Backend & Database):**
- Schema updates: 2-3 hours
- Real-time attack system: 4-5 hours
- Leaderboards: 2-3 hours
- **Subtotal**: 8-11 hours

**Phase 5 (Testing & Balancing):**
- Math testing: 3-4 hours
- Balance tuning: 4-5 hours
- Anti-griefing measures: 2-3 hours
- **Subtotal**: 9-12 hours

**TOTAL ESTIMATE: 39-54 hours**

---

## 🚀 Future Enhancements

- **Territory Control PvP**: Fight for and hold specific territories
- **Crew Alliances**: Team up with other players
- **Turf Wars**: Large-scale crew-vs-crew battles
- **Mercenary Market**: Hire other players' thugs temporarily
- **Bounty System**: Place bounties on rival pimps
- **Insurance System**: Protect crew from being poached (for a fee)
- **Crew Training**: Train crew to resist poaching
- **Legendary Crew Members**: Special hoes/thugs with unique abilities

---

---

### 3. Fix Turn System Integrity (Server-Side Turn Accrual)
- **Status**: Critical Bug - Needs Immediate Attention
- **Priority**: HIGH - Core game mechanic is broken
- **Description**: Turns are not accruing correctly at the server level. Sometimes they don't regenerate properly, sometimes they disappear. Need to ensure server-authoritative turn tracking with proper validation and recovery.

#### Current Problems:
- Turns sometimes don't accrue when they should
- Turns occasionally disappear or reset incorrectly
- Client and server turn counts can desync
- Turn regeneration might not be happening server-side
- No recovery mechanism when turns go wrong

#### Root Causes to Investigate:

**1. Server-Side Turn Generation**
- Is turn accrual happening server-side or just client-side?
- Are turns being calculated based on last save time correctly?
- Does server validate turn counts or trust client?

**2. Race Conditions**
- Multiple actions spending turns simultaneously
- Save/load conflicts overwriting turn data
- Client sending turn updates while server is calculating

**3. Database Sync Issues**
- Turn count not being saved properly to Supabase
- Stale data being loaded from database
- Turn updates not persisting between sessions

**4. Time Calculation Bugs**
- Timezone issues affecting turn regeneration
- Clock drift between client and server
- Incorrect time delta calculations

#### Proposed Solution: Server-Authoritative Turn System

### Core Principle: **NEVER TRUST THE CLIENT**

```javascript
// SERVER-SIDE TURN CALCULATION (Supabase Edge Function or equivalent)

async function getPlayerTurns(playerId) {
  // 1. Fetch player data from database (source of truth)
  const player = await supabase
    .from('players')
    .select('*')
    .eq('id', playerId)
    .single();

  // 2. Calculate turns since last check (SERVER TIME ONLY)
  const now = new Date(); // SERVER timestamp
  const lastCheck = new Date(player.last_turn_update);
  const timeDelta = (now - lastCheck) / 1000; // seconds

  // 3. Calculate accrued turns
  const turnsAccrued = Math.floor(timeDelta / TURN_REGEN_RATE); // e.g., 1 turn per 5 minutes = 300 seconds

  // 4. Add accrued turns, cap at max
  const newTurnCount = Math.min(
    player.turns + turnsAccrued,
    player.max_turns || 200
  );

  // 5. Update database with new count and timestamp
  await supabase
    .from('players')
    .update({
      turns: newTurnCount,
      last_turn_update: now.toISOString()
    })
    .eq('id', playerId);

  return newTurnCount;
}

async function spendTurns(playerId, amount) {
  // 1. Get current turns (server-calculated)
  const currentTurns = await getPlayerTurns(playerId);

  // 2. Validate spending amount
  if (amount < 0 || amount > currentTurns) {
    throw new Error('Invalid turn spend');
  }

  // 3. Deduct turns and update database
  const newTurnCount = currentTurns - amount;
  await supabase
    .from('players')
    .update({
      turns: newTurnCount,
      last_turn_update: new Date().toISOString()
    })
    .eq('id', playerId);

  return newTurnCount;
}
```

#### Implementation Plan:

**Phase 1: Server-Side Turn Authority**
- [ ] Create Supabase Edge Function for turn calculations
- [ ] Move ALL turn logic to server (no client-side trust)
- [ ] Client requests current turn count from server
- [ ] Server responds with authoritative turn count
- [ ] Client displays but doesn't modify turns locally

**Phase 2: Database Schema Validation**
- [ ] Add `last_turn_update` timestamp column (if not exists)
- [ ] Add `max_turns` column (default 200)
- [ ] Add `turn_regen_rate` column (customizable per player)
- [ ] Create database constraints (turns ≥ 0, turns ≤ max_turns)
- [ ] Add indexes for performance

**Phase 3: Turn Spending Validation**
- [ ] Every action that spends turns calls server API
- [ ] Server validates: Player has enough turns
- [ ] Server validates: Spend amount is positive
- [ ] Server atomically deducts turns
- [ ] Server returns new turn count
- [ ] Client updates UI with server response

**Phase 4: Sync & Recovery**
- [ ] On page load: Fetch authoritative turn count from server
- [ ] Periodic sync (every 60 seconds) to prevent drift
- [ ] If desync detected: Server value always wins
- [ ] Add "Refresh Turns" button for manual sync
- [ ] Log turn changes for audit trail

**Phase 5: Testing & Monitoring**
- [ ] Test concurrent turn spending (2 actions at once)
- [ ] Test turn regeneration across sessions
- [ ] Test max turn cap enforcement
- [ ] Add server-side logging for turn operations
- [ ] Add admin dashboard to view turn audit logs
- [ ] Monitor for anomalies (negative turns, huge jumps)

#### Implementation Tasks:

- [ ] **Create Supabase Edge Function for turn management**
  - [ ] `getTurns(playerId)` - Calculate and return current turns
  - [ ] `spendTurns(playerId, amount)` - Validate and deduct turns
  - [ ] `resetTurns(playerId)` - Admin function to fix broken accounts
  - [ ] Deploy to Supabase Edge Functions

- [ ] **Update database schema**
  - [ ] Add `last_turn_update` timestamp column
  - [ ] Migrate existing players (set to current timestamp)
  - [ ] Add constraints (CHECK turns >= 0 AND turns <= max_turns)
  - [ ] Add indexes on player_id and last_turn_update

- [ ] **Refactor client-side turn display**
  - [ ] Remove client-side turn calculations
  - [ ] Replace with server API calls
  - [ ] Show loading state while fetching turns
  - [ ] Display server-provided turn count

- [ ] **Update all turn-spending actions**
  - [ ] Scout districts: Call server API before executing
  - [ ] Drug dealing: Validate turns server-side
  - [ ] Ho payout adjustment: Server validation
  - [ ] Heat management: Server validation
  - [ ] Street fights: Server validation
  - [ ] Any other turn-spending action

- [ ] **Add turn sync system**
  - [ ] Auto-sync every 60 seconds
  - [ ] Sync on page focus (user returns to tab)
  - [ ] Sync after every action completes
  - [ ] Show sync status indicator

- [ ] **Error handling & recovery**
  - [ ] If server unreachable: Show error, don't allow actions
  - [ ] If desync detected: Auto-sync from server
  - [ ] If negative turns: Alert admin, auto-fix to 0
  - [ ] If turns > max: Auto-cap to max

- [ ] **Audit logging**
  - [ ] Log every turn spend (playerId, amount, action, timestamp)
  - [ ] Log every turn accrual calculation
  - [ ] Store in separate `turn_audit_log` table
  - [ ] Add admin view to investigate issues

- [ ] **Testing suite**
  - [ ] Unit test: Turn accrual calculation
  - [ ] Unit test: Turn spending validation
  - [ ] Integration test: Full turn lifecycle
  - [ ] Load test: Concurrent turn spending
  - [ ] Edge cases: Negative amounts, zero turns, max cap

#### Technical Considerations:
- Use database transactions for atomic turn operations
- Implement optimistic locking to prevent race conditions
- Cache turn counts briefly (5-10 seconds) to reduce DB load
- Use WebSockets for real-time turn updates (future)
- Consider Redis for high-traffic turn caching

#### Estimated Time:
- Edge function creation: 2-3 hours
- Database schema updates: 1-2 hours
- Client refactoring: 4-6 hours
- Action validation updates: 3-4 hours
- Sync system: 2-3 hours
- Error handling: 2-3 hours
- Audit logging: 2-3 hours
- Testing: 3-4 hours
- **Total**: 19-28 hours

---

### 4. Database Integrity Audit & Complete Schema Mapping
- **Status**: Not Started
- **Priority**: HIGH - Data integrity is critical
- **Description**: Ensure ALL game elements are properly referenced in the database. Audit the schema to make sure nothing is missing, no orphaned data exists, and all relationships are correct.

#### Current Concerns:
- Are all resources (crack, weed, beer, etc.) stored in DB?
- Are weapons and vehicles tracked in DB?
- Are crew happiness levels persisted?
- Are territories and districts saved?
- Are turn-related fields all present?
- Are temporary/computed values stored unnecessarily?

#### Full Schema Audit Needed:

### Player Table (`players`):

**Identity & Profile:**
- [ ] `id` (UUID, primary key)
- [ ] `wallet_address` (user auth ID)
- [ ] `username` (pimp name)
- [ ] `bio` (profile description)
- [ ] `email` (from auth, optional)
- [ ] `created_at` (signup date)
- [ ] `last_active` (last login timestamp)

**Progression:**
- [ ] `level` (player level)
- [ ] `exp` (experience points)
- [ ] `respect` (reputation score)

**Financial:**
- [ ] `cash` (liquid money)
- [ ] `net_worth` (calculated, should NOT be stored - compute on demand)

**Location:**
- [ ] `district` (district ID or name)
- [ ] `territory` (territory ID or name) - **MISSING? ADD THIS**
- [ ] `corners_controlled` (number of controlled corners)

**Turns & Time:**
- [ ] `turns` (current turn count)
- [ ] `turns_when_last_checked` (turns at last save)
- [ ] `last_turn_update` (timestamp of last turn calculation) - **MIGHT BE MISSING**
- [ ] `max_turns` (turn cap, default 200)
- [ ] `regen_rate` (turns per minute, default 0.2)

**Heat & Risk:**
- [ ] `heat` (police attention %)

**Crew Management:**
- [ ] `ho_payout_percentage` (% hoes keep)

**Resources (Main Crew):**
- [ ] `hoes` (total hoe count)
- [ ] `thugs` (total thug count)

**Resources (Detailed Hoes) - Might be in separate table or JSON column:**
- [ ] `hoe_details` (JSON: streetWorkers, sugarBabies, highEndEscorts, onlyTrampsModels)
- [ ] `hoe_happiness` (%)

**Resources (Thug Happiness):**
- [ ] `thug_happiness` (%)

**Resources (Drugs):**
- [ ] `crack` (bags)
- [ ] `weed` (oz)

**Resources (Supplies):**
- [ ] `beer` (cases)
- [ ] `condoms` (count)
- [ ] `medicine` (count)

**Resources (Weapons) - Might be JSON column:**
- [ ] `weapons` (JSON: pistols, shotguns, tek9s, ak47s)

**Resources (Vehicles) - Might be JSON column:**
- [ ] `vehicles` (JSON: cars, suvs, luxury)

**Crew State (for loss events):**
- [ ] `turns_since_last_loss_roll` - **MISSING? ADD THIS**
- [ ] `last_loss_event_time` - **MISSING? ADD THIS**
- [ ] `blocks_without_loss_event` - **MISSING? ADD THIS**

**PvP Data (Future):**
- [ ] `rivalries` (JSON array of rival player IDs)
- [ ] `attack_history` (JSON or separate table)
- [ ] `scouted_intel` (JSON: temporary intel on other players)

**Metadata:**
- [ ] `game_version` (track which version player is on)
- [ ] `tutorial_progress` (JSON: completed steps)
- [ ] `unlocked_vendors` (JSON: special vendors unlocked) - **MISSING? ADD THIS**
- [ ] `unlocked_blueprints` (JSON: special items unlocked) - **MISSING? ADD THIS**

### Separate Tables Needed:

**Turn Audit Log (`turn_audit_log`):** - **MISSING? CREATE THIS**
- `id` (UUID)
- `player_id` (FK to players)
- `action` (string: "spend", "accrue", "reset")
- `amount` (number: +/- turns)
- `balance_before` (turns before action)
- `balance_after` (turns after action)
- `timestamp` (when action occurred)
- `metadata` (JSON: additional context)

**PvP Attacks Log (`pvp_attacks`):** - **FUTURE**
- `id` (UUID)
- `attacker_id` (FK to players)
- `target_id` (FK to players)
- `attack_type` (string: "resource_raid", "crew_poach", etc.)
- `success` (boolean)
- `loot` (JSON: what was stolen)
- `timestamp`

**Crew Members (`crew_members`):** - **FUTURE (for detailed tracking)**
- `id` (UUID)
- `player_id` (FK to players)
- `type` (string: "hoe" or "thug")
- `subtype` (string: "streetWorker", "sugarBaby", etc.)
- `name` (randomly generated name)
- `happiness` (0-100)
- `loyalty` (0-100)
- `hired_date` (timestamp)
- `productivity_modifier` (decimal: 0.9 = -10%)

#### Implementation Tasks:

**Phase 1: Schema Audit**
- [ ] Document current Supabase schema (export to SQL or JSON)
- [ ] Compare with gameState object structure
- [ ] Identify missing columns
- [ ] Identify unnecessary stored columns (computed values)
- [ ] Identify orphaned data (data with no FK references)

**Phase 2: Add Missing Columns**
- [ ] Add `territory` column (string or FK)
- [ ] Add `last_turn_update` timestamp
- [ ] Add turn tracking columns (if missing)
- [ ] Add crew loss event columns
- [ ] Add `unlocked_vendors` JSON column
- [ ] Add `unlocked_blueprints` JSON column
- [ ] Add `game_version` column

**Phase 3: Remove Computed Columns**
- [ ] Remove `net_worth` if stored (compute on-demand)
- [ ] Remove any cached calculations
- [ ] Update save logic to not store computed values

**Phase 4: Create Audit Tables**
- [ ] Create `turn_audit_log` table
- [ ] Add foreign key constraints
- [ ] Add indexes for query performance
- [ ] Set up retention policy (keep logs for 30 days?)

**Phase 5: Validate Data Integrity**
- [ ] Run query: Find players with negative turns
- [ ] Run query: Find players with turns > max_turns
- [ ] Run query: Find players with NULL critical fields
- [ ] Run query: Find orphaned foreign keys
- [ ] Fix anomalies found

**Phase 6: Update Save/Load Functions**
- [ ] Ensure `saveGameState()` saves all fields
- [ ] Ensure `loadPlayerProfileFromAuth()` loads all fields
- [ ] Add validation before save (catch bad data)
- [ ] Add retry logic for failed saves

**Phase 7: Add Database Constraints**
- [ ] CHECK constraints: turns >= 0, turns <= max_turns
- [ ] CHECK constraints: happiness between 0 and 100
- [ ] CHECK constraints: heat between 0 and 100
- [ ] UNIQUE constraints where needed
- [ ] NOT NULL constraints on critical fields

**Phase 8: Testing & Verification**
- [ ] Test full save/load cycle
- [ ] Verify all resources persist correctly
- [ ] Verify turn tracking works across sessions
- [ ] Test edge cases (logout during save, etc.)
- [ ] Monitor for database errors in production

#### SQL Migration Script Template:

```sql
-- Add missing columns
ALTER TABLE players ADD COLUMN IF NOT EXISTS territory VARCHAR(100);
ALTER TABLE players ADD COLUMN IF NOT EXISTS last_turn_update TIMESTAMP DEFAULT NOW();
ALTER TABLE players ADD COLUMN IF NOT EXISTS turns_since_last_loss_roll INTEGER DEFAULT 0;
ALTER TABLE players ADD COLUMN IF NOT EXISTS last_loss_event_time TIMESTAMP;
ALTER TABLE players ADD COLUMN IF NOT EXISTS blocks_without_loss_event INTEGER DEFAULT 0;
ALTER TABLE players ADD COLUMN IF NOT EXISTS unlocked_vendors JSONB DEFAULT '[]';
ALTER TABLE players ADD COLUMN IF NOT EXISTS unlocked_blueprints JSONB DEFAULT '[]';
ALTER TABLE players ADD COLUMN IF NOT EXISTS game_version VARCHAR(20) DEFAULT '1.0.0';

-- Add constraints
ALTER TABLE players ADD CONSTRAINT turns_positive CHECK (turns >= 0);
ALTER TABLE players ADD CONSTRAINT turns_max_cap CHECK (turns <= max_turns);
ALTER TABLE players ADD CONSTRAINT happiness_range CHECK (hoe_happiness >= 0 AND hoe_happiness <= 100);
ALTER TABLE players ADD CONSTRAINT heat_range CHECK (heat >= 0 AND heat <= 100);

-- Create audit log table
CREATE TABLE IF NOT EXISTS turn_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  action VARCHAR(20) NOT NULL,
  amount INTEGER NOT NULL,
  balance_before INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_turn_audit_player ON turn_audit_log(player_id);
CREATE INDEX IF NOT EXISTS idx_turn_audit_timestamp ON turn_audit_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_players_last_active ON players(last_active);
```

#### Estimated Time:
- Schema audit & documentation: 2-3 hours
- Add missing columns: 1-2 hours
- Create audit tables: 1-2 hours
- Validate data integrity: 2-3 hours
- Update save/load functions: 3-4 hours
- Add constraints: 1-2 hours
- Testing: 2-3 hours
- **Total**: 12-19 hours

---

### 5. Multiplayer Infrastructure & Real-Time Features
- **Status**: Not Started (Foundation for Future PvP)
- **Priority**: MEDIUM - Needed before PvP launch
- **Description**: Build the infrastructure to support real-time multiplayer features: online player lists, presence detection, real-time notifications, and live updates.

#### What's Needed for Multiplayer:

**Core Infrastructure:**
1. **Player Presence System** - Who's online right now?
2. **Real-Time Notifications** - Instant alerts when attacked/messaged
3. **Live Player List** - See active rivals in real-time
4. **Message System** - Send DMs to other players
5. **Activity Feed** - See what other players are doing
6. **Leaderboards** - Live rankings that update instantly

#### Implementation Approach:

### 1. Player Presence System

**Use Supabase Realtime (Presence feature):**

```javascript
// Track player online/offline status
const presenceChannel = supabase.channel('online_players');

// When player logs in
presenceChannel.subscribe(async (status) => {
  if (status === 'SUBSCRIBED') {
    // Send presence state
    await presenceChannel.track({
      user_id: currentUser.id,
      username: gameState.player.username,
      district: gameState.player.district,
      level: gameState.player.level,
      online_at: new Date().toISOString()
    });
  }
});

// Listen for presence changes
presenceChannel.on('presence', { event: 'sync' }, () => {
  const state = presenceChannel.presenceState();
  const onlinePlayers = Object.keys(state).length;
  updateOnlinePlayerCount(onlinePlayers);
});

// When player logs out
window.addEventListener('beforeunload', () => {
  presenceChannel.untrack();
});
```

### 2. Real-Time Notifications

**Use Supabase Realtime (Broadcast feature):**

```javascript
// Create notifications channel
const notificationsChannel = supabase
  .channel(`notifications:${currentUser.id}`)
  .on('broadcast', { event: 'attack' }, (payload) => {
    showNotification(`🚨 ${payload.attacker} attacked you!`, 'danger');
    playSoundEffect('alert');
  })
  .on('broadcast', { event: 'message' }, (payload) => {
    showNotification(`💬 New message from ${payload.sender}`, 'info');
  })
  .subscribe();

// Send notification to another player
async function notifyPlayer(targetUserId, event, data) {
  const targetChannel = supabase.channel(`notifications:${targetUserId}`);
  await targetChannel.send({
    type: 'broadcast',
    event: event,
    payload: data
  });
}
```

### 3. Live Player List (Rivals)

**Database + Realtime:**

```javascript
// Subscribe to active players
const playersChannel = supabase
  .channel('active_players')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'players',
    filter: `last_active=gt.${fifteenMinutesAgo}`
  }, (payload) => {
    updateRivalsList(payload.new);
  })
  .subscribe();
```

### 4. Message System

**Create messages table:**

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES players(id),
  recipient_id UUID REFERENCES players(id),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_recipient ON messages(recipient_id, read);
```

**Real-time message delivery:**

```javascript
// Listen for new messages
const messagesChannel = supabase
  .channel(`messages:${currentUser.id}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `recipient_id=eq.${currentUser.id}`
  }, (payload) => {
    displayNewMessage(payload.new);
  })
  .subscribe();
```

### 5. Activity Feed (Future)

**Publish notable events:**

```javascript
// When player does something notable
async function publishActivity(playerId, action, details) {
  await supabase.from('activity_feed').insert({
    player_id: playerId,
    action: action, // "defeated_kingpin", "poached_crew", etc.
    details: details,
    timestamp: new Date().toISOString()
  });
}

// Subscribe to activity feed
const activityChannel = supabase
  .channel('global_activity')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'activity_feed'
  }, (payload) => {
    addActivityToFeed(payload.new);
  })
  .subscribe();
```

### 6. Live Leaderboards

**Create leaderboard views:**

```sql
-- Top by respect
CREATE VIEW leaderboard_respect AS
SELECT username, respect, district, level
FROM players
WHERE last_active > NOW() - INTERVAL '7 days'
ORDER BY respect DESC
LIMIT 100;

-- Top by net worth (computed)
CREATE VIEW leaderboard_networth AS
SELECT username,
       (cash + hoes * 1000 + thugs * 800) as net_worth,
       district, level
FROM players
WHERE last_active > NOW() - INTERVAL '7 days'
ORDER BY net_worth DESC
LIMIT 100;
```

#### Implementation Tasks:

**Phase 1: Player Presence**
- [ ] Set up Supabase Realtime channel
- [ ] Implement presence tracking on login
- [ ] Implement presence cleanup on logout
- [ ] Show online player count in UI
- [ ] Display "Online" badge on player profiles

**Phase 2: Real-Time Notifications**
- [ ] Create notification channel per player
- [ ] Implement notification sending function
- [ ] Add notification UI component (toast/modal)
- [ ] Add sound effects for notifications
- [ ] Store notification history in DB (optional)

**Phase 3: Live Player List**
- [ ] Query active players (last_active < 15 min)
- [ ] Subscribe to player updates
- [ ] Update rivals list in real-time
- [ ] Add filters (district, level, online status)
- [ ] Show "typing..." indicators (future)

**Phase 4: Message System**
- [ ] Create messages table in Supabase
- [ ] Implement send message function
- [ ] Implement receive message listener
- [ ] Create inbox UI
- [ ] Add read/unread status
- [ ] Add message threading (optional)

**Phase 5: Activity Feed**
- [ ] Create activity_feed table
- [ ] Publish notable events (kingpin defeats, crew poaching)
- [ ] Subscribe to global activity feed
- [ ] Display in game console or separate tab
- [ ] Add filters (district, friends only, etc.)

**Phase 6: Leaderboards**
- [ ] Create leaderboard views in database
- [ ] Query top players by category
- [ ] Subscribe to leaderboard changes
- [ ] Update leaderboard UI in real-time
- [ ] Add player ranking badges

**Phase 7: Performance & Scaling**
- [ ] Implement connection pooling
- [ ] Add rate limiting on notifications
- [ ] Cache presence data (Redis in future)
- [ ] Optimize database queries
- [ ] Test with 100+ concurrent users

**Phase 8: Mobile Support**
- [ ] Test realtime on mobile browsers
- [ ] Implement reconnection logic
- [ ] Handle connection drops gracefully
- [ ] Reduce data usage (optimize payload sizes)

#### Technical Considerations:
- Supabase Realtime has connection limits (check pricing)
- Implement exponential backoff for reconnections
- Use WebSockets efficiently (don't spam channels)
- Consider push notifications for mobile (future)
- Monitor Realtime usage and costs

#### Estimated Time:
- Presence system: 3-4 hours
- Notifications: 3-4 hours
- Live player list: 2-3 hours
- Message system: 4-5 hours
- Activity feed: 2-3 hours
- Leaderboards: 2-3 hours
- Performance optimization: 2-3 hours
- Mobile testing: 2-3 hours
- **Total**: 20-28 hours

---

## 🟢 Low Priority - Code Quality

### 6. Remove excessive debug code
- **Status**: Not Started
- **Description**: Lots of debug functions and console.logs that should be cleaned up for production
- **Locations**:
  - `debugButtonStatus()` (line 597)
  - `debugHoodPimps()` (line 5547)
  - `debugGameState()` (line 5708)
  - `debugWallets()` (line 11481)
  - Multiple "BUTTON DEBUG STATUS" logs
- **Tasks**:
  - [ ] Move debug functions to separate debug.js file
  - [ ] Add environment flag to enable/disable debug mode
  - [ ] Remove or wrap excessive console.logs
  - [ ] Keep only critical error logging

### 6. Add proper email validation
- **Status**: Not Started
- **Description**: Basic format checking in signup/signin forms
- **Locations**:
  - `emailSignUp()` (line 9673)
  - `signIn()` (line 9849)
- **Tasks**:
  - [ ] Add regex validation for email format
  - [ ] Show real-time validation feedback
  - [ ] Prevent submission with invalid emails
  - [ ] Add helpful error messages

### 7. Fix potential null/undefined crashes
- **Status**: Partially Addressed
- **Description**: Add defensive checks in more places
- **Locations**: Throughout codebase where accessing nested properties
- **Tasks**:
  - [ ] Audit gameState access patterns
  - [ ] Add null checks before DOM element access
  - [ ] Add optional chaining where appropriate
  - [ ] Implement fallback values for critical data

---

## 🟢 Nice to Have - Polish

### 8. Implement session timeout handling
- **Status**: Not Started
- **Description**: Gracefully handle when Supabase session expires
- **Tasks**:
  - [ ] Add session expiration detection
  - [ ] Show "session expired" modal
  - [ ] Implement auto-save before logout
  - [ ] Add "keep me signed in" option

### 9. Add confirmation dialogs
- **Status**: Not Started
- **Description**: For destructive actions like selling large amounts of resources
- **Locations**:
  - Selling crack/weed in bulk
  - Firing hoes/thugs
  - Resetting game progress
- **Tasks**:
  - [ ] Create styled confirmation modal
  - [ ] Add to bulk sell operations
  - [ ] Add to firing crew members
  - [ ] Add to reset/delete actions

### 10. Mobile responsiveness improvements
- **Status**: Partially Implemented
- **Description**: The profile modal and economic dashboard could use better mobile optimization
- **Tasks**:
  - [ ] Test profile modal on mobile devices
  - [ ] Improve button sizes for touch targets
  - [ ] Optimize modal heights for small screens
  - [ ] Add swipe-to-close gestures
  - [ ] Test on various screen sizes

---

## 🎯 Quick Wins (Can do immediately)

### Password Change Modal
- Implement proper Supabase password update
- Add to profile modal
- Estimated time: 30-45 minutes

### Loading Spinners
- Add simple loading states during auth
- Show "Loading..." on profile button
- Estimated time: 20-30 minutes

### Better Error Handling
- Replace key `alert()` calls with notifications
- Focus on auth flow first
- Estimated time: 30-45 minutes

---

## ✅ Recently Completed

- [x] **Fixed profile button display** - Now shows actual pimp name instead of email prefix
- [x] **Fixed button click issues** - Added `pointer-events-none` to glow overlay
- [x] **Created profile modal** - Full featured profile settings modal
- [x] **Removed Exit button** - Moved logout to profile modal
- [x] **Fixed pimp name persistence** - Username properly saves and loads from database

---

## 📝 Notes

- Priority should be given to user-facing features (loading states, error messages)
- Debug code cleanup can be done incrementally
- Consider creating a `config.js` file for environment variables (debug mode, API keys, etc.)
- Test all changes on both desktop and mobile before deploying

---

**Last Updated**: 2025-10-13
**Maintained By**: Development Team

---

## 🎨 Design Reference

### Mobile Tab Icons & Colors:
- **💪 Turns**: Purple gradient `#9333EA` → `#C026D3`
- **💰 Resources**: Gold gradient `#F59E0B` → `#FBBF24`
- **🥊 Fights**: Red gradient `#DC2626` → `#EF4444`
- **🛒 Shop**: Green gradient `#10B981` → `#34D399`

### Touch Target Guidelines:
- Minimum button height: 44px (iOS) / 48px (Android)
- Minimum spacing between touch targets: 8px
- Tab bar height: 60px (includes padding)
- Icon size in tabs: 24px
- Font size for tab labels: 12px

### Mobile Breakpoints:
```css
/* Mobile First */
@media (max-width: 767px) {
  /* Tab navigation layout */
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  /* Hybrid layout - sidebar + content */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Current desktop layout */
}
```
