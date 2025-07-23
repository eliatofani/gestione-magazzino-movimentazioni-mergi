/**
 * Simplified Warehouse Management System
 * Bootstrap-based touch-optimized interface
 */

class WarehouseApp {
    constructor() {
        this.currentFlow = null;
        this.currentDocument = null;
        this.documentItems = [];
        this.isEditMode = true;
        this.selectedArticle = null;
        this.searchResults = [];
        this.init();
    }

    init() {
        // Register routes
        this.registerRoutes();
        
        // Initialize event listeners
        this.initEventListeners();

        // Explicitly bind searchArticles to input event
        const articleSearchInput = document.getElementById('articleSearch');
        if (articleSearchInput) {
            articleSearchInput.addEventListener('keyup', (event) => this.searchArticles(event));
        }
        
        // Start the application
        console.log('Simplified Warehouse Management System initialized');
    }

    registerRoutes() {
        window.router.addRoute('home', () => this.renderHome());
        window.router.addRoute('trasferimento', () => this.renderTrasferimentoInterno());
        window.router.addRoute('movimentazione', () => this.renderMovimentazioneEsterna());
        window.router.addRoute('carico-esterno', () => this.renderCaricoEsterno());
        window.router.addRoute('carico-fornitore', () => this.renderCaricoFornitore());
    }

    initEventListeners() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    // ==================== HOME VIEW ====================

    renderHome() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="container-fluid">
                <div class="row justify-content-center">
                    <div class="col-12 col-md-10 col-lg-8">
                        <div class="company-header text-center">
                            <h1 class="display-5 mb-2">Sistema Gestione Magazzino</h1>
                            <p class="lead mb-0">Piattaforma aziendale per movimentazioni merci</p>
                            <small class="text-muted d-block mt-2">Interfaccia semplificata e professionale</small>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <button class="btn main-operation-btn btn-trasferimento w-100" onclick="navigateTo('trasferimento')">
                                    <span class="operation-icon">🔄</span>
                                    <div class="mt-2">
                                        <strong class="d-block">Trasferimento Interno</strong>
                                        <small class="d-block mt-1 opacity-75">Movimentazione tra magazzini aziendali</small>
                                    </div>
                                </button>
                            </div>
                            
                            <div class="col-md-6">
                                <button class="btn main-operation-btn btn-movimentazione w-100" onclick="navigateTo('movimentazione')">
                                    <span class="operation-icon">📤</span>
                                    <div class="mt-2">
                                        <strong class="d-block">Movimentazione Esterna</strong>
                                        <small class="d-block mt-1 opacity-75">Spedizioni verso clienti esterni</small>
                                    </div>
                                </button>
                            </div>
                            
                            <div class="col-md-6">
                                <button class="btn main-operation-btn btn-carico-esterno w-100" onclick="navigateTo('carico-esterno')">
                                    <span class="operation-icon">📥</span>
                                    <div class="mt-2">
                                        <strong class="d-block">Carico Movimentazione Esterna</strong>
                                        <small class="d-block mt-1 opacity-75">Ricevimento da movimentazioni esterne</small>
                                    </div>
                                </button>
                            </div>
                            
                            <div class="col-md-6">
                                <button class="btn main-operation-btn btn-carico-fornitore w-100" onclick="navigateTo('carico-fornitore')">
                                    <span class="operation-icon">🏭</span>
                                    <div class="mt-2">
                                        <strong class="d-block">Carico da Fornitore</strong>
                                        <small class="d-block mt-1 opacity-75">Ricevimento merce da fornitori</small>
                                    </div>
                                </button>
                            </div>
                        </div>
                        
                        <div class="text-center mt-4">
                            <small class="text-white-50">
                                <i class="fas fa-shield-alt me-1"></i>
                                Sistema sicuro e professionale per la gestione aziendale
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ==================== SIMPLIFIED FLOWS ====================

