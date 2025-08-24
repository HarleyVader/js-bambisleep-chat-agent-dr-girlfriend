// Enhanced Emotion Hook - Agent Dr Girlfriend
// Advanced emotional intelligence and pattern tracking

import {
  adaptResponse,
  analyzeEmotion,
  getEmotionalTrends,
  getMoodSuggestions,
  trackEmotionalPattern,
} from '../services/emotionalIntelligence.js';
import { getMemory, setMemory } from '../services/memoryService.js';
import { useCallback, useEffect, useRef, useState } from 'react';

const useEmotion = (options = {}) => {
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [emotionalHistory, setEmotionalHistory] = useState([]);
  const [emotionalTrends, setEmotionalTrends] = useState(null);
  const [moodSuggestions, setMoodSuggestions] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const [emotionalInsights, setEmotionalInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  // Refs for managing tracking
  const trackingInterval = useRef(null);
  const lastAnalysis = useRef(null);

  // Configuration
  const trackingEnabled = options.trackingEnabled !== false;
  const updateInterval = options.updateInterval || 30000; // 30 seconds

  // Initialize emotion tracking
  useEffect(() => {
    const initializeEmotionTracking = async () => {
      if (!trackingEnabled) return;

      try {
        setLoading(true);

        // Load emotional history
        const history = await getMemory('emotional_history') || [];
        setEmotionalHistory(history);

        // Get current trends
        const trends = await getEmotionalTrends();
        setEmotionalTrends(trends);

        // Get initial insights
        if (trends.status === 'success') {
          setEmotionalInsights(trends.insights);
        }

        setIsTracking(true);
      } catch (error) {
        console.error('Failed to initialize emotion tracking:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeEmotionTracking();

    // Cleanup on unmount
    return () => {
      if (trackingInterval.current) {
        clearInterval(trackingInterval.current);
      }
    };
  }, [trackingEnabled, updateInterval]);

  // Analyze emotion from text input
  const analyzeEmotionFromText = useCallback(async (text, context = {}) => {
    if (!text || typeof text !== 'string') {
      return null;
    }

    try {
      // Perform emotion analysis
      const analysis = analyzeEmotion(text);

      // Update current emotion state
      setCurrentEmotion(analysis);
      lastAnalysis.current = analysis;

      // Track pattern if enabled
      if (trackingEnabled && analysis.confidence > 0.3) {
        const patternResult = await trackEmotionalPattern(analysis, {
          ...context,
          source: 'text_input',
          timestamp: new Date().toISOString(),
        });

        if (patternResult) {
          // Update emotional history
          const updatedHistory = await getMemory('emotional_history') || [];
          setEmotionalHistory(updatedHistory);

          // Get updated suggestions
          const suggestions = await getMoodSuggestions(analysis.emotion);
          setMoodSuggestions(suggestions);
        }
      }

      return analysis;
    } catch (error) {
      console.error('Failed to analyze emotion:', error);
      return null;
    }
  }, [trackingEnabled]);

  // Get adapted response based on current emotion
  const getEmotionalResponse = useCallback((emotionalAnalysis = currentEmotion, context = {}) => {
    if (!emotionalAnalysis) return null;

    try {
      return adaptResponse(emotionalAnalysis, context);
    } catch (error) {
      console.error('Failed to get emotional response:', error);
      return null;
    }
  }, [currentEmotion]);

  // Update emotional trends
  const refreshEmotionalTrends = useCallback(async () => {
    try {
      setLoading(true);
      const trends = await getEmotionalTrends();
      setEmotionalTrends(trends);

      if (trends.status === 'success') {
        setEmotionalInsights(trends.insights);
      }

      return trends;
    } catch (error) {
      console.error('Failed to refresh emotional trends:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get mood suggestions for current or specified emotion
  const getMoodSuggestionsForEmotion = useCallback(async (emotion = null) => {
    try {
      const targetEmotion = emotion || (currentEmotion ? currentEmotion.emotion : 'neutral');
      const suggestions = await getMoodSuggestions(targetEmotion);
      setMoodSuggestions(suggestions);
      return suggestions;
    } catch (error) {
      console.error('Failed to get mood suggestions:', error);
      return [];
    }
  }, [currentEmotion]);

  // Track emotion manually
  const trackEmotion = useCallback(async (emotion, intensity = 'medium', context = {}) => {
    if (!trackingEnabled) return;

    try {
      const manualAnalysis = {
        emotion: emotion,
        confidence: 0.8, // Manual entries have high confidence
        intensity: intensity,
        details: { [emotion]: 1 },
      };

      const result = await trackEmotionalPattern(manualAnalysis, {
        ...context,
        source: 'manual_entry',
        timestamp: new Date().toISOString(),
      });

      if (result) {
        setCurrentEmotion(manualAnalysis);
        const updatedHistory = await getMemory('emotional_history') || [];
        setEmotionalHistory(updatedHistory);
        await refreshEmotionalTrends();
      }

      return result;
    } catch (error) {
      console.error('Failed to track emotion manually:', error);
      return null;
    }
  }, [trackingEnabled, refreshEmotionalTrends]);

  // Get emotional context for the day
  const getDailyEmotionalContext = useCallback(() => {
    const today = new Date().toDateString();
    const todaysEmotions = emotionalHistory.filter(entry => {
      const entryDate = new Date(entry.timestamp).toDateString();
      return entryDate === today;
    });

    if (todaysEmotions.length === 0) {
      return {
        status: 'no_data',
        message: 'No emotional data for today yet.',
      };
    }

    // Calculate today's emotional summary
    const emotionCounts = {};
    let totalIntensity = 0;

    todaysEmotions.forEach(entry => {
      emotionCounts[entry.emotion] = (emotionCounts[entry.emotion] || 0) + 1;

      const intensityValue = entry.intensity === 'high' ? 3 :
        entry.intensity === 'medium' ? 2 : 1;
      totalIntensity += intensityValue;
    });

    const dominantEmotion = Object.keys(emotionCounts)
      .reduce((a, b) => emotionCounts[a] > emotionCounts[b] ? a : b);

    const averageIntensity = totalIntensity / todaysEmotions.length;

    return {
      status: 'success',
      date: today,
      totalEntries: todaysEmotions.length,
      dominantEmotion: dominantEmotion,
      averageIntensity: averageIntensity > 2.5 ? 'high' :
        averageIntensity > 1.5 ? 'medium' : 'low',
      emotionBreakdown: emotionCounts,
      firstEmotion: todaysEmotions[0],
      lastEmotion: todaysEmotions[todaysEmotions.length - 1],
    };
  }, [emotionalHistory]);

  // Clear emotional history
  const clearEmotionalHistory = useCallback(async () => {
    try {
      await setMemory('emotional_history', []);
      await setMemory('emotional_patterns', {});

      setEmotionalHistory([]);
      setCurrentEmotion(null);
      setEmotionalTrends(null);
      setEmotionalInsights(null);
      setMoodSuggestions([]);

      return true;
    } catch (error) {
      console.error('Failed to clear emotional history:', error);
      return false;
    }
  }, []);

  // Get emotional statistics
  const getEmotionalStats = useCallback(() => {
    return {
      currentEmotion: currentEmotion,
      historyLength: emotionalHistory.length,
      trendsAvailable: emotionalTrends && emotionalTrends.status === 'success',
      isTracking: isTracking,
      dailyContext: getDailyEmotionalContext(),
      suggestionsCount: moodSuggestions.length,
    };
  }, [currentEmotion, emotionalHistory, emotionalTrends, isTracking, getDailyEmotionalContext, moodSuggestions]);

  return {
    // State
    currentEmotion,
    emotionalHistory,
    emotionalTrends,
    moodSuggestions,
    emotionalInsights,
    isTracking,
    loading,

    // Actions
    analyzeEmotionFromText,
    trackEmotion,
    getMoodSuggestionsForEmotion,
    refreshEmotionalTrends,
    clearEmotionalHistory,

    // Utils
    getEmotionalResponse,
    getDailyEmotionalContext,
    getEmotionalStats,

    // State checks
    hasEmotionalData: emotionalHistory.length > 0,
    hasCurrentEmotion: currentEmotion !== null,
  };
};

export default useEmotion;
