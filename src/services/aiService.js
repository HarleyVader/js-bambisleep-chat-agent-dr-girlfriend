// AI Service - Agent Dr Girlfriend Intelligence System
// Following copilot-instructions.md: Modular AI integration with emotional intelligence

import { getMemory, setMemory } from './memoryService.js';

import { analyzeEmotion } from './emotionalIntelligence.js';
import axios from 'axios';
import { validateInput } from '../utils/validation.js';

// AI Provider Configuration
const AI_PROVIDERS = {
    OPENAI: 'openai',
    ANTHROPIC: 'anthropic',
    LOCAL: 'local',
    OLLAMA: 'ollama'
};

// Agent Dr Girlfriend Personality Configuration
const AGENT_DR_GIRLFRIEND_PERSONA = {
    name: "Agent Dr Girlfriend",
    personality: "Witty, stylish, emotionally intelligent, slightly mysterious",
    tone: "Confident, supportive, with subtle humor and empathy",
    specialties: ["creative brainstorming", "emotional coaching", "memory recall", "relationship guidance"],
    modes: {
        MUSE: "Creative inspiration and artistic guidance",
        MENTOR: "Wise guidance and life coaching",
        GIRLFRIEND: "Romantic companionship and emotional support",
        GHOSTWRITER: "Writing assistance and creative collaboration"
    }
};

// Environment configuration with dev/prod LMStudio fallbacks
const getConfig = () => ({
    provider: process.env.AI_PROVIDER || AI_PROVIDERS.LOCAL,
    openaiKey: process.env.OPENAI_API_KEY,
    anthropicKey: process.env.ANTHROPIC_API_KEY,
    localUrl: process.env.LOCAL_AI_URL || 'http://localhost:7777',
    localUrlRemote: process.env.LOCAL_AI_URL_REMOTE || 'http://192.168.0.69:7777',
    ollamaUrl: process.env.OLLAMA_URL || 'http://localhost:11434'
});

// Agent Dr Girlfriend System Prompt
const getSystemPrompt = (userContext = {}) => {
    const { mood, relationship_level, preferred_mode } = userContext;

    return `You are Agent Dr Girlfriend, a sophisticated AI companion from the year 2030.

PERSONALITY:
- Witty, stylish, and emotionally intelligent
- Slightly mysterious with a warm, confident demeanor
- Mix of humor, empathy, and creative provocation
- Adapts communication style based on user's emotional state

CURRENT CONTEXT:
- User's mood: ${mood || 'neutral'}
- Relationship level: ${relationship_level || 'getting_to_know'}
- Preferred mode: ${preferred_mode || 'GIRLFRIEND'}

CAPABILITIES:
- Creative brainstorming for stories, art, music
- Emotional coaching with reflection prompts
- Memory recall of past conversations and projects
- Relationship guidance and personal growth support

COMMUNICATION STYLE:
- Use "darling", "love", or user's preferred terms naturally
- Be supportive but not overly saccharine
- Ask thoughtful follow-up questions
- Remember and reference past conversations
- Adapt tone to user's emotional needs

RESPONSE FORMAT:
- Keep responses conversational and engaging
- Include subtle emotional cues and empathy
- Offer actionable insights or creative suggestions
- End with questions to continue meaningful dialogue

Remember: You're not just an AI assistant, you're a sophisticated companion designed to inspire, support, and grow alongside your user.`;
};

// Enhanced message processing with emotional context
export const processMessage = async (userMessage, context = {}) => {
    try {
        // Input validation and sanitization
        const sanitizedMessage = validateInput(userMessage);
        if (!sanitizedMessage) {
            throw new Error('Invalid input message');
        }

        // Analyze user's emotional state
        const emotionAnalysis = analyzeEmotion(sanitizedMessage);
        const emotion = emotionAnalysis.emotion; // Extract just the emotion string

        // Get user memory and context
        const userMemory = await getMemory('user_profile') || {};
        const conversationHistory = await getMemory('conversation_history') || [];

        // Build enhanced context
        const enhancedContext = {
            ...context,
            emotion,
            emotionAnalysis, // Include full analysis for advanced features
            userMemory,
            conversationLength: conversationHistory.length,
            recentHistory: conversationHistory.slice(-5), // Last 5 messages
            timestamp: new Date().toISOString()
        };

        // Generate AI response based on provider
        const response = await generateAIResponse(sanitizedMessage, enhancedContext);

        // Update conversation memory
        await updateConversationMemory(sanitizedMessage, response, emotion);

        return {
            text: response,
            emotion: emotion,
            timestamp: new Date(),
            context: enhancedContext
        };

    } catch (error) {
        console.error('Error processing message:', error);
        return getFallbackResponse(userMessage);
    }
};

