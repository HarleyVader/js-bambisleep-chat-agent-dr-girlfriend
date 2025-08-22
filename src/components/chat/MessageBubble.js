// MessageBubble.js - Individual message component for Agent Dr Girlfriend
import React from 'react';

const MessageBubble = ({ message }) => {
    const isAgent = message.sender === 'agent';

    return (
        <div className={`flex items-center ${isAgent ? '' : 'flex-row-reverse'} w-full message-container`}>
            {/* Avatar */}
            {isAgent && (
                <div className="avatar agent-avatar">
                    <span>👩‍⚕️</span>
                </div>
            )}

            {/* Message Content */}
            <div className={`${isAgent ? 'chat-bubble-agent' : 'chat-bubble-user'} animate-slide-up`}>
                <p className="message-text">{message.text}</p>
                {message.timestamp && (
                    <span className={`message-timestamp ${isAgent ? 'agent-timestamp' : 'user-timestamp'}`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                )}
            </div>

            {/* User Avatar Placeholder */}
            {!isAgent && (
                <div className="avatar user-avatar">
                    <span>👤</span>
                </div>
            )}
        </div>
    );
};

export default MessageBubble;
