// useNameTransformation.js - React Hook for Agent Name Costume Changes
// Integrates the NameTransformationService with React components

import { useCallback, useEffect, useState } from 'react';

import nameTransformationService from '../services/nameTransformationService.js';

const useNameTransformation = () => {
    const [agentConfig, setAgentConfig] = useState(nameTransformationService.getAgentConfig());
    const [isTransforming, setIsTransforming] = useState(false);
    const [lastTransformation, setLastTransformation] = useState(null);

    // Subscribe to transformation events
    useEffect(() => {
        const unsubscribe = nameTransformationService.onTransformation((transformationData) => {
            setAgentConfig(transformationData.newConfig);
            setLastTransformation(transformationData);
            setIsTransforming(false);
        });

        return unsubscribe;
    }, []);

    // Detect costume change request from user message
    const detectCostumeChange = useCallback((userMessage) => {
        return nameTransformationService.detectCostumeChangeRequest(userMessage);
    }, []);

    // Perform the costume change transformation
    const performCostumeChange = useCallback(async (newName, effectType) => {
        setIsTransforming(true);
        try {
            const result = await nameTransformationService.performCostumeChange(newName, effectType);
            if (!result.success) {
                setIsTransforming(false);
            }
            return result;
        } catch (error) {
            setIsTransforming(false);
            throw error;
        }
    }, []);

    // Reset to default agent name
    const resetToDefault = useCallback(async () => {
        setIsTransforming(true);
        try {
            const newConfig = await nameTransformationService.resetToDefault();
            setAgentConfig(newConfig);
            return newConfig;
        } finally {
            setIsTransforming(false);
        }
    }, []);

    // Get current agent display name
    const getDisplayName = useCallback((variant = 'name') => {
        switch (variant) {
            case 'full':
                return agentConfig.fullName;
            case 'short':
                return agentConfig.shortName;
            case 'title':
                return agentConfig.title;
            default:
                return agentConfig.name;
        }
    }, [agentConfig]);

    // Generate personalized greeting with current name
    const getPersonalizedGreeting = useCallback(() => {
        const hour = new Date().getHours();
        const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';

        const greetings = [
            `✨ Hey there, I'm ${agentConfig.name}`,
            `💖 Good ${timeOfDay}, I'm ${agentConfig.name}`,
            `🌟 ${agentConfig.name} here, ready to chat`,
            `💫 Hi beautiful, ${agentConfig.name} at your service`
        ];

        return greetings[Math.floor(Math.random() * greetings.length)];
    }, [agentConfig.name]);

    return {
        // Current agent configuration
        agentConfig,

        // Display methods
        getDisplayName,
        getPersonalizedGreeting,

        // Transformation methods
        detectCostumeChange,
        performCostumeChange,
        resetToDefault,

        // State
        isTransforming,
        lastTransformation,

        // Quick access to common names
        name: agentConfig.name,
        fullName: agentConfig.fullName,
        shortName: agentConfig.shortName,
        avatar: agentConfig.avatar
    };
};

export default useNameTransformation;
