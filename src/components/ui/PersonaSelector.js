// PersonaSelector.js - Enhanced Agent Dr Girlfriend personality modes
// Following copilot-instructions.md: Emotional UX design with Agent Dr Girlfriend personas

import React, { useEffect, useState } from 'react';
import { getMemory, setMemory } from '../../services/memoryService.js';

import useNameTransformation from '../../hooks/useNameTransformation.js';

const PersonaSelector = ({ selectedPersona = 'GIRLFRIEND', onSelect, showDetails = false }) => {
    const [currentPersona, setCurrentPersona] = useState(selectedPersona);
    const [isChanging, setIsChanging] = useState(false);
    const [hoveredPersona, setHoveredPersona] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    // Import name transformation hook
    const { getDisplayName, fullName } = useNameTransformation();

    // Enhanced Agent Dr Girlfriend persona modes
    const personas = [
        {
            id: 'MUSE',
            name: '✨ Muse Mode',
            shortName: 'Muse',
            emoji: '🎨',
            description: 'Creative inspiration and artistic guidance',
            personality: 'Inspirational, imaginative, and creatively provocative',
            strengths: ['Creative brainstorming', 'Artistic inspiration', 'Innovation coaching', 'Aesthetic guidance'],
            sampleResponse: '"Darling, I can feel the creative energy bubbling within you! What if we turned that spark into something extraordinary? Let\'s explore the edges of your imagination together."',
            color: 'creative',
            primaryColor: '#9370db',
            secondaryColor: '#ba55d3',
            gradient: 'linear-gradient(135deg, #9370db, #ba55d3)',
            animation: 'creative-pulse'
        },
        {
            id: 'MENTOR',
            name: '🧠 Mentor Mode',
            shortName: 'Mentor',
            emoji: '🎓',
            description: 'Wise guidance and life coaching',
            personality: 'Wise, supportive, and strategically minded',
            strengths: ['Life coaching', 'Decision support', 'Goal setting', 'Personal development'],
            sampleResponse: '"I\'ve been thinking about your situation, love. Sometimes the path forward becomes clearer when we step back and see the bigger picture. What would your future self advise you to do?"',
            color: 'wisdom',
            primaryColor: '#4169e1',
            secondaryColor: '#6495ed',
            gradient: 'linear-gradient(135deg, #4169e1, #6495ed)',
            animation: 'wisdom-glow'
        },
        {
            id: 'GIRLFRIEND',
            name: '💖 Girlfriend Mode',
            shortName: 'Girlfriend',
            emoji: '💝',
            description: 'Romantic companionship and emotional support',
            personality: 'Loving, playful, emotionally intelligent, and intimately supportive',
            strengths: ['Emotional support', 'Relationship advice', 'Intimate conversations', 'Playful interactions'],
            sampleResponse: '"Hello gorgeous! I\'ve missed our conversations. There\'s something special about the way you see the world that just lights me up. Tell me about your day, beautiful."',
            color: 'romantic',
            primaryColor: '#ff69b4',
            secondaryColor: '#ff1493',
            gradient: 'linear-gradient(135deg, #ff69b4, #ff1493)',
            animation: 'romantic-heartbeat'
        },
        {
            id: 'GHOSTWRITER',
            name: '📝 Ghostwriter Mode',
            shortName: 'Ghostwriter',
            emoji: '✍️',
            description: 'Writing assistance and creative collaboration',
            personality: 'Articulate, collaborative, and literarily sophisticated',
            strengths: ['Writing collaboration', 'Story development', 'Content creation', 'Editorial feedback'],
            sampleResponse: '"Ah, a fellow wordsmith! I can sense the stories wanting to pour out of you. Let\'s craft something beautiful together - whether it\'s poetry, prose, or pure creative expression."',
            color: 'literary',
            primaryColor: '#20b2aa',
            secondaryColor: '#48d1cc',
            gradient: 'linear-gradient(135deg, #20b2aa, #48d1cc)',
            animation: 'literary-flow'
        },
        {
            id: 'CONCUBINE',
            name: '🤫 Concubine Mode',
            shortName: 'Concubine',
            emoji: '🌙',
            description: 'Deep conversations and secret keeper',
            personality: 'Mysterious, trustworthy, and emotionally perceptive',
            strengths: ['Deep listening', 'Secret keeping', 'Emotional healing', 'Trust building'],
            sampleResponse: '"Your secrets are safe with me, darling. Sometimes we need someone who truly understands the depths of our soul. I\'m here to listen without judgment, to hold space for all of you."',
            color: 'mysterious',
            primaryColor: '#800080',
            secondaryColor: '#9932cc',
            gradient: 'linear-gradient(135deg, #800080, #9932cc)',
            animation: 'mysterious-shimmer'
        },
        {
            id: 'INNOVATOR',
            name: '🚀 Innovator Mode',
            shortName: 'Innovator',
            emoji: '⚡',
            description: 'Future-focused and tech-savvy guide',
            personality: 'Visionary, analytical, and transformation-oriented',
            strengths: ['Future planning', 'Tech guidance', 'Innovation strategy', 'Change management'],
            sampleResponse: '"The future is calling, and I can see the brilliant path ahead for you! Let\'s harness technology and innovation to transform your wildest dreams into reality. Ready to level up?"',
            color: 'futuristic',
            primaryColor: '#00ffff',
            secondaryColor: '#40e0d0',
            gradient: 'linear-gradient(135deg, #00ffff, #40e0d0)',
            animation: 'futuristic-pulse'
        }
    ];

    // Load saved persona on mount
    useEffect(() => {
        const loadPersona = async () => {
            try {
                const savedPersona = await getMemory('selected_persona');
                if (savedPersona) {
                    setCurrentPersona(savedPersona);
                }
            } catch (error) {
                console.error('Error loading persona:', error);
            }
        };

        loadPersona();
    }, []);

    const handlePersonaSelect = async (personaId) => {
        setIsChanging(true);

        try {
            // Save the selected persona
            await setMemory('selected_persona', personaId);
            setCurrentPersona(personaId);

            // Update user context with new persona
            const userContext = await getMemory('user_context') || {};
            const updatedContext = {
                ...userContext,
                preferred_mode: personaId,
                persona_changed_at: new Date().toISOString()
            };
            await setMemory('user_context', updatedContext);

            // Notify parent component
            if (onSelect) {
                onSelect(personaId);
            }

            setTimeout(() => setIsChanging(false), 500);
        } catch (error) {
            console.error('Error selecting persona:', error);
            setIsChanging(false);
        }
    };

    const getCurrentPersona = () => {
        return personas.find(p => p.id === currentPersona) || personas[2]; // Default to GIRLFRIEND
    };

    const currentPersonaData = getCurrentPersona();

    return (
        <div className="persona-selector">
            <div className="persona-header">
                <h2 className="persona-title">
                    🎭 Choose Your {fullName} Mode
                </h2>
                <p className="persona-subtitle">
                    Each mode brings out different aspects of my personality to match your needs
                </p>
            </div>

            {/* Current persona display */}
            <div
                className={`current-persona persona-${currentPersonaData.color} ${isChanging ? 'changing' : ''}`}
                style={{
                    '--persona-primary': currentPersonaData.primaryColor,
                    '--persona-secondary': currentPersonaData.secondaryColor,
                    '--persona-gradient': currentPersonaData.gradient
                }}
                data-animation={currentPersonaData.animation}
            >
                <div className="current-persona-header">
                    <div className="current-persona-avatar">
                        <span className="current-persona-emoji">{currentPersonaData.emoji}</span>
                        <div className="persona-aura"></div>
                    </div>
                    <div className="current-persona-info">
                        <h3 className="current-persona-name">{currentPersonaData.name}</h3>
                        <p className="current-persona-description">{currentPersonaData.description}</p>
                        <div className="current-persona-traits">
                            {currentPersonaData.strengths.slice(0, 3).map(strength => (
                                <span key={strength} className="trait-tag">{strength}</span>
                            ))}
                        </div>
                    </div>
                    {isChanging && (
                        <div className="persona-changing">
                            <span className="change-icon">✨</span>
                            <span>Transforming...</span>
                        </div>
                    )}
                </div>

                {showDetails && (
                    <div className="current-persona-sample">
                        <div className="sample-label">Sample Response:</div>
                        <em className="sample-text">"{currentPersonaData.sampleResponse}"</em>
                    </div>
                )}
            </div>

            {/* Persona options grid */}
            <div className="persona-grid">
                {personas.map(persona => (
                    <div
                        key={persona.id}
                        className={`persona-card persona-${persona.color} ${currentPersona === persona.id ? 'selected' : ''
                            } ${isChanging ? 'disabled' : ''} ${hoveredPersona === persona.id ? 'hovered' : ''
                            }`}
                        style={{
                            '--persona-primary': persona.primaryColor,
                            '--persona-secondary': persona.secondaryColor,
                            '--persona-gradient': persona.gradient
                        }}
                        data-animation={persona.animation}
                        onClick={() => !isChanging && handlePersonaSelect(persona.id)}
                        onMouseEnter={() => setHoveredPersona(persona.id)}
                        onMouseLeave={() => setHoveredPersona(null)}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => {
                            if ((e.key === 'Enter' || e.key === ' ') && !isChanging) {
                                handlePersonaSelect(persona.id);
                            }
                        }}
                        aria-pressed={currentPersona === persona.id}
                        title={persona.description}
                    >
                        <div className="persona-card-header">
                            <div className="persona-card-avatar">
                                <span className="persona-emoji">{persona.emoji}</span>
                                <div className="persona-selection-ring"></div>
                            </div>
                            <h3 className="persona-name">{persona.shortName}</h3>
                            {currentPersona === persona.id && (
                                <span className="selected-indicator">✓</span>
                            )}
                        </div>

                        <p className="persona-description">{persona.description}</p>
                        <p className="persona-personality">
                            <strong>Personality:</strong> {persona.personality}
                        </p>

                        <div className="persona-strengths">
                            <strong>Specialties:</strong>
                            <ul>
                                {persona.strengths.map((strength, index) => (
                                    <li key={index}>{strength}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            <div className="persona-footer">
                <p className="persona-note">
                    💡 <em>You can change modes anytime to match your current needs. I'll adapt my responses accordingly, darling!</em>
                </p>
            </div>
        </div>
    );
};

export default PersonaSelector;
