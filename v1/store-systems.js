/*
=============================================================================
PIMP.FUN - STORE SYSTEMS MODULE
=============================================================================
Enhanced store interface with quantity selectors for easy bulk purchasing
*/

// Enhanced Corner Store with quantity selectors
function openCornerStore() {
    console.log('🛒 OPENING ENHANCED CORNER STORE with quantity selectors');
    addConsoleMessage('🛒 Opening enhanced Corner Store with quantity selectors', 'cyan');
    
    const store = STORES["Corner Store"];
    const modal = `
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div class="game-panel rounded-lg p-6 max-w-lg w-full my-8">
                <h3 class="text-xl font-bold cyan-glow mb-2">CORNER STORE</h3>
                <p class="text-sm text-gray-400 mb-4">Run by ${store.owner} • Cash: <span class="gold-text">$${gameState.player.cash.toLocaleString()}</span></p>
                
                <div class="space-y-4">
                    <!-- Beer with Quantity Selector -->
                    <div class="border border-gray-700 rounded p-4 bg-gray-800/30">
                        <h4 class="font-bold text-yellow-400 mb-3">🍺 Beer ($2 each)</h4>
                        
                        <!-- Individual Beer -->
                        <div class="mb-3 p-3 bg-gray-900/50 rounded">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-gray-300">Individual Beer</span>
                                <span class="text-yellow-400">$2 each</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="flex items-center gap-2">
                                    <button onclick="adjustQuantity('beer_qty', -1)" class="w-8 h-8 bg-red-600 rounded text-white hover:bg-red-500">-</button>
                                    <input type="number" id="beer_qty" value="50" min="1" max="1000" 
                                           class="w-20 text-center bg-gray-800 border border-gray-600 rounded text-white py-1"
                                           oninput="updateQuantityDisplays()">
                                    <button onclick="adjustQuantity('beer_qty', 1)" class="w-8 h-8 bg-green-600 rounded text-white hover:bg-green-500">+</button>
                                </div>
                                <button onclick="buyWithQuantity('beer', 2, 'beer_qty')" class="flex-1 action-btn rounded py-2 text-sm">
                                    Buy <span id="beer_total">$100</span>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Keg Deal -->
                        <div class="mb-3 p-3 bg-green-900/30 rounded border border-green-500/50">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-green-400">🎉 Keg Deal (200 beers)</span>
                                <span class="text-green-400">$300 each</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="flex items-center gap-2">
                                    <button onclick="adjustQuantity('keg_qty', -1)" class="w-8 h-8 bg-red-600 rounded text-white hover:bg-red-500">-</button>
                                    <input type="number" id="keg_qty" value="1" min="1" max="20" 
                                           class="w-20 text-center bg-gray-800 border border-gray-600 rounded text-white py-1"
                                           oninput="updateQuantityDisplays()">
                                    <button onclick="adjustQuantity('keg_qty', 1)" class="w-8 h-8 bg-green-600 rounded text-white hover:bg-green-500">+</button>
                                </div>
                                <button onclick="buyKegs()" class="flex-1 bg-green-600 rounded py-2 text-sm hover:bg-green-500">
                                    Buy <span id="keg_total">$300</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Condoms with Quantity Selector -->
                    <div class="border border-gray-700 rounded p-4 bg-gray-800/30">
                        <h4 class="font-bold text-pink-400 mb-3">🛡️ Condoms ($1 each)</h4>
                        
                        <div class="mb-3 p-3 bg-gray-900/50 rounded">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-gray-300">Individual Condoms</span>
                                <span class="text-pink-400">$1 each</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="flex items-center gap-2">
                                    <button onclick="adjustQuantity('condom_qty', -10)" class="w-8 h-8 bg-red-600 rounded text-white hover:bg-red-500">--</button>
                                    <button onclick="adjustQuantity('condom_qty', -1)" class="w-8 h-8 bg-red-600 rounded text-white hover:bg-red-500">-</button>
                                    <input type="number" id="condom_qty" value="100" min="1" max="5000" 
                                           class="w-20 text-center bg-gray-800 border border-gray-600 rounded text-white py-1"
                                           oninput="updateQuantityDisplays()">
                                    <button onclick="adjustQuantity('condom_qty', 1)" class="w-8 h-8 bg-green-600 rounded text-white hover:bg-green-500">+</button>
                                    <button onclick="adjustQuantity('condom_qty', 10)" class="w-8 h-8 bg-green-600 rounded text-white hover:bg-green-500">++</button>
                                </div>
                                <button onclick="buyWithQuantity('condoms', 1, 'condom_qty')" class="flex-1 action-btn rounded py-2 text-sm">
                                    Buy <span id="condom_total">$100</span>
                                </button>
                            </div>
                        </div>
                        
                        <div class="p-3 bg-green-900/30 rounded border border-green-500/50">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-green-400">🎉 Bulk Crate (1000 condoms)</span>
                                <span class="text-green-400">$700 total</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="flex items-center gap-2">
                                    <button onclick="adjustQuantity('crate_qty', -1)" class="w-8 h-8 bg-red-600 rounded text-white hover:bg-red-500">-</button>
                                    <input type="number" id="crate_qty" value="1" min="1" max="10" 
                                           class="w-20 text-center bg-gray-800 border border-gray-600 rounded text-white py-1"
                                           oninput="updateQuantityDisplays()">
                                    <button onclick="adjustQuantity('crate_qty', 1)" class="w-8 h-8 bg-green-600 rounded text-white hover:bg-green-500">+</button>
                                </div>
                                <button onclick="buyCondomCrates()" class="flex-1 bg-green-600 rounded py-2 text-sm hover:bg-green-500">
                                    Buy <span id="crate_total">$700</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Medicine with Quantity Selector -->
                    <div class="border border-gray-700 rounded p-4 bg-gray-800/30">
                        <h4 class="font-bold text-red-400 mb-3">💊 Medicine</h4>
                        
                        <div class="space-y-3">
                            <!-- Individual Doses -->
                            <div class="p-3 bg-gray-900/50 rounded">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-gray-300">Medicine Doses</span>
                                    <span class="text-red-400">$20 each</span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <div class="flex items-center gap-2">
                                        <button onclick="adjustQuantity('medicine_qty', -1)" class="w-8 h-8 bg-red-600 rounded text-white hover:bg-red-500">-</button>
                                        <input type="number" id="medicine_qty" value="5" min="1" max="100" 
                                               class="w-20 text-center bg-gray-800 border border-gray-600 rounded text-white py-1"
                                               oninput="updateQuantityDisplays()">
                                        <button onclick="adjustQuantity('medicine_qty', 1)" class="w-8 h-8 bg-green-600 rounded text-white hover:bg-green-500">+</button>
                                    </div>
                                    <button onclick="buyWithQuantity('medicine', 20, 'medicine_qty')" class="flex-1 action-btn rounded py-2 text-sm">
                                        Buy <span id="medicine_total">$100</span>
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Bottle Deal -->
                            <div class="p-3 bg-blue-900/30 rounded border border-blue-500/50">
                                <div class="flex justify-between items-center">
                                    <span class="text-blue-400">💊 Medicine Bottle (10 doses)</span>
                                    <button onclick="buyStoreItem('medicine', 180, 10, 1)" class="px-3 py-1 bg-blue-600 rounded text-sm hover:bg-blue-500">
                                        $180 (Save $20!)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <button onclick="closeModal()" class="w-full mt-4 py-3 bg-gray-700 rounded font-bold">Close Store</button>
            </div>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = modal;
    
    // Initialize quantity displays
    updateQuantityDisplays();
}

// Enhanced store functions for quantity selectors
function adjustQuantity(inputId, change) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const currentValue = parseInt(input.value) || 1;
    const newValue = Math.max(1, currentValue + change);
    const maxValue = parseInt(input.max) || 1000;
    
    input.value = Math.min(newValue, maxValue);
    updateQuantityDisplays();
}

function updateQuantityDisplays() {
    // Update beer total
    const beerQty = parseInt(document.getElementById('beer_qty')?.value) || 0;
    const beerTotalEl = document.getElementById('beer_total');
    if (beerTotalEl) {
        beerTotalEl.textContent = `$${(beerQty * 2).toLocaleString()}`;
    }
    
    // Update keg total
    const kegQty = parseInt(document.getElementById('keg_qty')?.value) || 0;
    const kegTotalEl = document.getElementById('keg_total');
    if (kegTotalEl) {
        kegTotalEl.textContent = `$${(kegQty * 300).toLocaleString()}`;
    }
    
    // Update condom total
    const condomQty = parseInt(document.getElementById('condom_qty')?.value) || 0;
    const condomTotalEl = document.getElementById('condom_total');
    if (condomTotalEl) {
        condomTotalEl.textContent = `$${(condomQty * 1).toLocaleString()}`;
    }
    
    // Update crate total
    const crateQty = parseInt(document.getElementById('crate_qty')?.value) || 0;
    const crateTotalEl = document.getElementById('crate_total');
    if (crateTotalEl) {
        crateTotalEl.textContent = `$${(crateQty * 700).toLocaleString()}`;
    }
    
    // Update medicine total
    const medicineQty = parseInt(document.getElementById('medicine_qty')?.value) || 0;
    const medicineTotalEl = document.getElementById('medicine_total');
    if (medicineTotalEl) {
        medicineTotalEl.textContent = `$${(medicineQty * 20).toLocaleString()}`;
    }
}

function buyWithQuantity(item, unitPrice, qtyInputId) {
    const qtyInput = document.getElementById(qtyInputId);
    if (!qtyInput) {
        showNotification('❌ Quantity input not found', 'error');
        return;
    }
    
    const quantity = parseInt(qtyInput.value) || 1;
    const totalCost = unitPrice * quantity;
    
    console.log(`🛒 Buying ${quantity} ${item} for $${totalCost}`);
    
    if (gameState.player.cash < totalCost) {
        showNotification(`💸 Not enough cash! Need $${totalCost.toLocaleString()}, have $${gameState.player.cash.toLocaleString()}`, 'error');
        return;
    }
    
    gameState.player.cash -= totalCost;
    gameState.resources[item] = (gameState.resources[item] || 0) + quantity;
    
    console.log(`🛒 PURCHASE DEBUG:`, {
        item,
        quantity,
        totalCost,
        newAmount: gameState.resources[item],
        gameStateResources: gameState.resources
    });
    
    const displayText = quantity === 1 ? item : `${quantity} ${item}`;
    showNotification(`✅ Bought ${displayText} for $${totalCost.toLocaleString()}!`, 'success');
    addConsoleMessage(`💰 Corner Store: ${displayText} purchased for $${totalCost.toLocaleString()}`, 'green');
    
    updateUI();
    
    // Force save and verify
    saveGameState().then(saveResult => {
        console.log(`💾 Save result after purchase:`, saveResult);
        console.log(`💾 Current resources after save:`, gameState.resources);
    });
    
    // Update cash display in modal and reset quantity
    updateStoreAfterPurchase();
}

function buyKegs() {
    const qtyInput = document.getElementById('keg_qty');
    const quantity = parseInt(qtyInput?.value) || 1;
    const totalCost = 300 * quantity;
    const totalBeers = 200 * quantity;
    
    if (gameState.player.cash < totalCost) {
        showNotification(`💸 Not enough cash! Need $${totalCost.toLocaleString()}`, 'error');
        return;
    }
    
    gameState.player.cash -= totalCost;
    gameState.resources.beer = (gameState.resources.beer || 0) + totalBeers;
    
    const displayText = quantity === 1 ? 'keg' : `${quantity} kegs`;
    showNotification(`🍺 Bought ${displayText} (${totalBeers} beers) for $${totalCost.toLocaleString()}!`, 'success');
    addConsoleMessage(`💰 Corner Store: ${displayText} = ${totalBeers} beers for $${totalCost.toLocaleString()}`, 'green');
    
    updateUI();
    saveGameState();
    
    // Reset to 1 keg for next purchase
    if (qtyInput) qtyInput.value = '1';
    updateStoreAfterPurchase();
}

function buyCondomCrates() {
    const qtyInput = document.getElementById('crate_qty');
    const quantity = parseInt(qtyInput?.value) || 1;
    const totalCost = 700 * quantity;
    const totalCondoms = 1000 * quantity;
    
    if (gameState.player.cash < totalCost) {
        showNotification(`💸 Not enough cash! Need $${totalCost.toLocaleString()}`, 'error');
        return;
    }
    
    gameState.player.cash -= totalCost;
    gameState.resources.condoms = (gameState.resources.condoms || 0) + totalCondoms;
    
    const displayText = quantity === 1 ? 'crate' : `${quantity} crates`;
    showNotification(`🛡️ Bought ${displayText} (${totalCondoms} condoms) for $${totalCost.toLocaleString()}!`, 'success');
    addConsoleMessage(`💰 Corner Store: ${displayText} = ${totalCondoms} condoms for $${totalCost.toLocaleString()}`, 'green');
    
    updateUI();
    saveGameState();
    
    // Reset to 1 crate for next purchase
    if (qtyInput) qtyInput.value = '1';
    updateStoreAfterPurchase();
}

function updateStoreAfterPurchase() {
    // Update cash display in store modal
    const cashElements = document.querySelectorAll('.gold-text');
    cashElements.forEach(el => {
        if (el.textContent.includes('$') && el.textContent.includes(',')) {
            el.textContent = `$${gameState.player.cash.toLocaleString()}`;
        }
    });
    
    // Update all quantity displays
    updateQuantityDisplays();
}

// Enhanced Reggie's Plug with quantity selectors
function openReggiesPlug() {
    console.log('🌿 OPENING ENHANCED REGGIE\'S PLUG with quantity selectors');
    addConsoleMessage('🌿 Opening enhanced Reggie\'s Plug with quantity selectors', 'cyan');
    
    const modal = `
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div class="game-panel rounded-lg p-6 max-w-lg w-full my-8 max-h-[85vh] overflow-y-auto">
                <h3 class="text-xl font-bold cyan-glow mb-2">REGGIE'S PLUG</h3>
                <p class="text-sm text-gray-400 mb-4">🌿 Premium Weed • Heat +5 per purchase • Cash: <span class="gold-text">$${gameState.player.cash.toLocaleString()}</span></p>
                
                <div class="space-y-4">
                    <!-- Weed with Quantity Selector -->
                    <div class="border border-gray-700 rounded p-4 bg-gray-800/30">
                        <h4 class="font-bold text-green-400 mb-3">🌿 Premium Weed</h4>
                        
                        <!-- Eighth -->
                        <div class="mb-3 p-3 bg-gray-900/50 rounded">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-gray-300">Eighth (⅛ oz)</span>
                                <span class="text-green-400">$15 each</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="flex items-center gap-2">
                                    <button onclick="adjustQuantity('eighth_qty', -1)" class="w-8 h-8 bg-red-600 rounded text-white hover:bg-red-500">-</button>
                                    <input type="number" id="eighth_qty" value="5" min="1" max="50" 
                                           class="w-20 text-center bg-gray-800 border border-gray-600 rounded text-white py-1"
                                           oninput="updateWeedDisplays()">
                                    <button onclick="adjustQuantity('eighth_qty', 1)" class="w-8 h-8 bg-green-600 rounded text-white hover:bg-green-500">+</button>
                                </div>
                                <button onclick="buyWeedWithQuantity(15, 0.125, 'eighth_qty')" class="flex-1 action-btn rounded py-2 text-sm">
                                    Buy <span id="eighth_total">$75</span>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Quarter -->
                        <div class="mb-3 p-3 bg-gray-900/50 rounded">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-gray-300">Quarter (¼ oz)</span>
                                <span class="text-green-400">$28 each</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="flex items-center gap-2">
                                    <button onclick="adjustQuantity('quarter_qty', -1)" class="w-8 h-8 bg-red-600 rounded text-white hover:bg-red-500">-</button>
                                    <input type="number" id="quarter_qty" value="2" min="1" max="20" 
                                           class="w-20 text-center bg-gray-800 border border-gray-600 rounded text-white py-1"
                                           oninput="updateWeedDisplays()">
                                    <button onclick="adjustQuantity('quarter_qty', 1)" class="w-8 h-8 bg-green-600 rounded text-white hover:bg-green-500">+</button>
                                </div>
                                <button onclick="buyWeedWithQuantity(28, 0.25, 'quarter_qty')" class="flex-1 action-btn rounded py-2 text-sm">
                                    Buy <span id="quarter_total">$56</span>
                                </button>
                            </div>
                        </div>
                        
                        <!-- QP Deal (Best Value) -->
                        <div class="mb-3 p-3 bg-green-900/30 rounded border border-green-500/50">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-green-400">🔥 QP (4 oz) - BEST DEAL!</span>
                                <span class="text-green-400">$350 each</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="flex items-center gap-2">
                                    <button onclick="adjustQuantity('qp_qty', -1)" class="w-8 h-8 bg-red-600 rounded text-white hover:bg-red-500">-</button>
                                    <input type="number" id="qp_qty" value="1" min="1" max="10" 
                                           class="w-20 text-center bg-gray-800 border border-gray-600 rounded text-white py-1"
                                           oninput="updateWeedDisplays()">
                                    <button onclick="adjustQuantity('qp_qty', 1)" class="w-8 h-8 bg-green-600 rounded text-white hover:bg-green-500">+</button>
                                </div>
                                <button onclick="buyWeedWithQuantity(350, 4, 'qp_qty')" class="flex-1 bg-green-600 rounded py-2 text-sm hover:bg-green-500">
                                    Buy <span id="qp_total">$350</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-4 p-3 bg-yellow-900/30 rounded text-sm">
                    <p class="text-yellow-400">💡 Pro Tip: QP saves $50 vs buying 4 singles!</p>
                    <p class="text-gray-400 mt-1">Thugs need 1 oz per 8 thugs daily</p>
                </div>
                
                <button onclick="closeModal()" class="w-full mt-4 py-3 bg-gray-700 rounded font-bold">Close Store</button>
            </div>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = modal;
    
    // Initialize weed quantity displays
    updateWeedDisplays();
}

