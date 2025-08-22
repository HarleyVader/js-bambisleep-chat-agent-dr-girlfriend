// Enhanced Memory Hook - Agent Dr Girlfriend
// Advanced memory management and persistent storage

import {
    clearConversation as clearConversationMemory,
    getAllConversations,
    getConversationHistory,
    getMemory,
    getUserProfile,
    saveConversationMessage,
    setMemory,
    updateUserProfile
} from '../services/memoryService.js';
import { useCallback, useEffect, useRef, useState } from 'react';

const useMemory = (options = {}) => {
    const [userProfile, setUserProfile] = useState(null);
    const [conversations, setConversations] = useState({});
    const [currentConversationId, setCurrentConversationId] = useState(null);
    const [customMemories, setCustomMemories] = useState({});
    const [preferences, setPreferences] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Refs for managing auto-save
    const autoSaveTimeout = useRef(null);
    const isDirty = useRef(false);

    // Configuration
    const autoSave = options.autoSave !== false;
    const autoSaveDelay = options.autoSaveDelay || 5000; // 5 seconds

    // Initialize memory system
    useEffect(() => {
        const initializeMemory = async () => {
            try {
                setLoading(true);

                // Load user profile
                const profile = await getUserProfile();
                setUserProfile(profile);

                // Load current conversation ID
                const conversationId = await getMemory('current_conversation_id');
                setCurrentConversationId(conversationId);

                // Load user preferences
                const prefs = await getMemory('user_preferences') || {};
                setPreferences(prefs);

                // Load custom memories
                const memories = await getMemory('custom_memories') || {};
                setCustomMemories(memories);

            } catch (error) {
                console.error('Failed to initialize memory:', error);
                setError('Failed to load memories');
            } finally {
                setLoading(false);
            }
        };

        initializeMemory();

        // Cleanup on unmount
        return () => {
            if (autoSaveTimeout.current) {
                clearTimeout(autoSaveTimeout.current);
            }
        };
    }, []);

    // Auto-save dirty data
    useEffect(() => {
        if (autoSave && isDirty.current) {
            if (autoSaveTimeout.current) {
                clearTimeout(autoSaveTimeout.current);
            }

            autoSaveTimeout.current = setTimeout(async () => {
                await saveAllData();
                isDirty.current = false;
            }, autoSaveDelay);
        }
    }, [userProfile, preferences, customMemories, autoSave, autoSaveDelay]);

    // Save all data to persistent storage
    const saveAllData = useCallback(async () => {
        try {
            await Promise.all([
                updateUserProfile(userProfile),
                setMemory('user_preferences', preferences),
                setMemory('custom_memories', customMemories)
            ]);
        } catch (error) {
            console.error('Failed to save memory data:', error);
            setError('Failed to save data');
        }
    }, [userProfile, preferences, customMemories]);

    // Get memory by key
    const getMemoryValue = useCallback(async (key, defaultValue = null) => {
        try {
            return await getMemory(key) || defaultValue;
        } catch (error) {
            console.error(`Failed to get memory for key ${key}:`, error);
            return defaultValue;
        }
    }, []);

    // Set memory by key
    const setMemoryValue = useCallback(async (key, value) => {
        try {
            await setMemory(key, value);
            return true;
        } catch (error) {
            console.error(`Failed to set memory for key ${key}:`, error);
            setError('Failed to save memory');
            return false;
        }
    }, []);

    // Update user profile
    const updateProfile = useCallback((updates) => {
        setUserProfile(prev => {
            const updated = { ...prev, ...updates };
            isDirty.current = true;
            return updated;
        });
    }, []);

    // Update preferences
    const updatePreferences = useCallback((updates) => {
        setPreferences(prev => {
            const updated = { ...prev, ...updates };
            isDirty.current = true;
            return updated;
        });
    }, []);

    // Add custom memory
    const addCustomMemory = useCallback((key, value, metadata = {}) => {
        setCustomMemories(prev => {
            const updated = {
                ...prev,
                [key]: {
                    value: value,
                    timestamp: new Date().toISOString(),
                    metadata: metadata
                }
            };
            isDirty.current = true;
            return updated;
        });
    }, []);

    // Get custom memory
    const getCustomMemory = useCallback((key, defaultValue = null) => {
        const memory = customMemories[key];
        return memory ? memory.value : defaultValue;
    }, [customMemories]);

    // Remove custom memory
    const removeCustomMemory = useCallback((key) => {
        setCustomMemories(prev => {
            const updated = { ...prev };
            delete updated[key];
            isDirty.current = true;
            return updated;
        });
    }, []);

    // Load conversation
    const loadConversation = useCallback(async (conversationId) => {
        try {
            setLoading(true);
            const history = await getConversationHistory(conversationId);

            setConversations(prev => ({
                ...prev,
                [conversationId]: history
            }));

            setCurrentConversationId(conversationId);
            await setMemory('current_conversation_id', conversationId);

            return history;
        } catch (error) {
            console.error('Failed to load conversation:', error);
            setError('Failed to load conversation');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    // Save message to current conversation
    const saveMessage = useCallback(async (message) => {
        if (!currentConversationId) return false;

        try {
            await saveConversationMessage(currentConversationId, message);

            // Update local conversation cache
            setConversations(prev => ({
                ...prev,
                [currentConversationId]: [
                    ...(prev[currentConversationId] || []),
                    message
                ]
            }));

            return true;
        } catch (error) {
            console.error('Failed to save message:', error);
            setError('Failed to save message');
            return false;
        }
    }, [currentConversationId]);

    // Clear conversation
    const clearConversation = useCallback(async (conversationId = currentConversationId) => {
        if (!conversationId) return false;

        try {
            await clearConversationMemory(conversationId);

            // Update local cache
            setConversations(prev => {
                const updated = { ...prev };
                delete updated[conversationId];
                return updated;
            });

            return true;
        } catch (error) {
            console.error('Failed to clear conversation:', error);
            setError('Failed to clear conversation');
            return false;
        }
    }, [currentConversationId]);

    // Get all conversations
    const loadAllConversations = useCallback(async () => {
        try {
            setLoading(true);
            const allConversations = await getAllConversations();
            setConversations(allConversations);
            return allConversations;
        } catch (error) {
            console.error('Failed to load all conversations:', error);
            setError('Failed to load conversations');
            return {};
        } finally {
            setLoading(false);
        }
    }, []);

    // Export all data
    const exportAllData = useCallback(async () => {
        try {
            const exportData = {
                userProfile: userProfile,
                preferences: preferences,
                customMemories: customMemories,
                conversations: conversations,
                exportDate: new Date().toISOString(),
                version: '1.0'
            };

            return exportData;
        } catch (error) {
            console.error('Failed to export data:', error);
            setError('Failed to export data');
            return null;
        }
    }, [userProfile, preferences, customMemories, conversations]);

    // Import data
    const importData = useCallback(async (importData) => {
        try {
            setLoading(true);

            if (importData.userProfile) {
                setUserProfile(importData.userProfile);
                await updateUserProfile(importData.userProfile);
            }

            if (importData.preferences) {
                setPreferences(importData.preferences);
                await setMemory('user_preferences', importData.preferences);
            }

            if (importData.customMemories) {
                setCustomMemories(importData.customMemories);
                await setMemory('custom_memories', importData.customMemories);
            }

            if (importData.conversations) {
                setConversations(importData.conversations);
                // Note: Individual conversation import would need specific implementation
            }

            return true;
        } catch (error) {
            console.error('Failed to import data:', error);
            setError('Failed to import data');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // Get memory statistics
    const getMemoryStats = useCallback(() => {
        const totalConversations = Object.keys(conversations).length;
        const totalMessages = Object.values(conversations).reduce((total, conv) => total + conv.length, 0);
        const totalCustomMemories = Object.keys(customMemories).length;

        return {
            userProfile: userProfile !== null,
            totalConversations: totalConversations,
            totalMessages: totalMessages,
            totalCustomMemories: totalCustomMemories,
            totalPreferences: Object.keys(preferences).length,
            currentConversation: currentConversationId,
            lastActivity: userProfile?.lastActive || null
        };
    }, [userProfile, conversations, customMemories, preferences, currentConversationId]);

    // Force save
    const forceSave = useCallback(async () => {
        try {
            setLoading(true);
            await saveAllData();
            isDirty.current = false;
            return true;
        } catch (error) {
            console.error('Failed to force save:', error);
            setError('Failed to save data');
            return false;
        } finally {
            setLoading(false);
        }
    }, [saveAllData]);

    return {
        // State
        userProfile,
        conversations,
        currentConversationId,
        customMemories,
        preferences,
        loading,
        error,

        // Profile actions
        updateProfile,

        // Preferences actions
        updatePreferences,

        // Custom memory actions
        addCustomMemory,
        getCustomMemory,
        removeCustomMemory,

        // Generic memory actions
        getMemoryValue,
        setMemoryValue,

        // Conversation actions
        loadConversation,
        saveMessage,
        clearConversation,
        loadAllConversations,

        // Data management
        exportAllData,
        importData,
        forceSave,

        // Utils
        getMemoryStats,

        // Status
        isDirty: isDirty.current,
        hasUserProfile: userProfile !== null,
        hasConversations: Object.keys(conversations).length > 0
    };
};

export default useMemory;
