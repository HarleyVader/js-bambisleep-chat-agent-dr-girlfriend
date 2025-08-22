// PersonaSelector.js - Agent Dr Girlfriend personality modes
// Following copilot-instructions.md: Emotional UX design with Agent Dr Girlfriend personas

import React, { useState, useEffect } from 'react';
import { getMemory, setMemory } from '../../services/memoryService.js';

const PersonaSelector = ({ selectedPersona = 'GIRLFRIEND', onSelect }) => {
    const [currentPersona, setCurrentPersona] = useState(selectedPersona);
    const [isChanging, setIsChanging] = useState(false);

    // Agent Dr Girlfriend persona modes from documentation
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
            color: 'creative'
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
            color: 'wisdom'
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
            color: 'romantic'
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
            color: 'literary'
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
                    🎭 Choose Your Agent Dr Girlfriend Mode
                </h2>
                <p className="persona-subtitle">
                    Each mode brings out different aspects of my personality to match your needs
                </p>
            </div>

            {/* Current persona display */}
            <div className={`current-persona persona-${currentPersonaData.color}`}>
                <div className="current-persona-header">
                    <span className="current-persona-emoji">{currentPersonaData.emoji}</span>
                    <div className="current-persona-info">
                        <h3 className="current-persona-name">{currentPersonaData.name}</h3>
                        <p className="current-persona-description">{currentPersonaData.description}</p>
                    </div>
                    {isChanging && <div className="persona-changing">✨ Transforming...</div>}
                </div>
                <div className="current-persona-sample">
                    <em>"{currentPersonaData.sampleResponse}"</em>
                </div>
            </div>

            {/* Persona options */}
            <div className="persona-grid">
                {personas.map(persona => (
                    <div
                        key={persona.id}
                        className={`persona-card persona-${persona.color} ${currentPersona === persona.id ? 'selected' : ''
                            } ${isChanging ? 'disabled' : ''}`}
                        onClick={() => !isChanging && handlePersonaSelect(persona.id)}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => {
                            if ((e.key === 'Enter' || e.key === ' ') && !isChanging) {
                                handlePersonaSelect(persona.id);
                            }
                        }}
                        aria-pressed={currentPersona === persona.id}
                    >
                        <div className="persona-card-header">
                            <span className="persona-emoji">{persona.emoji}</span>
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