// Weed quantity display updates
function updateWeedDisplays() {
    // Update eighth total
    const eighthQty = parseInt(document.getElementById('eighth_qty')?.value) || 0;
    const eighthTotalEl = document.getElementById('eighth_total');
    if (eighthTotalEl) {
        eighthTotalEl.textContent = `$${(eighthQty * 15).toLocaleString()}`;
    }
    
    // Update quarter total
    const quarterQty = parseInt(document.getElementById('quarter_qty')?.value) || 0;
    const quarterTotalEl = document.getElementById('quarter_total');
    if (quarterTotalEl) {
        quarterTotalEl.textContent = `$${(quarterQty * 28).toLocaleString()}`;
    }
    
    // Update QP total
    const qpQty = parseInt(document.getElementById('qp_qty')?.value) || 0;
    const qpTotalEl = document.getElementById('qp_total');
    if (qpTotalEl) {
        qpTotalEl.textContent = `$${(qpQty * 350).toLocaleString()}`;
    }
}

// Enhanced weed buying with quantity
function buyWeedWithQuantity(unitPrice, ouncesPer, qtyInputId) {
    const qtyInput = document.getElementById(qtyInputId);
    const quantity = parseInt(qtyInput?.value) || 1;
    const totalCost = unitPrice * quantity;
    const totalOunces = ouncesPer * quantity;
    
    if (gameState.player.cash < totalCost) {
        showNotification(`💸 Not enough cash! Need $${totalCost.toLocaleString()}`, 'error');
        return;
    }
    
    gameState.player.cash -= totalCost;
    gameState.resources.weed = (gameState.resources.weed || 0) + totalOunces;
    gameState.player.heat = Math.min(100, (gameState.player.heat || 0) + 5); // +5 heat per purchase
    
    const displayText = quantity === 1 ? `${ouncesPer}oz weed` : `${quantity}x ${ouncesPer}oz weed (${totalOunces}oz total)`;
    showNotification(`🌿 Bought ${displayText} for $${totalCost.toLocaleString()}! Heat +5%`, 'success');
    addConsoleMessage(`💰 Reggie's Plug: ${displayText} purchased for $${totalCost.toLocaleString()} (+5% heat)`, 'green');
    
    updateUI();
    saveGameState();
    updateWeedStoreAfterPurchase();
}

