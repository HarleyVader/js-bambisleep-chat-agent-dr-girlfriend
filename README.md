# 🧠 BambiSleep's Agent Dr Girlfriend

> **A sophisticated AI companion from the year 2030 with emotional intelligence, memory, and style** 💖

## 🌟 Overview

Agent Dr Girlfriend is a modular, emotionally intelligent, and privacy-first AI companion platform. She's witty, stylish, slightly mysterious, and designed to inspire, support, and grow alongside you through creative brainstorming, emotional coaching, and meaningful conversations.

**Current Status**: 89% Complete - Fully operational AI system with personality! 🚀

## ✨ Features

### 🧬 **Agent Dr Girlfriend Personality System**

- **4 Interaction Modes**: MUSE (creative), MENTOR (guidance), GIRLFRIEND (companionship), GHOSTWRITER (writing)
- **Emotional Intelligence**: Mood detection, empathy, and adaptive responses
- **Memory System**: Remembers conversations, preferences, and relationship growth
- **Witty & Stylish**: Confident, supportive communication with subtle humor

### 💬 **Advanced Chat Interface**

- Real-time AI conversations with Agent Dr Girlfriend personality
- Message history with emotional context
- Voice input/output via Web Speech API
- XSS protection and input sanitization
- Responsive design with emotional theming

### 🧠 **AI Integration (Multi-Provider)**

- **OpenAI GPT-4** support
- **Anthropic Claude** support
- **Ollama** local AI support
- **LMStudio** compatibility
- Intelligent fallbacks when AI is unavailable

### 🛡️ **Privacy & Security First**

- Local storage with LocalForage encryption
- No data sent to external servers (except chosen AI provider)
- Input validation preventing XSS attacks
- End-to-end encryption for sensitive conversations

### 🎭 **Emotional UX Design**

- Mood-responsive UI themes
- Custom CSS framework with emotional color palette
- Accessibility-first design (ARIA, keyboard navigation)
- Progressive enhancement for all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- A code editor (VS Code recommended)
- Optional: OpenAI API key, Anthropic API key, or local AI setup

### Installation & Setup

### 1. **Clone and Install**

```bash
cd agent-dr-girlfriend
npm install
```

### 2. **Configure Your AI Provider**

```bash
# Copy the environment template
cp .env.example .env

# Edit .env and choose your AI provider:
# - Set VITE_AI_PROVIDER to: 'openai', 'anthropic', 'ollama', or 'local'
# - Add your API key for your chosen provider
```

### 3. **Start Agent Dr Girlfriend**

```bash
cd agent-dr-girlfriend; npm run dev
```

### 4. **Open Your Browser**

Visit `http://localhost:3000` and start chatting with Agent Dr Girlfriend! 💖

## 🔧 Configuration Options

### AI Providers

#### OpenAI (Recommended)

```bash
VITE_AI_PROVIDER=openai
VITE_OPENAI_API_KEY=sk-your-key-here
```

#### Anthropic Claude

```bash
VITE_AI_PROVIDER=anthropic
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
```

#### Local AI (LMStudio)

```bash
VITE_AI_PROVIDER=local
VITE_LOCAL_AI_URL=http://localhost:1234
```

#### Ollama

```bash
VITE_AI_PROVIDER=ollama
VITE_OLLAMA_URL=http://localhost:11434
VITE_OLLAMA_MODEL=mistral
```

### Agent Dr Girlfriend Personality

```bash
# Interaction mode (MUSE, MENTOR, GIRLFRIEND, GHOSTWRITER)
VITE_DEFAULT_MODE=GIRLFRIEND

# Personality intensity (0.1 to 1.0)
VITE_PERSONALITY_INTENSITY=0.8

# Emotional responsiveness (0.1 to 1.0)
VITE_EMOTIONAL_RESPONSIVENESS=0.9
```

1. Clone the repository:

   ```text
   git clone https://github.com/yourusername/bambisleep-chat-agent.git
   ```

2. Navigate to the project directory:

   ```text
   cd bambisleep-chat-agent
   ```

3. Install dependencies:

   ```text
   npm install
   ```

### Running the Application

To start the development server, run:

```text
cd agent-dr-girlfriend; npm run dev
```

Open your browser and navigate to `http://localhost:3000` to view the application.

## Contributing

We welcome contributions! Please refer to the [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines on how to contribute to this project.

## Security

For information on security practices and considerations, please see [SECURITY.md](docs/SECURITY.md).

## Documentation

For detailed documentation about the Agent Dr Girlfriend persona and its features, refer to [AGENT_DR_GIRLFRIEND.md](docs/AGENT_DR_GIRLFRIEND.md).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
