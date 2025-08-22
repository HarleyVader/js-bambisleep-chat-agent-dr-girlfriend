// JournalEditor.js - Enhanced journal with emotional intelligence
// Following copilot-instructions.md: Emotional UX design with autosave

import React, { useState, useEffect, useRef } from 'react';
import EmotionalTagging from './EmotionalTagging.js';
import { analyzeEmotion, trackEmotionalPattern } from '../../services/emotionalIntelligence.js';
import { getMemory, setMemory } from '../../services/memoryService.js';
import { validateInput } from '../../utils/validation.js';

const JournalEditor = () => {
    const [entry, setEntry] = useState('');
    const [emotions, setEmotions] = useState([]);
    const [isAutoSaving, setIsAutoSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [currentMood, setCurrentMood] = useState('neutral');
    const [journalEntries, setJournalEntries] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const autoSaveTimeout = useRef(null);

    // Load journal entries on mount
    useEffect(() => {
        const loadJournalEntries = async () => {
            try {
                const savedEntries = await getMemory('journal_entries') || [];
                setJournalEntries(savedEntries);

                // Load draft if exists
                const draft = await getMemory('journal_draft');
                if (draft) {
                    setEntry(draft.text || '');
                    setEmotions(draft.emotions || []);
                }
            } catch (error) {
                console.error('Error loading journal:', error);
            }
        };

        loadJournalEntries();
    }, []);

    // Auto-save functionality
    useEffect(() => {
        if (entry.trim()) {
            // Clear existing timeout
            if (autoSaveTimeout.current) {
                clearTimeout(autoSaveTimeout.current);
            }

            // Set new timeout for auto-save
            autoSaveTimeout.current = setTimeout(async () => {
                try {
                    setIsAutoSaving(true);
                    const draft = {
                        text: entry,
                        emotions: emotions,
                        lastModified: new Date().toISOString()
                    };
                    await setMemory('journal_draft', draft);
                    setLastSaved(new Date());
                } catch (error) {
                    console.error('Auto-save failed:', error);
                } finally {
                    setIsAutoSaving(false);
                }
            }, 2000); // Auto-save after 2 seconds of inactivity
        }

        return () => {
            if (autoSaveTimeout.current) {
                clearTimeout(autoSaveTimeout.current);
            }
        };
    }, [entry, emotions]);

    // Analyze emotion when text changes
    useEffect(() => {
        if (entry.length > 10) { // Only analyze if there's substantial content
            const emotionalAnalysis = analyzeEmotion(entry);
            setCurrentMood(emotionalAnalysis.emotion);
        }
    }, [entry]);

    const handleTextChange = (event) => {
        const newText = event.target.value;
        setEntry(newText);
    };

    const handleEmotionTagging = (newEmotions) => {
        setEmotions(newEmotions);
    };

    const saveEntry = async () => {
        if (!entry.trim()) {
            alert('Please write something before saving!');
            return;
        }

        try {
            const sanitizedEntry = validateInput(entry);
            if (!sanitizedEntry) {
                alert('Invalid content detected. Please check your entry.');
                return;
            }

            const emotionalAnalysis = analyzeEmotion(entry);

            const journalEntry = {
                id: `journal-${Date.now()}`,
                text: sanitizedEntry,
                emotions: emotions,
                detectedMood: emotionalAnalysis.emotion,
                confidence: emotionalAnalysis.confidence,
                timestamp: new Date().toISOString(),
                wordCount: sanitizedEntry.split(' ').filter(word => word.length > 0).length
            };

            // Track emotional pattern
            await trackEmotionalPattern(emotionalAnalysis.emotion, {
                type: 'journal_entry',
                wordCount: journalEntry.wordCount,
                manualEmotions: emotions
            });

            // Save to journal entries
            const updatedEntries = [journalEntry, ...journalEntries];
            setJournalEntries(updatedEntries);
            await setMemory('journal_entries', updatedEntries);

            // Clear draft
            await setMemory('journal_draft', null);

            // Reset form
            setEntry('');
            setEmotions([]);
            setCurrentMood('neutral');
            setLastSaved(new Date());

            alert('Journal entry saved successfully! 💖');
        } catch (error) {
            console.error('Error saving journal entry:', error);
            alert('Failed to save entry. Please try again.');
        }
    };

    const loadEntry = (entryId) => {
        const entryToLoad = journalEntries.find(entry => entry.id === entryId);
        if (entryToLoad) {
            setEntry(entryToLoad.text);
            setEmotions(entryToLoad.emotions || []);
            setSelectedEntry(entryToLoad);
        }
    };

    const deleteEntry = async (entryId) => {
        if (confirm('Are you sure you want to delete this journal entry?')) {
            try {
                const updatedEntries = journalEntries.filter(entry => entry.id !== entryId);
                setJournalEntries(updatedEntries);
                await setMemory('journal_entries', updatedEntries);

                if (selectedEntry && selectedEntry.id === entryId) {
                    setEntry('');
                    setEmotions([]);
                    setSelectedEntry(null);
                }
            } catch (error) {
                console.error('Error deleting entry:', error);
                alert('Failed to delete entry.');
            }
        }
    };

    const newEntry = () => {
        if (entry.trim() && !confirm('You have unsaved changes. Start a new entry?')) {
            return;
        }
        setEntry('');
        setEmotions([]);
        setSelectedEntry(null);
        setCurrentMood('neutral');
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="journal-editor">
            {/* Header */}
            <div className="journal-header">
                <h2 className={`journal-title mood-${currentMood}`}>
                    📝 Dream Journal Mode
                </h2>
                <div className="journal-controls">
                    <button onClick={newEntry} className="btn-secondary">New Entry</button>
                    <button onClick={saveEntry} className="btn-primary" disabled={!entry.trim()}>
                        Save Entry
                    </button>
                </div>
            </div>

            {/* Auto-save status */}
            <div className="journal-status">
                {isAutoSaving && <span className="auto-save-indicator">💾 Auto-saving...</span>}
                {lastSaved && !isAutoSaving && (
                    <span className="last-saved">
                        ✅ Last saved: {formatTimestamp(lastSaved)}
                    </span>
                )}
                <span className={`mood-indicator mood-${currentMood}`}>
                    Current mood: {currentMood}
                </span>
            </div>

            {/* Main editor */}
            <div className="journal-main">
                <div className="journal-editor-panel">
                    <textarea
                        value={entry}
                        onChange={handleTextChange}
                        placeholder="Pour your thoughts, dreams, and feelings onto this digital canvas... Let Agent Dr Girlfriend help you explore your inner landscape. ✨"
                        className={`journal-textarea mood-${currentMood}`}
                        rows="15"
                        aria-label="Journal entry text area"
                    />

                    <div className="journal-meta">
                        <div className="word-count">
                            Words: {entry.split(' ').filter(word => word.length > 0).length}
                        </div>
                        <EmotionalTagging
                            onTagging={handleEmotionTagging}
                            selectedEmotions={emotions}
                            detectedMood={currentMood}
                        />
                    </div>
                </div>

                {/* Journal entries sidebar */}
                <div className="journal-sidebar">
                    <h3>Previous Entries</h3>
                    <div className="journal-entries-list">
                        {journalEntries.length === 0 ? (
                            <p className="no-entries">No journal entries yet. Start writing! 💫</p>
                        ) : (
                            journalEntries.map(journalEntry => (
                                <div
                                    key={journalEntry.id}
                                    className={`journal-entry-item ${selectedEntry?.id === journalEntry.id ? 'selected' : ''}`}
                                >
                                    <div className="entry-preview" onClick={() => loadEntry(journalEntry.id)}>
                                        <div className="entry-date">
                                            {formatTimestamp(journalEntry.timestamp)}
                                        </div>
                                        <div className={`entry-mood mood-${journalEntry.detectedMood}`}>
                                            {journalEntry.detectedMood}
                                        </div>
                                        <div className="entry-text-preview">
                                            {journalEntry.text.substring(0, 100)}...
                                        </div>
                                        <div className="entry-meta">
                                            {journalEntry.wordCount} words
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteEntry(journalEntry.id)}
                                        className="delete-entry-btn"
                                        aria-label="Delete entry"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JournalEditor;
