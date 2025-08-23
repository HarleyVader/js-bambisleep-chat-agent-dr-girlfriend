// Emotional Intelligence Service - Core emotion detection and pattern tracking
// Following copilot-instructions.md: Local-first architecture with privacy protection

import { getMemory, setMemory } from './memoryService.js';

import { generateId } from '../utils/validation.js';

// Emotion analysis using sentiment patterns and keyword detection
const EMOTION_PATTERNS = {
    joy: {
        keywords: ['happy', 'excited', 'wonderful', 'amazing', 'love', 'great', 'fantastic', 'awesome', 'perfect', 'brilliant'],
        intensity_modifiers: ['very', 'extremely', 'incredibly', 'absolutely', 'totally'],
        emoji_patterns: ['😊', '😄', '😃', '🥰', '😍', '🤩', '✨', '💖', '❤️', '🎉']
    },
    sadness: {
        keywords: ['sad', 'upset', 'disappointed', 'down', 'hurt', 'crying', 'depressed', 'lonely', 'empty', 'broken'],
        intensity_modifiers: ['very', 'extremely', 'deeply', 'completely', 'totally'],
        emoji_patterns: ['😢', '😭', '😔', '☹️', '😞', '💔', '😰', '😥', '🥺']
    },
    anger: {
        keywords: ['angry', 'mad', 'furious', 'frustrated', 'annoyed', 'irritated', 'pissed', 'rage', 'hate', 'disgusted'],
        intensity_modifiers: ['very', 'extremely', 'incredibly', 'absolutely', 'really'],
        emoji_patterns: ['😠', '😡', '🤬', '😤', '💢', '🔥', '👿', '😾']
    },
    fear: {
        keywords: ['scared', 'afraid', 'worried', 'anxious', 'nervous', 'terrified', 'panic', 'stress', 'concerned', 'frightened'],
        intensity_modifiers: ['very', 'extremely', 'incredibly', 'absolutely', 'really'],
        emoji_patterns: ['😨', '😰', '😱', '🙈', '😧', '😟', '😦', '🫣']
    },
    surprise: {
        keywords: ['surprised', 'shocked', 'amazed', 'astonished', 'unexpected', 'wow', 'omg', 'incredible', 'unbelievable'],
        intensity_modifiers: ['very', 'extremely', 'totally', 'completely', 'absolutely'],
        emoji_patterns: ['😲', '😯', '😮', '🤯', '😵', '🙀', '😱']
    },
    neutral: {
        keywords: ['okay', 'fine', 'normal', 'regular', 'usual', 'average', 'standard'],
        intensity_modifiers: ['pretty', 'fairly', 'somewhat', 'kind of'],
        emoji_patterns: ['😐', '😑', '🤷', '🙂']
    }
};

// Advanced sentiment analysis with context awareness
export const analyzeEmotion = (text, context = {}) => {
    try {
        if (!text || typeof text !== 'string') {
            return { emotion: 'neutral', confidence: 0.1, intensity: 0.1 };
        }

        const normalizedText = text.toLowerCase().trim();
        const words = normalizedText.split(/\s+/);

        // Score each emotion category
        const emotionScores = {};
        let totalMatches = 0;

        for (const [emotion, patterns] of Object.entries(EMOTION_PATTERNS)) {
            let score = 0;
            let matches = 0;

            // Check keywords
            for (const keyword of patterns.keywords) {
                const keywordCount = (normalizedText.match(new RegExp(`\\b${keyword}\\b`, 'g')) || []).length;
                if (keywordCount > 0) {
                    score += keywordCount * 1.0;
                    matches += keywordCount;
                }
            }

            // Check intensity modifiers
            for (const modifier of patterns.intensity_modifiers) {
                if (normalizedText.includes(modifier)) {
                    score *= 1.3; // Boost intensity
                }
            }

            // Check emoji patterns
            for (const emoji of patterns.emoji_patterns) {
                const emojiCount = (text.match(new RegExp(emoji, 'g')) || []).length;
                if (emojiCount > 0) {
                    score += emojiCount * 0.8;
                    matches += emojiCount;
                }
            }

            emotionScores[emotion] = score;
            totalMatches += matches;
        }

        // Find dominant emotion
        const dominantEmotion = Object.entries(emotionScores).reduce((a, b) =>
            emotionScores[a[0]] > emotionScores[b[0]] ? a : b
        )[0];

        // Calculate confidence and intensity
        const maxScore = emotionScores[dominantEmotion];
        const confidence = totalMatches > 0 ? Math.min(maxScore / totalMatches, 1.0) : 0.1;
        const intensity = Math.min(maxScore / 2.0, 1.0);

        // Context-based adjustments
        let adjustedEmotion = dominantEmotion;
        let adjustedConfidence = confidence;

        if (context.previousEmotion) {
            // Emotional continuity - slight bias toward previous emotion
            if (context.previousEmotion === dominantEmotion) {
                adjustedConfidence *= 1.1;
            }
        }

        if (context.conversationLength && context.conversationLength > 10) {
            // Longer conversations tend to be more nuanced
            adjustedConfidence *= 0.9;
        }

        return {
            emotion: adjustedEmotion,
            confidence: Math.max(0.1, Math.min(adjustedConfidence, 1.0)),
            intensity: Math.max(0.1, Math.min(intensity, 1.0)),
            rawScores: emotionScores,
            matches: totalMatches
        };

    } catch (error) {
        console.error('Error in emotion analysis:', error);
        return { emotion: 'neutral', confidence: 0.1, intensity: 0.1 };
    }
};

