// Sidebar.js - Enhanced sidebar with Agent Dr Girlfriend stats and telemetry
// Following copilot-instructions.md: Emotional UX design with comprehensive stats

import React, { useState, useEffect } from 'react';
import { getMemory } from '../../services/memoryService.js';

const Sidebar = ({ currentView, setCurrentView }) => {
    const [userContext, setUserContext] = useState(null);
    const [relationshipStats, setRelationshipStats] = useState(null);
    const [emotionalTrends, setEmotionalTrends] = useState(null);
    const [systemStats, setSystemStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load comprehensive data for sidebar
    useEffect(() => {
        const loadSidebarData = async () => {
            try {
                setIsLoading(true);

                const [
                    rawContext,
                    rawEmotionalHistory,
                    rawRecentMessages,
                    rawRelationshipMilestones,
                    rawJournalEntries,
                    rawCreativeProjects
                ] = await Promise.all([
                    getMemory('user_context'),
                    getMemory('emotional_history'),
                    getMemory('recent_messages'),
                    getMemory('relationship_milestones'),
                    getMemory('journal_entries'),
                    getMemory('creative_projects')
                ]);

                // Apply null checks and defaults after Promise resolution
                const context = rawContext || {};
                const emotional_history = rawEmotionalHistory || [];
                const recent_messages = rawRecentMessages || [];
                const relationship_milestones = rawRelationshipMilestones || [];
                const journal_entries = rawJournalEntries || [];
                const creative_projects = rawCreativeProjects || [];

                setUserContext(context);

                // Calculate relationship stats with proper null checks
                const firstInteraction = context?.first_interaction || new Date().toISOString();
                const daysTogether = Math.floor((new Date() - new Date(firstInteraction)) / (1000 * 60 * 60 * 24));
                const totalInteractions = recent_messages.length + journal_entries.length + creative_projects.length;

                setRelationshipStats({
                    daysTogether,
                    totalInteractions,
                    totalMessages: recent_messages.length,
                    journalEntries: journal_entries.length,
                    creativeProjects: creative_projects.length,
                    milestones: relationship_milestones.length,
                    relationshipLevel: context?.relationship_level || 'getting_to_know'
                });

                // Calculate emotional trends
                const recentEmotions = emotional_history.slice(-10);
                const emotionCounts = recentEmotions.reduce((acc, item) => {
                    acc[item.emotion] = (acc[item.emotion] || 0) + 1;
                    return acc;
                }, {});

                const dominantEmotion = Object.entries(emotionCounts)
                    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'neutral';

                setEmotionalTrends({
                    dominantEmotion,
                    totalEmotionalEntries: emotional_history.length,
                    recentEmotions: recentEmotions.length,
                    emotionVariety: Object.keys(emotionCounts).length
                });

                // System stats
                setSystemStats({
                    currentMode: context?.preferred_mode || 'GIRLFRIEND',
                    lastActive: new Date().toISOString(),
                    storageHealth: 'optimal',
                    uptime: '24/7'
                });

            } catch (error) {
                console.error('Error loading sidebar data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadSidebarData();
    }, [currentView]); // Refresh when view changes

    const getPersonalizedGreeting = () => {
        const hour = new Date().getHours();
        const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';

        if (userContext?.preferred_mode) {
            const modeGreetings = {
                'MUSE': `✨ Creative ${timeOfDay}, darling`,
                'MENTOR': `🧠 Good ${timeOfDay}, love`,
                'GIRLFRIEND': `💖 Hey beautiful`,
                'GHOSTWRITER': `📝 Ready to write?`
            };
            return modeGreetings[userContext.preferred_mode] || `Good ${timeOfDay}!`;
        }

        return `Good ${timeOfDay}!`;
    };

    const getRelationshipLevelDisplay = (level) => {
        const levels = {
            'getting_to_know': { emoji: '🌱', text: 'Getting to Know' },
            'building_connection': { emoji: '🌿', text: 'Building Connection' },
            'deep_bond': { emoji: '🌸', text: 'Deep Bond' },
            'soulmate_connection': { emoji: '🌹', text: 'Soulmate Level' }
        };
        return levels[level] || { emoji: '💫', text: 'Growing Together' };
    };

    const getEmotionEmoji = (emotion) => {
        const emojis = {
            'joy': '😊', 'love': '💕', 'excitement': '🤩', 'creative': '✨',
            'sad': '😢', 'neutral': '😐', 'angry': '😠', 'fear': '😨',
            'surprise': '😲', 'calm': '😌', 'motivated': '💪', 'curious': '🤔'
        };
        return emojis[emotion] || '💫';
    };

    if (isLoading) {
        return (
            <aside className="sidebar loading">
                <div className="loading-container">
                    <div className="loading-spinner">💖</div>
                    <p>Loading Agent Dr Girlfriend...</p>
                </div>
            </aside>
        );
    }

    return (
        <aside className="sidebar" role="complementary" aria-label="Agent Dr Girlfriend Stats and Navigation">

            {/* Agent Dr Girlfriend Profile Section */}
            <div className="sidebar-profile">
                <div className="profile-header">
                    <div className="profile-avatar">
                        <span className="avatar-icon">👩‍⚕️</span>
                        <div className="status-indicator online"></div>
                    </div>
                    <div className="profile-info">
                        <h2 className="profile-name">Agent Dr Girlfriend</h2>
                        <p className="profile-subtitle">AI Companion from 2030</p>
                        <p className="profile-greeting">{getPersonalizedGreeting()}</p>
                    </div>
                </div>
            </div>

            {/* Relationship Statistics */}
            <div className="sidebar-section">
                <h3 className="section-title">📊 Our Relationship</h3>
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📅</div>
                        <div className="stat-content">
                            <div className="stat-value">{relationshipStats?.daysTogether || 0}</div>
                            <div className="stat-label">Days Together</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">💬</div>
                        <div className="stat-content">
                            <div className="stat-value">{relationshipStats?.totalMessages || 0}</div>
                            <div className="stat-label">Messages</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">📝</div>
                        <div className="stat-content">
                            <div className="stat-value">{relationshipStats?.journalEntries || 0}</div>
                            <div className="stat-label">Journal Entries</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">🎨</div>
                        <div className="stat-content">
                            <div className="stat-value">{relationshipStats?.creativeProjects || 0}</div>
                            <div className="stat-label">Creative Works</div>
                        </div>
                    </div>
                </div>

                {/* Relationship Level */}
                <div className="relationship-level">
                    {(() => {
                        const level = getRelationshipLevelDisplay(relationshipStats?.relationshipLevel);
                        return (
                            <div className="level-display">
                                <span className="level-emoji">{level.emoji}</span>
                                <span className="level-text">{level.text}</span>
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* Emotional Intelligence Stats */}
            <div className="sidebar-section">
                <h3 className="section-title">🧠 Emotional Intelligence</h3>
                <div className="emotion-stats">
                    <div className="current-emotion">
                        <span className="emotion-emoji">
                            {getEmotionEmoji(emotionalTrends?.dominantEmotion)}
                        </span>
                        <div className="emotion-info">
                            <div className="emotion-label">Current Vibe</div>
                            <div className="emotion-value">
                                {emotionalTrends?.dominantEmotion || 'neutral'}
                            </div>
                        </div>
                    </div>

                    <div className="emotion-metrics">
                        <div className="metric">
                            <span className="metric-label">Emotional Range:</span>
                            <span className="metric-value">{emotionalTrends?.emotionVariety || 0}</span>
                        </div>
                        <div className="metric">
                            <span className="metric-label">Total Emotions:</span>
                            <span className="metric-value">{emotionalTrends?.totalEmotionalEntries || 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Status */}
            <div className="sidebar-section">
                <h3 className="section-title">⚙️ System Status</h3>
                <div className="system-stats">
                    <div className="system-item">
                        <span className="system-label">Mode:</span>
                        <span className="system-value">{systemStats?.currentMode || 'GIRLFRIEND'}</span>
                    </div>
                    <div className="system-item">
                        <span className="system-label">Uptime:</span>
                        <span className="system-value">{systemStats?.uptime || '24/7'}</span>
                    </div>
                    <div className="system-item">
                        <span className="system-label">Storage:</span>
                        <span className="system-value health-optimal">{systemStats?.storageHealth || 'optimal'}</span>
                    </div>
                    <div className="system-item">
                        <span className="system-label">Version:</span>
                        <span className="system-value">BambiSleep v1.0.0</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="sidebar-section">
                <h3 className="section-title">⚡ Quick Actions</h3>
                <div className="quick-actions">
                    <button
                        className="quick-action-btn"
                        onClick={() => setCurrentView('relationship')}
                        title="View detailed relationship analytics"
                    >
                        <span className="btn-icon">📈</span>
                        <span className="btn-text">View Analytics</span>
                    </button>
                    <button
                        className="quick-action-btn"
                        onClick={() => setCurrentView('persona')}
                        title="Change personality mode"
                    >
                        <span className="btn-icon">🎭</span>
                        <span className="btn-text">Switch Mode</span>
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="sidebar-footer">
                <div className="footer-text">
                    <p className="tagline">🤖 Emotional AI Companion</p>
                    <p className="copyright">© 2030 Future Tech</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
