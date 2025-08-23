// MessageBubble.js - Enhanced message component for Agent Dr Girlfriend
import React, { useEffect, useState } from 'react';

const MessageBubble = ({ message }) => {
    const isAgent = message.sender === 'agent';
    const [isVisible, setIsVisible] = useState(false);

    // Trigger entrance animation
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 50);
        return () => clearTimeout(timer);
    }, []);

    // Mood-based emoji mapping
    const getMoodEmoji = (mood) => {
        const moodEmojis = {
            happy: '😊',
            romantic: '💖',
            excited: '✨',
            sad: '💙',
            thoughtful: '🤔',
            playful: '😏',
            supportive: '🤗',
            neutral: '👩‍⚕️'
        };
        return moodEmojis[mood] || moodEmojis.neutral;
    };

    // Format timestamp
    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={`message-container ${isAgent ? 'agent-message' : 'user-message'} ${isVisible ? 'visible' : ''}`}
            data-mood={message.mood || 'neutral'}>

            {/* Agent Avatar */}
            {isAgent && (
                <div className="message-avatar agent-avatar" data-mood={message.mood}>
                    <span className="avatar-emoji">{getMoodEmoji(message.mood)}</span>
                    <div className="avatar-status-ring"></div>
                </div>
            )}

            {/* Message Content */}
            <div className={`message-bubble ${isAgent ? 'message-agent' : 'message-user'}`}
                data-mood={message.mood || 'neutral'}>

                {/* Message text with enhanced formatting */}
                <div className="message-content">
                    <p className="message-text">{message.text}</p>

                    {/* Emotion indicator for agent messages */}
                    {isAgent && message.emotion && (
                        <div className="emotion-indicator">
                            <span className="emotion-tag">
                                {typeof message.emotion === 'string'
                                    ? message.emotion
                                    : message.emotion.emotion || 'neutral'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Enhanced timestamp with status */}
                <div className="message-footer">
                    <span className="message-timestamp">
                        {formatTime(message.timestamp)}
                    </span>
                    {!isAgent && (
                        <span className="message-status">✓</span>
                    )}
                </div>
            </div>

            {/* User Avatar */}
            {!isAgent && (
                <div className="message-avatar user-avatar">
                    <span className="avatar-emoji">👤</span>
                    <div className="avatar-status-ring user-ring"></div>
                </div>
            )}
        </div>
    );
};

export default MessageBubble;