    async renderTrasferimentoInterno() {
        this.currentFlow = { type: 'trasferimento' };
        this.documentItems = [];
        this.isEditMode = true;

        try {
            const warehouses = await window.warehouseAPI.getWarehouses();
            
            const app = document.getElementById('app');
            app.innerHTML = `
                <div class="container-fluid">
                    <div class="row justify-content-center">
                        <div class="col-12 col-lg-8">
                            <div class="card shadow">
                                <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                                    <h4 class="mb-0">🔄 Trasferimento Interno</h4>
                                    <button class="btn btn-outline-light btn-sm" onclick="navigateTo('home')">
                                        ← Indietro
                                    </button>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label fw-bold">Magazzino Partenza</label>
                                            <select class="form-select" id="warehouseFrom" onchange="app.validateWarehouses()">
                                                <option value="">Seleziona magazzino...</option>
                                                ${warehouses.map(w => `<option value="${w.id}">${w.name}</option>`).join('')}
                                            </select>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label fw-bold">Magazzino Destinazione</label>
                                            <select class="form-select" id="warehouseTo" onchange="app.validateWarehouses()">
                                                <option value="">Seleziona magazzino...</option>
                                                ${warehouses.map(w => `<option value="${w.id}">${w.name}</option>`).join('')}
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div id="items-section" class="hidden">
                                        ${this.renderItemsSection()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            this.showToast('Errore', 'Errore nel caricamento dei magazzini', 'danger');
        }
    }

    async renderMovimentazioneEsterna() {
        this.currentFlow = { type: 'movimentazione' };
        this.documentItems = [];
        this.isEditMode = true;

        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="container-fluid">
                <div class="row justify-content-center">
                    <div class="col-12 col-lg-8">
                        <div class="card shadow">
                            <div class="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
                                <h4 class="mb-0">📤 Movimentazione Esterna</h4>
                                <button class="btn btn-outline-dark btn-sm" onclick="navigateTo('home')">
                                    ← Indietro
                                </button>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label fw-bold">Tipo Cliente</label>
                                        <select class="form-select" id="clientType" onchange="app.loadClients()">
                                            <option value="">Seleziona tipo...</option>
                                            <option value="TT">TT</option>
                                            <option value="TG">TG</option>
                                            <option value="FLY">FLY</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 mb-3 hidden" id="client-group">
                                        <label class="form-label fw-bold">Cliente</label>
                                        <select class="form-select" id="client">
                                            <option value="">Seleziona cliente...</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div id="items-section" class="hidden">
                                    ${this.renderItemsSection()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async renderCaricoEsterno() {
        this.currentFlow = { type: 'carico-esterno' };
        this.documentItems = [];
        this.isEditMode = true;

        try {
            const warehouses = await window.warehouseAPI.getWarehouses();
            
            const app = document.getElementById('app');
            app.innerHTML = `
                <div class="container-fluid">
                    <div class="row justify-content-center">
                        <div class="col-12 col-lg-8">
                            <div class="card shadow">
                                <div class="card-header d-flex justify-content-between align-items-center" style="background: #9c27b0; color: white;">
                                    <h4 class="mb-0">📥 Carico Movimentazione Esterna</h4>
                                    <button class="btn btn-outline-light btn-sm" onclick="navigateTo('home')">
                                        ← Indietro
                                    </button>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label fw-bold">Magazzino di Destinazione</label>
                                            <select class="form-select" id="warehouseTo" onchange="app.enableExternalMovementSelection()">
                                                <option value="">Seleziona magazzino...</option>
                                                ${warehouses.map(w => `<option value="${w.id}">${w.name}</option>`).join('')}
                                            </select>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label fw-bold">Movimentazione Esterna</label>
                                            <select class="form-select" id="externalMovement" onchange="app.handleExternalMovementSelection()">
                                                <option value="">Caricamento movimentazioni...</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div id="items-section" class="hidden">
                                        ${this.renderItemsSection()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Load external movements
            this.loadExternalMovements();
        } catch (error) {
            this.showToast('Errore', 'Errore nel caricamento dei magazzini', 'danger');
        }
    }

    async renderCaricoFornitore() {
        this.currentFlow = { type: 'carico-fornitore' };
        this.documentItems = [];
        this.isEditMode = true;

        try {
            const warehouses = await window.warehouseAPI.getWarehouses();
            const suppliers = await window.warehouseAPI.getSuppliers();
            
            const app = document.getElementById('app');
            app.innerHTML = `
                <div class="container-fluid">
                    <div class="row justify-content-center">
                        <div class="col-12 col-lg-8">
                            <div class="card shadow">
                                <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
                                    <h4 class="mb-0">🏭 Carico da Fornitore</h4>
                                    <button class="btn btn-outline-light btn-sm" onclick="navigateTo('home')">
                                        ← Indietro
                                    </button>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-4 mb-3">
                                            <label class="form-label fw-bold">Magazzino di Carico</label>
                                            <select class="form-select" id="warehouseTo" onchange="app.enableSupplierSelection()">
                                                <option value="">Seleziona magazzino...</option>
                                                ${warehouses.map(w => `<option value="${w.id}">${w.name}</option>`).join('')}
                                            </select>
                                        </div>
                                        <div class="col-md-4 mb-3">
                                            <label class="form-label fw-bold">Fornitore</label>
                                            <select class="form-select" id="supplier" onchange="app.handleSupplierSelection()">
                                                <option value="">Seleziona fornitore...</option>
                                                ${suppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                                            </select>
                                        </div>
                                        <div class="col-md-4 mb-3">
                                            <label class="form-label fw-bold">Ordine Fornitore</label>
                                            <select class="form-select" id="supplierOrder" onchange="app.handleOrderSelection()">
                                                <option value="">Prima seleziona fornitore...</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div class="row mb-3" id="order-options" style="display: none;">
                                        <div class="col-12">
                                            <div class="alert alert-info">
                                                <strong>Opzioni:</strong>
                                                <div class="form-check mt-2">
                                                    <input class="form-check-input" type="radio" name="orderOption" id="selectExistingOrder" value="existing" onchange="app.handleOrderOptionChange()">
                                                    <label class="form-check-label" for="selectExistingOrder">
                                                        Seleziona ordine esistente
                                                    </label>
                                                </div>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="radio" name="orderOption" id="createNewOrder" value="new" onchange="app.handleOrderOptionChange()">
                                                    <label class="form-check-label" for="createNewOrder">
                                                        Inserimento libero (senza ordine)
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div id="items-section" class="hidden">
                                        ${this.renderItemsSection()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            this.showToast('Errore', 'Errore nel caricamento dei dati', 'danger');
        }
    }

    // ==================== ITEMS SECTION ====================

    renderItemsSection() {
        return `
            <div class="add-item-form mb-4">
                <h5 class="mb-3">Aggiungi Articolo</h5>
                <div class="row g-3">
                    <div class="col-md-4">
                        <label class="form-label">Codice a Barre / Ricerca</label>
                        <div class="position-relative">
                            <input type="text" class="form-control" id="articleSearch" 
                                   placeholder="Scansiona o digita per cercare...">
                            <div id="search-results" class="search-results hidden"></div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Quantità</label>
                        <input type="number" class="form-control" id="quantity" 
                               placeholder="0" min="1" step="1">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Prezzo</label>
                        <input type="number" class="form-control" id="price" 
                               placeholder="0.00" step="0.01" readonly>
                    </div>
                    <div class="col-md-2 d-flex align-items-end">
                        <button class="btn btn-primary w-100" onclick="app.addItem()">
                            Aggiungi
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="table-responsive mb-4">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Codice</th>
                            <th>Articolo</th>
                            <th>Quantità</th>
                            <th>Prezzo</th>
                            <th>Totale</th>
                            <th>Azioni</th>
                        </tr>
                    </thead>
                    <tbody id="items-table-body">
                        <tr>
                            <td colspan="6" class="text-center text-muted">Nessun articolo aggiunto</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="d-flex gap-2 justify-content-end">
                <button class="btn btn-secondary" onclick="app.cancelDocument()">
                    Annulla
                </button>
                <button class="btn btn-success" onclick="app.confirmDocument()" disabled id="confirm-btn">
                    Conferma Documento
                </button>
            </div>
        `;
    }

    // ==================== FORM HANDLERS ====================

    validateWarehouses() {
        const warehouseFrom = document.getElementById('warehouseFrom')?.value;
        const warehouseTo = document.getElementById('warehouseTo')?.value;
        
        if (warehouseFrom && warehouseTo) {
            if (warehouseFrom === warehouseTo) {
                this.showToast('Errore', 'Magazzino di partenza e destinazione non possono essere uguali', 'danger');
                return false;
            }
            document.getElementById('items-section').classList.remove('hidden');
            return true;
        }
        return false;
    }

    enableItemsSection() {
        const warehouse = document.getElementById('warehouseTo')?.value;
        if (warehouse) {
            document.getElementById('items-section').classList.remove('hidden');
        }
    }

    // ==================== CARICO MOVIMENTAZIONI ESTERNE ====================

    async loadExternalMovements() {
        try {
            const movements = await window.warehouseAPI.getExternalMovements();
            const movementSelect = document.getElementById('externalMovement');
            
            movementSelect.innerHTML = '<option value="">Seleziona movimentazione...</option>' +
                movements.map(m => `<option value="${m.id}">${m.number} - ${m.clientName} (${m.date})</option>`).join('');
        } catch (error) {
            this.showToast('Errore', 'Errore nel caricamento delle movimentazioni esterne', 'danger');
        }
    }

    enableExternalMovementSelection() {
        const warehouse = document.getElementById('warehouseTo').value;
        if (warehouse) {
            document.getElementById('externalMovement').disabled = false;
        }
    }

    async handleExternalMovementSelection() {
        const movementId = document.getElementById('externalMovement').value;
        const itemsSection = document.getElementById('items-section');
        
        if (!movementId) {
            itemsSection.classList.add('hidden');
            return;
        }
        
        try {
            const movements = await window.warehouseAPI.getExternalMovements();
            const movement = movements.find(m => m.id == movementId);
            
            if (movement) {
                this.documentItems = movement.items.map(item => ({
                    id: item.articleId,
                    code: `ART${item.articleId.toString().padStart(6, '0')}`,
                    name: item.articleName,
                    quantity: item.quantity,
                    price: item.price,
                    isExternalMovementItem: true
                }));
                
                this.updateItemsTable();
                itemsSection.classList.remove('hidden');
                document.getElementById('confirm-btn').disabled = false;
            }
        } catch (error) {
            this.showToast('Errore', 'Errore nel caricamento degli articoli della movimentazione', 'danger');
        }
    }

    // ==================== CARICO DA FORNITORE ====================

    enableSupplierSelection() {
        const warehouse = document.getElementById('warehouseTo').value;
        if (warehouse) {
            document.getElementById('supplier').disabled = false;
        }
    }

    async handleSupplierSelection() {
        const supplierId = document.getElementById('supplier').value;
        const orderSelect = document.getElementById('supplierOrder');
        const orderOptions = document.getElementById('order-options');
        
        if (!supplierId) {
            orderSelect.innerHTML = '<option value="">Prima seleziona fornitore...</option>';
            orderOptions.style.display = 'none';
            return;
        }
        
        try {
            const orders = await window.warehouseAPI.getSupplierOrders(parseInt(supplierId));
            orderSelect.innerHTML = '<option value="">Seleziona ordine...</option>' +
                orders.map(o => `<option value="${o.id}">${o.number} - ${o.date} (${o.status})</option>`).join('');
            
            orderOptions.style.display = 'block';
            orderSelect.disabled = false;
        } catch (error) {
            this.showToast('Errore', 'Errore nel caricamento degli ordini del fornitore', 'danger');
        }
    }

    handleOrderOptionChange() {
        const selectedOption = document.querySelector('input[name="orderOption"]:checked').value;
        const orderSelect = document.getElementById('supplierOrder');
        const itemsSection = document.getElementById('items-section');
        
        if (selectedOption === 'existing') {
            orderSelect.disabled = false;
            itemsSection.classList.add('hidden');
        } else if (selectedOption === 'new') {
            orderSelect.disabled = true;
            orderSelect.value = '';
            this.documentItems = [];
            this.updateItemsTable();
            itemsSection.classList.remove('hidden');
            document.getElementById('confirm-btn').disabled = true;
        }
    }

    async loadClients() {
        const clientType = document.getElementById('clientType').value;
        const clientGroup = document.getElementById('client-group');
        const clientSelect = document.getElementById('client');
        
        if (!clientType) {
            clientGroup.classList.add('hidden');
            return;
        }
        
        try {
            const clients = await window.warehouseAPI.getClientsByType(clientType);
            clientSelect.innerHTML = '<option value="">Seleziona cliente...</option>' +
                clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
            
            clientGroup.classList.remove('hidden');
            
            // Show items section when client is selected
            clientSelect.onchange = () => {
                if (clientSelect.value) {
                    document.getElementById('items-section').classList.remove('hidden');
                }
            };
        } catch (error) {
            this.showToast('Errore', 'Errore nel caricamento dei clienti', 'danger');
        }
    }

    async handleOrderSelection() {
        const orderId = document.getElementById('supplierOrder').value;
        const itemsSection = document.getElementById('items-section');
        
        if (!orderId) {
            itemsSection.classList.add('hidden');
            return;
        }
        
        try {
            const orders = await window.warehouseAPI.getSupplierOrders();
            const order = orders.find(o => o.id == orderId);
            
            if (order) {
                this.documentItems = order.items.map(item => ({
                    id: item.articleId,
                    code: `ART${item.articleId.toString().padStart(6, '0')}`,
                    name: item.articleName,
                    quantity: item.receivedQty,
                    orderedQty: item.orderedQty,
                    price: 0,
                    isOrderItem: true
                }));
                
                this.updateItemsTable();
                itemsSection.classList.remove('hidden');
                document.getElementById('confirm-btn').disabled = false;
            }
        } catch (error) {
            this.showToast('Errore', 'Errore nel caricamento degli articoli dell\'ordine', 'danger');
        }
    }

    // ==================== ARTICLE SEARCH ====================

    async searchArticles(event) {
        const query = event.target.value.trim();
        const resultsDiv = document.getElementById('search-results');
        
        if (query.length < 2) {
            resultsDiv.classList.add('hidden');
            return;
        }
        
        try {
            const articles = await window.warehouseAPI.searchArticles(query);
            
            if (articles.length === 0) {
                resultsDiv.innerHTML = '<div class="search-result">Nessun articolo trovato</div>';
            } else {
                // Store articles in a temporary array for selection
                this.searchResults = articles;
                
                resultsDiv.innerHTML = articles.map((article, index) => `
                    <div class="search-result" onclick="app.selectArticleByIndex(${index})">
                        <strong>${article.code}</strong> - ${article.name}
                        <span class="price">€ ${article.price.toFixed(2)}</span>
                    </div>
                `).join('');
            }
            
            resultsDiv.classList.remove('hidden');
        } catch (error) {
            this.showToast('Errore', 'Errore nella ricerca degli articoli', 'danger');
        }
    }

    selectArticleByIndex(index) {
        if (!this.searchResults || !this.searchResults[index]) {
            this.showToast('Errore', 'Articolo non trovato', 'danger');
            return;
        }
        
        const article = this.searchResults[index];
        this.selectArticle(article);
    }

    selectArticle(article) {
        document.getElementById('articleSearch').value = `${article.code} - ${article.name}`;
        document.getElementById('price').value = article.price.toFixed(2);
        document.getElementById('search-results').classList.add('hidden');
        
        // Store selected article
        this.selectedArticle = article;
        
        // Focus on quantity
        document.getElementById('quantity').focus();
    }

    // ==================== ITEM MANAGEMENT ====================

    addItem() {
        const articleSearch = document.getElementById('articleSearch').value;
        const quantity = parseFloat(document.getElementById('quantity').value);
        const price = parseFloat(document.getElementById('price').value);
        
        // Validation
        if (!articleSearch || !this.selectedArticle) {
            this.showToast('Errore', 'Seleziona un articolo valido', 'danger');
            return;
        }
        
        if (!quantity || quantity <= 0) {
            this.showToast('Errore', 'Inserisci una quantità valida', 'danger');
            return;
        }
        
        if (!price || price < 0) {
            this.showToast('Errore', 'Prezzo non valido', 'danger');
            return;
        }
        
        // Check if item already exists
        const existingIndex = this.documentItems.findIndex(item => item.id === this.selectedArticle.id);
        
        if (existingIndex >= 0) {
            this.documentItems[existingIndex].quantity += quantity;
        } else {
            this.documentItems.push({
                id: this.selectedArticle.id,
                code: this.selectedArticle.code,
                name: this.selectedArticle.name,
                quantity: quantity,
                price: price
            });
        }
        
        // Clear form
        document.getElementById('articleSearch').value = '';
        document.getElementById('quantity').value = '';
        document.getElementById('price').value = '';
        this.selectedArticle = null;
        
        // Update table
        this.updateItemsTable();
        
        // Enable confirm button
        document.getElementById('confirm-btn').disabled = false;
    }

    updateItemsTable() {
        const tbody = document.getElementById('items-table-body');
        
        if (this.documentItems.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nessun articolo aggiunto</td></tr>';
            return;
        }
        
        tbody.innerHTML = this.documentItems.map((item, index) => `
            <tr>
                <td>${item.code}</td>
                <td>${item.name}</td>
                <td>
                    ${item.isOrderItem ? 
                        `<input type="number" class="form-control form-control-sm" value="${item.quantity}" min="0" max="${item.orderedQty}" 
                                onchange="app.updateItemQuantity(${index}, this.value)" 
                                ${!this.isEditMode ? 'disabled' : ''}>
                         <small class="text-muted">/${item.orderedQty}</small>` :
                        item.isExternalMovementItem ?
                        `<span class="badge bg-info">${item.quantity}</span>
                         <small class="text-muted d-block">Da movimentazione esterna</small>` :
                        `<span>${item.quantity}</span>`
                    }
                </td>
                <td>€ ${item.price.toFixed(2)}</td>
                <td>€ ${(item.quantity * item.price).toFixed(2)}</td>
                <td>
                    ${this.isEditMode && !item.isExternalMovementItem ? `
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-secondary" onclick="app.editItem(${index})">
                                Modifica
                            </button>
                            <button class="btn btn-outline-danger" onclick="app.removeItem(${index})">
                                Elimina
                            </button>
                        </div>
                    ` : item.isExternalMovementItem ? 
                        `<small class="text-muted">Importato</small>` : ''}
                </td>
            </tr>
        `).join('');
    }

    updateItemQuantity(index, newQuantity) {
        const quantity = parseFloat(newQuantity);
        if (quantity >= 0) {
            this.documentItems[index].quantity = quantity;
            this.updateItemsTable();
        }
    }

    editItem(index) {
        const item = this.documentItems[index];
        
        // Populate form with item data
        document.getElementById('articleSearch').value = `${item.code} - ${item.name}`;
        document.getElementById('quantity').value = item.quantity;
        document.getElementById('price').value = item.price;
        
        this.selectedArticle = item;
        
        // Remove item from list (will be re-added when form is submitted)
        this.removeItem(index);
    }

    removeItem(index) {
        this.documentItems.splice(index, 1);
        this.updateItemsTable();
        
        if (this.documentItems.length === 0) {
            document.getElementById('confirm-btn').disabled = true;
        }
    }

    // ==================== DOCUMENT ACTIONS ====================

    async confirmDocument() {
        if (this.documentItems.length === 0) {
            this.showToast('Errore', 'Aggiungi almeno un articolo al documento', 'danger');
            return;
        }
        
        try {
            // Validate document
            const documentData = this.buildDocumentData();
            const validation = await window.warehouseAPI.validateDocument(documentData);
            
            if (!validation.valid) {
                this.showToast('Errori di Validazione', validation.errors.join('\n'), 'danger');
                return;
            }
            
            if (validation.warnings.length > 0) {
                this.showToast('Attenzione', validation.warnings.join('\n'), 'warning');
            }
            
            // Create document
            let result;
            if (this.currentFlow.type === 'trasferimento') {
                result = await window.warehouseAPI.createInternalTransfer(documentData);
            } else if (this.currentFlow.type === 'movimentazione') {
                result = await window.warehouseAPI.createDeliveryNote(documentData);
            } else {
                result = await window.warehouseAPI.createGoodsReceipt(documentData);
            }
            
            // Update stock
            await window.warehouseAPI.updateStock(this.buildStockMovements());
            
            // Disable editing
            this.isEditMode = false;
            this.updateItemsTable();
            
            // Update UI
            document.getElementById('confirm-btn').textContent = 'Documento Confermato';
            document.getElementById('confirm-btn').disabled = true;
            document.querySelector('.add-item-form').style.display = 'none';
            
            this.showToast('Successo', `Documento ${result.number} creato con successo`, 'success');
            
        } catch (error) {
            this.showToast('Errore', 'Errore nella creazione del documento', 'danger');
        }
    }

    buildDocumentData() {
        const data = {
            type: this.currentFlow.type,
            items: this.documentItems.map(item => ({
                articleId: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            }))
        };
        
        // Add specific fields based on flow type
        if (this.currentFlow.type === 'trasferimento') {
            data.warehouseFrom = document.getElementById('warehouseFrom').value;
            data.warehouseTo = document.getElementById('warehouseTo').value;
        } else if (this.currentFlow.type === 'movimentazione') {
            data.clientType = document.getElementById('clientType').value;
            data.clientId = document.getElementById('client').value;
        } else {
            data.warehouseTo = document.getElementById('warehouseTo').value;
            data.supplierId = document.getElementById('supplier')?.value;
            data.orderId = document.getElementById('supplierOrder')?.value;
        }
        
        return data;
    }

    buildStockMovements() {
        return this.documentItems.map(item => ({
            articleId: item.id,
            quantity: item.quantity,
            type: this.currentFlow.type,
            warehouseFrom: document.getElementById('warehouseFrom')?.value,
            warehouseTo: document.getElementById('warehouseTo')?.value
        }));
    }

    cancelDocument() {
        if (this.documentItems.length > 0) {
            if (confirm('Sei sicuro di voler annullare? Tutti i dati inseriti andranno persi.')) {
                window.navigateTo('home');
            }
        } else {
            window.navigateTo('home');
        }
    }

    // ==================== UTILITY FUNCTIONS ====================

    showToast(title, message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        const toastId = 'toast-' + Date.now();
        
        const toastHtml = `
            <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true" id="${toastId}">
                <div class="toast-header">
                    <strong class="me-auto text-${type}">${title}</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;
        
        toastContainer.insertAdjacentHTML('beforeend', toastHtml);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            const toast = document.getElementById(toastId);
            if (toast) {
                toast.remove();
            }
        }, 5000);
    }

    closeModal() {
        const modal = bootstrap.Modal.getInstance(document.getElementById('documentModal'));
        if (modal) {
            modal.hide();
        }
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new WarehouseApp();
    window.showAlert = (title, message, type) => window.app.showToast(title, message, type);
});
