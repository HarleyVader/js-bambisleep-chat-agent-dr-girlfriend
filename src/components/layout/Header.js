// Header.js - Enhanced header with fixed navbar and hover descriptions
// Following copilot-instructions.md: Accessible navigation design

import React, { useEffect, useState } from 'react';

import useNameTransformation from '../../hooks/useNameTransformation.js';
import useBambisleepAlerts from '../../hooks/useBambisleepAlerts.js';

const Header = ({ currentView, setCurrentView }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoverTimer, setHoverTimer] = useState(null);

  // Import name transformation hook
  const { getDisplayName, fullName } = useNameTransformation();

  // Import bambisleep alerts hook
  const {
    isAlertVisible,
    currentAlert,
    alertQueue,
    connectionStatus,
    ALERT_TYPES,
    dismissAlert,
    triggerTestAlert,
  } = useBambisleepAlerts();

  const navigationItems = [
    { id: 'chat', label: 'Chat', icon: '💬', description: `Talk with ${fullName} - Share thoughts, feelings, and have meaningful conversations` },
    { id: 'journal', label: 'Journal', icon: '📝', description: 'Dream Journal - Write your thoughts, dreams, and private reflections' },
    { id: 'creative', label: 'Creative', icon: '🎨', description: 'Creative Studio - Collaborate on stories, art, and creative projects together' },
    { id: 'relationship', label: 'Journey', icon: '💖', description: 'Our Journey - Track relationship progress, milestones, and emotional growth' },
    { id: 'persona', label: 'Mode', icon: '🎭', description: 'Personality Mode - Choose interaction style: Girlfriend, Muse, Mentor, or Ghostwriter' },
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

  // Format timestamp for alerts
  const formatAlertTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get alert icon based on type
  const getAlertIcon = (type) => {
    switch (type) {
    case ALERT_TYPES.UPDATE: return '📡';
    case ALERT_TYPES.WARNING: return '⚠️';
    case ALERT_TYPES.ALERT: return '🚨';
    case ALERT_TYPES.INFO: return 'ℹ️';
    default: return 'ℹ️';
    }
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

            {/* Alert Connection Status */}
            <div
              className={`alert-connection-status ${connectionStatus}`}
              title={`Bambisleep Prime: ${connectionStatus}`}
            ></div>

            {/* Alert Queue Indicator */}
            {alertQueue > 0 && (
              <div className="alert-queue-badge" title={`${alertQueue} alerts queued`}>
                {alertQueue}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer with Alert System */}
      <div className="header-spacer">
        {/* Bambisleep Prime Alert */}
        {currentAlert && (
          <div
            className={`bambisleep-alert alert-${currentAlert.type} ${isAlertVisible ? 'visible' : ''}`}
            role="alert"
            aria-live={currentAlert.priority === 'high' ? 'assertive' : 'polite'}
          >
            <div className="alert-content">
              <div className="alert-main">
                <div className="alert-icon" aria-hidden="true">
                  {getAlertIcon(currentAlert.type)}
                </div>
                <div className="alert-text">
                  <div className="alert-title">{currentAlert.title}</div>
                  {currentAlert.message && (
                    <div className="alert-message">{currentAlert.message}</div>
                  )}
                </div>
              </div>
              <div className="alert-actions">
                <div className="alert-timestamp">
                  {formatAlertTime(currentAlert.timestamp)}
                </div>
                <button
                  className="alert-dismiss"
                  onClick={dismissAlert}
                  aria-label="Dismiss alert"
                >
                                    ✕
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