function updateWeedStoreAfterPurchase() {
    // Update cash display in store modal
    const cashElements = document.querySelectorAll('.gold-text');
    cashElements.forEach(el => {
        if (el.textContent.includes('$') && el.textContent.includes(',')) {
            el.textContent = `$${gameState.player.cash.toLocaleString()}`;
        }
    });
    
    // Update all weed quantity displays
    updateWeedDisplays();
}

// Enhanced Tony's Chop Shop with quantity selectors
function openTonysChopShop() {
    console.log('🚗 OPENING ENHANCED TONY\'S CHOP SHOP with quantity selectors');
    addConsoleMessage('🚗 Opening enhanced Tony\'s Chop Shop with quantity selectors', 'cyan');
    
    const modal = `
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div class="game-panel rounded-lg p-6 max-w-lg w-full my-8 max-h-[85vh] overflow-y-auto">
                <h3 class="text-xl font-bold cyan-glow mb-2">TONY'S CHOP SHOP</h3>
                <p class="text-sm text-gray-400 mb-4">🚗 Premium Rides • Cash: <span class="gold-text">$${gameState.player.cash.toLocaleString()}</span></p>
                
                <div class="space-y-4">
                    <!-- Basic Vehicles -->
                    <div class="border border-gray-700 rounded p-4 bg-gray-800/30">
                        <h4 class="font-bold text-blue-400 mb-3">🚗 Basic Rides</h4>
                        
                        <!-- Bicycle -->
                        <div class="mb-3 p-3 bg-gray-900/50 rounded">
                            <div class="flex justify-between items-center mb-2">
                                <div>
                                    <span class="text-gray-300">Bicycle</span>
                                    <div class="text-xs text-gray-400">Silent getaway bike</div>
                                </div>
                                <span class="text-blue-400">$1,000 each</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="flex items-center gap-2">
                                    <button onclick="adjustQuantity('bicycle_qty', -1)" class="w-8 h-8 bg-red-600 rounded text-white hover:bg-red-500">-</button>
                                    <input type="number" id="bicycle_qty" value="1" min="1" max="10" 
                                           class="w-20 text-center bg-gray-800 border border-gray-600 rounded text-white py-1"
                                           oninput="updateVehicleDisplays()">
                                    <button onclick="adjustQuantity('bicycle_qty', 1)" class="w-8 h-8 bg-green-600 rounded text-white hover:bg-green-500">+</button>
                                </div>
                                <button onclick="buyVehicleWithQuantity('bicycle', 1000, 'bicycle_qty')" class="flex-1 action-btn rounded py-2 text-sm">
                                    Buy <span id="bicycle_total">$1,000</span>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Motorcycle -->
                        <div class="mb-3 p-3 bg-gray-900/50 rounded">
                            <div class="flex justify-between items-center mb-2">
                                <div>
                                    <span class="text-gray-300">Motorcycle</span>
                                    <div class="text-xs text-gray-400">Fast street bike</div>
                                </div>
                                <span class="text-blue-400">$3,500 each</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="flex items-center gap-2">
                                    <button onclick="adjustQuantity('motorcycle_qty', -1)" class="w-8 h-8 bg-red-600 rounded text-white hover:bg-red-500">-</button>
                                    <input type="number" id="motorcycle_qty" value="1" min="1" max="5" 
                                           class="w-20 text-center bg-gray-800 border border-gray-600 rounded text-white py-1"
                                           oninput="updateVehicleDisplays()">
                                    <button onclick="adjustQuantity('motorcycle_qty', 1)" class="w-8 h-8 bg-green-600 rounded text-white hover:bg-green-500">+</button>
                                </div>
                                <button onclick="buyVehicleWithQuantity('motorcycle', 3500, 'motorcycle_qty')" class="flex-1 action-btn rounded py-2 text-sm">
                                    Buy <span id="motorcycle_total">$3,500</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Premium Vehicles -->
                    <div class="border border-purple-700 rounded p-4 bg-purple-900/20">
                        <h4 class="font-bold text-purple-400 mb-3">🏆 Premium Rides</h4>
                        
                        <!-- Lowrider -->
                        <div class="mb-3 p-3 bg-gray-900/50 rounded">
                            <div class="flex justify-between items-center mb-2">
                                <div>
                                    <span class="text-gray-300">Lowrider</span>
                                    <div class="text-xs text-gray-400">Classic lowrider - street cred</div>
                                </div>
                                <span class="text-purple-400">$15,000 each</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="flex items-center gap-2">
                                    <button onclick="adjustQuantity('lowrider_qty', -1)" class="w-8 h-8 bg-red-600 rounded text-white hover:bg-red-500">-</button>
                                    <input type="number" id="lowrider_qty" value="1" min="1" max="3" 
                                           class="w-20 text-center bg-gray-800 border border-gray-600 rounded text-white py-1"
                                           oninput="updateVehicleDisplays()">
                                    <button onclick="adjustQuantity('lowrider_qty', 1)" class="w-8 h-8 bg-green-600 rounded text-white hover:bg-green-500">+</button>
                                </div>
                                <button onclick="buyVehicleWithQuantity('lowrider', 15000, 'lowrider_qty')" class="flex-1 action-btn rounded py-2 text-sm">
                                    Buy <span id="lowrider_total">$15,000</span>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Escalade -->
                        <div class="p-3 bg-gray-900/50 rounded">
                            <div class="flex justify-between items-center mb-2">
                                <div>
                                    <span class="text-gray-300">Escalade</span>
                                    <div class="text-xs text-gray-400">Luxury Escalade - crew transport</div>
                                </div>
                                <span class="text-purple-400">$35,000 each</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="flex items-center gap-2">
                                    <button onclick="adjustQuantity('escalade_qty', -1)" class="w-8 h-8 bg-red-600 rounded text-white hover:bg-red-500">-</button>
                                    <input type="number" id="escalade_qty" value="1" min="1" max="2" 
                                           class="w-20 text-center bg-gray-800 border border-gray-600 rounded text-white py-1"
                                           oninput="updateVehicleDisplays()">
                                    <button onclick="adjustQuantity('escalade_qty', 1)" class="w-8 h-8 bg-green-600 rounded text-white hover:bg-green-500">+</button>
                                </div>
                                <button onclick="buyVehicleWithQuantity('escalade', 35000, 'escalade_qty')" class="flex-1 action-btn rounded py-2 text-sm">
                                    Buy <span id="escalade_total">$35,000</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-4 p-3 bg-yellow-900/30 rounded text-sm">
                    <p class="text-yellow-400">💡 Pro Tip: Vehicles provide protection and status!</p>
                    <p class="text-gray-400 mt-1">Higher-end vehicles reduce heat from police</p>
                </div>
                
                <button onclick="closeModal()" class="w-full mt-4 py-3 bg-gray-700 rounded font-bold">Close Shop</button>
            </div>
        </div>
    `;
    document.getElementById('modalContainer').innerHTML = modal;
    
    // Initialize vehicle quantity displays
    updateVehicleDisplays();
}

