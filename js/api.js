/**
 * API Module for Warehouse Management System
 * Handles all backend communication with MS Access database
 */

class WarehouseAPI {
    constructor() {
        this.baseURL = '/api'; // Placeholder base URL
        this.timeout = 10000; // 10 seconds timeout
    }

    /**
     * Generic fetch wrapper with error handling
     * @param {string} url - API endpoint
     * @param {object} options - Fetch options
     * @returns {Promise} API response
     */
    async fetchData(url, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(`${this.baseURL}${url}`, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new Error('Timeout: La richiesta ha impiegato troppo tempo');
            }
            
            console.error('API Error:', error);
            throw new Error(`Errore di comunicazione: ${error.message}`);
        }
    }

    // ==================== MAGAZZINI ====================

    /**
     * Get list of warehouses
     * @returns {Promise<Array>} List of warehouses
     */
    async getWarehouses() {
        try {
            // Placeholder data - replace with actual API call
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve([
                        { id: 1, name: 'Magazzino Centrale', code: 'MC' },
                        { id: 2, name: 'Magazzino Nord', code: 'MN' },
                        { id: 3, name: 'Magazzino Sud', code: 'MS' },
                        { id: 4, name: 'Deposito Esterno', code: 'DE' }
                    ]);
                }, 500);
            });
        } catch (error) {
            throw new Error('Errore nel caricamento dei magazzini');
        }
    }

    // ==================== FORNITORI ====================

    /**
     * Get list of suppliers
     * @returns {Promise<Array>} List of suppliers
     */
    async getSuppliers() {
        try {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve([
                        { id: 1, name: 'Fornitore TT', type: 'TT', code: 'FTT001' },
                        { id: 2, name: 'Fornitore TG', type: 'TG', code: 'FTG001' },
                        { id: 3, name: 'Fornitore FLY', type: 'FLY', code: 'FLY001' },
                        { id: 4, name: 'Fornitore Generale', type: 'GEN', code: 'GEN001' }
                    ]);
                }, 400);
            });
        } catch (error) {
            throw new Error('Errore nel caricamento dei fornitori');
        }
    }

    // ==================== CLIENTI ====================

    /**
     * Get list of clients by type
     * @param {string} type - Client type (TT, TG, FLY)
     * @returns {Promise<Array>} List of clients
     */
    async getClientsByType(type) {
        try {
            return new Promise(resolve => {
                setTimeout(() => {
                    const clients = {
                        'TT': [
                            { id: 1, name: 'Cliente TT 1', code: 'CTT001' },
                            { id: 2, name: 'Cliente TT 2', code: 'CTT002' }
                        ],
                        'TG': [
                            { id: 3, name: 'Cliente TG 1', code: 'CTG001' },
                            { id: 4, name: 'Cliente TG 2', code: 'CTG002' }
                        ],
                        'FLY': [
                            { id: 5, name: 'Cliente FLY 1', code: 'CFLY001' },
                            { id: 6, name: 'Cliente FLY 2', code: 'CFLY002' }
                        ]
                    };
                    resolve(clients[type] || []);
                }, 300);
            });
        } catch (error) {
            throw new Error(`Errore nel caricamento dei clienti ${type}`);
        }
    }

    // ==================== ARTICOLI ====================

    /**
     * Search articles by barcode or text
     * @param {string} query - Search query (barcode or text)
     * @returns {Promise<Array>} List of matching articles
     */
    async searchArticles(query) {
        try {
            return new Promise(resolve => {
                setTimeout(() => {
                    // Simulate search results
                    const articles = [
                        { id: 1, code: '1234567890123', name: 'Articolo Test 1', price: 15.50, stock: 100 },
                        { id: 2, code: '2345678901234', name: 'Articolo Test 2', price: 25.00, stock: 50 },
                        { id: 3, code: '3456789012345', name: 'Articolo Test 3', price: 8.75, stock: 200 },
                        { id: 4, code: '4567890123456', name: 'Prodotto Esempio', price: 12.30, stock: 75 }
                    ];
                    
                    const filtered = articles.filter(article => 
                        article.code.includes(query) || 
                        article.name.toLowerCase().includes(query.toLowerCase())
                    );
                    
                    resolve(filtered);
                }, 600);
            });
        } catch (error) {
            throw new Error('Errore nella ricerca degli articoli');
        }
    }

    /**
     * Get article by barcode
     * @param {string} barcode - Article barcode
     * @returns {Promise<Object>} Article details
     */
    async getArticleByBarcode(barcode) {
        try {
            const articles = await this.searchArticles(barcode);
            const article = articles.find(a => a.code === barcode);
            
            if (!article) {
                throw new Error('Articolo non trovato');
            }
            
            return article;
        } catch (error) {
            throw new Error(`Errore nel caricamento dell'articolo: ${error.message}`);
        }
    }

    // ==================== ORDINI FORNITORE ====================

    /**
     * Get supplier orders
     * @param {number} supplierId - Supplier ID (optional)
     * @returns {Promise<Array>} List of supplier orders
     */
    async getSupplierOrders(supplierId = null) {
        try {
            return new Promise(resolve => {
                setTimeout(() => {
                    const orders = [
                        {
                            id: 1,
                            number: 'OF001',
                            supplierId: 1,
                            supplierName: 'Fornitore TT',
                            date: '2024-01-15',
                            status: 'pending',
                            items: [
                                { articleId: 1, articleName: 'Articolo Test 1', orderedQty: 50, receivedQty: 0 },
                                { articleId: 2, articleName: 'Articolo Test 2', orderedQty: 30, receivedQty: 0 }
                            ]
                        },
                        {
                            id: 2,
                            number: 'OF002',
                            supplierId: 2,
                            supplierName: 'Fornitore TG',
                            date: '2024-01-16',
                            status: 'partial',
                            items: [
                                { articleId: 3, articleName: 'Articolo Test 3', orderedQty: 100, receivedQty: 60 },
                                { articleId: 4, articleName: 'Prodotto Esempio', orderedQty: 25, receivedQty: 25 }
                            ]
                        },
                        {
                            id: 3,
                            number: 'OF003',
                            supplierId: 1,
                            supplierName: 'Fornitore TT',
                            date: '2024-01-17',
                            status: 'pending',
                            items: [
                                { articleId: 1, articleName: 'Articolo Test 1', orderedQty: 25, receivedQty: 0 },
                                { articleId: 3, articleName: 'Articolo Test 3', orderedQty: 75, receivedQty: 0 }
                            ]
                        }
                    ];
                    
                    const filtered = supplierId ? 
                        orders.filter(order => order.supplierId === supplierId) : 
                        orders;
                    
                    resolve(filtered);
                }, 400);
            });
        } catch (error) {
            throw new Error('Errore nel caricamento degli ordini fornitore');
        }
    }

    // ==================== MOVIMENTAZIONI ESTERNE ====================

    /**
     * Get external movements for loading
     * @returns {Promise<Array>} List of external movements
     */
    async getExternalMovements() {
        try {
            return new Promise(resolve => {
                setTimeout(() => {
                    const movements = [
                        {
                            id: 1,
                            number: 'ME001',
                            date: '2024-01-15',
                            clientType: 'TT',
                            clientName: 'Cliente TT 1',
                            status: 'shipped',
                            items: [
                                { articleId: 1, articleName: 'Articolo Test 1', quantity: 20, price: 15.50 },
                                { articleId: 2, articleName: 'Articolo Test 2', quantity: 15, price: 25.00 }
                            ]
                        },
                        {
                            id: 2,
                            number: 'ME002',
                            date: '2024-01-16',
                            clientType: 'TG',
                            clientName: 'Cliente TG 1',
                            status: 'shipped',
                            items: [
                                { articleId: 3, articleName: 'Articolo Test 3', quantity: 30, price: 8.75 },
                                { articleId: 4, articleName: 'Prodotto Esempio', quantity: 10, price: 12.30 }
                            ]
                        },
                        {
                            id: 3,
                            number: 'ME003',
                            date: '2024-01-17',
                            clientType: 'FLY',
                            clientName: 'Cliente FLY 1',
                            status: 'shipped',
                            items: [
                                { articleId: 1, articleName: 'Articolo Test 1', quantity: 40, price: 15.50 },
                                { articleId: 3, articleName: 'Articolo Test 3', quantity: 25, price: 8.75 }
                            ]
                        }
                    ];
                    
                    resolve(movements);
                }, 500);
            });
        } catch (error) {
            throw new Error('Errore nel caricamento delle movimentazioni esterne');
        }
    }

    // ==================== DOCUMENTI ====================

    /**
     * Create internal transfer document (Bolla Interna)
     * @param {Object} documentData - Document data
     * @returns {Promise<Object>} Created document
     */
    async createInternalTransfer(documentData) {
        try {
            return new Promise(resolve => {
                setTimeout(() => {
                    const document = {
                        id: Date.now(),
                        type: 'bolla_interna',
                        number: `BI${Date.now()}`,
                        date: new Date().toISOString().split('T')[0],
                        ...documentData,
                        status: 'created'
                    };
                    resolve(document);
                }, 800);
            });
        } catch (error) {
            throw new Error('Errore nella creazione della bolla interna');
        }
    }

    /**
     * Create delivery note (DDT)
     * @param {Object} documentData - Document data
     * @returns {Promise<Object>} Created document
     */
    async createDeliveryNote(documentData) {
        try {
            return new Promise(resolve => {
                setTimeout(() => {
                    const document = {
                        id: Date.now(),
                        type: 'ddt_emesso',
                        number: `DDT${Date.now()}`,
                        date: new Date().toISOString().split('T')[0],
                        ...documentData,
                        status: 'created'
                    };
                    resolve(document);
                }, 800);
            });
        } catch (error) {
            throw new Error('Errore nella creazione del DDT');
        }
    }

    /**
     * Create goods receipt
     * @param {Object} receiptData - Receipt data
     * @returns {Promise<Object>} Created receipt
     */
    async createGoodsReceipt(receiptData) {
        try {
            return new Promise(resolve => {
                setTimeout(() => {
                    const receipt = {
                        id: Date.now(),
                        type: 'carico_merce',
                        number: `CM${Date.now()}`,
                        date: new Date().toISOString().split('T')[0],
                        ...receiptData,
                        status: 'created'
                    };
                    resolve(receipt);
                }, 800);
            });
        } catch (error) {
            throw new Error('Errore nella creazione del carico merce');
        }
    }

    // ==================== STOCK MOVEMENTS ====================

    /**
     * Update stock levels
     * @param {Array} movements - Stock movements
     * @returns {Promise<Object>} Update result
     */
    async updateStock(movements) {
        try {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        success: true,
                        updatedItems: movements.length,
                        timestamp: new Date().toISOString()
                    });
                }, 600);
            });
        } catch (error) {
            throw new Error('Errore nell\'aggiornamento delle giacenze');
        }
    }

    // ==================== VALIDATION ====================

    /**
     * Validate document before submission
     * @param {Object} documentData - Document to validate
     * @returns {Promise<Object>} Validation result
     */
    async validateDocument(documentData) {
        try {
            return new Promise(resolve => {
                setTimeout(() => {
                    const errors = [];
                    const warnings = [];

                    // Basic validation
                    if (!documentData.items || documentData.items.length === 0) {
                        errors.push('Il documento deve contenere almeno un articolo');
                    }

                    // Check quantities
                    documentData.items?.forEach((item, index) => {
                        if (!item.quantity || item.quantity <= 0) {
                            errors.push(`Quantità non valida per l'articolo alla riga ${index + 1}`);
                        }
                        if (item.quantity > 1000) {
                            warnings.push(`Quantità elevata per l'articolo ${item.name}`);
                        }
                    });

                    // Check warehouses for internal transfers
                    if (documentData.type === 'bolla_interna') {
                        if (documentData.warehouseFrom === documentData.warehouseTo) {
                            errors.push('Magazzino di partenza e destinazione non possono essere uguali');
                        }
                    }

                    resolve({
                        valid: errors.length === 0,
                        errors,
                        warnings
                    });
                }, 300);
            });
        } catch (error) {
            throw new Error('Errore nella validazione del documento');
        }
    }
}

// Create global API instance
window.warehouseAPI = new WarehouseAPI();

// Utility function for handling API errors
window.handleAPIError = (error, context = '') => {
    console.error(`API Error ${context}:`, error);
    
    let message = 'Si è verificato un errore imprevisto';
    
    if (error.message.includes('Timeout')) {
        message = 'Operazione scaduta. Verificare la connessione di rete.';
    } else if (error.message.includes('Errore di comunicazione')) {
        message = 'Impossibile comunicare con il server. Riprovare più tardi.';
    } else if (error.message) {
        message = error.message;
    }
    
    if (window.showAlert) {
        window.showAlert('Errore', message, 'error');
    }
    
    return message;
};
