// Sidebar.js - Enhanced sidebar with Agent Dr Girlfriend stats and telemetry
// Following copilot-instructions.md: Emotional UX design with comprehensive stats

import React, { useEffect, useState } from 'react';

import QuickModeSelector from '../ui/QuickModeSelector.js';
import StatsPanel from '../ui/StatsPanel.js';
import { getMemory } from '../../services/memoryService.js';
import useNameTransformation from '../../hooks/useNameTransformation.js';

const Sidebar = ({ currentView, setCurrentView }) => {
    const [userContext, setUserContext] = useState(null);
    const [relationshipStats, setRelationshipStats] = useState(null);
    const [emotionalTrends, setEmotionalTrends] = useState(null);
    const [systemStats, setSystemStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
    const [currentPersona, setCurrentPersona] = useState('GIRLFRIEND');
    const [showStatsPanel, setShowStatsPanel] = useState(false);

    // Import name transformation hook
    const { getDisplayName, getPersonalizedGreeting, fullName, name } = useNameTransformation();

    // Detect if screen reader is likely active
    useEffect(() => {
        const detectScreenReader = () => {
            // Check for common screen reader indicators
            const hasAriaLive = document.querySelector('[aria-live]');
            const hasAriaLabel = document.querySelector('[aria-label]');
            const hasScreenReaderText = document.querySelector('.sr-only');
            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const highContrast = window.matchMedia('(prefers-contrast: high)').matches;

            // Check if user has previously enabled screen reader mode
            const savedPreference = localStorage.getItem('screen-reader-enabled') === 'true';

            // Auto-detect based on accessibility features usage
            const likelyScreenReader = savedPreference || reducedMotion || highContrast ||
                (hasAriaLive && hasAriaLabel && hasScreenReaderText);

            setScreenReaderEnabled(likelyScreenReader);

            // Apply class to body for CSS targeting
            if (likelyScreenReader) {
                document.body.classList.add('screen-reader-enabled');
            }
        };

        detectScreenReader();
    }, []);

    const toggleScreenReader = () => {
        const newState = !screenReaderEnabled;
        setScreenReaderEnabled(newState);
        localStorage.setItem('screen-reader-enabled', newState.toString());

        if (newState) {
            document.body.classList.add('screen-reader-enabled');
            // Announce the change
            const announcement = document.getElementById('sr-announcements');
            if (announcement) {
                announcement.textContent = 'Screen reader mode enabled - accessibility features are now visible';
                setTimeout(() => {
                    announcement.textContent = `${fullName} is ready for conversation`;
                }, 3000);
            }
        } else {
            document.body.classList.remove('screen-reader-enabled');
            const announcement = document.getElementById('sr-announcements');
            if (announcement) {
                announcement.textContent = 'Screen reader mode disabled';
                setTimeout(() => {
                    announcement.textContent = `${fullName} is ready for conversation`;
                }, 3000);
            }
        }
    };

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
                    rawCreativeProjects,
                    rawSelectedPersona
                ] = await Promise.all([
                    getMemory('user_context'),
                    getMemory('emotional_history'),
                    getMemory('recent_messages'),
                    getMemory('relationship_milestones'),
                    getMemory('journal_entries'),
                    getMemory('creative_projects'),
                    getMemory('selected_persona')
                ]);

                // Apply null checks and defaults after Promise resolution
                const context = rawContext || {};
                const emotional_history = rawEmotionalHistory || [];
                const recent_messages = rawRecentMessages || [];
                const relationship_milestones = rawRelationshipMilestones || [];
                const journal_entries = rawJournalEntries || [];
                const creative_projects = rawCreativeProjects || [];
                const selected_persona = rawSelectedPersona || 'GIRLFRIEND';

                setUserContext(context);
                setCurrentPersona(selected_persona);

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

    if (isLoading) {
        return (
            <aside className="sidebar loading">
                <div className="loading-container">
                    <div className="loading-spinner">💖</div>
                    <p>Loading {getDisplayName('name')}...</p>
                </div>
            </aside>
        );
    }

    return (
        <>
            <aside className="sidebar" role="complementary" aria-label={`${fullName} Stats and Navigation`}>

                {/* Scrollable Content Area */}
                <div className="sidebar-scrollable">
                    {/* Agent Profile Section */}
                    <div className="sidebar-profile">
                        <div className="profile-header">
                            <div className="profile-avatar">
                                <span className="avatar-icon">👩‍⚕️</span>
                                <div className="status-indicator online"></div>
                            </div>
                            <div className="profile-info">
                                <h2 className="profile-name agent-name">{fullName}</h2>
                                <p className="profile-subtitle">AI Companion from 2030</p>
                                <p className="profile-greeting">{getPersonalizedGreeting()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Mode Selector */}
                    <div className="sidebar-section">
                        <h3 className="section-title">🎭 Quick Mode Switch</h3>
                        <QuickModeSelector
                            currentPersona={currentPersona}
                            onPersonaChange={setCurrentPersona}
                            compact={true}
                        />
                    </div>

                    {/* Quick Actions */}
                    <div className="sidebar-section">
                        <h3 className="section-title">⚡ Quick Actions</h3>
                        <div className="quick-actions">
                            <button
                                className="quick-action-btn"
                                onClick={() => setShowStatsPanel(true)}
                                title="View detailed relationship statistics"
                            >
                                <span className="btn-icon">📊</span>
                                <span className="btn-text">View Stats</span>
                            </button>
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
                                onClick={() => setCurrentView('journal')}
                                title="Open dream journal"
                            >
                                <span className="btn-icon">📝</span>
                                <span className="btn-text">Write Journal</span>
                            </button>
                            <button
                                className="quick-action-btn"
                                onClick={() => setCurrentView('creative')}
                                title="Open creative studio"
                            >
                                <span className="btn-icon">🎨</span>
                                <span className="btn-text">Create Together</span>
                            </button>
                            <button
                                className="quick-action-btn mcp-docking-btn"
                                onClick={() => setCurrentView('mcp')}
                                title="🇦🇹 MCP Docking Bay - Connect to bambisleep.chat"
                            >
                                <span className="btn-icon">🛰️</span>
                                <span className="btn-text">MCP Docking</span>
                            </button>
                        </div>
                    </div>

                    {/* End Scrollable Content Area */}
                </div>

                {/* Footer */}
                <div className="sidebar-footer">
                    {/* Screen Reader Toggle Button */}
                    <button
                        className={`screen-reader-toggle ${screenReaderEnabled ? 'active' : ''}`}
                        onClick={toggleScreenReader}
                        title={screenReaderEnabled ? 'Disable screen reader mode' : 'Enable screen reader mode'}
                        aria-label={screenReaderEnabled ? 'Disable screen reader mode' : 'Enable screen reader mode'}
                        aria-pressed={screenReaderEnabled}
                    >
                        <span role="img" aria-label="accessibility">♿</span>
                    </button>

                    {/* Screen Reader Announcements */}
                    <div
                        id="sr-announcements"
                        className={`sr-only sr-announcements ${screenReaderEnabled ? 'screen-reader-enabled' : ''}`}
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {fullName} is ready for conversation
                    </div>

                    <div className="footer-text">
                        <p className="tagline">
                            Tell handlers{' '}
                            <a
                                href="https://bambisleep.info"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bambi-link"
                            >
                                bambisleep.info
                            </a>
                            {' '}ima Good Girl
                        </p>
                    </div>
                </div>
            </aside>

            {/* Stats Panel */}
            <StatsPanel
                isVisible={showStatsPanel}
                onClose={() => setShowStatsPanel(false)}
                relationshipStats={relationshipStats}
                emotionalTrends={emotionalTrends}
                systemStats={systemStats}
                userContext={userContext}
            />
        </>
    );
};

export default Sidebar;