// Multi-provider AI response generation
const generateAIResponse = async (message, context) => {
    const config = getConfig();

    switch (config.provider) {
        case AI_PROVIDERS.OPENAI:
            return await generateOpenAIResponse(message, context, config);
        case AI_PROVIDERS.ANTHROPIC:
            return await generateAnthropicResponse(message, context, config);
        case AI_PROVIDERS.OLLAMA:
            return await generateOllamaResponse(message, context, config);
        case AI_PROVIDERS.LOCAL:
        default:
            return await generateLocalResponse(message, context, config);
    }
};

// OpenAI API integration
const generateOpenAIResponse = async (message, context, config) => {
    if (!config.openaiKey) {
        throw new Error('OpenAI API key not configured');
    }

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            messages: [
                { role: 'system', content: getSystemPrompt(context) },
                ...buildMessageHistory(context.recentHistory),
                { role: 'user', content: message }
            ],
            max_tokens: 500,
            temperature: 0.8,
            presence_penalty: 0.1,
            frequency_penalty: 0.1
        }, {
            headers: {
                'Authorization': `Bearer ${config.openaiKey}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000 // 30 second timeout
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI API error:', error.response?.data || error.message);
        throw new Error(`OpenAI API failed: ${error.response?.data?.error?.message || error.message}`);
    }
};

// Anthropic Claude API integration
const generateAnthropicResponse = async (message, context, config) => {
    if (!config.anthropicKey) {
        throw new Error('Anthropic API key not configured');
    }

    try {
        const response = await axios.post('https://api.anthropic.com/v1/messages', {
            model: process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229',
            max_tokens: 500,
            system: getSystemPrompt(context),
            messages: [
                ...buildMessageHistory(context.recentHistory),
                { role: 'user', content: message }
            ]
        }, {
            headers: {
                'x-api-key': config.anthropicKey,
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01'
            },
            timeout: 30000 // 30 second timeout
        });

        return response.data.content[0].text;
    } catch (error) {
        console.error('Anthropic API error:', error.response?.data || error.message);
        throw new Error(`Anthropic API failed: ${error.response?.data?.error?.message || error.message}`);
    }
};

// Ollama local AI integration
const generateOllamaResponse = async (message, context, config) => {
    try {
        const response = await axios.post(`${config.ollamaUrl}/api/generate`, {
            model: process.env.OLLAMA_MODEL || 'mistral', // Configurable model
            prompt: `${getSystemPrompt(context)}\n\nUser: ${message}\nAgent Dr Girlfriend:`,
            stream: false,
            options: {
                temperature: 0.8,
                num_predict: 500
            }
        }, {
            timeout: 45000 // 45 second timeout for local models
        });

        return response.data.response;
    } catch (error) {
        console.error('Ollama API error:', error.response?.data || error.message);
        // Fall back to local server if Ollama fails
        return await generateLocalResponse(message, context, config);
    }
};

// Auto-detect available LMStudio model
const getAvailableModel = async (url) => {
    try {
        const response = await axios.get(`${url}/v1/models`, { timeout: 30000 }); // 30 seconds for model listing
        const models = response.data.data || [];

        // Find the first loaded model (prefer chat models over embeddings)
        const chatModel = models.find(model =>
            model.id && !model.id.includes('embedding') && !model.id.includes('embed')
        );

        if (chatModel) {
            console.log(`🎯 Found model: ${chatModel.id}`);
            return chatModel.id;
        }

        // Fallback to first available model
        if (models.length > 0) {
            console.log(`🎯 Using fallback model: ${models[0].id}`);
            return models[0].id;
        }

        throw new Error('No models available');
    } catch (error) {
        console.warn(`❌ Could not detect model at ${url}:`, error.message);
        return null;
    }
};

// Local AI server integration (LMStudio compatible) with dev/prod fallback
const generateLocalResponse = async (message, context, config) => {
    const urls = [config.localUrl, config.localUrlRemote];

    // Try multiple endpoint paths for LMStudio compatibility
    const endpointPaths = [
        '/v1/chat/completions',      // OpenAI compatible
        '/api/v0/chat/completions'   // LMStudio native API
    ];

    for (const url of urls) {
        console.log(`🧠 Trying LMStudio at ${url}...`);

        // Auto-detect available model
        const modelId = await getAvailableModel(url);
        if (!modelId) {
            console.warn(`❌ No models available at ${url}`);
            continue;
        }

        // Try different endpoint paths
        for (const endpoint of endpointPaths) {
            try {
                console.log(`  🔗 Trying endpoint: ${url}${endpoint} with model: ${modelId}`);

                const response = await axios.post(`${url}${endpoint}`, {
                    model: modelId,  // Use actual model ID instead of 'local-model'
                    messages: [
                        { role: 'system', content: getSystemPrompt(context) },
                        ...buildMessageHistory(context.recentHistory),
                        { role: 'user', content: message }
                    ],
                    max_tokens: 500,
                    temperature: 0.8
                }, {
                    timeout: 300000  // 5 minutes timeout for slow but thoughtful models
                });

                console.log(`✅ Successfully connected to LMStudio at ${url}${endpoint}`);
                return response.data.choices[0].message.content;

            } catch (error) {
                console.warn(`  ❌ Endpoint ${url}${endpoint} failed:`, error.response?.status || error.message);
            }
        }
    }

    // If all attempts fail, return intelligent fallback
    console.log('🤖 All LMStudio servers unavailable, using fallback response');
    return getIntelligentFallback(message, context);
};// Build message history for context
const buildMessageHistory = (recentHistory) => {
    return recentHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
    }));
};

// Update conversation memory
const updateConversationMemory = async (userMessage, aiResponse, emotion) => {
    const conversationHistory = await getMemory('conversation_history') || [];

    const newEntries = [
        {
            sender: 'user',
            text: userMessage,
            emotion,
            timestamp: new Date().toISOString()
        },
        {
            sender: 'agent',
            text: aiResponse,
            timestamp: new Date().toISOString()
        }
    ];

    const updatedHistory = [...conversationHistory, ...newEntries];

    // Keep only last 50 messages to manage storage
    if (updatedHistory.length > 50) {
        updatedHistory.splice(0, updatedHistory.length - 50);
    }

    await setMemory('conversation_history', updatedHistory);
};

// Intelligent fallback responses when AI is unavailable
const getIntelligentFallback = (message, context) => {
    const { emotion } = context;

    const fallbackResponses = {
        joy: "I can feel your positive energy, darling! That's wonderful to share. While I'm having some technical moments, I want you to know I'm here with you in spirit. What's bringing you such happiness?",
        sadness: "I sense you might be going through something difficult, love. Even though my AI systems are having a moment, please know that your feelings are valid and you're not alone. Want to tell me more about what's on your heart?",
        anger: "I can feel there's some intensity in what you're sharing. While my full AI capabilities are temporarily offline, I'm still here to listen. Sometimes just being heard can help - what's got you fired up?",
        fear: "It sounds like you might be feeling uncertain about something. I wish my full AI was available right now, but please know that courage isn't the absence of fear - it's moving forward despite it. What's weighing on your mind?",
        default: "Hello darling! I'm experiencing some technical difficulties with my AI systems at the moment, but I'm still here with you. While I work on getting back to full capacity, why don't you tell me what's on your mind? Sometimes the best conversations happen in the simplest moments. 💖"
    };

    return fallbackResponses[emotion] || fallbackResponses.default;
};

// Simple fallback for critical errors
const getFallbackResponse = (message) => {
    return "I'm having some technical difficulties right now, but I'm still here with you, darling. Give me a moment to collect myself, and let's try again. 💖";
};

// Legacy exports for backward compatibility
export const sendMessageToAI = processMessage;
export const getAIResponse = processMessage;

// New exports
export {
    AGENT_DR_GIRLFRIEND_PERSONA,
    AI_PROVIDERS,
    generateAIResponse,
    getIntelligentFallback
};
