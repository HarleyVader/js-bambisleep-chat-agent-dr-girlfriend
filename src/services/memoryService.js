// Memory Service - Agent Dr Girlfriend Memory Management System
// Following copilot-instructions.md: LocalForage for secure local storage

import localforage from 'localforage';

// Configure LocalForage for enhanced security and performance
localforage.config({
  driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
  name: 'AgentDrGirlfriendDB',
  version: 1.0,
  storeName: 'memories',
});

// Memory categories for organization
const MEMORY_CATEGORIES = {
  USER_PROFILE: 'user_profile',
  CONVERSATION_HISTORY: 'conversation_history',
  EMOTIONAL_STATES: 'emotional_states',
  PREFERENCES: 'preferences',
  RECENT_MESSAGES: 'recent_messages',
  USER_CONTEXT: 'user_context',
  RELATIONSHIP_DATA: 'relationship_data',
};

// Get memory by key
export const getMemory = async (key) => {
  try {
    const value = await localforage.getItem(key);

    // Handle cases where stored value might be corrupted
    if (value === null || value === undefined) {
      return null;
    }

    // If value is a string that looks like "[object Object]", it's corrupted
    if (typeof value === 'string' && value === '[object Object]') {
      console.warn(`Corrupted data found for key ${key}, clearing it`);
      await localforage.removeItem(key);
      return null;
    }

    return value;
  } catch (error) {
    console.error(`Error getting memory for key ${key}:`, error);

    // If there's a parsing error, try to clear the corrupted data
    if (error.message.includes('JSON') || error.message.includes('parse')) {
      try {
        await localforage.removeItem(key);
        console.warn(`Cleared corrupted data for key ${key}`);
      } catch (clearError) {
        console.error(`Failed to clear corrupted data for key ${key}:`, clearError);
      }
    }

    return null;
  }
};

// Set memory by key
export const setMemory = async (key, value) => {
  try {
    // Validate that we're not storing corrupted data
    if (value === null || value === undefined) {
      await localforage.removeItem(key);
      return true;
    }

    // Check if value is a string representation of [object Object]
    if (typeof value === 'string' && value === '[object Object]') {
      console.error(`Attempted to store corrupted data for key ${key}`);
      return false;
    }

    // Ensure objects are properly serializable
    if (typeof value === 'object') {
      try {
        JSON.stringify(value);
      } catch (stringifyError) {
        console.error(`Value for key ${key} is not serializable:`, stringifyError);
        return false;
      }
    }

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
    created_at: new Date().toISOString(),
  };
};

// Update user profile
export const updateUserProfile = async (updates) => {
  const currentProfile = await getUserProfile();
  const updatedProfile = {
    ...currentProfile,
    ...updates,
    updated_at: new Date().toISOString(),
  };
  return await setMemory(MEMORY_CATEGORIES.USER_PROFILE, updatedProfile);
};

// Save conversation message
export const saveConversationMessage = async (message) => {
  try {
    const history = await getMemory(MEMORY_CATEGORIES.CONVERSATION_HISTORY) || [];
    const messageWithTimestamp = {
      ...message,
      saved_at: new Date().toISOString(),
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
      timestamp: new Date().toISOString(),
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
      new Date(state.timestamp) > cutoffDate,
    );
  } catch (error) {
    console.error('Error getting emotional patterns:', error);
    return [];
  }
};

