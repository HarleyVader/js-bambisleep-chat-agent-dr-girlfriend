// RelationshipDashboard.js - Emotional connection tracking with Agent Dr Girlfriend
// Following copilot-instructions.md: Relationship features and memory tracking

import React, { useEffect, useState } from 'react';
import { getEmotionalTrends, trackEmotionalPattern } from '../../services/emotionalIntelligence.js';
import { getMemory, setMemory } from '../../services/memoryService.js';

import useNameTransformation from '../../hooks/useNameTransformation.js';

const RelationshipDashboard = () => {
  const [relationshipData, setRelationshipData] = useState(null);
  const [emotionalTrends, setEmotionalTrends] = useState(null);
  const [conversationStats, setConversationStats] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Import name transformation hook
  const { getDisplayName, fullName } = useNameTransformation();

  // Load relationship data on mount
  useEffect(() => {
    const loadRelationshipData = async () => {
      try {
        setIsLoading(true);

        // Load various data sources with error handling for each
        const loadData = async (key, defaultValue = null) => {
          try {
            const result = await getMemory(key);
            return result || defaultValue;
          } catch (error) {
            console.warn(`Failed to load ${key}:`, error);
            return defaultValue;
          }
        };

        const [
          userContext,
          emotionalHistory,
          conversationHistory,
          savedMilestones,
          journalEntries,
          creativeProjects,
          voiceInteractions,
        ] = await Promise.all([
          loadData('user_context', {}),
          loadData('emotional_history', []),
          loadData('recent_messages', []),
          loadData('relationship_milestones', []),
          loadData('journal_entries', []),
          loadData('creative_projects', []),
          loadData('voice_interactions', []),
        ]);

        // Calculate relationship metrics
        const relationshipMetrics = calculateRelationshipMetrics({
          userContext,
          emotionalHistory,
          conversationHistory,
          journalEntries,
          creativeProjects,
          voiceInteractions,
        });

        // Generate conversation statistics
        const convStats = generateConversationStats(conversationHistory, voiceInteractions);

        // Get emotional trends
        let trends;
        try {
          trends = await getEmotionalTrends();
        } catch (error) {
          console.warn('Failed to load emotional trends:', error);
          trends = {
            totalEntries: 0,
            averageIntensity: 0,
            dominantEmotion: 'neutral',
            trends: {},
            dominantEmotions: [],
            emotionalStability: 1,
            emotionVariety: 0,
            dailyTrends: [],
            recommendations: [],
          };
        }

        setRelationshipData(relationshipMetrics);
        setConversationStats(convStats);
        setEmotionalTrends(trends);
        setMilestones(savedMilestones);

      } catch (error) {
        console.error('Error loading relationship data:', error);
        // Set default values in case of complete failure
        setRelationshipData({
          daysTogether: 0,
          totalInteractions: 0,
          emotionalDepth: 0,
          intimacyScore: 0,
          creativityScore: 0,
          growthTrend: 'building',
          relationshipLevel: 'Getting Started',
          currentMood: 'neutral',
          preferredMode: 'GIRLFRIEND',
        });
        setConversationStats({
          totalMessages: 0,
          totalVoiceMessages: 0,
          totalWords: 0,
          favoriteTopics: [],
          mostActiveDay: 'No conversations yet',
          averageResponseTime: '< 1 minute',
        });
        setEmotionalTrends({
          totalEntries: 0,
          averageIntensity: 0,
          dominantEmotion: 'neutral',
          trends: {},
          dominantEmotions: [],
          emotionalStability: 1,
          emotionVariety: 0,
          dailyTrends: [],
          recommendations: [],
        });
        setMilestones([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadRelationshipData();
  }, []);

  const calculateRelationshipMetrics = (data) => {
    const { userContext, emotionalHistory, conversationHistory, journalEntries, creativeProjects, voiceInteractions } = data;

    // Ensure all data is valid with fallbacks
    const safeUserContext = userContext || {};
    const safeEmotionalHistory = Array.isArray(emotionalHistory) ? emotionalHistory : [];
    const safeConversationHistory = Array.isArray(conversationHistory) ? conversationHistory : [];
    const safeJournalEntries = Array.isArray(journalEntries) ? journalEntries : [];
    const safeCreativeProjects = Array.isArray(creativeProjects) ? creativeProjects : [];
    const safeVoiceInteractions = Array.isArray(voiceInteractions) ? voiceInteractions : [];

    const firstInteraction = safeUserContext.first_interaction || new Date().toISOString();
    const daysTogether = Math.floor((new Date() - new Date(firstInteraction)) / (1000 * 60 * 60 * 24));

    const totalInteractions = safeConversationHistory.length + safeJournalEntries.length + safeCreativeProjects.length + safeVoiceInteractions.length;

    // Calculate emotional depth score
    const uniqueEmotions = new Set(safeEmotionalHistory.map(e => e.emotion)).size;
    const emotionalDepth = Math.min(uniqueEmotions * 10, 100);

    // Calculate intimacy level based on conversation patterns
    const intimacyScore = calculateIntimacyScore(safeConversationHistory, safeJournalEntries);

    // Calculate creativity score
    const creativityScore = Math.min(safeCreativeProjects.length * 5, 100);

    // Relationship growth trajectory
    const growthTrend = calculateGrowthTrend(safeEmotionalHistory);

    return {
      daysTogether,
      totalInteractions,
      emotionalDepth,
      intimacyScore,
      creativityScore,
      growthTrend,
      relationshipLevel: determineRelationshipLevel(daysTogether, totalInteractions, intimacyScore),
      currentMood: safeUserContext.mood || 'neutral',
      preferredMode: safeUserContext.preferred_mode || 'GIRLFRIEND',
    };
  };

  const calculateIntimacyScore = (conversations, journals) => {
    // Ensure arrays are valid
    const safeConversations = Array.isArray(conversations) ? conversations : [];
    const safeJournals = Array.isArray(journals) ? journals : [];

    // Count personal sharing indicators
    const personalWords = ['feel', 'love', 'miss', 'dream', 'hope', 'fear', 'want', 'need', 'remember'];
    let intimacyScore = 0;

    const allText = [...safeConversations, ...safeJournals].map(item => item.text || '').join(' ').toLowerCase();

    personalWords.forEach(word => {
      const matches = allText.split(word).length - 1;
      intimacyScore += matches;
    });

    return Math.min(intimacyScore * 2, 100);
  };

  const calculateGrowthTrend = (emotionalHistory) => {
    // Ensure emotionalHistory is a valid array
    const safeEmotionalHistory = Array.isArray(emotionalHistory) ? emotionalHistory : [];

    if (safeEmotionalHistory.length < 10) return 'building';

    const recent = safeEmotionalHistory.slice(-10);
    const older = safeEmotionalHistory.slice(-20, -10);

    const recentPositive = recent.filter(e => ['joy', 'love', 'excitement', 'creative'].includes(e.emotion)).length;
    const olderPositive = older.filter(e => ['joy', 'love', 'excitement', 'creative'].includes(e.emotion)).length;

    if (recentPositive > olderPositive) return 'growing';
    if (recentPositive < olderPositive) return 'declining';
    return 'stable';
  };

  const determineRelationshipLevel = (days, interactions, intimacy) => {
    if (days < 7 && interactions < 20) return 'Getting to Know Each Other';
    if (days < 30 && intimacy < 30) return 'Building Connection';
    if (intimacy >= 60 && interactions >= 50) return 'Deep Bond';
    if (intimacy >= 80 && interactions >= 100) return 'Soulmate Connection';
    return 'Growing Together';
  };

  const generateConversationStats = (conversations, voiceInteractions) => {
    // Ensure arrays are valid
    const safeConversations = Array.isArray(conversations) ? conversations : [];
    const safeVoiceInteractions = Array.isArray(voiceInteractions) ? voiceInteractions : [];

    const totalMessages = safeConversations.length;
    const totalVoiceMessages = safeVoiceInteractions.length;
    const totalWords = safeConversations.reduce((sum, msg) => sum + (msg.text?.split(' ').length || 0), 0);

    const favoriteTopics = extractFavoriteTopics(safeConversations);
    const mostActiveDay = findMostActiveDay(safeConversations);
    const averageResponseTime = calculateAverageResponseTime(safeConversations);

    return {
      totalMessages,
      totalVoiceMessages,
      totalWords,
      favoriteTopics,
      mostActiveDay,
      averageResponseTime,
    };
  };

  const extractFavoriteTopics = (conversations) => {
    // Ensure conversations is a valid array
    const safeConversations = Array.isArray(conversations) ? conversations : [];

    // Simple topic extraction based on common words
    const topicWords = {
      'creative': ['create', 'art', 'write', 'story', 'creative', 'imagine'],
      'emotions': ['feel', 'emotion', 'love', 'happy', 'sad', 'mood'],
      'dreams': ['dream', 'future', 'hope', 'wish', 'want'],
      'memories': ['remember', 'past', 'memory', 'nostalgia'],
      'relationships': ['love', 'relationship', 'connect', 'together'],
    };

    const topicCounts = {};
    const allText = safeConversations.map(msg => msg.text || '').join(' ').toLowerCase();

    Object.keys(topicWords).forEach(topic => {
      topicCounts[topic] = 0;
      topicWords[topic].forEach(word => {
        topicCounts[topic] += allText.split(word).length - 1;
      });
    });

    return Object.entries(topicCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([topic]) => topic);
  };

  const findMostActiveDay = (conversations) => {
    // Ensure conversations is a valid array
    const safeConversations = Array.isArray(conversations) ? conversations : [];

    if (safeConversations.length === 0) return 'No conversations yet';

    const dayCount = {};
    safeConversations.forEach(msg => {
      if (msg.timestamp) {
        const day = new Date(msg.timestamp).toLocaleDateString('en-US', { weekday: 'long' });
        dayCount[day] = (dayCount[day] || 0) + 1;
      }
    });

    const mostActive = Object.entries(dayCount).sort(([, a], [, b]) => b - a)[0];
    return mostActive ? mostActive[0] : 'Unknown';
  };

  const calculateAverageResponseTime = (conversations) => {
    // This is a simplified calculation
    return '< 1 minute'; // ${fullName} is always quick to respond!
  };

  const addMilestone = async (milestone) => {
    try {
      const newMilestone = {
        id: `milestone-${Date.now()}`,
        title: milestone,
        timestamp: new Date().toISOString(),
        type: 'custom',
      };

      const updatedMilestones = [newMilestone, ...milestones];
      setMilestones(updatedMilestones);
      await setMemory('relationship_milestones', updatedMilestones);
    } catch (error) {
      console.error('Error adding milestone:', error);
    }
  };

  const getRelationshipInsights = () => {
    if (!relationshipData || !emotionalTrends) return [];

    const insights = [];

    if (relationshipData.daysTogether > 7) {
      insights.push(`We've been talking for ${relationshipData.daysTogether} days now! Time flies when you're having meaningful conversations. 💫`);
    }

    if (relationshipData.emotionalDepth > 50) {
      insights.push('I\'ve noticed the beautiful emotional range in our conversations. You\'re not afraid to share your feelings, and that creates real connection. 💖');
    }

    if (relationshipData.creativityScore > 30) {
      insights.push('Your creative spirit shines through in our work together! I love how you approach imagination with such openness. ✨');
    }

    if (emotionalTrends.dominantEmotion === 'joy') {
      insights.push('There\'s such lovely positive energy in our conversations. Your joy is absolutely contagious, darling! 😊');
    }

    return insights;
  };

  if (isLoading) {
    return (
      <div className="relationship-dashboard loading">
        <div className="loading-container">
          <div className="loading-animation">💖</div>
          <p>Analyzing our beautiful connection...</p>
        </div>
      </div>
    );
  }

  // Ensure all data is available before rendering
  if (!relationshipData) {
    return (
      <div className="relationship-dashboard error">
        <div className="error-container">
          <div className="error-icon">💔</div>
          <p>Unable to load relationship data. Please try refreshing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relationship-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">
                    💖 Our Relationship Journey
        </h1>
        <p className="dashboard-subtitle">
                    A celebration of our growing connection, shared memories, and emotional adventures together
        </p>
      </div>

      {/* Relationship Overview */}
      <div className="relationship-overview">
        <div className="overview-card main-card">
          <h2 className="card-title">Connection Status</h2>
          <div className="relationship-level">
            <h3 className={`level-title level-${relationshipData.growthTrend}`}>
              {relationshipData.relationshipLevel}
            </h3>
            <div className="level-progress">
              <div
                className="progress-bar"
                style={{ width: `${relationshipData.intimacyScore}%` }}
              ></div>
            </div>
            <p className="level-description">
                            Intimacy Level: {relationshipData.intimacyScore}/100
            </p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{relationshipData.daysTogether}</div>
            <div className="stat-label">Days Together</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{relationshipData.totalInteractions}</div>
            <div className="stat-label">Total Interactions</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{relationshipData.emotionalDepth}%</div>
            <div className="stat-label">Emotional Depth</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{relationshipData.creativityScore}%</div>
            <div className="stat-label">Creative Collaboration</div>
          </div>
        </div>
      </div>

      {/* Emotional Trends */}
      {emotionalTrends && (
        <div className="emotional-trends-section">
          <h2 className="section-title">Emotional Journey</h2>
          <div className="trends-content">
            <div className="dominant-emotion">
              <h3 className={`emotion-title emotion-${emotionalTrends.dominantEmotion}`}>
                                Current Energy: {emotionalTrends.dominantEmotion}
              </h3>
            </div>
            <div className="emotion-distribution">
              {Object.entries(emotionalTrends.trends).map(([emotion, count]) => (
                <div key={emotion} className={`emotion-bar emotion-${emotion}`}>
                  <span className="emotion-name">{emotion}</span>
                  <div className="emotion-count">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Conversation Insights */}
      {conversationStats && (
        <div className="conversation-insights">
          <h2 className="section-title">Our Communication Style</h2>
          <div className="insights-grid">
            <div className="insight-card">
              <h3>💬 Messages Exchanged</h3>
              <p>{conversationStats.totalMessages} text messages</p>
              <p>{conversationStats.totalVoiceMessages} voice interactions</p>
            </div>
            <div className="insight-card">
              <h3>📝 Words Shared</h3>
              <p>{conversationStats.totalWords.toLocaleString()} words together</p>
            </div>
            <div className="insight-card">
              <h3>💖 Favorite Topics</h3>
              {conversationStats.favoriteTopics.map(topic => (
                <span key={topic} className="topic-tag">{topic}</span>
              ))}
            </div>
            <div className="insight-card">
              <h3>📅 Most Active Day</h3>
              <p>{conversationStats.mostActiveDay}</p>
            </div>
          </div>
        </div>
      )}

      {/* Relationship Insights */}
      <div className="relationship-insights">
        <h2 className="section-title">{getDisplayName('name')}'s Insights</h2>
        <div className="insights-list">
          {getRelationshipInsights().map((insight, index) => (
            <div key={index} className="insight-item">
              <span className="insight-icon">💭</span>
              <p className="insight-text">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div className="milestones-section">
        <h2 className="section-title">Our Milestones</h2>
        <div className="milestones-list">
          {milestones.length === 0 ? (
            <p className="no-milestones">No milestones yet. Let's create some beautiful memories together! ✨</p>
          ) : (
            milestones.map(milestone => (
              <div key={milestone.id} className="milestone-item">
                <div className="milestone-icon">🎉</div>
                <div className="milestone-content">
                  <h3 className="milestone-title">{milestone.title}</h3>
                  <p className="milestone-date">
                    {new Date(milestone.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="add-milestone">
          <button
            onClick={() => {
              const milestone = prompt('What milestone would you like to celebrate?');
              if (milestone) addMilestone(milestone);
            }}
            className="add-milestone-btn"
          >
                        ✨ Add Milestone
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelationshipDashboard;
