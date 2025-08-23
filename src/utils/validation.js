// Validation Utilities - Agent Dr Girlfriend Input Security
// Following copilot-instructions.md: Security & privacy first, XSS prevention

// Input sanitization to prevent XSS attacks
export const validateInput = (input) => {
  if (typeof input !== 'string') {
    return '';
  }

  // Create a temporary div to safely escape HTML
  const div = document.createElement('div');
  div.textContent = input;
  const escaped = div.innerHTML;

  // Additional sanitization - remove potentially dangerous patterns
  const sanitized = escaped
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();

  return sanitized;
};

// Validate text input with security checks
export const validateTextInput = (input) => {
  if (typeof input !== 'string') {
    return { isValid: false, message: 'Input must be a string.', sanitized: '' };
  }

  const trimmed = input.trim();
  if (trimmed === '') {
    return { isValid: false, message: 'Input cannot be empty.', sanitized: '' };
  }

  const sanitized = validateInput(trimmed);

  // Check for potential security issues
  const securityPatterns = [
    /<[^>]*>/g, // HTML tags
    /javascript:/i, // JavaScript URLs
    /vbscript:/i, // VBScript URLs
    /data:/i, // Data URLs
    /on\w+\s*=/i, // Event handlers
  ];

  const hasSecurityIssues = securityPatterns.some(pattern => pattern.test(input));

  if (hasSecurityIssues) {
    return {
      isValid: false,
      message: 'Input contains potentially unsafe content.',
      sanitized,
    };
  }

  return { isValid: true, message: '', sanitized };
};

// Validate emotion tag
export const validateEmotionTag = (tag) => {
  const validTags = [
    'joy', 'happiness', 'sadness', 'anger', 'fear', 'surprise',
    'love', 'excitement', 'calm', 'neutral', 'anxious', 'content',
    'frustrated', 'hopeful', 'disappointed', 'grateful', 'confused',
    'determined', 'overwhelmed', 'peaceful', 'curious', 'proud',
  ];

  if (typeof tag !== 'string') {
    return { isValid: false, message: 'Emotion tag must be a string.' };
  }

  const normalizedTag = tag.toLowerCase().trim();
  if (!validTags.includes(normalizedTag)) {
    return {
      isValid: false,
      message: `Invalid emotion tag. Valid options: ${validTags.join(', ')}`,
    };
  }

  return { isValid: true, message: '', normalized: normalizedTag };
};

// Validate journal entry
export const validateJournalEntry = (entry) => {
  const validation = validateTextInput(entry);
  if (!validation.isValid) {
    return validation;
  }

  if (validation.sanitized.length > 20000) {
    return {
      isValid: false,
      message: 'Journal entry cannot exceed 2000 characters.',
      sanitized: validation.sanitized.substring(0, 20000),
    };
  }

  return { isValid: true, message: '', sanitized: validation.sanitized };
};

// Validate message length for chat
export const validateChatMessage = (message) => {
  const validation = validateTextInput(message);
  if (!validation.isValid) {
    return validation;
  }

  if (validation.sanitized.length > 10000) {
    return {
      isValid: false,
      message: 'Message cannot exceed 1000 characters.',
      sanitized: validation.sanitized.substring(0, 10000),
    };
  }

  if (validation.sanitized.length < 1) {
    return {
      isValid: false,
      message: 'Message cannot be empty.',
      sanitized: validation.sanitized,
    };
  }

  return { isValid: true, message: '', sanitized: validation.sanitized };
};

// Validate user name
export const validateUserName = (name) => {
  if (typeof name !== 'string') {
    return { isValid: false, message: 'Name must be a string.' };
  }

  const trimmed = name.trim();
  if (trimmed.length < 1) {
    return { isValid: false, message: 'Name cannot be empty.' };
  }

  if (trimmed.length > 50) {
    return { isValid: false, message: 'Name cannot exceed 50 characters.' };
  }

  // Allow letters, numbers, spaces, apostrophes, hyphens
  const namePattern = /^[a-zA-Z0-9\s'-]+$/;
  if (!namePattern.test(trimmed)) {
    return {
      isValid: false,
      message: 'Name can only contain letters, numbers, spaces, apostrophes, and hyphens.',
    };
  }

  const sanitized = validateInput(trimmed);
  return { isValid: true, message: '', sanitized };
};

// Validate API key format (basic format checking)
export const validateApiKey = (apiKey) => {
  if (typeof apiKey !== 'string') {
    return { isValid: false, message: 'API key must be a string.' };
  }

  const trimmed = apiKey.trim();
  if (trimmed.length < 10) {
    return { isValid: false, message: 'API key appears to be too short.' };
  }

  if (trimmed.length > 200) {
    return { isValid: false, message: 'API key appears to be too long.' };
  }

  // Basic pattern check for common API key formats
  const apiKeyPatterns = [
    /^sk-[a-zA-Z0-9]{40,}$/, // OpenAI format
    /^sk-ant-[a-zA-Z0-9]{40,}$/, // Anthropic format
    /^[a-f0-9]{32}$/, // MD5 format
    /^[a-zA-Z0-9]{20,}$/, // Generic format
  ];

  const isValidFormat = apiKeyPatterns.some(pattern => pattern.test(trimmed));
  if (!isValidFormat) {
    return {
      isValid: false,
      message: 'API key format does not match known patterns.',
    };
  }

  return { isValid: true, message: '' };
};

// Rate limiting validation (for preventing spam)
const rateLimitMap = new Map();

export const validateRateLimit = (identifier, maxRequests = 10, windowMs = 60000) => {
  const now = Date.now();
  const windowStart = now - windowMs;

  if (!rateLimitMap.has(identifier)) {
    rateLimitMap.set(identifier, []);
  }

  const requests = rateLimitMap.get(identifier);

  // Remove old requests outside the window
  const recentRequests = requests.filter(timestamp => timestamp > windowStart);

  if (recentRequests.length >= maxRequests) {
    return {
      isValid: false,
      message: `Rate limit exceeded. Maximum ${maxRequests} requests per ${windowMs / 1000} seconds.`,
      retryAfter: Math.ceil((recentRequests[0] + windowMs - now) / 1000),
    };
  }

  recentRequests.push(now);
  rateLimitMap.set(identifier, recentRequests);

  return { isValid: true, message: '' };
};

// Generate unique IDs using crypto.randomUUID() with fallback
export const generateId = () => {
  try {
    // Use crypto.randomUUID() if available (modern browsers)
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    // Fallback: Generate UUID v4 manually
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  } catch (error) {
    // Final fallback: timestamp + random
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
};

// Export all validation functions as a utility object
export const validationUtils = {
  validateInput,
  validateTextInput,
  validateEmotionTag,
  validateJournalEntry,
  validateChatMessage,
  validateUserName,
  validateApiKey,
  validateRateLimit,
  generateId,
};
