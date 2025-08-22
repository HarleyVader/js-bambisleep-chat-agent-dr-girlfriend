// Memory Service - Agent Dr Girlfriend Memory Management System
// Following copilot-instructions.md: LocalForage for secure local storage

import localforage from 'localforage';

// Configure LocalForage for enhanced security and performance
localforage.config({
    driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
    name: 'AgentDrGirlfriendDB',
    version: 1.0,
    storeName: 'memories'
});

// Memory categories for organization
const MEMORY_CATEGORIES = {
    USER_PROFILE: 'user_profile',
    CONVERSATION_HISTORY: 'conversation_history',
    EMOTIONAL_STATES: 'emotional_states',
    PREFERENCES: 'preferences',
    RECENT_MESSAGES: 'recent_messages',
    USER_CONTEXT: 'user_context',
    RELATIONSHIP_DATA: 'relationship_data'
};

// Get memory by key
export const getMemory = async (key) => {
    try {
        const value = await localforage.getItem(key);
        return value;
    } catch (error) {
        console.error(`Error getting memory for key ${key}:`, error);
        return null;
    }
};

// Set memory by key
export const setMemory = async (key, value) => {
    try {
        await localforage.setItem(key, value);
        return true;
    } catch (error) {
        console.error(`Error setting memory for key ${key}:`, error);
        return false;
    }
};

// Remove memory by key
export const removeMemory = async (key) => {
    try {
        await localforage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error removing memory for key ${key}:`, error);
        return false;
    }
};

// Clear all memories (nuclear option)
export const clearAllMemories = async () => {
    try {
        await localforage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing all memories:', error);
        return false;
    }
};

// Get user profile with defaults
export const getUserProfile = async () => {
    const profile = await getMemory(MEMORY_CATEGORIES.USER_PROFILE);
    return profile || {
        name: '',
        preferred_name: '',
        relationship_level: 'getting_to_know',
        preferred_mode: 'GIRLFRIEND',
        emotional_preferences: {},
        created_at: new Date().toISOString()
    };
};

// Update user profile
export const updateUserProfile = async (updates) => {
    const currentProfile = await getUserProfile();
    const updatedProfile = {
        ...currentProfile,
        ...updates,
        updated_at: new Date().toISOString()
    };
    return await setMemory(MEMORY_CATEGORIES.USER_PROFILE, updatedProfile);
};

// Save conversation message
export const saveConversationMessage = async (message) => {
    try {
        const history = await getMemory(MEMORY_CATEGORIES.CONVERSATION_HISTORY) || [];
        const messageWithTimestamp = {
            ...message,
            saved_at: new Date().toISOString()
        };

        history.push(messageWithTimestamp);

        // Keep only last 100 messages to manage storage
        if (history.length > 100) {
            history.splice(0, history.length - 100);
        }

        return await setMemory(MEMORY_CATEGORIES.CONVERSATION_HISTORY, history);
    } catch (error) {
        console.error('Error saving conversation message:', error);
        return false;
    }
};

// Get conversation history
export const getConversationHistory = async (limit = 50) => {
    try {
        const history = await getMemory(MEMORY_CATEGORIES.CONVERSATION_HISTORY) || [];
        return limit ? history.slice(-limit) : history;
    } catch (error) {
        console.error('Error getting conversation history:', error);
        return [];
    }
};

// Save emotional state
export const saveEmotionalState = async (emotion, context = {}) => {
    try {
        const states = await getMemory(MEMORY_CATEGORIES.EMOTIONAL_STATES) || [];
        const emotionalState = {
            emotion,
            context,
            timestamp: new Date().toISOString()
        };

        states.push(emotionalState);

        // Keep only last 50 emotional states
        if (states.length > 50) {
            states.splice(0, states.length - 50);
        }

        return await setMemory(MEMORY_CATEGORIES.EMOTIONAL_STATES, states);
    } catch (error) {
        console.error('Error saving emotional state:', error);
        return false;
    }
};

// Get recent emotional patterns
export const getEmotionalPatterns = async (days = 7) => {
    try {
        const states = await getMemory(MEMORY_CATEGORIES.EMOTIONAL_STATES) || [];
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        return states.filter(state =>
            new Date(state.timestamp) > cutoffDate
        );
    } catch (error) {
        console.error('Error getting emotional patterns:', error);
        return [];
    }
};

// Export memory categories for use in other modules
export { MEMORY_CATEGORIES };

// Legacy compatibility exports
export const memoryService = {
    getMemory,
    setMemory,
    removeMemory,
    clearAllMemories,
    getUserProfile,
    updateUserProfile,
    saveConversationMessage,
    getConversationHistory,
    saveEmotionalState,
    getEmotionalPatterns
};
