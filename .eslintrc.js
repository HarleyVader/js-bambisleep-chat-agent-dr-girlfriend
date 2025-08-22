export default {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    rules: {
        // Code Quality
        'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        'no-console': 'warn',
        'no-debugger': 'error',

        // ES6+ Best Practices
        'prefer-const': 'error',
        'prefer-arrow-callback': 'error',
        'arrow-spacing': 'error',

        // Emotional UX & Security
        'no-eval': 'error',
        'no-implied-eval': 'error',
        'no-script-url': 'error',

        // Code Style (following copilot instructions)
        'semi': ['error', 'always'],
        'quotes': ['error', 'single'],
        'indent': ['error', 2],
        'comma-dangle': ['error', 'always-multiline'],
    },
    globals: {
        // Browser APIs for emotional UX
        'SpeechRecognition': 'readonly',
        'webkitSpeechRecognition': 'readonly',
        'SpeechSynthesis': 'readonly',
        'IndexedDB': 'readonly',
    },
};
