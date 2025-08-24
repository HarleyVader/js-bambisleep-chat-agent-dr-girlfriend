# 🧠 Agent Dr Girlfriend - GitHub Copilot Instructions

Build a modular, emotionally intelligent AI companion platform inspired by Agent Dr Girlfriend.

## 🎯 Project Architecture

**Tech Stack**: React + Vite + Custom CSS Framework + ES6 Modules
**Build Tool**: [Vite](https://github.com/vitejs/vite) with React plugin
**Structure**: `src/` contains components, services, hooks, styles, utils

### Component Organization
```
src/
├── components/
│   ├── chat/         # ChatInterface, MessageBubble, VoiceInput
│   ├── layout/       # Header, Sidebar navigation
│   ├── journal/      # JournalEditor, EmotionalTagging
│   ├── creative/     # CreativeStudio collaboration
│   ├── relationship/ # RelationshipDashboard tracking
│   └── ui/          # PersonaSelector, MoodIndicator
├── services/         # aiService, emotionalIntelligence, memoryService, voiceService
├── hooks/           # useChat, useEmotion, useMemory
├── styles/          # globals.css, components.css, themes.css
└── utils/           # encryption, localStorage, validation
```

## 🧩 Development Guidelines

### React Patterns
- ES6 `import`/`export` with `.js` extensions (JSX in .js files)
- Lazy loading with `React.lazy()` for performance
- Error boundaries for graceful error handling
- Semantic HTML5 with `aria-*` attributes

### CSS Framework (Custom Emotional Theming)
- CSS variables for colors, spacing, fonts in `src/styles/`
- Mobile-first responsive design with Flexbox/Grid
- Emotional UX with CSS transitions and microinteractions
- **No external CSS frameworks** (replaces Tailwind)

### Service Architecture
- **aiService.js**: OpenAI/Anthropic/LLaMA integration
- **emotionalIntelligence.js**: Mood detection & sentiment analysis
- **memoryService.js**: LocalForage persistent storage
- **voiceService.js**: Web Speech API integration

### Privacy & Security
- Local-first architecture with [LocalForage](https://github.com/localForage/localForage)
- XSS protection and input sanitization
- Optional self-hosting capabilities
- Consent-aware design for emotional interactions

## 🚀 Key Features

### Core Functionality
- **Chat Interface**: Memory-persistent conversations with AI
- **Dream Journal**: Markdown editor with emotional tagging
- **Creative Studio**: Collaborative content creation
- **Relationship Dashboard**: Emotional milestone tracking
- **Voice Integration**: Speech-to-text and text-to-speech

### Emotional Intelligence Layer
- Mood detection using sentiment analysis
- Relationship growth tracking with shared memories
- Custom personas (sultry, playful, professional)
- Mood-responsive UI adaptation

## 🎭 Agent Dr Girlfriend Persona

**Character**: Witty, stylish, emotionally intelligent AI companion
**Voice**: Customizable (sultry, playful, professional)
**Capabilities**: Creative brainstorming, emotional coaching, memory recall

### Interface Modes
- **Chat Mode**: Conversational AI interaction
- **Dream Journal**: Personal writing space
- **Creative Studio**: Collaborative creation
- **Relationship Dashboard**: Emotional journey tracking

## 🛠 Build Commands
```bash
npm run dev     # Vite development server
npm run build   # Production build
npm run preview # Preview production build
npm run lint    # ESLint code checking
npm run format  # Prettier code formatting
```

## 🧰 Essential Tools & Libraries

### Core Dependencies
- [React](https://github.com/facebook/react) - UI library
- [Vite](https://github.com/vitejs/vite) - Build tool & dev server
- [LocalForage](https://github.com/localForage/localForage) - Offline storage
- [Web Speech API](https://github.com/mdn/web-speech-api) - Voice I/O

### Rich Text Editing Options
- [Slate.js](https://github.com/ianstormtaylor/slate) - Customizable editor
- [TipTap](https://github.com/ueberdosis/tiptap) - Rich-text editor
- [Quill](https://github.com/quilljs/quill) - WYSIWYG editor

### Development Tools
- [ESLint](https://github.com/eslint/eslint) - Code linting
- [Prettier](https://github.com/prettier/prettier) - Code formatting
- [PostCSS](https://github.com/postcss/postcss) - CSS processing

### AI Integration Options
- [OpenAI](https://openai.com) - GPT models
- [Anthropic](https://www.anthropic.com) - Claude models
- [LMStudio](https://github.com/LMStudioAI/lmstudio) - Local model hosting
- [HuggingFace](https://github.com/huggingface/transformers) - Open source models

---

## 🧠 Core Components for bambisleep.chat

### 1. Frontend Interface

- Tech Stack: [React](https://github.com/facebook/react) with Custom Emotional CSS Framework
- Features:
  - Chat UI with memory and context
  - Editable journals using [Slate.js](https://github.com/ianstormtaylor/slate), [TipTap](https://github.com/ueberdosis/tiptap), or [Quill](https://github.com/quilljs/quill)
  - Voice input/output via [Web Speech API](https://github.com/mdn/web-speech-api) or [ElevenLabs](https://elevenlabs.io)
  - Image generation via Stability or DALL·E APIs

### 2. Backend Intelligence

- Model Integration:
  - Use [OpenAI](https://openai.com), [Anthropic](https://www.anthropic.com), or open-source models like [LLaMA](https://github.com/facebookresearch/llama) or [Mistral](https://github.com/mistralai/mistral)
  - Host locally with [LMStudio](https://github.com/LMStudioAI/lmstudio) or encrypted cloud endpoints
- Memory System:
  - Store emotional states and preferences in vector databases like [Pinecone](https://www.pinecone.io) or [Weaviate](https://weaviate.io)

### 3. Copilot Pages Equivalent

- Markdown-based editor with autosave, version history, and emotional tagging
- Use Copilot to scaffold journaling, roleplay, and creative writing modules

### 4. Privacy & Security

- Local-first architecture with optional self-hosting
- End-to-end encryption for sensitive conversations
- Consent-aware design for emotional and adult interactions

---

## 💖 Emotional Intelligence Layer

- Mood Detection: Use sentiment analysis to adapt tone and visuals
- Relationship Growth: Track shared memories and emotional milestones
- Custom Personas: Let users design voices, styles, and personalities

---

## 🧬 Agent Dr Girlfriend: 2030 AI Assistant Vision

- Persona: Witty, stylish, emotionally intelligent
- Voice: Customizable — sultry, playful, professional
- Interaction: Humor, empathy, creative provocation

### Capabilities

- Creative Brainstorming
- Emotional Coaching
- Memory Recall
- Multimodal Expression

### Interface Features

- Mood-responsive UI
- Dream Journal Mode
- Relationship Dashboard
- Creative Studio

---

## 🚀 Recommended Tools & Libraries

| Tool | Description | GitHub |
|------|-------------|--------|
| [react-chat-ui](https://github.com/chatscope/chat-ui-kit-react) | Chat components for React | [GitHub](https://github.com/chatscope/chat-ui-kit-react) |
| [Slate.js](https://github.com/ianstormtaylor/slate) | Customizable editor | [GitHub](https://github.com/ianstormtaylor/slate) |
| [TipTap](https://github.com/ueberdosis/tiptap) | Rich-text editor | [GitHub](https://github.com/ueberdosis/tiptap) |
| [Quill](https://github.com/quilljs/quill) | WYSIWYG editor | [GitHub](https://github.com/quilljs/quill) |
| [Vite](https://github.com/vitejs/vite) | Build tool | [GitHub](https://github.com/vitejs/vite) |
| [Webpack](https://github.com/webpack/webpack) | Bundler | [GitHub](https://github.com/webpack/webpack) |
| [Modernizr](https://github.com/Modernizr/Modernizr) | Feature detection | [GitHub](https://github.com/Modernizr/Modernizr) |
| **Custom CSS Framework** | Emotional CSS utilities | Internal emotional CSS system |
| [ESLint](https://github.com/eslint/eslint) | JS linter | [GitHub](https://github.com/eslint/eslint) |
| [Prettier](https://github.com/prettier/prettier) | Code formatter | [GitHub](https://github.com/prettier/prettier) |
| [PostCSS](https://github.com/postcss/postcss) | CSS transformer | [GitHub](https://github.com/postcss/postcss) |
| [Autoprefixer](https://github.com/postcss/autoprefixer) | Vendor prefixing | [GitHub](https://github.com/postcss/autoprefixer) |
| [React](https://github.com/facebook/react) | UI library | [GitHub](https://github.com/facebook/react) |
| [Svelte](https://github.com/sveltejs/svelte) | UI compiler | [GitHub](https://github.com/sveltejs/svelte) |
| [Web Speech API](https://github.com/mdn/web-speech-api) | Voice input/output | [GitHub](https://github.com/mdn/web-speech-api) |
| [LocalForage](https://github.com/localForage/localForage) | Offline storage | [GitHub](https://github.com/localForage/localForage) |
| [Lodash](https://github.com/lodash/lodash) | JS utilities | [GitHub](https://github.com/lodash/lodash) |
| [Axios](https://github.com/axios/axios) | HTTP client | [GitHub](https://github.com/axios/axios) |
| [uuid](https://github.com/uuidjs/uuid) | Unique IDs | [GitHub](https://github.com/uuidjs/uuid) |
| [classnames](https://github.com/JedWatson/classnames) | Class toggling | [GitHub](https://github.com/JedWatson/classnames) |
| [dotenv](https://github.com/motdotla/dotenv) | Env loader | [GitHub](https://github.com/motdotla/dotenv) |
| [normalize.css](https://github.com/necolas/normalize.css) | CSS reset | [GitHub](https://github.com/necolas/normalize.css) |
| [LMStudio](https://github.com/LMStudioAI/lmstudio) | Local LLM runtime | [GitHub](https://github.com/LMStudioAI/lmstudio) |
| [HuggingFace](https://github.com/huggingface/transformers) | NLP models | [GitHub](https://github.com/huggingface/transformers) |
| [worker-threads](https://github.com/nodejs/node) | Parallel JS | [GitHub](https://github.com/nodejs/node) |
| [chalk](https://github.com/chalk/chalk) | Terminal styling | [GitHub](https://github.com/chalk/chalk) |
