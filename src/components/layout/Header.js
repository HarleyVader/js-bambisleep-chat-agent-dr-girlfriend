// Header.js - Enhanced header with fixed navbar and hover descriptions
// Following copilot-instructions.md: Accessible navigation design

import React, { useState, useEffect } from 'react';

const Header = ({ currentView, setCurrentView }) => {
    const [hoveredItem, setHoveredItem] = useState(null);
    const [hoverTimer, setHoverTimer] = useState(null);

    const navigationItems = [
        { id: 'chat', label: 'Chat', icon: '💬', description: 'Talk with Agent Dr Girlfriend - Share thoughts, feelings, and have meaningful conversations' },
        { id: 'journal', label: 'Journal', icon: '📝', description: 'Dream Journal - Write your thoughts, dreams, and private reflections' },
        { id: 'creative', label: 'Creative', icon: '🎨', description: 'Creative Studio - Collaborate on stories, art, and creative projects together' },
        { id: 'relationship', label: 'Journey', icon: '💖', description: 'Our Journey - Track relationship progress, milestones, and emotional growth' },
        { id: 'persona', label: 'Mode', icon: '🎭', description: 'Personality Mode - Choose interaction style: Girlfriend, Muse, Mentor, or Ghostwriter' }
    ];

    const handleMouseEnter = (itemId) => {
        // Clear any existing timer
        if (hoverTimer) {
            clearTimeout(hoverTimer);
        }

        // Set 1-second delay for hover description
        const timer = setTimeout(() => {
            setHoveredItem(itemId);
        }, 1000);

        setHoverTimer(timer);
    };

    const handleMouseLeave = () => {
        // Clear timer and hide description
        if (hoverTimer) {
            clearTimeout(hoverTimer);
            setHoverTimer(null);
        }
        setHoveredItem(null);
    };

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (hoverTimer) {
                clearTimeout(hoverTimer);
            }
        };
    }, [hoverTimer]);

    const handleNavigation = (viewId) => {
        setCurrentView(viewId);
        handleMouseLeave(); // Hide any visible descriptions
    };

    return (
        <header className="header-fixed">
            {/* Fixed Top Navigation Bar */}
            <nav className="top-navbar" aria-label="Main navigation">
                <div className="navbar-container">
                    {/* Brand/Logo */}
                    <div className="navbar-brand" onClick={() => handleNavigation('chat')}>
                        <span className="brand-icon">👩‍⚕️</span>
                        <span className="brand-text">Dr_Girlfriend.exe</span>
                    </div>

                    {/* Navigation Links */}
                    <div className="navbar-nav">
                        {navigationItems.map(item => (
                            <div
                                key={item.id}
                                className="nav-item-container"
                                onMouseEnter={() => handleMouseEnter(item.id)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <a
                                    href={`#${item.id}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleNavigation(item.id);
                                    }}
                                    className={`nav-anchor ${currentView === item.id ? 'active' : ''}`}
                                    aria-current={currentView === item.id ? 'page' : undefined}
                                >
                                    <span className="nav-icon">{item.icon}</span>
                                    <span className="nav-label">{item.label}</span>
                                </a>

                                {/* Hover Description Tooltip */}
                                {hoveredItem === item.id && (
                                    <div className="nav-tooltip" role="tooltip">
                                        <div className="tooltip-content">
                                            <div className="tooltip-title">{item.label}</div>
                                            <div className="tooltip-description">{item.description}</div>
                                        </div>
                                        <div className="tooltip-arrow"></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Status Indicator */}
                    <div className="navbar-status">
                        <div className="status-indicator online"></div>
                        <span className="status-text">Online</span>
                    </div>
                </div>
            </nav>

            {/* Spacer to prevent content overlap */}
            <div className="header-spacer"></div>
        </header>
    );
};

export default Header;
