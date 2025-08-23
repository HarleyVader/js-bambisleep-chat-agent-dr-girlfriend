// BambiSleep's Agent Dr Girlfriend - Main Application Entry Point
// Following copilot-instructions.md: Modular ES6 architecture with emotional UX

import './styles/globals.css';
import './styles/themes.css';

import React, { StrictMode, Suspense, lazy } from 'react';

import { createRoot } from 'react-dom/client';
import useNameTransformation from './hooks/useNameTransformation.js';

// Lazy load components for performance optimization with better chunking
const ChatInterface = lazy(() => import(/* webpackChunkName: "chat" */ './components/chat/ChatInterface.js'));
const JournalEditor = lazy(() => import(/* webpackChunkName: "journal" */ './components/journal/JournalEditor.js'));
const CreativeStudio = lazy(() => import(/* webpackChunkName: "creative" */ './components/creative/CreativeStudio.js'));
const RelationshipDashboard = lazy(() => import(/* webpackChunkName: "relationship" */ './components/relationship/RelationshipDashboard.js'));
const PersonaSelector = lazy(() => import(/* webpackChunkName: "ui" */ './components/ui/PersonaSelector.js'));
const Header = lazy(() => import(/* webpackChunkName: "layout" */ './components/layout/Header.js'));
const Sidebar = lazy(() => import(/* webpackChunkName: "layout" */ './components/layout/Sidebar.js'));

// 🇦🇹 MCP Docking System for bambisleep.chat integration
const MCPDockingInterface = lazy(() => import(/* webpackChunkName: "mcp" */ './components/mcp/MCPDockingInterface.js'));

// Dynamically load components CSS only when needed
const loadComponentStyles = () => {
    return import(/* webpackChunkName: "component-styles" */ './styles/components.css');
};

