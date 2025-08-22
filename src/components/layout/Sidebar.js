// Sidebar.js - Enhanced sidebar component for desktop view
// Following copilot-instructions.md: Emotional UX design with Agent Dr Girlfriend personality

import React, { useState, useEffect } from 'react';
import { getMemory } from '../../services/memoryService.js';

const Sidebar = ({ currentView, setCurrentView }) => {
    const [userContext, setUserContext] = useState(null);
    const [currentMood, setCurrentMood] = useState('neutral');

    // Enhanced menu items matching the full feature set
    const menuItems = [
        {
            id: 'chat',
            label: 'Chat',
            icon: '💬',
            description: 'Talk with Agent Dr Girlfriend',
            category: 'main'
        },
        {
            id: 'journal',
            label: 'Dream Journal',
            icon: '📝',
            description: 'Write your thoughts and dreams',
            category: 'main'
        },
        {
            id: 'creative',
            label: 'Creative Studio',
            icon: '🎨',
            description: 'Collaborate on creative projects',
            category: 'creative'
        },
        {
            id: 'relationship',
            label: 'Our Journey',
            icon: '💖',
            description: 'Track relationship progress',
            category: 'insights'
        },
        {
            id: 'persona',
            label: 'Personality Mode',
            icon: '🎭',
            description: 'Choose interaction style',
            category: 'settings'
        }
    ];

    // Load user context for personalization
    useEffect(() => {
        const loadUserContext = async () => {
            try {
                const context = await getMemory('user_context');
                if (context) {
                    setUserContext(context);
                    setCurrentMood(context.mood || 'neutral');
                }
            } catch (error) {
                console.error('Error loading user context:', error);
            }
        };

        loadUserContext();
    }, []);

    const getMenuItemsByCategory = (category) => {
        return menuItems.filter(item => item.category === category);
    };

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

    const getStatusMessage = () => {
        if (userContext?.relationship_level) {
            const levels = {
                'getting_to_know': 'Getting to know each other',
                'building_connection': 'Building our connection',
                'deep_bond': 'Deep emotional bond',
                'soulmate_connection': 'Soulmate connection'
            };
            return levels[userContext.relationship_level] || 'Growing together';
        }
        return 'Ready for conversation';
    };

    return (
        <aside className="sidebar" role="complementary" aria-label="Navigation sidebar">
            {/* Sidebar Header */}
            <div className="sidebar-header">
                <div className="sidebar-brand" onClick={() => setCurrentView('chat')}>
                    <div className="sidebar-avatar">
                        <span role="img" aria-label="Agent Dr Girlfriend">👩‍⚕️</span>
                        <div className={`mood-indicator mood-${currentMood}`}></div>
                    </div>
                    <div className="sidebar-info">
                        <h2 className="sidebar-title">Agent Dr Girlfriend</h2>
                        <p className="sidebar-subtitle">AI Companion from 2030</p>
                        <div className="sidebar-status">
                            <p className="greeting">{getPersonalizedGreeting()}</p>
                            <p className="status-message">{getStatusMessage()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="sidebar-nav" aria-label="Main navigation">

                {/* Primary Features */}
                <div className="nav-section">
                    <h3 className="nav-section-title">Conversations</h3>
                    <ul className="nav-list">
                        {getMenuItemsByCategory('main').map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => setCurrentView(item.id)}
                                    className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                                    aria-pressed={currentView === item.id}
                                >
                                    <span className="nav-icon">{item.icon}</span>
                                    <div className="nav-content">
                                        <div className="nav-label">{item.label}</div>
                                        <div className="nav-description">{item.description}</div>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Creative Features */}
                <div className="nav-section">
                    <h3 className="nav-section-title">Creative</h3>
                    <ul className="nav-list">
                        {getMenuItemsByCategory('creative').map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => setCurrentView(item.id)}
                                    className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                                    aria-pressed={currentView === item.id}
                                >
                                    <span className="nav-icon">{item.icon}</span>
                                    <div className="nav-content">
                                        <div className="nav-label">{item.label}</div>
                                        <div className="nav-description">{item.description}</div>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Insights & Relationship */}
                <div className="nav-section">
                    <h3 className="nav-section-title">Insights</h3>
                    <ul className="nav-list">
                        {getMenuItemsByCategory('insights').map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => setCurrentView(item.id)}
                                    className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                                    aria-pressed={currentView === item.id}
                                >
                                    <span className="nav-icon">{item.icon}</span>
                                    <div className="nav-content">
                                        <div className="nav-label">{item.label}</div>
                                        <div className="nav-description">{item.description}</div>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Settings */}
                <div className="nav-section">
                    <h3 className="nav-section-title">Settings</h3>
                    <ul className="nav-list">
                        {getMenuItemsByCategory('settings').map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => setCurrentView(item.id)}
                                    className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                                    aria-pressed={currentView === item.id}
                                >
                                    <span className="nav-icon">{item.icon}</span>
                                    <div className="nav-content">
                                        <div className="nav-label">{item.label}</div>
                                        <div className="nav-description">{item.description}</div>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            {/* Sidebar Footer */}
            <div className="sidebar-footer">
                <div className="footer-stats">
                    {userContext && (
                        <>
                            <div className="stat-item">
                                <span className="stat-label">Days together:</span>
                                <span className="stat-value">
                                    {userContext.first_interaction ?
                                        Math.floor((new Date() - new Date(userContext.first_interaction)) / (1000 * 60 * 60 * 24)) :
                                        '0'
                                    }
                                </span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Current mode:</span>
                                <span className="stat-value">{userContext.preferred_mode || 'Girlfriend'}</span>
                            </div>
                        </>
                    )}
                </div>

                <div className="footer-info">
                    <p className="version-info">BambiSleep v1.0.0</p>
                    <p className="tagline">Emotional AI Companion</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
