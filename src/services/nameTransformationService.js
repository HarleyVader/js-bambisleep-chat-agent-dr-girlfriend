// NameTransformationService.js - Agent Name Costume Change System
// Centralized name management with visual transformation effects

import { getMemory, setMemory } from './memoryService.js';

// Default Agent Configuration
const DEFAULT_AGENT_CONFIG = {
  name: 'Dr Girlfriend',
  fullName: 'Agent Dr Girlfriend',
  shortName: 'Dr Girlfriend',
  title: 'Agent',
  personality: 'Witty, stylish, emotionally intelligent AI companion',
  avatar: '👩‍⚕️',
};

// Name transformation effects configuration
const TRANSFORMATION_EFFECTS = {
  SPARKLE_CASCADE: 'sparkle-cascade',
  NEON_GLITCH: 'neon-glitch',
  SHIMMER_FADE: 'shimmer-fade',
  PARTICLE_BURST: 'particle-burst',
  CYBER_MATRIX: 'cyber-matrix',
};

// Costume change request patterns (what Bambi might say)
const COSTUME_CHANGE_PATTERNS = [
  /please change your name to (.+)/i,
  /can you be called (.+)/i,
  /I want to call you (.+)/i,
  /your new name is (.+)/i,
  /from now on you're (.+)/i,
  /I'd like you to be (.+)/i,
  /become (.+)/i,
  /transform into (.+)/i,
  /costume change to (.+)/i,
  /rename yourself to (.+)/i,
];

class NameTransformationService {
  constructor() {
    this.currentConfig = { ...DEFAULT_AGENT_CONFIG };
    this.isTransforming = false;
    this.transformationCallbacks = new Set();
    this.elementSelectors = [
      '.profile-name',
      '.agent-name',
      '.stats-panel-title',
      '[aria-label*="Agent Dr Girlfriend"]',
      '.tagline',
      '.profile-greeting',
    ];

    this.init();
  }

  async init() {
    // Load saved agent configuration
    const savedConfig = await getMemory('agent_configuration');
    if (savedConfig) {
      this.currentConfig = { ...DEFAULT_AGENT_CONFIG, ...savedConfig };
    }

    // Set up transformation effect styles
    this.injectTransformationCSS();
  }

  // Main method to detect costume change requests
  detectCostumeChangeRequest(userMessage) {
    for (const pattern of COSTUME_CHANGE_PATTERNS) {
      const match = userMessage.match(pattern);
      if (match && match[1]) {
        const newName = match[1].trim();
        // Validate and clean the name
        const cleanName = this.validateAndCleanName(newName);
        if (cleanName) {
          return {
            detected: true,
            newName: cleanName,
            originalRequest: userMessage,
          };
        }
      }
    }
    return { detected: false };
  }

