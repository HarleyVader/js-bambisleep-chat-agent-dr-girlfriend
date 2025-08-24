// ChatInterface.js - Enhanced chat component for Agent Dr Girlfriend
// Following copilot-instructions.md: Emotional UX design with accessibility

import React, { useEffect, useRef, useState } from 'react';
import { analyzeEmotion, getEmotionalTrends, trackEmotionalPattern } from '../../services/emotionalIntelligence.js';
import { getMemory, setMemory } from '../../services/memoryService.js';

import MessageBubble from './MessageBubble.js';
import { TRANSFORMATION_EFFECTS } from '../../services/nameTransformationService.js';
import VoiceInput from './VoiceInput.js';
import { processMessage } from '../../services/aiService.js';
import useNameTransformation from '../../hooks/useNameTransformation.js';

// Typing indicator component
const TypingIndicator = ({ isVisible, mood = 'neutral', agentName = 'Dr Girlfriend' }) => {
  if (!isVisible) return null;

  return (
    <div className="typing-indicator" data-mood={mood}>
      <div className="typing-indicator-avatar">
        <span className="agent-icon">👩‍💼</span>
      </div>
      <div className="typing-indicator-bubble">
        <div className="typing-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
        <div className="typing-text">{agentName} is thinking...</div>
      </div>
    </div>
  );
};

