# 🔧 Critical Fixes Needed Before 1000 User Rollout

## ❌ **CURRENT ISSUES IDENTIFIED:**

### **🛒 Store Inconsistencies:**
1. **Corner Store** ✅ - Enhanced with quantity selectors
2. **Pew Pew Jimmy's** ⚠️ - Has quantity selectors but different functions  
3. **Reggie's Plug** ✅ - Now enhanced (just added)
4. **Tony's Chop Shop** ❌ - Still uses old individual buy buttons

### **📱 Modal Issues:**
1. **Season Reset Modal** ❌ - Too long, can't scroll to bottom
2. **Economic Dashboard** ❌ - May have scrolling issues
3. **Data Investigation** ❌ - Very long content
4. **Store modals** ✅ - Fixed with proper height limits

### **🧮 Math Issues:**
1. **Scout Formulas** ❌ - District bonuses may not be applied correctly
2. **Combat Loot** ❌ - Need to verify 3-18% cash, 0-9% assets
3. **Turn Regeneration** ❌ - Edge cases in calculation
4. **Net Worth** ❌ - May not include all assets
5. **Happiness Formulas** ❌ - Complex and potentially buggy

### **⚙️ Function Issues:**
1. **Mixed Store Systems** ❌ - Some use enhanced, some use old
2. **Duplicate Functions** ❌ - Multiple ways to do same thing
3. **Inconsistent Naming** ❌ - Different patterns across stores

---

## 🎯 **IMPLEMENTATION PLAN:**

### **PHASE 1: Store Standardization** 
- [x] Enhanced Corner Store  
- [x] Enhanced Reggie's Plug
- [ ] Enhanced Tony's Chop Shop
- [ ] Standardize Pew Pew Jimmy's functions
- [ ] Remove old visitStore system entirely

### **PHASE 2: Modal Fixes**
- [x] Add proper height limits to all modals
- [ ] Test all modals on mobile
- [ ] Ensure scroll to bottom works
- [ ] Split overly long content

### **PHASE 3: Math Verification**
- [ ] Audit all scout formulas
- [ ] Verify combat loot percentages  
- [ ] Test turn regeneration edge cases
- [ ] Validate net worth calculation
- [ ] Simplify happiness formulas

### **PHASE 4: Function Cleanup**
- [ ] Move all store functions to store-systems.js
- [ ] Remove duplicate functions
- [ ] Standardize function naming
- [ ] Clean up old system remnants

---

## 🚨 **BLOCKERS FOR 1000 USER ROLLOUT:**

### **HIGH PRIORITY (Must Fix):**
1. **Tony's Chop Shop** - Still uses old system
2. **Modal scrolling** - Users can't access all content
3. **Math accuracy** - Economic balance critical

### **MEDIUM PRIORITY (Should Fix):**
1. **Function consistency** - Professional code quality
2. **Performance** - Remove duplicate code
3. **UX Polish** - Consistent interfaces

### **LOW PRIORITY (Can Wait):**
1. **Code cleanup** - Internal organization
2. **Documentation** - Developer notes

---

## ✅ **NEXT STEPS:**

1. **Fix Tony's Chop Shop** - Add quantity selectors
2. **Audit all math formulas** - Verify accuracy  
3. **Test every modal** - Ensure proper scrolling
4. **Standardize all functions** - Remove duplicates
5. **Final testing** - Every component working

**Target:** All HIGH PRIORITY fixes completed before rollout

