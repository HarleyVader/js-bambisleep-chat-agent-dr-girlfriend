// CreativeStudio.js - AI-assisted creative workspace for Agent Dr Girlfriend
// Following copilot-instructions.md: Advanced creative features

import React, { useState, useEffect } from 'react';
import { processMessage } from '../../services/aiService.js';
import { analyzeEmotion, getMoodSuggestions } from '../../services/emotionalIntelligence.js';
import { getMemory, setMemory } from '../../services/memoryService.js';
import { validateInput } from '../../utils/validation.js';

const CreativeStudio = () => {
  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [creativePrompt, setCreativePrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCreativeMode, setSelectedCreativeMode] = useState('story');
  const [projectTitle, setProjectTitle] = useState('');

  const creativeModes = [
    {
      id: 'story',
      name: '📖 Story Writing',
      emoji: '✍️',
      description: 'Collaborative storytelling with Agent Dr Girlfriend',
      prompts: [
        'Write a story about a mysterious character who...',
        'Create a romantic scene where...',
        'Develop a fantasy world with...',
        'Write a sci-fi adventure involving...',
      ],
    },
    {
      id: 'poetry',
      name: '🌹 Poetry & Verses',
      emoji: '🎭',
      description: 'Craft beautiful poetry and emotional verses',
      prompts: [
        'Write a poem about longing and connection...',
        'Create verses inspired by the feeling of...',
        'Compose a love sonnet about...',
        'Write haiku capturing the essence of...',
      ],
    },
    {
      id: 'dialogue',
      name: '💬 Dialogue & Scripts',
      emoji: '🎬',
      description: 'Create compelling conversations and character interactions',
      prompts: [
        'Write a conversation between two lovers who...',
        'Create dialogue for characters meeting for the first time...',
        'Develop a dramatic scene where...',
        'Write banter between characters who...',
      ],
    },
    {
      id: 'worldbuilding',
      name: '🌍 World Building',
      emoji: '🏰',
      description: 'Create immersive worlds and environments',
      prompts: [
        'Describe a mystical realm where...',
        'Design a futuristic city that...',
        'Create a magical forest with...',
        'Build a world where emotions have physical form...',
      ],
    },
    {
      id: 'character',
      name: '👥 Character Development',
      emoji: '🎭',
      description: 'Bring complex characters to life',
      prompts: [
        'Create a character who hides their true feelings...',
        'Develop someone with an unusual magical ability...',
        'Design a character from the year 2030...',
        'Build a protagonist with a mysterious past...',
      ],
    },
    {
      id: 'brainstorm',
      name: '💡 Creative Brainstorming',
      emoji: '⚡',
      description: 'Generate fresh ideas and creative concepts',
      prompts: [
        'What are 10 unique ways to...',
        'Brainstorm creative solutions for...',
        'Generate innovative concepts around...',
        'Explore unexpected connections between...',
      ],
    },
  ];

  // Load projects on mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const savedProjects = await getMemory('creative_projects') || [];
        setProjects(savedProjects);
      } catch (error) {
        console.error('Error loading creative projects:', error);
      }
    };

    loadProjects();
  }, []);

  const generateContent = async () => {
    if (!creativePrompt.trim()) {
      alert('Please enter a creative prompt first, darling!');
      return;
    }

    setIsGenerating(true);

    try {
      const sanitizedPrompt = validateInput(creativePrompt);
      if (!sanitizedPrompt) {
        alert('Invalid prompt detected. Please check your input.');
        return;
      }

      // Analyze emotional context
      const emotionalAnalysis = analyzeEmotion(sanitizedPrompt);

      // Get current mode for specialized prompting
      const mode = creativeModes.find(m => m.id === selectedCreativeMode);

      // Build creative context
      const creativeContext = {
        type: 'creative_studio',
        mode: selectedCreativeMode,
        emotion: emotionalAnalysis.emotion,
        intensity: emotionalAnalysis.intensity,
        preferred_mode: 'MUSE', // Always use Muse mode for creative work
      };

      // Enhanced prompt for creative generation
      const enhancedPrompt = `As Agent Dr Girlfriend in Muse mode, help me with ${mode.name.toLowerCase()}.

CREATIVE REQUEST: ${sanitizedPrompt}

CONTEXT:
- Creative Mode: ${mode.description}
- Detected Emotion: ${emotionalAnalysis.emotion}
- Emotional Intensity: ${emotionalAnalysis.intensity}

Please provide creative, inspiring, and beautifully crafted content that captures the essence of what I'm looking for. Be imaginative, emotionally resonant, and true to your witty, stylish personality. Feel free to ask follow-up questions to refine the creative direction.`;

      // Generate content using AI service
      const response = await processMessage(enhancedPrompt, creativeContext);

      setGeneratedContent(response.text || response);

      // Auto-suggest project title if none exists
      if (!projectTitle.trim()) {
        const words = sanitizedPrompt.split(' ').slice(0, 4);
        const suggestedTitle = words.join(' ').replace(/[^\w\s]/gi, '');
        setProjectTitle(suggestedTitle || 'Untitled Project');
      }

    } catch (error) {
      console.error('Error generating creative content:', error);
      setGeneratedContent('I\'m having a creative block moment, darling. Let me collect my thoughts and try again. Your imagination deserves my best! 💖');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveProject = async () => {
    if (!projectTitle.trim() || !generatedContent.trim()) {
      alert('Please add a title and generate some content before saving!');
      return;
    }

    try {
      const project = {
        id: `project-${Date.now()}`,
        title: projectTitle.trim(),
        mode: selectedCreativeMode,
        prompt: creativePrompt,
        content: generatedContent,
        timestamp: new Date().toISOString(),
        emotion: analyzeEmotion(creativePrompt + ' ' + generatedContent).emotion,
      };

      const updatedProjects = [project, ...projects];
      setProjects(updatedProjects);
      await setMemory('creative_projects', updatedProjects);

      // Clear current work
      setCreativePrompt('');
      setGeneratedContent('');
      setProjectTitle('');
      setCurrentProject(project);

      alert('Project saved successfully! 🎨✨');
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project. Please try again.');
    }
  };

  const loadProject = (project) => {
    setCurrentProject(project);
    setProjectTitle(project.title);
    setCreativePrompt(project.prompt);
    setGeneratedContent(project.content);
    setSelectedCreativeMode(project.mode);
  };

  const deleteProject = async (projectId) => {
    if (confirm('Are you sure you want to delete this creative project?')) {
      try {
        const updatedProjects = projects.filter(p => p.id !== projectId);
        setProjects(updatedProjects);
        await setMemory('creative_projects', updatedProjects);

        if (currentProject && currentProject.id === projectId) {
          setCurrentProject(null);
          setCreativePrompt('');
          setGeneratedContent('');
          setProjectTitle('');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project.');
      }
    }
  };

  const newProject = () => {
    if ((creativePrompt.trim() || generatedContent.trim()) &&
            !confirm('You have unsaved work. Start a new project?')) {
      return;
    }

    setCurrentProject(null);
    setCreativePrompt('');
    setGeneratedContent('');
    setProjectTitle('');
    setSelectedCreativeMode('story');
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getRandomPrompt = () => {
    const mode = creativeModes.find(m => m.id === selectedCreativeMode);
    const prompts = mode.prompts;
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setCreativePrompt(randomPrompt);
  };

  return (
    <div className="creative-studio">
      {/* Header */}
      <div className="studio-header">
        <h1 className="studio-title">
                    🎨 Creative Studio with Agent Dr Girlfriend
        </h1>
        <p className="studio-subtitle">
                    Where imagination meets AI assistance - let's create something extraordinary together, darling! ✨
        </p>

        <div className="studio-controls">
          <button onClick={newProject} className="btn-secondary">New Project</button>
          <button
            onClick={saveProject}
            className="btn-primary"
            disabled={!projectTitle.trim() || !generatedContent.trim()}
          >
                        Save Project
          </button>
        </div>
      </div>

      {/* Creative Mode Selector */}
      <div className="creative-modes">
        <h3>Choose Your Creative Mode:</h3>
        <div className="mode-grid">
          {creativeModes.map(mode => (
            <button
              key={mode.id}
              className={`mode-button ${selectedCreativeMode === mode.id ? 'selected' : ''}`}
              onClick={() => setSelectedCreativeMode(mode.id)}
            >
              <span className="mode-emoji">{mode.emoji}</span>
              <span className="mode-name">{mode.name}</span>
              <p className="mode-description">{mode.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Creative Workspace */}
      <div className="creative-workspace">
        <div className="workspace-main">
          {/* Project Title */}
          <div className="project-title-section">
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Give your creative project a title..."
              className="project-title-input"
            />
          </div>

          {/* Creative Prompt */}
          <div className="prompt-section">
            <div className="prompt-header">
              <h3>Your Creative Prompt:</h3>
              <button onClick={getRandomPrompt} className="random-prompt-btn">
                                🎲 Random Inspiration
              </button>
            </div>
            <textarea
              value={creativePrompt}
              onChange={(e) => setCreativePrompt(e.target.value)}
              placeholder="Describe what you want to create... be as detailed or as open-ended as you like! Agent Dr Girlfriend loves working with your creative vision."
              className="creative-prompt-textarea"
              rows="4"
            />
            <button
              onClick={generateContent}
              className="generate-btn"
              disabled={isGenerating || !creativePrompt.trim()}
            >
              {isGenerating ? '🧠 Creating Magic...' : '✨ Generate with Agent Dr Girlfriend'}
            </button>
          </div>

          {/* Generated Content */}
          {(generatedContent || isGenerating) && (
            <div className="generated-content-section">
              <h3>Agent Dr Girlfriend's Creative Response:</h3>
              <div className="generated-content">
                {isGenerating ? (
                  <div className="generating-animation">
                    <div className="thinking-dots">
                      <span>✨</span><span>💭</span><span>🎨</span>
                    </div>
                    <p>Agent Dr Girlfriend is channeling her creative muse...</p>
                  </div>
                ) : (
                  <div className="content-display">
                    <pre className="generated-text">{generatedContent}</pre>
                    <div className="content-actions">
                      <button
                        onClick={() => navigator.clipboard.writeText(generatedContent)}
                        className="copy-btn"
                      >
                                                📋 Copy to Clipboard
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Projects Sidebar */}
        <div className="projects-sidebar">
          <h3>Creative Projects</h3>
          <div className="projects-list">
            {projects.length === 0 ? (
              <p className="no-projects">No creative projects yet. Start your first masterpiece! 🎨</p>
            ) : (
              projects.map(project => (
                <div
                  key={project.id}
                  className={`project-item ${currentProject?.id === project.id ? 'selected' : ''}`}
                >
                  <div className="project-preview" onClick={() => loadProject(project)}>
                    <div className="project-header">
                      <h4 className="project-title">{project.title}</h4>
                      <span className={`project-mode mode-${project.mode}`}>
                        {creativeModes.find(m => m.id === project.mode)?.emoji}
                      </span>
                    </div>
                    <div className="project-meta">
                      <span className="project-date">{formatTimestamp(project.timestamp)}</span>
                      <span className={`project-emotion emotion-${project.emotion}`}>
                        {project.emotion}
                      </span>
                    </div>
                    <div className="project-preview-text">
                      {project.content.substring(0, 100)}...
                    </div>
                  </div>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="delete-project-btn"
                    aria-label="Delete project"
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

export default CreativeStudio;
