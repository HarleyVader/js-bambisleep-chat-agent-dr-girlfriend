# 🤖 AI Server Configuration Guide

Agent Dr Girlfriend supports multiple AI providers. Here's how to configure each one:

## 🔧 Configuration Options

### 1. Local AI Server (LMStudio, Jan, etc.)

```bash
# In your .env file:
AI_PROVIDER=local
LOCAL_AI_URL=http://localhost:1234

# For network servers (if needed):
# LOCAL_AI_URL=http://192.168.x.x:port
```

**Common Ports:**

- LMStudio: `http://localhost:1234`
- Jan: `http://localhost:1337`
- Text Generation WebUI: `http://localhost:5000`
- Oobabooga: `http://localhost:5000`

### 2. Ollama (Recommended for Local)

```bash
AI_PROVIDER=ollama
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=mistral
```

**Popular Models:**

- `mistral` - Good balance of speed and quality
- `llama2` - Meta's flagship model
- `codellama` - Optimized for code
- `phi` - Microsoft's efficient model

### 3. OpenAI API

```bash
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4o-mini
```

### 4. Anthropic Claude

```bash
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your-api-key-here
ANTHROPIC_MODEL=claude-3-sonnet-20240229
```

## 🛡️ Content Security Policy

The CSP allows connections to:

- `localhost:*` (any localhost port)
- `127.0.0.1:*` (loopback)
- `192.168.*:*` (local network)
- `10.*:*` (private network)
- `172.*:*` (private network)

## 🚨 Troubleshooting

### CSP Errors

If you see "violates Content Security Policy", the server address needs to be added to the CSP in `index.html`.

### Connection Refused

1. Check if your AI server is running
2. Verify the port in your `.env` file
3. Test the endpoint manually: `curl http://localhost:1234/v1/models`

### No Response

1. Verify your API key (for external providers)
2. Check model name spelling
3. Look at browser console for detailed errors

## 📝 Testing Your Setup

1. Start your AI server
2. Update `.env` with correct settings
3. Restart the development server
4. Try sending a message in the chat

The app will automatically fall back to intelligent offline responses if the AI server is unavailable.