// Auto-cleanup corrupted storage (built-in)
export const autoCleanupStorage = async () => {
  try {
    console.log('🧹 Running comprehensive storage cleanup...');

    const keysToCheck = [
      'user_context',
      'emotional_history',
      'recent_messages',
      'relationship_milestones',
      'journal_entries',
      'creative_projects',
      'voice_interactions',
      'emotional_patterns',
      'daily_emotional_summaries',
    ];

    let cleanedCount = 0;

    // Clean LocalForage/IndexedDB data
    for (const key of keysToCheck) {
      try {
        const value = await localforage.getItem(key);
        if (typeof value === 'string' && value === '[object Object]') {
          await localforage.removeItem(key);
          cleanedCount++;
          console.log(`Cleaned corrupted LocalForage key: ${key}`);
        }
      } catch (error) {
        if (error.message.includes('JSON') || error.message.includes('parse')) {
          await localforage.removeItem(key);
          cleanedCount++;
          console.log(`Cleaned corrupted LocalForage key: ${key}`);
        }
      }
    }

    // Also clean regular localStorage for good measure
    if (typeof window !== 'undefined' && window.localStorage) {
      const localStorageKeys = Object.keys(localStorage);
      for (const key of localStorageKeys) {
        try {
          const value = localStorage.getItem(key);
          if (value === '[object Object]' || value === 'undefined' || value === 'null') {
            localStorage.removeItem(key);
            cleanedCount++;
            console.log(`Cleaned corrupted localStorage key: ${key}`);
          }
          // Try to parse as JSON to catch invalid JSON
          if (value && value.startsWith('{') && !value.startsWith('{"')) {
            try {
              JSON.parse(value);
            } catch (jsonError) {
              localStorage.removeItem(key);
              cleanedCount++;
              console.log(`Cleaned invalid JSON in localStorage key: ${key}`);
            }
          }
        } catch (error) {
          // If we can't even access the key, remove it
          try {
            localStorage.removeItem(key);
            cleanedCount++;
            console.log(`Cleaned inaccessible localStorage key: ${key}`);
          } catch (removeError) {
            console.warn(`Could not remove problematic key: ${key}`, removeError);
          }
        }
      }
    }

    // Emergency: Clear all storage if too many corruption issues detected
    if (cleanedCount > 10) {
      console.warn('🚨 Excessive corruption detected, performing complete storage reset...');
      try {
        await localforage.clear();
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.clear();
        }
        if (typeof window !== 'undefined' && window.sessionStorage) {
          sessionStorage.clear();
        }
        console.log('✅ Complete storage reset performed');
        cleanedCount = 'FULL_RESET';
      } catch (resetError) {
        console.error('Failed to perform complete reset:', resetError);
      }
    }

    if (cleanedCount === 'FULL_RESET') {
      console.log('🔄 Performed complete storage reset due to extensive corruption');
    } else if (cleanedCount > 0) {
      console.log(`✅ Cleaned ${cleanedCount} corrupted storage entries`);
    } else {
      console.log('✅ Storage is clean');
    }

    return { success: true, cleanedCount };
  } catch (error) {
    console.error('Storage cleanup failed:', error);
    return { success: false, error: error.message };
  }
};

// Initialize on first load
if (typeof window !== 'undefined') {
  // Run cleanup automatically when service loads
  autoCleanupStorage().catch(error => {
    console.warn('Initial storage cleanup failed:', error);
  });

  // Make cleanup function available globally for emergency use
  window.emergencyStorageCleanup = async () => {
    console.log('🚨 Running EMERGENCY storage cleanup...');
    try {
      // Clear everything
      await localforage.clear();
      if (window.localStorage) localStorage.clear();
      if (window.sessionStorage) sessionStorage.clear();

      // Clear IndexedDB databases
      if (window.indexedDB) {
        try {
          const databases = await indexedDB.databases();
          for (const db of databases) {
            if (db.name) {
              indexedDB.deleteDatabase(db.name);
              console.log(`Deleted IndexedDB: ${db.name}`);
            }
          }
        } catch (dbError) {
          console.warn('Could not clean IndexedDB:', dbError);
        }
      }

      console.log('✅ EMERGENCY cleanup completed - please refresh the page');
      return { success: true, message: 'Emergency cleanup completed' };
    } catch (error) {
      console.error('Emergency cleanup failed:', error);
      return { success: false, error: error.message };
    }
  };

  console.log('💡 Emergency cleanup available: run `window.emergencyStorageCleanup()` in console if needed');
}

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
  getEmotionalPatterns,
};