// Error Boundary for graceful error handling
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Agent Dr Girlfriend Error:', error, errorInfo);

        // Only trigger cleanup for actual storage/JSON errors, not React rendering errors
        const isStorageError = error?.message?.includes('JSON') ||
            error?.message?.includes('not valid') ||
            error?.message?.includes('localStorage') ||
            error?.message?.includes('IndexedDB');

        if (isStorageError) {
            console.log('🔧 Storage-related error detected, scheduling cleanup on next page visit');
            // Mark for cleanup on next visit instead of immediate
            localStorage.setItem('needsCleanup', 'true');
        } else {
            console.log('🎭 React component error - no storage cleanup needed');
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-screen">
                    <div className="error-container">
                        <h1 className="error-title">😔 Agent Dr Girlfriend is Taking a Break</h1>
                        <p className="error-message">Something went wrong, but I'll be back soon!</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="error-button"
                        >
                            Refresh & Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Loading component for Suspense fallbacks
const LoadingSpinner = ({ message = "Loading..." }) => {
    const { fullName } = useNameTransformation();

    return (
        <div className="loading-screen">
            <div className="loading-container">
                <div className="loading-spinner">
                    <div className="loading-avatar"></div>
                </div>
                <h2 className="loading-title">{fullName}</h2>
                <p className="loading-message">{message}</p>
            </div>
        </div>
    );
};

// Main App Component with emotional UX foundation
const App = () => {
    const [currentView, setCurrentView] = React.useState('chat');
    const [isLoading, setIsLoading] = React.useState(true);

    // Import name transformation hook
    const { getDisplayName, fullName } = useNameTransformation();

    // Initialize app after a brief loading period for emotional UX
    React.useEffect(() => {
        const initializeApp = async () => {
            try {
                // Load component styles dynamically
                await loadComponentStyles();

                // Add global error handler for uncaught JSON parsing errors
                if (typeof window !== 'undefined') {
                    // Check if cleanup is needed from previous session
                    const needsCleanup = localStorage.getItem('needsCleanup');
                    if (needsCleanup === 'true') {
                        console.log('🧹 Performing scheduled cleanup from previous session...');
                        if (window.emergencyStorageCleanup) {
                            window.emergencyStorageCleanup();
                        }
                        localStorage.removeItem('needsCleanup');
                    }

                    // Only handle actual storage errors, not React errors
                    window.addEventListener('unhandledrejection', (event) => {
                        const message = event.reason?.message || '';
                        if (message.includes('not valid JSON') ||
                            message.includes('localStorage') ||
                            message.includes('IndexedDB')) {
                            console.warn('🔧 Storage error detected:', message);
                            // Schedule cleanup for next visit instead of immediate
                            localStorage.setItem('needsCleanup', 'true');
                            event.preventDefault();
                        }
                    });

                    // Lightweight console monitoring for storage errors only
                    const originalConsoleError = console.error;
                    console.error = (...args) => {
                        const message = args.join(' ');
                        // Only act on actual storage corruption, not React errors
                        if ((message.includes('[object Object]') && message.includes('localStorage')) ||
                            (message.includes('JSON') && message.includes('parse'))) {
                            console.warn('� Storage corruption detected, will cleanup on next visit');
                            localStorage.setItem('needsCleanup', 'true');
                        }
                        originalConsoleError.apply(console, args);
                    };

                    // Add gentle cleanup when user actually leaves the page
                    window.addEventListener('beforeunload', () => {
                        // Only cleanup temporary data, keep user preferences
                        const tempKeys = ['temp_messages', 'session_state', 'current_typing'];
                        tempKeys.forEach(key => {
                            try {
                                localStorage.removeItem(key);
                                sessionStorage.removeItem(key);
                            } catch (e) {
                                // Silent fail for cleanup
                            }
                        });
                    });

                    // Make manual cleanup available but not automatic
                    window.manualStorageCleanup = () => {
                        if (confirm(`Are you sure you want to clear all ${fullName} data? This cannot be undone.`)) {
                            window.emergencyStorageCleanup();
                        }
                    };
                }

                console.log(`🚀 Initializing ${fullName}...`);
            } catch (error) {
                console.error('Initialization failed:', error);
            }

            // Continue with normal initialization
            const timer = setTimeout(() => {
                setIsLoading(false);
                // Announce to screen readers
                const announcement = document.getElementById('sr-announcements');
                if (announcement) {
                    announcement.textContent = `${fullName} is ready for conversation`;
                }
            }, 1500);

            return () => clearTimeout(timer);
        };

        const cleanup = initializeApp();
        return () => {
            if (cleanup && typeof cleanup.then === 'function') {
                cleanup.then(cleanupFn => {
                    if (typeof cleanupFn === 'function') {
                        cleanupFn();
                    }
                });
            }
        };
    }, []);    // Emotional loading state
    if (isLoading) {
        return <LoadingSpinner message="Warming up emotional circuits..." />;
    }

    return (
        <div className="app-container">
            {/* Fixed Sidebar with dynamic agent stats */}
            <Suspense fallback={<div className="sidebar-loading">💖 Loading {fullName}...</div>}>
                <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
            </Suspense>

            {/* Main Content Area with proper offset */}
            <div className="main-content">
                {/* Fixed Header with navigation */}
                <Suspense fallback={<div className="header-loading">Loading navigation...</div>}>
                    <Header currentView={currentView} setCurrentView={setCurrentView} />
                </Suspense>

                {/* Main Content Based on Current View */}
                <main className="main-content-area" role="main">
                    <Suspense fallback={<LoadingSpinner message="Loading..." />}>
                        {currentView === 'chat' && <ChatInterface />}
                        {currentView === 'journal' && <JournalEditor />}
                        {currentView === 'creative' && <CreativeStudio />}
                        {currentView === 'relationship' && <RelationshipDashboard />}
                        {currentView === 'persona' && <PersonaSelector />}
                        {currentView === 'mcp' && <MCPDockingInterface bambisleepConfig={{ id: fullName, pronouns: 'she/her' }} />}
                    </Suspense>

                </main>
            </div>

            {/* Mobile Bottom Navigation (shown only on mobile) */}
            <nav className="bottom-nav mobile-only">
                <div className="bottom-nav-container">
                    <button
                        onClick={() => setCurrentView('chat')}
                        className={`nav-button ${currentView === 'chat' ? 'active' : ''}`}
                        aria-label={`Chat with ${fullName}`}
                    >
                        <span className="nav-icon">💬</span>
                        <span className="nav-label">Chat</span>
                    </button>
                    <button
                        onClick={() => setCurrentView('journal')}
                        className={`nav-button ${currentView === 'journal' ? 'active' : ''}`}
                        aria-label="Dream Journal"
                    >
                        <span className="nav-icon">📝</span>
                        <span className="nav-label">Journal</span>
                    </button>
                    <button
                        onClick={() => setCurrentView('creative')}
                        className={`nav-button ${currentView === 'creative' ? 'active' : ''}`}
                        aria-label="Creative Studio"
                    >
                        <span className="nav-icon">🎨</span>
                        <span className="nav-label">Creative</span>
                    </button>
                    <button
                        onClick={() => setCurrentView('relationship')}
                        className={`nav-button ${currentView === 'relationship' ? 'active' : ''}`}
                        aria-label="Relationship Dashboard"
                    >
                        <span className="nav-icon">💖</span>
                        <span className="nav-label">Journey</span>
                    </button>
                    <button
                        onClick={() => setCurrentView('persona')}
                        className={`nav-button ${currentView === 'persona' ? 'active' : ''}`}
                        aria-label="Personality Mode"
                    >
                        <span className="nav-icon">🎭</span>
                        <span className="nav-label">Mode</span>
                    </button>
                </div>
            </nav>
        </div>
    );
};

// Progressive enhancement - check for required browser features
const checkBrowserSupport = () => {
    const required = [
        'localStorage',
        'Promise',
        'fetch',
        'addEventListener'
    ];

    return required.every(feature => feature in window);
};

// Initialize the app with error handling and progressive enhancement
const initializeApp = () => {
    const container = document.getElementById('app');

    if (!container) {
        console.error('App container not found');
        return;
    }

    // Check browser support
    if (!checkBrowserSupport()) {
        container.innerHTML = `
      <div class="min-h-screen flex items-center justify-center bg-slate-100">
        <div class="text-center p-8">
          <h1 class="text-2xl font-bold text-slate-900 mb-4">Browser Not Supported</h1>
          <p class="text-slate-600 mb-4">Please use a modern browser to experience Agent Dr Girlfriend.</p>
          <p class="text-sm text-slate-500">Recommended: Chrome, Firefox, Safari, or Edge</p>
        </div>
      </div>
    `;
        return;
    }

    // Create React root and render app
    const root = createRoot(container);

    root.render(
        <StrictMode>
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        </StrictMode>
    );
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