// Track emotional patterns over time
export const trackEmotionalPattern = async (emotion, intensity, context = {}) => {
    try {
        const timestamp = new Date().toISOString();
        const patternEntry = {
            id: generateId(),
            emotion,
            intensity,
            timestamp,
            context,
            date: new Date().toDateString()
        };

        // Get existing patterns
        const existingPatterns = await getMemory('emotional_patterns') || [];

        // Add new pattern
        existingPatterns.push(patternEntry);

        // Keep only last 100 patterns for performance
        const recentPatterns = existingPatterns.slice(-100);

        // Save updated patterns
        await setMemory('emotional_patterns', recentPatterns);

        // Update daily summary
        await updateDailySummary(emotion, intensity);

        return patternEntry;

    } catch (error) {
        console.error('Error tracking emotional pattern:', error);
        return null;
    }
};

// Update daily emotional summary
const updateDailySummary = async (emotion, intensity) => {
    try {
        const today = new Date().toDateString();
        const dailySummaries = await getMemory('daily_emotional_summaries') || {};

        if (!dailySummaries[today]) {
            dailySummaries[today] = {
                date: today,
                emotions: {},
                totalEntries: 0,
                averageIntensity: 0
            };
        }

        const todaySummary = dailySummaries[today];

        // Update emotion counts
        if (!todaySummary.emotions[emotion]) {
            todaySummary.emotions[emotion] = { count: 0, totalIntensity: 0 };
        }

        todaySummary.emotions[emotion].count++;
        todaySummary.emotions[emotion].totalIntensity += intensity;
        todaySummary.totalEntries++;

        // Recalculate average intensity
        const totalIntensity = Object.values(todaySummary.emotions)
            .reduce((sum, emotionData) => sum + emotionData.totalIntensity, 0);
        todaySummary.averageIntensity = totalIntensity / todaySummary.totalEntries;

        // Keep only last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const filteredSummaries = {};
        for (const [date, summary] of Object.entries(dailySummaries)) {
            if (new Date(date) >= thirtyDaysAgo) {
                filteredSummaries[date] = summary;
            }
        }

        await setMemory('daily_emotional_summaries', filteredSummaries);

    } catch (error) {
        console.error('Error updating daily summary:', error);
    }
};

