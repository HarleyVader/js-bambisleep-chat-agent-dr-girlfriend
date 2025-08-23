// StatsPanel.js - Sliding stats panel for Agent Dr Girlfriend
// Following copilot-instructions.md: Emotional UX design with slide animations

import React from 'react';

const StatsPanel = ({
    isVisible,
    onClose,
    relationshipStats,
    emotionalTrends,
    systemStats,
    userContext
}) => {
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

    if (!isVisible) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="stats-panel-backdrop"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Stats Panel */}
            <div
                className="stats-panel"
                role="dialog"
                aria-labelledby="stats-panel-title"
                aria-modal="true"
            >
                {/* Panel Header */}
                <div className="stats-panel-header">
                    <h2 id="stats-panel-title" className="stats-panel-title">
                        📊 Relationship Statistics
                    </h2>
                    <button
                        className="stats-panel-close"
                        onClick={onClose}
                        aria-label="Close statistics panel"
                        title="Close statistics panel"
                    >
                        ✕
                    </button>
                </div>

                {/* Panel Content */}
                <div className="stats-panel-content">

                    {/* Relationship Statistics */}
                    <div className="stats-section">
                        <h3 className="stats-section-title">💖 Our Relationship</h3>
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

                            <div className="stat-card">
                                <div className="stat-icon">🏆</div>
                                <div className="stat-content">
                                    <div className="stat-value">{relationshipStats?.milestones || 0}</div>
                                    <div className="stat-label">Milestones</div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">🤝</div>
                                <div className="stat-content">
                                    <div className="stat-value">{relationshipStats?.totalInteractions || 0}</div>
                                    <div className="stat-label">Total Interactions</div>
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
                    <div className="stats-section">
                        <h3 className="stats-section-title">🧠 Emotional Intelligence</h3>
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
                                <div className="metric">
                                    <span className="metric-label">Recent Activity:</span>
                                    <span className="metric-value">{emotionalTrends?.recentEmotions || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="stats-section">
                        <h3 className="stats-section-title">⚙️ System Status</h3>
                        <div className="system-stats">
                            <div className="system-item">
                                <span className="system-label">Current Mode:</span>
                                <span className="system-value">{systemStats?.currentMode || 'GIRLFRIEND'}</span>
                            </div>
                            <div className="system-item">
                                <span className="system-label">Uptime:</span>
                                <span className="system-value">{systemStats?.uptime || '24/7'}</span>
                            </div>
                            <div className="system-item">
                                <span className="system-label">Storage Health:</span>
                                <span className="system-value health-optimal">{systemStats?.storageHealth || 'optimal'}</span>
                            </div>
                            <div className="system-item">
                                <span className="system-label">Version:</span>
                                <span className="system-value">BambiSleep v1.0.0</span>
                            </div>
                            <div className="system-item">
                                <span className="system-label">Last Active:</span>
                                <span className="system-value">Just Now</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default StatsPanel;
