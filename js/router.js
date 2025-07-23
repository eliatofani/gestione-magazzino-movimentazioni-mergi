/**
 * Client-side Router for Warehouse Management System
 * Handles navigation between different views without page reloads
 */

class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = '';
        this.init();
    }

    init() {
        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRouteChange());
        window.addEventListener('DOMContentLoaded', () => this.handleRouteChange());
    }

    /**
     * Register a route with its handler function
     * @param {string} path - The route path (e.g., 'home', 'scarico')
     * @param {function} handler - Function to execute when route is accessed
     */
    addRoute(path, handler) {
        this.routes[path] = handler;
    }

    /**
     * Navigate to a specific route
     * @param {string} path - The route to navigate to
     * @param {object} params - Optional parameters to pass to the route
     */
    navigateTo(path, params = {}) {
        if (path.startsWith('#')) {
            path = path.substring(1);
        }
        
        // Store parameters for the route
        if (Object.keys(params).length > 0) {
            sessionStorage.setItem(`route_params_${path}`, JSON.stringify(params));
        }
        
        window.location.hash = path;
    }

    /**
     * Get parameters for the current route
     * @returns {object} Route parameters
     */
    getRouteParams() {
        const params = sessionStorage.getItem(`route_params_${this.currentRoute}`);
        return params ? JSON.parse(params) : {};
    }

    /**
     * Handle route changes
     */
    handleRouteChange() {
        const hash = window.location.hash.substring(1) || 'home';
        this.currentRoute = hash;

        // Clear previous route parameters
        const keys = Object.keys(sessionStorage);
        keys.forEach(key => {
            if (key.startsWith('route_params_') && key !== `route_params_${hash}`) {
                sessionStorage.removeItem(key);
            }
        });

        // Execute route handler
        if (this.routes[hash]) {
            try {
                this.routes[hash]();
            } catch (error) {
                console.error(`Error executing route handler for ${hash}:`, error);
                this.handleError();
            }
        } else {
            console.warn(`Route not found: ${hash}`);
            this.navigateTo('home');
        }
    }

    /**
     * Handle routing errors
     */
    handleError() {
        if (window.showAlert) {
            window.showAlert('Errore di navigazione', 'Si è verificato un errore durante la navigazione.', 'error');
        }
        this.navigateTo('home');
    }

    /**
     * Get current route
     * @returns {string} Current route
     */
    getCurrentRoute() {
        return this.currentRoute;
    }

    /**
     * Go back to previous route or home
     */
    goBack() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            this.navigateTo('home');
        }
    }

    /**
     * Check if we can go back
     * @returns {boolean} True if we can go back
     */
    canGoBack() {
        return window.history.length > 1 && this.currentRoute !== 'home';
    }
}

// Create global router instance
window.router = new Router();

// Utility functions for navigation
window.navigateTo = (path, params) => window.router.navigateTo(path, params);
window.goBack = () => window.router.goBack();
window.getCurrentRoute = () => window.router.getCurrentRoute();
window.getRouteParams = () => window.router.getRouteParams();