// Get emotional trends and insights
export const getEmotionalTrends = async (days = 7) => {
    try {
        const patterns = await getMemory('emotional_patterns') || [];
        const dailySummaries = await getMemory('daily_emotional_summaries') || {};

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        // Filter recent patterns
        const recentPatterns = patterns.filter(pattern =>
            pattern && pattern.timestamp && new Date(pattern.timestamp) >= cutoffDate
        );

        // Calculate trends
        const emotionCounts = {};
        let totalIntensity = 0;
        let totalEntries = recentPatterns.length;

        recentPatterns.forEach(pattern => {
            if (pattern && pattern.emotion) {
                if (!emotionCounts[pattern.emotion]) {
                    emotionCounts[pattern.emotion] = 0;
                }
                emotionCounts[pattern.emotion]++;
                totalIntensity += pattern.intensity || 0;
            }
        });

        // Get dominant emotions
        const sortedEmotions = Object.entries(emotionCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3);

        // Calculate emotional stability (variance in emotions)
        const emotionVariety = Object.keys(emotionCounts).length;
        const stability = emotionVariety > 0 ? 1 / emotionVariety : 1;

        // Get daily trends
        const dailyTrends = Object.values(dailySummaries)
            .filter(summary => summary && summary.date && new Date(summary.date) >= cutoffDate)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        // Get dominant emotion
        const dominantEmotion = sortedEmotions.length > 0 ? sortedEmotions[0][0] : 'neutral';

        return {
            totalEntries,
            averageIntensity: totalEntries > 0 ? totalIntensity / totalEntries : 0,
            dominantEmotion,
            dominantEmotions: sortedEmotions.map(([emotion, count]) => ({
                emotion,
                count,
                percentage: totalEntries > 0 ? (count / totalEntries) * 100 : 0
            })),
            emotionalStability: stability,
            emotionVariety,
            dailyTrends,
            trends: emotionCounts,
            recommendations: generateRecommendations(emotionCounts, totalEntries > 0 ? totalIntensity / totalEntries : 0)
        };

    } catch (error) {
        console.error('Error getting emotional trends:', error);
        return {
            totalEntries: 0,
            averageIntensity: 0,
            dominantEmotion: 'neutral',
            dominantEmotions: [],
            emotionalStability: 1,
            emotionVariety: 0,
            dailyTrends: [],
            trends: {},
            recommendations: []
        };
    }
};

// Generate emotional health recommendations
const generateRecommendations = (emotionCounts, averageIntensity) => {
    const recommendations = [];

    // Check for emotional balance
    const totalEmotions = Object.values(emotionCounts).reduce((sum, count) => sum + count, 0);
    const negativeEmotions = ['sadness', 'anger', 'fear'];
    const negativeCount = negativeEmotions.reduce((sum, emotion) =>
        sum + (emotionCounts[emotion] || 0), 0);

    if (negativeCount / totalEmotions > 0.6) {
        recommendations.push({
            type: 'emotional_balance',
            message: 'Consider activities that bring you joy - music, nature, or connecting with loved ones.',
            priority: 'high'
        });
    }

    if (averageIntensity > 0.8) {
        recommendations.push({
            type: 'intensity_management',
            message: 'Your emotions are running high. Deep breathing or meditation might help.',
            priority: 'medium'
        });
    }

    if ((emotionCounts.joy || 0) / totalEmotions > 0.7) {
        recommendations.push({
            type: 'positive_reinforcement',
            message: 'You seem to be in a great emotional space! Keep doing what makes you happy.',
            priority: 'low'
        });
    }

    return recommendations;
};

// Get mood-appropriate response tone
export const getMoodAppropriateResponse = (userEmotion, intensity) => {
    const toneMap = {
        joy: {
            low: 'warm',
            medium: 'enthusiastic',
            high: 'celebratory'
        },
        sadness: {
            low: 'gentle',
            medium: 'supportive',
            high: 'comforting'
        },
        anger: {
            low: 'understanding',
            medium: 'validating',
            high: 'calming'
        },
        fear: {
            low: 'reassuring',
            medium: 'protective',
            high: 'grounding'
        },
        surprise: {
            low: 'curious',
            medium: 'engaged',
            high: 'excited'
        },
        neutral: {
            low: 'casual',
            medium: 'friendly',
            high: 'engaging'
        }
    };

    const intensityLevel = intensity <= 0.3 ? 'low' : intensity <= 0.7 ? 'medium' : 'high';
    return toneMap[userEmotion]?.[intensityLevel] || 'friendly';
};

// Clear emotional data (for privacy)
export const clearEmotionalData = async () => {
    try {
        await setMemory('emotional_patterns', []);
        await setMemory('daily_emotional_summaries', {});
        return true;
    } catch (error) {
        console.error('Error clearing emotional data:', error);
        return false;
    }
};

// Export functions for testing and debugging
export const debugEmotionalIntelligence = () => {
    return {
        EMOTION_PATTERNS,
        analyzeEmotion,
        trackEmotionalPattern,
        getEmotionalTrends,
        getMoodAppropriateResponse
    };
};