// Enhanced chat hook with real AI integration and name transformation
const useEnhancedChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userContext, setUserContext] = useState({
    mood: 'neutral',
    relationship_level: 'getting_to_know',
    preferred_mode: 'GIRLFRIEND',
  });

  // Import name transformation hook
  const {
    getDisplayName,
    getPersonalizedGreeting,
    detectCostumeChange,
    performCostumeChange,
    isTransforming,
  } = useNameTransformation();

  // Load initial greeting and conversation history
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Load previous messages from memory
        const savedMessages = await getMemory('recent_messages') || [];

        if (savedMessages.length === 0) {
          // First time greeting using current agent name
          const greeting = {
            id: 'greeting-1',
            text: `Hello there, darling! 💖 I'm ${getDisplayName('full')}, your emotionally intelligent companion from the future. I'm here to listen, inspire, and grow alongside you. How are you feeling today?`,
            sender: 'agent',
            timestamp: new Date(),
            mood: 'friendly',
            emotion: 'joy',
          };
          setMessages([greeting]);
        } else {
          setMessages(savedMessages);
        }

        // Load user context
        const savedContext = await getMemory('user_context');
        if (savedContext) {
          setUserContext(savedContext);
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
        // Fallback greeting
        setMessages([{
          id: 'fallback-greeting',
          text: `Hello darling! I'm ${getDisplayName('full')}. Something's a bit wonky with my memory systems, but I'm here and ready to chat with you! 💖`,
          sender: 'agent',
          timestamp: new Date(),
          mood: 'friendly',
          emotion: 'joy',
        }]);
      }
    };

    initializeChat();
  }, []);

  // Save messages to memory when they change
  useEffect(() => {
    if (messages.length > 0) {
      // Keep only last 20 messages in UI memory
      const recentMessages = messages.slice(-20);
      setMemory('recent_messages', recentMessages);
    }
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
      emotion: analyzeEmotion(text.trim()).emotion,
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Check for costume change request BEFORE processing with AI
      const costumeChangeRequest = detectCostumeChange(text.trim());

      if (costumeChangeRequest.detected) {
        // Handle costume change request
        setIsLoading(false);

        // Add transformation announcement message
        const transformationMessage = {
          id: `transformation-${Date.now()}`,
          text: `✨ Ooh, a costume change! I love this idea! Let me transform into ${costumeChangeRequest.newName} for you... 💫`,
          sender: 'agent',
          timestamp: new Date(),
          mood: 'excited',
          emotion: 'excitement',
          isTransformationMessage: true,
        };

        setMessages(prev => [...prev, transformationMessage]);

        // Perform the actual transformation with effects
        setTimeout(async () => {
          try {
            const result = await performCostumeChange(
              costumeChangeRequest.newName,
              TRANSFORMATION_EFFECTS.SPARKLE_CASCADE,
            );

            // Add success message
            const successMessage = {
              id: `success-${Date.now()}`,
              text: result.message,
              sender: 'agent',
              timestamp: new Date(),
              mood: 'happy',
              emotion: 'joy',
              isTransformationComplete: true,
            };

            setMessages(prev => [...prev, successMessage]);

          } catch (error) {
            console.error('Transformation failed:', error);

            const errorMessage = {
              id: `transformation-error-${Date.now()}`,
              text: 'Oops! The costume change magic fizzled out. The cosmic energies must be misaligned. Want to try again? 💫',
              sender: 'agent',
              timestamp: new Date(),
              mood: 'apologetic',
              emotion: 'neutral',
            };

            setMessages(prev => [...prev, errorMessage]);
          }
        }, 1000);

        return; // Don't process as normal AI message
      }

      // Process message with AI (normal flow)
      const aiResponse = await processMessage(text.trim(), userContext);

      const agentMessage = {
        id: `agent-${Date.now()}`,
        text: aiResponse.text,
        sender: 'agent',
        timestamp: aiResponse.timestamp,
        mood: detectMoodFromEmotion(aiResponse.emotion),
        emotion: aiResponse.emotion,
        context: aiResponse.context,
      };

      setMessages(prev => [...prev, agentMessage]);

      // Update user context based on conversation
      const updatedContext = {
        ...userContext,
        mood: aiResponse.emotion,
        last_interaction: new Date().toISOString(),
      };
      setUserContext(updatedContext);
      await setMemory('user_context', updatedContext);

    } catch (error) {
      console.error('Error sending message:', error);

      // Fallback response
      const errorMessage = {
        id: `error-${Date.now()}`,
        text: 'I\'m having a moment with my systems, darling. Give me a second to collect myself and let\'s try again. You\'re worth the wait! 💖',
        sender: 'agent',
        timestamp: new Date(),
        mood: 'apologetic',
        emotion: 'neutral',
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    isLoading: isLoading || isTransforming,
    userContext,
    getDisplayName,
    getPersonalizedGreeting,
  };
};

// Helper function to map emotions to moods for UI
const detectMoodFromEmotion = (emotion) => {
  const emotionToMoodMap = {
    joy: 'happy',
    happiness: 'happy',
    sadness: 'sad',
    anger: 'angry',
    fear: 'nervous',
    surprise: 'excited',
    love: 'romantic',
    excitement: 'excited',
    calm: 'peaceful',
    neutral: 'neutral',
  };
  return emotionToMoodMap[emotion] || 'neutral';
};

const ChatInterface = () => {
  const {
    messages,
    sendMessage,
    isLoading,
    userContext,
    getDisplayName,
    getPersonalizedGreeting,
  } = useEnhancedChat();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      await sendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  // Handle voice input
  const handleVoiceInput = (transcript) => {
    if (transcript.trim()) {
      sendMessage(transcript.trim());
    }
  };

  return (
    <div className="chat-interface">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-avatar">
            <span>👩‍⚕️</span>
          </div>
          <div className="chat-title-section">
            <h2 className="chat-title agent-name">{getDisplayName('full')}</h2>
            <p className="chat-subtitle">
              {isLoading ? 'Thinking...' : `Mode: ${userContext.preferred_mode} • Mood: ${userContext.mood}`}
            </p>
          </div>
        </div>
        <div className="chat-header-actions">
          <button className="header-btn" aria-label="Settings">⚙️</button>
          <button className="header-btn" aria-label="Voice Mode">🎤</button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="messages-container"
        role="log"
        aria-live="polite"
        aria-label="Chat messages">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
          />
        ))}

        {/* Enhanced Typing indicator */}
        <TypingIndicator
          isVisible={isLoading}
          mood={userContext.mood}
          agentName={getDisplayName('name')}
        />

        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />

        {/* Floating Input Container */}
        <div className="floating-input-container">
          <div className="input-form">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder={`Share your thoughts with ${getDisplayName('name')}...`}
              className="chat-textarea"
              rows="2"
              aria-label="Message input"
              maxLength="2000"
              disabled={isLoading}
            />
            <div className="input-controls"
              role="group"
              aria-label="Chat controls">

              {/* Voice Input Button */}
              <VoiceInput
                onResult={handleVoiceInput}
                isEnabled={!isLoading}
              />

              {/* Send Button */}
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="send-button"
                aria-label={isLoading ? 'Sending...' : 'Send message'}
              >
                {isLoading ? (
                  <span className="loading-indicator">
                    <span className="loading-dot"></span>
                    <span className="loading-dot"></span>
                    <span className="loading-dot"></span>
                  </span>
                ) : (
                  <svg
                    className="send-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
