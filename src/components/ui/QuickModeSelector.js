// QuickModeSelector.js - Simplified mode switching for header/sidebar
// Following copilot-instructions.md: Quick access to personality modes

import React, { useState, useEffect } from 'react';
import { getMemory, setMemory } from '../../services/memoryService.js';

const QuickModeSelector = ({ currentPersona, onPersonaChange, compact = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isChanging, setIsChanging] = useState(false);

    const quickModes = [
        { id: 'GIRLFRIEND', name: 'Girlfriend', emoji: '💝', color: '#ff69b4' },
        { id: 'MUSE', name: 'Muse', emoji: '🎨', color: '#9370db' },
        { id: 'MENTOR', name: 'Mentor', emoji: '🎓', color: '#4169e1' },
        { id: 'GHOSTWRITER', name: 'Writer', emoji: '✍️', color: '#00ffff' }
    ];

    const currentMode = quickModes.find(mode => mode.id === currentPersona) || quickModes[0];

    const handleModeChange = async (modeId) => {
        if (isChanging) return;

        setIsChanging(true);
        setIsOpen(false);

        try {
            // Save the selected persona
            await setMemory('selected_persona', modeId);

            // Update user context
            const userContext = await getMemory('user_context') || {};
            const updatedContext = {
                ...userContext,
                preferred_mode: modeId,
                persona_changed_at: new Date().toISOString()
            };
            await setMemory('user_context', updatedContext);

            // Notify parent
            if (onPersonaChange) {
                onPersonaChange(modeId);
            }

            // Brief delay for visual feedback
            setTimeout(() => setIsChanging(false), 300);

        } catch (error) {
            console.error('Error changing mode:', error);
            setIsChanging(false);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && !event.target.closest('.quick-mode-selector')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isOpen]);

    if (compact) {
        return (
            <div className="quick-mode-selector compact">
                <button
                    className={`mode-toggle-btn ${isChanging ? 'changing' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                    disabled={isChanging}
                    title={`Current mode: ${currentMode.name}`}
                    aria-label={`Current mode: ${currentMode.name}. Click to change mode.`}
                    style={{ '--mode-color': currentMode.color }}
                >
                    <span className="mode-emoji">{currentMode.emoji}</span>
                    <span className="mode-name">{currentMode.name}</span>
                    <span className="dropdown-arrow">▼</span>
                </button>

                {isOpen && (
                    <div className="mode-dropdown">
                        {quickModes.map(mode => (
                            <button
                                key={mode.id}
                                className={`mode-option ${mode.id === currentPersona ? 'current' : ''}`}
                                onClick={() => handleModeChange(mode.id)}
                                style={{ '--mode-color': mode.color }}
                                disabled={isChanging}
                            >
                                <span className="mode-emoji">{mode.emoji}</span>
                                <span className="mode-name">{mode.name}</span>
                                {mode.id === currentPersona && <span className="current-indicator">✓</span>}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="quick-mode-selector">
            <div className="current-mode-display">
                <span className="current-emoji" style={{ color: currentMode.color }}>{currentMode.emoji}</span>
                <div className="current-info">
                    <div className="current-name">Mode: {currentMode.name}</div>
                    <div className="current-status">{isChanging ? 'Switching...' : 'Active'}</div>
                </div>
            </div>

            <div className="mode-grid">
                {quickModes.map(mode => (
                    <button
                        key={mode.id}
                        className={`mode-btn ${mode.id === currentPersona ? 'active' : ''} ${isChanging ? 'disabled' : ''}`}
                        onClick={() => handleModeChange(mode.id)}
                        disabled={isChanging}
                        style={{ '--mode-color': mode.color }}
                        title={`Switch to ${mode.name} mode`}
                        aria-pressed={mode.id === currentPersona}
                    >
                        <span className="mode-emoji">{mode.emoji}</span>
                        <span className="mode-label">{mode.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuickModeSelector;
