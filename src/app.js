// BambiSleep's Agent Dr Girlfriend - Main Application Entry Point
// Following copilot-instructions.md: Modular ES6 architecture with emotional UX

import './styles/globals.css';

import React, { StrictMode, Suspense, lazy } from 'react';

import { createRoot } from 'react-dom/client';

// Lazy load components for performance optimization
const ChatInterface = lazy(() => import('./components/chat/ChatInterface.js'));
const JournalEditor = lazy(() => import('./components/journal/JournalEditor.js'));
const CreativeStudio = lazy(() => import('./components/creative/CreativeStudio.js'));
const RelationshipDashboard = lazy(() => import('./components/relationship/RelationshipDashboard.js'));
const PersonaSelector = lazy(() => import('./components/ui/PersonaSelector.js'));
const Header = lazy(() => import('./components/layout/Header.js'));
const Sidebar = lazy(() => import('./components/layout/Sidebar.js'));

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
const LoadingSpinner = ({ message = "Loading..." }) => (
    <div className="loading-screen">
        <div className="loading-container">
            <div className="loading-spinner">
                <div className="loading-avatar"></div>
            </div>
            <h2 className="loading-title">Agent Dr Girlfriend</h2>
            <p className="loading-message">{message}</p>
        </div>
    </div>
);

// Main App Component with emotional UX foundation
const App = () => {
    const [currentView, setCurrentView] = React.useState('chat');
    const [isLoading, setIsLoading] = React.useState(true);

    // Initialize app after a brief loading period for emotional UX
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
            // Announce to screen readers
            const announcement = document.getElementById('sr-announcements');
            if (announcement) {
                announcement.textContent = 'Agent Dr Girlfriend is ready for conversation';
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    // Emotional loading state
    if (isLoading) {
        return <LoadingSpinner message="Warming up emotional circuits..." />;
    }

    return (
        <div className="app-container">
            {/* Main App Layout - Mobile-first responsive design */}
            <div className="app-layout">

                {/* Sidebar - Hidden on mobile, shown on desktop */}
                <div className="sidebar-desktop">
                    <Suspense fallback={<div className="sidebar-loading">Loading sidebar...</div>}>
                        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
                    </Suspense>
                </div>

                {/* Main Content Area */}
                <div className="main-content">

                    {/* Header */}
                    <header className="header-mobile">
                        <Suspense fallback={<div className="header-loading"></div>}>
                            <Header currentView={currentView} setCurrentView={setCurrentView} />
                        </Suspense>
                    </header>

                    {/* Main Content Based on Current View */}
                    <main className="main-content-area" role="main">
                        <Suspense fallback={<LoadingSpinner message="Loading..." />}>
                            {currentView === 'chat' && <ChatInterface />}
                            {currentView === 'journal' && <JournalEditor />}
                            {currentView === 'creative' && <CreativeStudio />}
                            {currentView === 'relationship' && <RelationshipDashboard />}
                            {currentView === 'persona' && <PersonaSelector />}
                        </Suspense>
                    </main>

                </div>
            </div>

            {/* Enhanced Mobile Bottom Navigation */}
            <nav className="bottom-nav">
                <div className="bottom-nav-container">
                    <button
                        onClick={() => setCurrentView('chat')}
                        className={`nav-button ${currentView === 'chat' ? 'active' : ''}`}
                        aria-label="Chat with Agent Dr Girlfriend"
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
                        <span className="nav-label">Create</span>
                    </button>
                    <button
                        onClick={() => setCurrentView('relationship')}
                        className={`nav-button ${currentView === 'relationship' ? 'active' : ''}`}
                        aria-label="Relationship Dashboard"
                    >
                        <span className="nav-icon">💖</span>
                        <span className="nav-label">Us</span>
                    </button>
                    <button
                        onClick={() => setCurrentView('persona')}
                        className={`nav-button ${currentView === 'persona' ? 'active' : ''}`}
                        aria-label="Persona Settings"
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