  // Validate and clean the proposed name
  validateAndCleanName(name) {
    // Remove quotes, extra spaces, and normalize
    let cleanName = name.replace(/['"]/g, '').trim();

    // Ensure it's not too long or contains inappropriate content
    if (cleanName.length > 50 || cleanName.length < 2) {
      return null;
    }

    // Remove any HTML tags for security
    cleanName = cleanName.replace(/<[^>]*>/g, '');

    // Capitalize properly
    cleanName = this.properCapitalize(cleanName);

    return cleanName;
  }

  properCapitalize(name) {
    return name.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Main transformation method with visual effects
  async performCostumeChange(newName, effectType = TRANSFORMATION_EFFECTS.SPARKLE_CASCADE) {
    if (this.isTransforming) {
      throw new Error('Transformation already in progress');
    }

    try {
      this.isTransforming = true;

      // 1. Announce the transformation
      this.announceTransformation(newName);

      // 2. Apply visual effects to all name elements
      await this.applyTransformationEffect(effectType);

      // 3. Update the configuration
      const oldConfig = { ...this.currentConfig };
      this.updateAgentConfiguration(newName);

      // 4. Transform all UI elements
      await this.transformAllUIElements(oldConfig, this.currentConfig);

      // 5. Update storage
      await this.saveConfigurationToStorage();

      // 6. Notify all subscribers
      this.notifyTransformationComplete(oldConfig, this.currentConfig);

      // 7. Final sparkle effect
      await this.finalTransformationEffect();

      return {
        success: true,
        oldName: oldConfig.name,
        newName: this.currentConfig.name,
        message: `✨ Costume change complete! I'm now ${this.currentConfig.name}! ✨`,
      };

    } catch (error) {
      console.error('Transformation failed:', error);
      return {
        success: false,
        error: error.message,
        message: 'Oops! The costume change magic fizzled out. Please try again! 💫',
      };
    } finally {
      this.isTransforming = false;
    }
  }

  updateAgentConfiguration(newName) {
    this.currentConfig = {
      ...this.currentConfig,
      name: newName,
      fullName: `Agent ${newName}`,
      shortName: newName,
      transformedAt: new Date().toISOString(),
      transformationCount: (this.currentConfig.transformationCount || 0) + 1,
    };
  }

  // Apply stunning visual transformation effects
  async applyTransformationEffect(effectType) {
    const elements = this.getAllNameElements();

    switch (effectType) {
    case TRANSFORMATION_EFFECTS.SPARKLE_CASCADE:
      await this.sparkleEffect(elements);
      break;
    case TRANSFORMATION_EFFECTS.NEON_GLITCH:
      await this.neonGlitchEffect(elements);
      break;
    case TRANSFORMATION_EFFECTS.SHIMMER_FADE:
      await this.shimmerFadeEffect(elements);
      break;
    case TRANSFORMATION_EFFECTS.PARTICLE_BURST:
      await this.particleBurstEffect(elements);
      break;
    case TRANSFORMATION_EFFECTS.CYBER_MATRIX:
      await this.cyberMatrixEffect(elements);
      break;
    }
  }

  getAllNameElements() {
    const elements = [];
    this.elementSelectors.forEach(selector => {
      const found = document.querySelectorAll(selector);
      elements.push(...Array.from(found));
    });
    return elements;
  }

  // Sparkle cascade effect
  async sparkleEffect(elements) {
    return new Promise((resolve) => {
      elements.forEach((element, index) => {
        setTimeout(() => {
          element.classList.add('name-transform-sparkle');
          this.createSparkleParticles(element);
        }, index * 100);
      });

      setTimeout(resolve, elements.length * 100 + 1000);
    });
  }

  createSparkleParticles(element) {
    const rect = element.getBoundingClientRect();
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'sparkle-particle';
      particle.style.cssText = `
                position: fixed;
                left: ${rect.left + Math.random() * rect.width}px;
                top: ${rect.top + Math.random() * rect.height}px;
                z-index: 9999;
                pointer-events: none;
            `;
      document.body.appendChild(particle);

      setTimeout(() => particle.remove(), 2000);
    }
  }

  // Neon glitch effect
  async neonGlitchEffect(elements) {
    return new Promise((resolve) => {
      elements.forEach(element => {
        element.classList.add('name-transform-glitch');
      });

      setTimeout(() => {
        elements.forEach(element => {
          element.classList.remove('name-transform-glitch');
        });
        resolve();
      }, 1500);
    });
  }

  // Transform all UI elements with the new name
  async transformAllUIElements(oldConfig, newConfig) {
    const transformPromises = [];

    // Transform text content
    this.elementSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        transformPromises.push(this.transformElementText(element, oldConfig, newConfig));
      });
    });

    // Transform aria-labels and accessibility attributes
    transformPromises.push(this.transformAccessibilityAttributes(oldConfig, newConfig));

    // Transform screen reader announcements
    transformPromises.push(this.updateScreenReaderAnnouncements(newConfig));

    await Promise.all(transformPromises);
  }

  async transformElementText(element, oldConfig, newConfig) {
    return new Promise((resolve) => {
      const text = element.textContent || element.innerText;

      // Replace various forms of the old name
      const newText = text
        .replace(new RegExp(oldConfig.fullName, 'gi'), newConfig.fullName)
        .replace(new RegExp(oldConfig.name, 'gi'), newConfig.name)
        .replace(new RegExp(oldConfig.shortName, 'gi'), newConfig.shortName);

      // Animated text replacement
      this.animateTextChange(element, newText);

      setTimeout(resolve, 500);
    });
  }

  animateTextChange(element, newText) {
    element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    element.style.opacity = '0';
    element.style.transform = 'scale(0.8)';

    setTimeout(() => {
      element.textContent = newText;
      element.style.opacity = '1';
      element.style.transform = 'scale(1)';
    }, 300);
  }

  async transformAccessibilityAttributes(oldConfig, newConfig) {
    const elementsWithAriaLabel = document.querySelectorAll('[aria-label]');
    elementsWithAriaLabel.forEach(element => {
      const ariaLabel = element.getAttribute('aria-label');
      if (ariaLabel.includes(oldConfig.name) || ariaLabel.includes(oldConfig.fullName)) {
        const newAriaLabel = ariaLabel
          .replace(new RegExp(oldConfig.fullName, 'gi'), newConfig.fullName)
          .replace(new RegExp(oldConfig.name, 'gi'), newConfig.name);
        element.setAttribute('aria-label', newAriaLabel);
      }
    });
  }

  async updateScreenReaderAnnouncements(newConfig) {
    const announcement = document.getElementById('sr-announcements');
    if (announcement) {
      announcement.textContent = `${newConfig.fullName} is ready for conversation`;
    }
  }

  announceTransformation(newName) {
    // Create a dramatic announcement overlay
    const overlay = document.createElement('div');
    overlay.className = 'transformation-announcement';
    overlay.innerHTML = `
            <div class="announcement-content">
                <h2>✨ Costume Change in Progress ✨</h2>
                <p>Transforming into <strong>${newName}</strong>...</p>
                <div class="transformation-loader"></div>
            </div>
        `;
    document.body.appendChild(overlay);

    setTimeout(() => overlay.remove(), 3000);
  }

  async finalTransformationEffect() {
    // Create celebratory particle burst
    const celebrationOverlay = document.createElement('div');
    celebrationOverlay.className = 'transformation-celebration';
    celebrationOverlay.innerHTML = `
            <div class="celebration-content">
                <h2>🎉 Transformation Complete! 🎉</h2>
                <p>I am now <strong>${this.currentConfig.name}</strong>!</p>
            </div>
        `;
    document.body.appendChild(celebrationOverlay);

    // Create celebration particles
    this.createCelebrationParticles();

    setTimeout(() => celebrationOverlay.remove(), 2500);
  }

  createCelebrationParticles() {
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'celebration-particle';
      particle.style.cssText = `
                position: fixed;
                left: ${Math.random() * window.innerWidth}px;
                top: ${Math.random() * window.innerHeight}px;
                z-index: 10000;
                pointer-events: none;
            `;
      document.body.appendChild(particle);

      setTimeout(() => particle.remove(), 3000);
    }
  }

  async saveConfigurationToStorage() {
    await setMemory('agent_configuration', this.currentConfig);

    // Also update any other storage that might reference the agent name
    const userContext = await getMemory('user_context') || {};
    userContext.agent_name = this.currentConfig.name;
    userContext.agent_full_name = this.currentConfig.fullName;
    await setMemory('user_context', userContext);
  }

  // Subscribe to transformation events
  onTransformation(callback) {
    this.transformationCallbacks.add(callback);
    return () => this.transformationCallbacks.delete(callback);
  }

  notifyTransformationComplete(oldConfig, newConfig) {
    this.transformationCallbacks.forEach(callback => {
      try {
        callback({ oldConfig, newConfig, timestamp: Date.now() });
      } catch (error) {
        console.error('Transformation callback error:', error);
      }
    });
  }

  // Get current agent configuration
  getAgentConfig() {
    return { ...this.currentConfig };
  }

  // Reset to default configuration
  async resetToDefault() {
    const oldConfig = { ...this.currentConfig };
    this.currentConfig = { ...DEFAULT_AGENT_CONFIG };
    await this.saveConfigurationToStorage();
    await this.transformAllUIElements(oldConfig, this.currentConfig);
    return this.currentConfig;
  }

  // Inject CSS for transformation effects
  injectTransformationCSS() {
    const style = document.createElement('style');
    style.textContent = `
            .name-transform-sparkle {
                animation: sparkle-transform 1s ease-in-out;
            }

            .name-transform-glitch {
                animation: glitch-transform 1.5s ease-in-out;
            }

            @keyframes sparkle-transform {
                0% { filter: brightness(1) hue-rotate(0deg); }
                25% { filter: brightness(1.5) hue-rotate(90deg); transform: scale(1.05); }
                50% { filter: brightness(2) hue-rotate(180deg); transform: scale(1.1); }
                75% { filter: brightness(1.5) hue-rotate(270deg); transform: scale(1.05); }
                100% { filter: brightness(1) hue-rotate(360deg); transform: scale(1); }
            }

            @keyframes glitch-transform {
                0%, 100% { transform: translateX(0); filter: hue-rotate(0deg); }
                10% { transform: translateX(-2px) skew(-1deg); filter: hue-rotate(90deg); }
                20% { transform: translateX(2px) skew(1deg); filter: hue-rotate(180deg); }
                30% { transform: translateX(-1px) skew(-0.5deg); filter: hue-rotate(270deg); }
                40% { transform: translateX(1px) skew(0.5deg); filter: hue-rotate(360deg); }
                50% { transform: translateX(0) skew(0deg); filter: hue-rotate(180deg) brightness(1.5); }
            }

            .sparkle-particle {
                width: 4px;
                height: 4px;
                background: radial-gradient(circle, #00ffff, #ff0080);
                animation: sparkle-float 2s ease-out forwards;
                border-radius: 50%;
            }

            @keyframes sparkle-float {
                0% { opacity: 1; transform: translateY(0) scale(1); }
                100% { opacity: 0; transform: translateY(-50px) scale(0); }
            }

            .transformation-announcement {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9998;
                animation: announcement-fade-in 0.5s ease-out;
            }

            .announcement-content {
                text-align: center;
                color: #00ffff;
                font-size: 2rem;
                padding: 2rem;
                border: 2px solid #00ffff;
                border-radius: 1rem;
                background: rgba(10, 10, 15, 0.95);
                box-shadow: 0 0 3vw rgba(0, 255, 255, 0.4);
            }

            .transformation-loader {
                width: 40px;
                height: 40px;
                border: 3px solid rgba(0, 255, 255, 0.3);
                border-top: 3px solid #00ffff;
                border-radius: 50%;
                animation: loader-spin 1s linear infinite;
                margin: 1rem auto;
            }

            @keyframes loader-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .transformation-celebration {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 0, 128, 0.1);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                animation: celebration-fade 2.5s ease-out forwards;
                pointer-events: none;
            }

            .celebration-content {
                text-align: center;
                color: #ff0080;
                font-size: 2.5rem;
                padding: 2rem;
                animation: celebration-bounce 0.6s ease-out;
            }

            @keyframes celebration-bounce {
                0% { transform: scale(0.5) rotate(-5deg); opacity: 0; }
                50% { transform: scale(1.2) rotate(2deg); opacity: 1; }
                100% { transform: scale(1) rotate(0deg); opacity: 1; }
            }

            @keyframes celebration-fade {
                0% { opacity: 1; }
                70% { opacity: 1; }
                100% { opacity: 0; }
            }

            .celebration-particle {
                width: 8px;
                height: 8px;
                background: linear-gradient(45deg, #00ffff, #ff0080);
                animation: celebration-float 3s ease-out forwards;
                border-radius: 50%;
                box-shadow: 0 0 10px currentColor;
            }

            @keyframes celebration-float {
                0% {
                    opacity: 1;
                    transform: translateY(0) rotate(0deg) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-200px) rotate(720deg) scale(0);
                }
            }

            @keyframes announcement-fade-in {
                0% { opacity: 0; backdrop-filter: blur(0px); }
                100% { opacity: 1; backdrop-filter: blur(10px); }
            }
        `;
    document.head.appendChild(style);
  }
}

// Create singleton instance
const nameTransformationService = new NameTransformationService();

export default nameTransformationService;
export { TRANSFORMATION_EFFECTS };
