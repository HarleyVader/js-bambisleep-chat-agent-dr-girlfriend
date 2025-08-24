// Voice Service - Agent Dr Girlfriend
// Enhanced speech recognition and synthesis with emotional awareness

import { getMemory, setMemory } from './memoryService.js';

import { analyzeEmotion } from './emotionalIntelligence.js';

// Voice synthesis settings for different personas
const voicePersonas = {
  sultry: {
    rate: 0.8,
    pitch: 0.9,
    volume: 0.8,
    preferredVoices: ['female', 'english', 'us'],
  },
  playful: {
    rate: 1.1,
    pitch: 1.2,
    volume: 0.9,
    preferredVoices: ['female', 'english', 'us'],
  },
  professional: {
    rate: 1.0,
    pitch: 1.0,
    volume: 0.8,
    preferredVoices: ['female', 'english', 'uk'],
  },
  intimate: {
    rate: 0.7,
    pitch: 0.8,
    volume: 0.7,
    preferredVoices: ['female', 'english', 'us'],
  },
};

// Get available voices and find best match
export const getAvailableVoices = () => {
  const voices = window.speechSynthesis.getVoices();
  return voices.filter(voice =>
    voice.lang.includes('en') &&
        (voice.name.toLowerCase().includes('female') ||
            voice.name.toLowerCase().includes('zira') ||
            voice.name.toLowerCase().includes('hazel') ||
            voice.name.toLowerCase().includes('samantha')),
  );
};

// Find best voice for persona
const findBestVoice = (persona = 'sultry') => {
  const voices = getAvailableVoices();
  if (voices.length === 0) return null;

  // Prefer female voices
  const femaleVoices = voices.filter(voice =>
    voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('zira') ||
        voice.name.toLowerCase().includes('hazel') ||
        voice.name.toLowerCase().includes('samantha'),
  );

  return femaleVoices.length > 0 ? femaleVoices[0] : voices[0];
};

// Enhanced speech recognition with context awareness
export const startVoiceRecognition = (onResult, onError = null, options = {}) => {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    const error = 'Speech recognition not supported in this browser';
    console.error(error);
    if (onError) onError(error);
    return null;
  }

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  // Enhanced configuration
  recognition.continuous = options.continuous || false;
  recognition.interimResults = options.interimResults || true;
  recognition.lang = options.language || 'en-US';
  recognition.maxAlternatives = options.maxAlternatives || 3;

  let finalTranscript = '';
  let interimTranscript = '';

  recognition.onstart = () => {
    console.log('Voice recognition started');
  };

  recognition.onresult = (event) => {
    finalTranscript = '';
    interimTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;

      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    // Analyze emotion in real-time
    if (finalTranscript) {
      const emotion = analyzeEmotion(finalTranscript);
      onResult({
        final: finalTranscript,
        interim: interimTranscript,
        emotion: emotion,
        confidence: event.results[event.results.length - 1][0].confidence || 0.8,
      });
    } else if (interimTranscript && options.interimResults) {
      onResult({
        final: '',
        interim: interimTranscript,
        emotion: null,
        confidence: 0,
      });
    }
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);

    const errorMessages = {
      'network': 'Network error - please check your connection',
      'not-allowed': 'Microphone access denied - please enable microphone permissions',
      'no-speech': 'No speech detected - please try speaking again',
      'audio-capture': 'Audio capture failed - please check your microphone',
      'service-not-allowed': 'Speech service not allowed',
      'aborted': 'Speech recognition was aborted',
      'language-not-supported': 'Language not supported',
    };

    const userFriendlyError = errorMessages[event.error] || `Speech recognition error: ${event.error}`;

    if (onError) {
      onError(userFriendlyError);
    }
  };

  recognition.onend = () => {
    console.log('Voice recognition ended');
  };

  try {
    recognition.start();
    return recognition;
  } catch (error) {
    console.error('Failed to start voice recognition:', error);
    if (onError) onError('Failed to start voice recognition');
    return null;
  }
};