// Vehicle quantity display updates
function updateVehicleDisplays() {
    // Update bicycle total
    const bicycleQty = parseInt(document.getElementById('bicycle_qty')?.value) || 0;
    const bicycleTotalEl = document.getElementById('bicycle_total');
    if (bicycleTotalEl) {
        bicycleTotalEl.textContent = `$${(bicycleQty * 1000).toLocaleString()}`;
    }
    
    // Update motorcycle total
    const motorcycleQty = parseInt(document.getElementById('motorcycle_qty')?.value) || 0;
    const motorcycleTotalEl = document.getElementById('motorcycle_total');
    if (motorcycleTotalEl) {
        motorcycleTotalEl.textContent = `$${(motorcycleQty * 3500).toLocaleString()}`;
    }
    
    // Update lowrider total
    const lowriderQty = parseInt(document.getElementById('lowrider_qty')?.value) || 0;
    const lowriderTotalEl = document.getElementById('lowrider_total');
    if (lowriderTotalEl) {
        lowriderTotalEl.textContent = `$${(lowriderQty * 15000).toLocaleString()}`;
    }
    
    // Update escalade total
    const escaladeQty = parseInt(document.getElementById('escalade_qty')?.value) || 0;
    const escaladeTotalEl = document.getElementById('escalade_total');
    if (escaladeTotalEl) {
        escaladeTotalEl.textContent = `$${(escaladeQty * 35000).toLocaleString()}`;
    }
}

