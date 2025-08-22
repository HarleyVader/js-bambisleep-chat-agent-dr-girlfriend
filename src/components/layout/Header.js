// Header.js - Enhanced header component with navigation
// Following copilot-instructions.md: Accessible navigation design

import React, { useState } from 'react';

const Header = ({ currentView, setCurrentView }) => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const navigationItems = [
        { id: 'chat', label: 'Chat', icon: '💬', description: 'Talk with Agent Dr Girlfriend' },
        { id: 'journal', label: 'Dream Journal', icon: '📝', description: 'Write your thoughts and dreams' },
        { id: 'creative', label: 'Creative Studio', icon: '🎨', description: 'Collaborate on creative projects' },
        { id: 'relationship', label: 'Our Journey', icon: '💖', description: 'Track your relationship progress' },
        { id: 'persona', label: 'Personality', icon: '🎭', description: 'Choose Agent Dr Girlfriend mode' }
    ];

    const currentItem = navigationItems.find(item => item.id === currentView) || navigationItems[0];

    const handleNavigation = (viewId) => {
        setCurrentView(viewId);
        setShowMobileMenu(false);
    };

    const toggleMobileMenu = () => {
        setShowMobileMenu(!showMobileMenu);
    };

    return (
        <header className="header-container">
            <div className="header-content">
                {/* Brand Section */}
                <div className="header-brand" onClick={() => handleNavigation('chat')}>
                    <div className="header-avatar">
                        <span role="img" aria-label="Agent Dr Girlfriend avatar">👩‍⚕️</span>
                    </div>
                    <div className="brand-text">
                        <h1 className="header-title">Agent Dr Girlfriend</h1>
                        <p className="header-subtitle">Your AI Companion</p>
                    </div>
                </div>

                {/* Current View Indicator (Mobile) */}
                <div className="current-view-mobile">
                    <span className="current-icon">{currentItem.icon}</span>
                    <span className="current-label">{currentItem.label}</span>
                </div>

                {/* Desktop Navigation */}
                <nav className="header-nav-desktop" aria-label="Main navigation">
                    {navigationItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleNavigation(item.id)}
                            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                            aria-pressed={currentView === item.id}
                            title={item.description}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="header-menu-button"
                    onClick={toggleMobileMenu}
                    aria-expanded={showMobileMenu}
                    aria-label="Toggle navigation menu"
                >
                    <svg
                        className={`menu-icon ${showMobileMenu ? 'open' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        {showMobileMenu ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Navigation Dropdown */}
            {showMobileMenu && (
                <div className="mobile-nav-dropdown">
                    <nav className="mobile-nav" aria-label="Mobile navigation">
                        {navigationItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => handleNavigation(item.id)}
                                className={`mobile-nav-item ${currentView === item.id ? 'active' : ''}`}
                                aria-pressed={currentView === item.id}
                            >
                                <span className="mobile-nav-icon">{item.icon}</span>
                                <div className="mobile-nav-text">
                                    <span className="mobile-nav-label">{item.label}</span>
                                    <span className="mobile-nav-description">{item.description}</span>
                                </div>
                            </button>
                        ))}
                    </nav>
                </div>
            )}

            {/* Mobile Menu Overlay */}
            {showMobileMenu && (
                <div
                    className="mobile-menu-overlay"
                    onClick={() => setShowMobileMenu(false)}
                    aria-hidden="true"
                ></div>
            )}
        </header>
    );
};

export default Header;
