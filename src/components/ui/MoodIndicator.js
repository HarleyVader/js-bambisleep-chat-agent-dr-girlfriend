import React, { useEffect, useState } from 'react';

const MoodIndicator = ({ mood, intensity = 0.5, showLabel = true, size = 'medium' }) => {
    const [animationClass, setAnimationClass] = useState('');

    // Trigger animation when mood changes
    useEffect(() => {
        setAnimationClass('mood-changing');
        const timer = setTimeout(() => setAnimationClass(''), 600);
        return () => clearTimeout(timer);
    }, [mood]);

    // Mood configuration with colors, emojis, and animations
    const moodConfig = {
        happy: {
            emoji: '😊',
            color: '#ffff00',
            secondaryColor: '#ffd700',
            animation: 'bounce',
            description: 'Joyful & Bright'
        },
        romantic: {
            emoji: '💖',
            color: '#ff69b4',
            secondaryColor: '#ff1493',
            animation: 'heartbeat',
            description: 'Loving & Warm'
        },
        excited: {
            emoji: '✨',
            color: '#ff4500',
            secondaryColor: '#ff6347',
            animation: 'sparkle',
            description: 'Energetic & Thrilled'
        },
        sad: {
            emoji: '💙',
            color: '#4169e1',
            secondaryColor: '#6495ed',
            animation: 'gentle-sway',
            description: 'Reflective & Caring'
        },
        thoughtful: {
            emoji: '🤔',
            color: '#9370db',
            secondaryColor: '#ba55d3',
            animation: 'thinking',
            description: 'Deep & Contemplative'
        },
        playful: {
            emoji: '😏',
            color: '#32cd32',
            secondaryColor: '#98fb98',
            animation: 'wiggle',
            description: 'Mischievous & Fun'
        },
        supportive: {
            emoji: '🤗',
            color: '#20b2aa',
            secondaryColor: '#48d1cc',
            animation: 'warm-glow',
            description: 'Caring & Supportive'
        },
        mysterious: {
            emoji: '🌙',
            color: '#800080',
            secondaryColor: '#9932cc',
            animation: 'mysterious-pulse',
            description: 'Enigmatic & Alluring'
        },
        neutral: {
            emoji: '😌',
            color: '#00ffff',
            secondaryColor: '#40e0d0',
            animation: 'steady-glow',
            description: 'Balanced & Present'
        }
    };

    const currentMood = moodConfig[mood] || moodConfig.neutral;

    // Size configurations
    const sizeConfig = {
        small: { width: '4vw', fontSize: '1.5vw' },
        medium: { width: '6vw', fontSize: '2vw' },
        large: { width: '8vw', fontSize: '3vw' }
    };

    const currentSize = sizeConfig[size] || sizeConfig.medium;

    return (
        <div className="mood-indicator-container">
            <div
                className={`mood-indicator-circle ${animationClass} mood-${mood}`}
                style={{
                    width: currentSize.width,
                    height: currentSize.width,
                    '--mood-color': currentMood.color,
                    '--mood-secondary': currentMood.secondaryColor,
                    '--intensity': intensity
                }}
                data-animation={currentMood.animation}
                title={currentMood.description}
            >
                {/* Animated rings */}
                <div className="mood-ring-1"></div>
                <div className="mood-ring-2"></div>
                <div className="mood-ring-3"></div>

                {/* Center emoji */}
                <div className="mood-emoji" style={{ fontSize: currentSize.fontSize }}>
                    {currentMood.emoji}
                </div>

                {/* Intensity indicator */}
                <div className="mood-intensity-bar">
                    <div
                        className="mood-intensity-fill"
                        style={{ width: `${intensity * 100}%` }}
                    ></div>
                </div>
            </div>

            {showLabel && (
                <div className="mood-label">
                    <span className="mood-name">{mood}</span>
                    <span className="mood-description">{currentMood.description}</span>
                </div>
            )}
        </div>
    );
};

export default MoodIndicator;
