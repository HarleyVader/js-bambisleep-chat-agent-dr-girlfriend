// Local Storage Utilities - Agent Dr Girlfriend Secure Storage
// Following copilot-instructions.md: LocalForage for secure data persistence

import localforage from 'localforage';

// Configure LocalForage for optimal performance and security
localforage.config({
    driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
    name: 'AgentDrGirlfriendStorage',
    version: 1.0,
    storeName: 'secureStorage'
});

// Save to secure local storage using LocalForage
export const saveToLocalStorage = async (key, value) => {
    try {
        await localforage.setItem(key, value);
        return true;
    } catch (error) {
        console.error("Error saving to localStorage with LocalForage:", error);
        return false;
    }
};

// Load from secure local storage using LocalForage
export const loadFromLocalStorage = async (key) => {
    try {
        const value = await localforage.getItem(key);
        return value;
    } catch (error) {
        console.error("Error loading from localStorage with LocalForage:", error);
        return undefined;
    }
};

// Remove from secure local storage using LocalForage
export const removeFromLocalStorage = async (key) => {
    try {
        await localforage.removeItem(key);
        return true;
    } catch (error) {
        console.error("Error removing from localStorage with LocalForage:", error);
        return false;
    }
};

// Clear all secure local storage
export const clearLocalStorage = async () => {
    try {
        await localforage.clear();
        return true;
    } catch (error) {
        console.error("Error clearing localStorage with LocalForage:", error);
        return false;
    }
};

// Get all keys from secure local storage
export const getLocalStorageKeys = async () => {
    try {
        const keys = await localforage.keys();
        return keys;
    } catch (error) {
        console.error("Error getting localStorage keys:", error);
        return [];
    }
};

// Get storage size and usage information
export const getStorageInfo = async () => {
    try {
        const keys = await localforage.keys();
        let totalSize = 0;
        const items = {};

        for (const key of keys) {
            const value = await localforage.getItem(key);
            const size = JSON.stringify(value).length;
            totalSize += size;
            items[key] = {
                size,
                type: typeof value,
                lastModified: new Date().toISOString()
            };
        }

        return {
            totalKeys: keys.length,
            totalSize,
            items,
            driver: localforage.driver()
        };
    } catch (error) {
        console.error("Error getting storage info:", error);
        return null;
    }
};

// Legacy compatibility exports (for existing code)
export const getLocalMemory = loadFromLocalStorage;
export const setLocalMemory = saveToLocalStorage;

// Fallback to regular localStorage if LocalForage fails
const fallbackToRegularStorage = {
    save: (key, value) => {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
            return true;
        } catch (error) {
            console.error("Error with fallback localStorage save:", error);
            return false;
        }
    },

    load: (key) => {
        try {
            const serializedValue = localStorage.getItem(key);
            return serializedValue === null ? undefined : JSON.parse(serializedValue);
        } catch (error) {
            console.error("Error with fallback localStorage load:", error);
            return undefined;
        }
    },

    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error("Error with fallback localStorage remove:", error);
            return false;
        }
    }
};

// Test LocalForage availability and provide fallback
export const testStorage = async () => {
    try {
        await localforage.setItem('test', 'value');
        await localforage.removeItem('test');
        return {
            available: true,
            driver: localforage.driver(),
            fallback: false
        };
    } catch (error) {
        console.warn("LocalForage not available, using fallback storage:", error);
        return {
            available: false,
            driver: 'localStorage-fallback',
            fallback: true
        };
    }
};

export { fallbackToRegularStorage };
