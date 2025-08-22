// Enhanced Chat Hook - Agent Dr Girlfriend
// Advanced chat management with emotional intelligence and memory

import { analyzeEmotion, trackEmotionalPattern } from '../services/emotionalIntelligence.js';
import { getConversationHistory, getMemory, saveConversationMessage, setMemory } from '../services/memoryService.js';
import { useCallback, useEffect, useRef, useState } from 'react';

import { processMessage } from '../services/aiService.js';
import { processVoiceCommand } from '../services/voiceService.js';

const useChat = (initialPersona = 'sultry') => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [currentPersona, setCurrentPersona] = useState(initialPersona);
    const [conversationId, setConversationId] = useState(null);
    const [emotionalContext, setEmotionalContext] = useState(null);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    // Refs for managing state
    const isInitialized = useRef(false);
    const typingTimeout = useRef(null);
    const maxRetries = 3;

    // Initialize chat on mount
    useEffect(() => {
        const initializeChat = async () => {
            if (isInitialized.current) return;

            try {
                // Generate or retrieve conversation ID
                const savedConversationId = await getMemory('current_conversation_id');
                const newConversationId = savedConversationId || `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

                setConversationId(newConversationId);
                await setMemory('current_conversation_id', newConversationId);

                // Load conversation history
                const history = await getConversationHistory(newConversationId);
                if (history && history.length > 0) {
                    setMessages(history);
                }

                // Load user preferences
                const savedPersona = await getMemory('preferred_persona');
                if (savedPersona) {
                    setCurrentPersona(savedPersona);
                }

                isInitialized.current = true;
            } catch (error) {
                console.error('Failed to initialize chat:', error);
                setError('Failed to initialize chat. Please refresh and try again.');
            }
        };

        initializeChat();
    }, []);

    // Auto-save messages to memory
    const saveMessage = useCallback(async (message) => {
        if (conversationId) {
            try {
                await saveConversationMessage(conversationId, message);
            } catch (error) {
                console.error('Failed to save message:', error);
            }
        }
    }, [conversationId]);

    // Enhanced input change handler
    const handleInputChange = useCallback((event) => {
        setInput(event.target.value);
        setError(null); // Clear any previous errors

        // Simulate typing indicator
        setIsTyping(true);
        if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
        }
        typingTimeout.current = setTimeout(() => {
            setIsTyping(false);
        }, 1000);
    }, []);

    // Enhanced message sending with emotional intelligence
    const handleSendMessage = useCallback(async (messageText = input, options = {}) => {
        const text = messageText.trim();
        if (!text) return;

        setLoading(true);
        setError(null);

        try {
            // Create user message with metadata
            const userMessage = {
                id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                text: text,
                sender: 'user',
                timestamp: new Date().toISOString(),
                persona: currentPersona,
                messageType: options.messageType || 'text'
            };

            // Add user message to state and save
            setMessages(prev => [...prev, userMessage]);
            await saveMessage(userMessage);
            setInput('');

            // Check if it's a voice command
            const voiceCommandResult = await processVoiceCommand(text);
            if (voiceCommandResult.isCommand) {
                const commandResponse = {
                    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    text: voiceCommandResult.message || "Command executed successfully, darling!",
                    sender: 'ai',
                    timestamp: new Date().toISOString(),
                    persona: currentPersona,
                    messageType: 'command_response',
                    commandResult: voiceCommandResult.result
                };

                setMessages(prev => [...prev, commandResponse]);
                await saveMessage(commandResponse);
                setLoading(false);
                return;
            }

            // Analyze user's emotional state
            const emotionalAnalysis = analyzeEmotion(text);
            setEmotionalContext(emotionalAnalysis);

            // Track emotional pattern
            await trackEmotionalPattern(emotionalAnalysis.emotion, emotionalAnalysis.intensity, {
                persona: currentPersona,
                conversationId: conversationId
            });

            // Generate AI response with emotional context
            const aiResponse = await processMessage(text, {
                persona: currentPersona,
                emotion: emotionalAnalysis,
                conversationHistory: messages.slice(-5), // Last 5 messages for context
                userId: await getMemory('user_id') || 'anonymous'
            });

            // Create AI response message
            const aiMessage = {
                id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                text: aiResponse.text,
                sender: 'ai',
                timestamp: new Date().toISOString(),
                persona: currentPersona,
                messageType: 'response',
                emotionalContext: emotionalAnalysis,
                generatedBy: 'ai_service'
            };

            // Add AI message to state and save
            setMessages(prev => [...prev, aiMessage]);
            await saveMessage(aiMessage);

            setRetryCount(0); // Reset retry count on success

        } catch (error) {
            console.error('Failed to send message:', error);

            if (retryCount < maxRetries) {
                setRetryCount(prev => prev + 1);
                setError(`Message failed to send. Retrying... (${retryCount + 1}/${maxRetries})`);

                // Retry after a delay
                setTimeout(() => {
                    handleSendMessage(text, options);
                }, 2000);
            } else {
                setError('Failed to send message. Please try again.');
                setRetryCount(0);
            }
        } finally {
            setLoading(false);
        }
    }, [input, currentPersona, conversationId, messages, saveMessage, retryCount]);

    // Clear conversation
    const clearConversation = useCallback(async () => {
        try {
            setMessages([]);
            setEmotionalContext(null);
            setError(null);

            // Generate new conversation ID
            const newConversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            setConversationId(newConversationId);
            await setMemory('current_conversation_id', newConversationId);

        } catch (error) {
            console.error('Failed to clear conversation:', error);
            setError('Failed to clear conversation');
        }
    }, []);

    // Change persona
    const changePersona = useCallback(async (newPersona) => {
        try {
            setCurrentPersona(newPersona);
            await setMemory('preferred_persona', newPersona);

            // Add system message about persona change
            const systemMessage = {
                id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                text: `*Agent Dr Girlfriend shifts into ${newPersona} mode* 💫`,
                sender: 'system',
                timestamp: new Date().toISOString(),
                persona: newPersona,
                messageType: 'persona_change'
            };

            setMessages(prev => [...prev, systemMessage]);
            await saveMessage(systemMessage);
        } catch (error) {
            console.error('Failed to change persona:', error);
            setError('Failed to change persona');
        }
    }, [saveMessage]);

    // Send quick reply
    const sendQuickReply = useCallback((replyText) => {
        handleSendMessage(replyText, { messageType: 'quick_reply' });
    }, [handleSendMessage]);

    // Get conversation statistics
    const getConversationStats = useCallback(() => {
        const userMessages = messages.filter(msg => msg.sender === 'user');
        const aiMessages = messages.filter(msg => msg.sender === 'ai');

        return {
            totalMessages: messages.length,
            userMessages: userMessages.length,
            aiMessages: aiMessages.length,
            conversationStarted: messages.length > 0 ? messages[0].timestamp : null,
            lastMessage: messages.length > 0 ? messages[messages.length - 1].timestamp : null,
            emotionalContext: emotionalContext
        };
    }, [messages, emotionalContext]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (typingTimeout.current) {
                clearTimeout(typingTimeout.current);
            }
        };
    }, []);

    return {
        // State
        messages,
        input,
        loading,
        isTyping,
        currentPersona,
        conversationId,
        emotionalContext,
        error,

        // Actions
        handleInputChange,
        handleSendMessage,
        clearConversation,
        changePersona,
        sendQuickReply,

        // Utils
        getConversationStats,

        // Status
        isInitialized: isInitialized.current,
        retryCount,
        maxRetries
    };
};

export default useChat;