// Enhanced text-to-speech with emotional adaptation
export const speakText = async (text, options = {}) => {
  if (!text || typeof text !== 'string') return;

  // Get user's preferred persona
  const userPersona = await getMemory('voice_persona') || 'sultry';
  const persona = voicePersonas[userPersona] || voicePersonas.sultry;

  // Analyze emotion to adapt speech
  const emotion = analyzeEmotion(text);

  const utterance = new SpeechSynthesisUtterance(text);

  // Apply persona settings
  utterance.rate = persona.rate;
  utterance.pitch = persona.pitch;
  utterance.volume = persona.volume;

  // Emotional adaptations
  if (emotion.emotion === 'excitement' && emotion.confidence > 0.5) {
    utterance.rate *= 1.1;
    utterance.pitch *= 1.1;
  } else if (emotion.emotion === 'sadness' && emotion.confidence > 0.5) {
    utterance.rate *= 0.9;
    utterance.pitch *= 0.9;
  } else if (emotion.emotion === 'anger' && emotion.confidence > 0.5) {
    utterance.rate *= 1.05;
    utterance.volume *= 0.9;
  } else if (emotion.emotion === 'love' && emotion.confidence > 0.5) {
    utterance.rate *= 0.85;
    utterance.pitch *= 0.95;
  }

  // Apply any override options
  if (options.rate) utterance.rate = options.rate;
  if (options.pitch) utterance.pitch = options.pitch;
  if (options.volume) utterance.volume = options.volume;

  // Find and set best voice
  const bestVoice = findBestVoice(userPersona);
  if (bestVoice) {
    utterance.voice = bestVoice;
  }

  return new Promise((resolve, reject) => {
    utterance.onend = () => {
      console.log('Speech synthesis completed');
      resolve();
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      reject(event.error);
    };

    // Stop any current speech before starting new one
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  });
};

// Set voice persona
export const setVoicePersona = async (persona) => {
  if (voicePersonas[persona]) {
    await setMemory('voice_persona', persona);
    return true;
  }
  return false;
};

// Get current voice persona
export const getCurrentVoicePersona = async () => {
  return await getMemory('voice_persona') || 'sultry';
};

// Stop current speech
export const stopSpeech = () => {
  window.speechSynthesis.cancel();
};

// Check if voice features are supported
export const getVoiceCapabilities = () => {
  return {
    speechRecognition: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
    speechSynthesis: 'speechSynthesis' in window,
    voicesAvailable: getAvailableVoices().length > 0,
  };
};

// Process voice command with Agent Dr Girlfriend intelligence
export const processVoiceCommand = async (transcript) => {
  const lowerTranscript = transcript.toLowerCase();

  // Voice commands for Agent Dr Girlfriend
  const commands = {
    'change voice to sultry': () => setVoicePersona('sultry'),
    'change voice to playful': () => setVoicePersona('playful'),
    'change voice to professional': () => setVoicePersona('professional'),
    'change voice to intimate': () => setVoicePersona('intimate'),
    'stop talking': () => stopSpeech(),
    'shut up': () => stopSpeech(),
    'be quiet': () => stopSpeech(),
    'start journal': () => ({ action: 'navigate', target: 'journal' }),
    'open journal': () => ({ action: 'navigate', target: 'journal' }),
    'creative mode': () => ({ action: 'navigate', target: 'creative' }),
    'relationship dashboard': () => ({ action: 'navigate', target: 'relationship' }),
    'clear chat': () => ({ action: 'clear_chat' }),
    'new conversation': () => ({ action: 'clear_chat' }),
  };

  // Check for exact matches first
  for (const [command, action] of Object.entries(commands)) {
    if (lowerTranscript.includes(command)) {
      const result = await action();
      return {
        isCommand: true,
        result: result,
        message: `Command executed: ${command}`,
      };
    }
  }

  // If no command found, return the transcript for normal processing
  return {
    isCommand: false,
    transcript: transcript,
    emotion: analyzeEmotion(transcript),
  };
};
