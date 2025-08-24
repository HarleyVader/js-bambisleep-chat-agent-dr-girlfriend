// VoiceInput.js - Enhanced voice input component for Agent Dr Girlfriend
// Following copilot-instructions.md: Voice integration with Web Speech API

import React, { useState, useEffect, useRef } from 'react';
import { getMemory, setMemory } from '../../services/memoryService.js';

const VoiceInput = ({ onTranscript, onError, className = '' }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  // Check for speech recognition support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      setupRecognition();
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const setupRecognition = () => {
    const recognition = recognitionRef.current;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      setTranscript('');
      setConfidence(0);

      // Set timeout to stop listening after 30 seconds
      timeoutRef.current = setTimeout(() => {
        stopListening();
      }, 30000);
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      let bestConfidence = 0;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const resultTranscript = result[0].transcript;
        const resultConfidence = result[0].confidence;

        if (result.isFinal) {
          finalTranscript += resultTranscript;
          bestConfidence = Math.max(bestConfidence, resultConfidence);
        } else {
          interimTranscript += resultTranscript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
      setConfidence(bestConfidence);

      // If we have a final result, send it
      if (finalTranscript.trim()) {
        onTranscript(finalTranscript.trim());
        stopListening();

        // Save voice interaction for analytics
        saveVoiceInteraction(finalTranscript, bestConfidence);
      }
    };

    recognition.onerror = (event) => {
      const errorMessage = getErrorMessage(event.error);
      setError(errorMessage);
      setIsListening(false);

      if (onError) {
        onError(errorMessage);
      }

      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };

    recognition.onend = () => {
      setIsListening(false);

      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  };

  const getErrorMessage = (error) => {
    switch (error) {
    case 'no-speech':
      return 'I didn\'t hear anything, darling. Try speaking a bit louder.';
    case 'audio-capture':
      return 'I can\'t access your microphone. Please check your permissions.';
    case 'not-allowed':
      return 'Microphone access is blocked. Please enable it to use voice input.';
    case 'network':
      return 'Network error occurred. Please check your connection.';
    case 'aborted':
      return 'Voice input was cancelled.';
    default:
      return 'Voice recognition error occurred. Please try again.';
    }
  };

  const startListening = () => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        setError('Could not start voice recognition. Please try again.');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const saveVoiceInteraction = async (text, confidence) => {
    try {
      const voiceHistory = await getMemory('voice_interactions') || [];
      const interaction = {
        timestamp: new Date().toISOString(),
        transcript: text,
        confidence: confidence,
        wordCount: text.split(' ').length,
      };

      voiceHistory.push(interaction);

      // Keep only last 50 voice interactions
      if (voiceHistory.length > 50) {
        voiceHistory.splice(0, voiceHistory.length - 50);
      }

      await setMemory('voice_interactions', voiceHistory);
    } catch (error) {
      console.error('Error saving voice interaction:', error);
    }
  };

  const getButtonText = () => {
    if (!isSupported) return '🚫 Voice Not Supported';
    if (isListening) return '🎤 Listening...';
    return '🎤 Speak';
  };

  const getButtonClass = () => {
    let classes = `voice-button ${className}`;
    if (isListening) classes += ' listening';
    if (!isSupported) classes += ' unsupported';
    if (error) classes += ' error';
    return classes;
  };

  return (
    <div className="voice-input-container">
      <button
        onClick={isListening ? stopListening : startListening}
        disabled={!isSupported}
        className={getButtonClass()}
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
        title={isListening ? 'Click to stop listening' : 'Click to speak to Agent Dr Girlfriend'}
      >
        <span className="voice-button-text">{getButtonText()}</span>

        {isListening && (
          <div className="voice-animation">
            <div className="pulse-ring"></div>
            <div className="pulse-ring"></div>
            <div className="pulse-ring"></div>
          </div>
        )}
      </button>

      {/* Live transcript display */}
      {isListening && transcript && (
        <div className="live-transcript">
          <div className="transcript-label">Speaking:</div>
          <div className="transcript-text">{transcript}</div>
          {confidence > 0 && (
            <div className="confidence-indicator">
                            Confidence: {Math.round(confidence * 100)}%
            </div>
          )}
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="voice-error">
          <span className="error-icon">⚠️</span>
          <span className="error-message">{error}</span>
          <button
            className="dismiss-error"
            onClick={() => setError(null)}
            aria-label="Dismiss error"
          >
                        ✕
          </button>
        </div>
      )}

      {/* Instructions for first-time users */}
      {!isSupported && (
        <div className="voice-unsupported">
          <p>💔 Voice input isn't supported in this browser, love.</p>
          <p>Try using Edge, Chrome or Safari for the best experience with Agent Dr Girlfriend.</p>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
