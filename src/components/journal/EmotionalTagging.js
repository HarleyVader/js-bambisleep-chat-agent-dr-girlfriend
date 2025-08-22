// EmotionalTagging.js - Enhanced emotion selection with Agent Dr Girlfriend personality
// Following copilot-instructions.md: Emotional UX design with multi-select capabilities

import React, { useState, useEffect } from 'react';

const EmotionalTagging = ({ onTagging, selectedEmotions = [], detectedMood = 'neutral' }) => {
    const [localSelectedEmotions, setLocalSelectedEmotions] = useState(selectedEmotions);

    // Comprehensive emotion palette with Agent Dr Girlfriend styling
    const emotions = [
        { name: 'joyful', emoji: '😊', color: 'joy', category: 'positive' },
        { name: 'excited', emoji: '🤩', color: 'excitement', category: 'positive' },
        { name: 'love', emoji: '💖', color: 'romantic', category: 'positive' },
        { name: 'grateful', emoji: '🙏', color: 'peaceful', category: 'positive' },
        { name: 'creative', emoji: '✨', color: 'creative', category: 'positive' },
        { name: 'confident', emoji: '💪', color: 'empowered', category: 'positive' },
        { name: 'peaceful', emoji: '🧘', color: 'calm', category: 'neutral' },
        { name: 'contemplative', emoji: '🤔', color: 'thoughtful', category: 'neutral' },
        { name: 'curious', emoji: '🔮', color: 'mysterious', category: 'neutral' },
        { name: 'nostalgic', emoji: '🌙', color: 'dreamy', category: 'neutral' },
        { name: 'melancholy', emoji: '🍂', color: 'wistful', category: 'complex' },
        { name: 'anxious', emoji: '😰', color: 'nervous', category: 'challenging' },
        { name: 'frustrated', emoji: '😤', color: 'tense', category: 'challenging' },
        { name: 'lonely', emoji: '🌧️', color: 'sad', category: 'challenging' },
        { name: 'overwhelmed', emoji: '🌀', color: 'chaotic', category: 'challenging' },
        { name: 'yearning', emoji: '🌟', color: 'longing', category: 'complex' }
    ];

    // Update local state when props change
    useEffect(() => {
        setLocalSelectedEmotions(selectedEmotions);
    }, [selectedEmotions]);

    const handleEmotionToggle = (emotion) => {
        let updatedEmotions;

        if (localSelectedEmotions.includes(emotion.name)) {
            // Remove emotion if already selected
            updatedEmotions = localSelectedEmotions.filter(e => e !== emotion.name);
        } else {
            // Add emotion if not selected
            updatedEmotions = [...localSelectedEmotions, emotion.name];
        }

        setLocalSelectedEmotions(updatedEmotions);

        // Notify parent component
        if (onTagging) {
            onTagging(updatedEmotions);
        }
    };

    const clearAllEmotions = () => {
        setLocalSelectedEmotions([]);
        if (onTagging) {
            onTagging([]);
        }
    };

    const getEmotionsByCategory = (category) => {
        return emotions.filter(emotion => emotion.category === category);
    };

    const categories = [
        { name: 'positive', title: '✨ Radiant Emotions', description: 'Light & uplifting' },
        { name: 'neutral', title: '🌙 Balanced Emotions', description: 'Centered & contemplative' },
        { name: 'complex', title: '🎭 Complex Emotions', description: 'Nuanced & layered' },
        { name: 'challenging', title: '🌪️ Intense Emotions', description: 'Difficult but valid' }
    ];

    return (
        <div className="emotional-tagging">
            <div className="emotion-header">
                <h3 className="emotion-title">
                    💝 Emotional Palette
                </h3>
                <div className="emotion-meta">
                    {detectedMood !== 'neutral' && (
                        <span className={`detected-mood mood-${detectedMood}`}>
                            🔍 Detected: {detectedMood}
                        </span>
                    )}
                    <span className="selected-count">
                        {localSelectedEmotions.length} emotion{localSelectedEmotions.length !== 1 ? 's' : ''} selected
                    </span>
                </div>
            </div>

            {localSelectedEmotions.length > 0 && (
                <div className="selected-emotions-summary">
                    <div className="selected-emotions">
                        {localSelectedEmotions.map(emotionName => {
                            const emotion = emotions.find(e => e.name === emotionName);
                            return emotion ? (
                                <span key={emotionName} className={`selected-emotion emotion-${emotion.color}`}>
                                    {emotion.emoji} {emotion.name}
                                </span>
                            ) : null;
                        })}
                    </div>
                    <button onClick={clearAllEmotions} className="clear-emotions-btn">
                        Clear All
                    </button>
                </div>
            )}

            {categories.map(category => (
                <div key={category.name} className={`emotion-category category-${category.name}`}>
                    <div className="category-header">
                        <h4 className="category-title">{category.title}</h4>
                        <p className="category-description">{category.description}</p>
                    </div>

                    <div className="emotion-grid">
                        {getEmotionsByCategory(category.name).map(emotion => (
                            <button
                                key={emotion.name}
                                className={`emotion-button emotion-${emotion.color} ${localSelectedEmotions.includes(emotion.name) ? 'selected' : ''
                                    } ${detectedMood === emotion.name ? 'detected' : ''}`}
                                onClick={() => handleEmotionToggle(emotion)}
                                aria-pressed={localSelectedEmotions.includes(emotion.name)}
                                title={`${emotion.emoji} ${emotion.name} - Click to ${localSelectedEmotions.includes(emotion.name) ? 'remove' : 'add'
                                    }`}
                            >
                                <span className="emotion-emoji">{emotion.emoji}</span>
                                <span className="emotion-name">{emotion.name}</span>
                                {localSelectedEmotions.includes(emotion.name) && (
                                    <span className="selected-indicator">✓</span>
                                )}
                                {detectedMood === emotion.name && (
                                    <span className="detected-indicator">🔍</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            ))}

            <div className="emotion-guidance">
                <p className="emotion-tip">
                    💡 <em>Multiple emotions can coexist beautifully. Select all that resonate with your experience, darling.</em>
                </p>
            </div>
        </div>
    );
};

export default EmotionalTagging;
