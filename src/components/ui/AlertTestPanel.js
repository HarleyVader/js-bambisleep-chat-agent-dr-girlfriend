// AlertTestPanel.js - Testing component for bambisleep alerts
// Following copilot-instructions.md: Component development guidelines
// Updated for Socket.IO integration with WebSocket fallback

import React from 'react';
import useBambisleepAlerts from '../../hooks/useBambisleepAlerts.js';

const AlertTestPanel = () => {
    const {
        connectionStatus,
        alertQueue,
        isDevelopmentMode,
        ALERT_TYPES,
        triggerTestAlert,
        reconnect,
        reconnectWebSocket
    } = useBambisleepAlerts();

    const testAlerts = [
        {
            type: ALERT_TYPES.UPDATE,
            label: 'Update Alert',
            description: 'Test system update notification'
        },
        {
            type: ALERT_TYPES.WARNING,
            label: 'Warning Alert',
            description: 'Test warning notification'
        },
        {
            type: ALERT_TYPES.ALERT,
            label: 'Critical Alert',
            description: 'Test critical alert notification'
        },
        {
            type: ALERT_TYPES.INFO,
            label: 'Info Alert',
            description: 'Test information notification'
        }
    ];

    return (
        <div className="alert-test-panel">
            <div className="test-panel-header">
                <h3>🚨 Bambisleep Alert System Test {isDevelopmentMode ? '(Mock Mode)' : '(Socket.IO)'}</h3>
                <div className="connection-info">
                    <span className={`connection-status ${connectionStatus}`}>
                        Connection: {connectionStatus}
                        {connectionStatus === 'mock' && ' 🔧'}
                        {connectionStatus === 'connected' && ' ✅'}
                        {connectionStatus === 'failed' && ' ❌'}
                    </span>
                    {alertQueue > 0 && (
                        <span className="queue-info">
                            Queue: {alertQueue} alerts
                        </span>
                    )}
                </div>
            </div>

            {/* Connection Controls */}
            <div className="connection-controls">
                <button
                    className="reconnect-button socket-io"
                    onClick={reconnect}
                    disabled={connectionStatus === 'connected' || connectionStatus === 'mock'}
                >
                    🔌 Reconnect Socket.IO
                </button>
                <button
                    className="reconnect-button websocket-fallback"
                    onClick={reconnectWebSocket}
                    disabled={connectionStatus === 'connected' || connectionStatus === 'mock'}
                    title="Deprecated: Use for testing WebSocket fallback only"
                >
                    ⚠️ Try WebSocket Fallback
                </button>
            </div>

            <div className="test-buttons">
                {testAlerts.map((alert, index) => (
                    <button
                        key={index}
                        className={`test-button alert-${alert.type}`}
                        onClick={() => triggerTestAlert(alert.type)}
                        title={alert.description}
                    >
                        {alert.label}
                    </button>
                ))}
            </div>

            <div className="test-info">
                <p><strong>Socket.IO Integration:</strong></p>
                <ul>
                    <li><strong>Primary:</strong> Uses Socket.IO for secure, authenticated real-time communication</li>
                    <li><strong>Fallback:</strong> WebSocket connection available if Socket.IO fails</li>
                    <li><strong>Mock Mode:</strong> Development testing without server requirements</li>
                    <li><strong>Security:</strong> HTTPS/WSS in production, authentication tokens, auto-reconnection</li>
                    <li><strong>Testing:</strong> Click alert buttons to test different notification types</li>
                </ul>

                <p><strong>Connection Status:</strong></p>
                <ul>
                    <li><strong>connected ✅:</strong> Socket.IO connected and ready</li>
                    <li><strong>mock 🔧:</strong> Development mode (no server required)</li>
                    <li><strong>reconnecting 🔄:</strong> Attempting to reconnect</li>
                    <li><strong>failed ❌:</strong> All connection methods failed</li>
                </ul>
            </div>
        </div>
    );
};

export default AlertTestPanel;