// Enhanced vehicle buying with quantity
function buyVehicleWithQuantity(vehicleType, unitPrice, qtyInputId) {
    const qtyInput = document.getElementById(qtyInputId);
    const quantity = parseInt(qtyInput?.value) || 1;
    const totalCost = unitPrice * quantity;
    
    if (gameState.player.cash < totalCost) {
        showNotification(`💸 Not enough cash! Need $${totalCost.toLocaleString()}`, 'error');
        return;
    }
    
    gameState.player.cash -= totalCost;
    
    // Add vehicles to inventory
    if (!gameState.resources.vehicles[vehicleType]) {
        gameState.resources.vehicles[vehicleType] = 0;
    }
    gameState.resources.vehicles[vehicleType] += quantity;
    
    const displayText = quantity === 1 ? vehicleType : `${quantity} ${vehicleType}s`;
    showNotification(`🚗 Bought ${displayText} for $${totalCost.toLocaleString()}!`, 'success');
    addConsoleMessage(`💰 Tony's Chop Shop: ${displayText} purchased for $${totalCost.toLocaleString()}`, 'green');
    
    updateUI();
    saveGameState();
    updateVehicleStoreAfterPurchase();
}

function updateVehicleStoreAfterPurchase() {
    // Update cash display in store modal
    const cashElements = document.querySelectorAll('.gold-text');
    cashElements.forEach(el => {
        if (el.textContent.includes('$') && el.textContent.includes(',')) {
            el.textContent = `$${gameState.player.cash.toLocaleString()}`;
        }
    });
    
    // Update all vehicle quantity displays
    updateVehicleDisplays();
}