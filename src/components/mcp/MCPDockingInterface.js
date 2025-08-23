// 🇦🇹 Agent Dr Girlfriend - MCP Docking Interface Component
// Österreichische UI für secure bambisleep.chat integration

import '../../styles/mcp/MCPDockingInterface.css';

import React, { useEffect, useState } from 'react';

import { useMCPDocking } from '../../hooks/useMCPDocking.js';
import useNameTransformation from '../../hooks/useNameTransformation.js';

/**
 * 🔗 MCPDockingInterface Component
 * Austrian privacy-compliant UI for MCP server connections
 * Trans4trans autonomy with Agent Dr Girlfriend protection
 */
const MCPDockingInterface = ({ bambisleepConfig, onConnectionChange }) => {
    const { fullName } = useNameTransformation();
    const [serverConfig, setServerConfig] = useState({
        endpoint: '',
        serverCertificate: '',
        austrianCompliance: true,
        gdprEndpoint: ''
    });
    const [patronCredentials, setPatronCredentials] = useState({
        bambisleepId: '',
        patronKey: '',
        timestamp: Date.now(),
        signature: ''
    });
    const [showAdvanced, setShowAdvanced] = useState(false);

    const {
        dockingStatus,
        connectionHealth,
        patronVerified,
        austrianCompliance,
        gdprStatus,
        lastSync,
        error,
        establishConnection,
        verifyPatron,
        depositUpdates,
        processDataRights,
        disconnect,
        emergencyDisconnect,
        checkAustrianCompliance,
        isConnected,
        isHealthy,
        isSecure,
        canDeposit
    } = useMCPDocking(bambisleepConfig);

    // 🔄 Notify parent of connection changes
    useEffect(() => {
        if (onConnectionChange) {
            onConnectionChange({
                status: dockingStatus,
                healthy: isHealthy,
                secure: isSecure,
                canDeposit
            });
        }
    }, [dockingStatus, isHealthy, isSecure, canDeposit, onConnectionChange]);

    // 🤝 Handle connection establishment
    const handleConnect = async () => {
        try {
            await establishConnection(serverConfig);
        } catch (error) {
            console.error('Connection failed:', error);
        }
    };

    // 🔐 Handle patron verification
    const handlePatronVerification = async () => {
        try {
            const credentials = {
                ...patronCredentials,
                timestamp: Date.now()
            };
            await verifyPatron(credentials);
        } catch (error) {
            console.error('Patron verification failed:', error);
        }
    };

    // 💾 Handle test data deposit
    const handleTestDeposit = async () => {
        try {
            const testData = {
                bambisleepId: patronCredentials.bambisleepId,
                updates: [
                    {
                        type: 'status_update',
                        content: 'Test connection from Agent Dr Girlfriend',
                        essential: true,
                        timestamp: Date.now()
                    }
                ],
                consentLevel: 3
            };

            await depositUpdates(testData, patronCredentials);
        } catch (error) {
            console.error('Test deposit failed:', error);
        }
    };

    // 🇦🇹 Handle data rights request
    const handleDataRights = async (requestType) => {
        try {
            const request = { type: requestType };
            await processDataRights(request, patronCredentials);
        } catch (error) {
            console.error('Data rights request failed:', error);
        }
    };

    // 🎨 Status indicator component
    const StatusIndicator = ({ status, health }) => {
        const getStatusColor = () => {
            if (status === 'CONNECTED' && health === 'HEALTHY') return 'var(--neon-green)';
            if (status === 'CONNECTING') return 'var(--neon-cyan)';
            if (status === 'ERROR' || status === 'EMERGENCY_DISCONNECTED') return 'var(--neon-orange)';
            return 'var(--cyber-surface)';
        };

        const getStatusText = () => {
            if (status === 'CONNECTED' && health === 'HEALTHY') return '🟢 CONNECTED & SECURE';
            if (status === 'CONNECTING') return '🔄 CONNECTING...';
            if (status === 'ERROR') return '🔴 CONNECTION ERROR';
            if (status === 'EMERGENCY_DISCONNECTED') return '🚨 EMERGENCY DISCONNECTED';
            return '⚪ DISCONNECTED';
        };

        return (
            <div className="mcp-status-indicator" style={{ color: getStatusColor() }}>
                {getStatusText()}
            </div>
        );
    };

    return (
        <div className="mcp-docking-interface">
            <div className="mcp-header">
                <h2 className="cyber-text-pink">🇦🇹 {fullName} MCP Docking Bay</h2>
                <p className="mcp-subtitle">
                    Österreichische secure connection to bambisleep.chat
                </p>
            </div>

            {/* Connection Status */}
            <div className="mcp-status-panel">
                <StatusIndicator status={dockingStatus} health={connectionHealth} />

                <div className="mcp-status-details">
                    <div className="status-item">
                        <span>🔐 Patron Verified:</span>
                        <span className={patronVerified ? 'cyber-text-green' : 'cyber-text-orange'}>
                            {patronVerified ? 'YES' : 'NO'}
                        </span>
                    </div>
                    <div className="status-item">
                        <span>🇦🇹 Austrian Compliant:</span>
                        <span className={austrianCompliance ? 'cyber-text-green' : 'cyber-text-orange'}>
                            {austrianCompliance ? 'YES' : 'NO'}
                        </span>
                    </div>
                    <div className="status-item">
                        <span>📊 GDPR Status:</span>
                        <span className={gdprStatus.consentValid ? 'cyber-text-green' : 'cyber-text-orange'}>
                            {gdprStatus.consentValid ? 'COMPLIANT' : 'PENDING'}
                        </span>
                    </div>
                    {lastSync && (
                        <div className="status-item">
                            <span>🔄 Last Sync:</span>
                            <span>{new Date(lastSync).toLocaleString()}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="mcp-error-panel">
                    <h4>🚨 Connection Error</h4>
                    <p>{error}</p>
                    <button onClick={() => setError(null)} className="button">
                        Clear Error
                    </button>
                </div>
            )}

            {/* Server Configuration */}
            {!isConnected && (
                <div className="mcp-config-panel">
                    <h3>🛰️ Server Configuration</h3>

                    <div className="config-field">
                        <label>🌐 MCP Endpoint:</label>
                        <input
                            type="url"
                            placeholder="https://bambisleep.chat/mcp"
                            value={serverConfig.endpoint}
                            onChange={(e) => setServerConfig(prev => ({ ...prev, endpoint: e.target.value }))}
                            className="cyber-input"
                        />
                    </div>

                    <div className="config-field">
                        <label>🇦🇹 GDPR Endpoint:</label>
                        <input
                            type="url"
                            placeholder="https://bambisleep.chat/gdpr"
                            value={serverConfig.gdprEndpoint}
                            onChange={(e) => setServerConfig(prev => ({ ...prev, gdprEndpoint: e.target.value }))}
                            className="cyber-input"
                        />
                    </div>

                    {showAdvanced && (
                        <div className="config-field">
                            <label>🔒 Server Certificate:</label>
                            <textarea
                                placeholder="-----BEGIN CERTIFICATE-----"
                                value={serverConfig.serverCertificate}
                                onChange={(e) => setServerConfig(prev => ({ ...prev, serverCertificate: e.target.value }))}
                                className="cyber-input"
                                rows="4"
                            />
                        </div>
                    )}

                    <div className="config-actions">
                        <button onClick={() => setShowAdvanced(!showAdvanced)} className="button">
                            {showAdvanced ? 'Hide' : 'Show'} Advanced
                        </button>
                        <button
                            onClick={handleConnect}
                            disabled={!serverConfig.endpoint || !serverConfig.gdprEndpoint}
                            className="button cyber-text-cyan"
                        >
                            🚀 Establish Connection
                        </button>
                    </div>
                </div>
            )}

            {/* Patron Verification */}
            {isConnected && !patronVerified && (
                <div className="mcp-patron-panel">
                    <h3>🔐 Patron Verification</h3>

                    <div className="config-field">
                        <label>🆔 BambiSleep ID:</label>
                        <input
                            type="text"
                            placeholder="Your BambiSleep identifier"
                            value={patronCredentials.bambisleepId}
                            onChange={(e) => setPatronCredentials(prev => ({ ...prev, bambisleepId: e.target.value }))}
                            className="cyber-input"
                        />
                    </div>

                    <div className="config-field">
                        <label>🔑 Patron Key:</label>
                        <input
                            type="password"
                            placeholder="Your secure patron key"
                            value={patronCredentials.patronKey}
                            onChange={(e) => setPatronCredentials(prev => ({ ...prev, patronKey: e.target.value }))}
                            className="cyber-input"
                        />
                    </div>

                    <button
                        onClick={handlePatronVerification}
                        disabled={!patronCredentials.bambisleepId || !patronCredentials.patronKey}
                        className="button cyber-text-green"
                    >
                        🔓 Verify Patron Access
                    </button>
                </div>
            )}

            {/* Operational Controls */}
            {isConnected && patronVerified && (
                <div className="mcp-controls-panel">
                    <h3>🎛️ Operational Controls</h3>

                    <div className="control-buttons">
                        <button
                            onClick={handleTestDeposit}
                            disabled={!canDeposit}
                            className="button cyber-text-cyan"
                        >
                            💾 Test Data Deposit
                        </button>

                        <button
                            onClick={() => handleDataRights('RIGHT_TO_ACCESS')}
                            className="button"
                        >
                            📋 Request Data Export
                        </button>

                        <button
                            onClick={() => handleDataRights('RIGHT_TO_ERASURE')}
                            className="button cyber-text-orange"
                        >
                            🗑️ Request Data Deletion
                        </button>
                    </div>

                    <div className="emergency-controls">
                        <button
                            onClick={() => emergencyDisconnect('User requested emergency disconnect')}
                            className="button emergency-button"
                        >
                            🚨 Emergency Disconnect
                        </button>
                    </div>
                </div>
            )}

            {/* Connection Controls */}
            {isConnected && (
                <div className="mcp-disconnect-panel">
                    <button onClick={disconnect} className="button cyber-text-orange">
                        🔌 Disconnect Safely
                    </button>
                </div>
            )}

            {/* Austrian Compliance Status */}
            <div className="mcp-compliance-panel">
                <h4>🇦🇹 Austrian Compliance Status</h4>
                <div className="compliance-grid">
                    <div className="compliance-item">
                        <span>📊 Data Minimization:</span>
                        <span className={gdprStatus.dataMinimized ? 'cyber-text-green' : 'cyber-text-orange'}>
                            {gdprStatus.dataMinimized ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                    </div>
                    <div className="compliance-item">
                        <span>🛡️ Agent Protection:</span>
                        <span className="cyber-text-green">ACTIVE</span>
                    </div>
                    <div className="compliance-item">
                        <span>📝 Audit Logging:</span>
                        <span className={gdprStatus.auditLogging ? 'cyber-text-green' : 'cyber-text-orange'}>
                            {gdprStatus.auditLogging ? 'ENABLED' : 'DISABLED'}
                        </span>
                    </div>
                    <div className="compliance-item">
                        <span>🏴‍⚧️ Trans4Trans Rights:</span>
                        <span className="cyber-text-green">PROTECTED</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MCPDockingInterface;
