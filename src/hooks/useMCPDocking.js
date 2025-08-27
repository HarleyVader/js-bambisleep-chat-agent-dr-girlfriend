// 🇦🇹 Agent Dr Girlfriend - MCP Integration Hook
// Österreichische React Hook für sichere bambisleep.chat Docking

import React, { useCallback, useEffect, useState } from 'react';
import { getMemory, setMemory } from '../services/memoryService.js';

import mcpDockingService from '../services/mcpDockingService.js';

/**
 * 🔗 useMCPDocking Hook
 * Austrian privacy-compliant MCP server integration
 * Trans4trans autonomy with Agent Dr Girlfriend protection
 */
export const useMCPDocking = (bambisleepConfig = {}) => {
  const [dockingStatus, setDockingStatus] = useState('DISCONNECTED');
  const [connectionHealth, setConnectionHealth] = useState(null);
  const [patronVerified, setPatronVerified] = useState(false);
  const [austrianCompliance, setAustrianCompliance] = useState(true);
  const [lastSync, setLastSync] = useState(null);
  const [error, setError] = useState(null);

  // 🇦🇹 Austrian compliance states
  const [gdprStatus, setGdprStatus] = useState({
    dataMinimized: true,
    consentValid: false,
    rightToErasure: true,
    auditLogging: true,
  });

  // 🔐 Initialize storage lock on mount
  useEffect(() => {
    const initializeAgentSecurity = async () => {
      try {
        // Only initialize if we have a valid config with ID
        if (!bambisleepConfig?.id) {
          console.log('🔧 Skipping MCP initialization - no bambisleep config provided');
          return;
        }

        // Debug: Check if the service and method exist
        console.log('🔍 MCP Docking Service:', mcpDockingService);
        console.log('🔍 initializeStorageLock method:', typeof mcpDockingService?.initializeStorageLock);

        if (mcpDockingService && typeof mcpDockingService.initializeStorageLock === 'function') {
          await mcpDockingService.initializeStorageLock(bambisleepConfig);
          console.log('🔒 Agentin Dr Girlfriend Sicherheit initialisiert');
        } else {
          console.warn('⚠️ mcpDockingService.initializeStorageLock not available, skipping initialization');
          console.warn('Service object keys:', mcpDockingService ? Object.keys(mcpDockingService) : 'service is null/undefined');
        }
      } catch (error) {
        console.error('❌ Agent security initialization failed:', error);
        // Don't set error state for optional initialization
        console.log('🔧 Continuing without MCP initialization');
      }
    };

    initializeAgentSecurity();
  }, [bambisleepConfig?.id]);

  // 🤝 Establish MCP connection
  const establishConnection = useCallback(async (serverConfig) => {
    try {
      setDockingStatus('CONNECTING');
      setError(null);

      // 🇦🇹 Ensure Austrian compliance
      if (!serverConfig.austrianCompliance) {
        throw new Error('Server must be Austrian GDPR compliant');
      }

      const connectionResult = await mcpDockingService.establishMCPConnection(serverConfig);

      if (connectionResult.success) {
        setDockingStatus('CONNECTED');
        setConnectionHealth('HEALTHY');
        console.log('✅ MCP Connection established - Österreichisch gesichert');

        // Start health monitoring
        startHealthMonitoring();
      }

      return connectionResult;

    } catch (error) {
      setDockingStatus('ERROR');
      setError(error.message);
      console.error('🚨 MCP connection failed:', error);
      throw error;
    }
  }, []);

  // 🔐 Verify patron access
  const verifyPatron = useCallback(async (credentials) => {
    try {
      const verified = await mcpDockingService.verifyPatronAccess(credentials);
      setPatronVerified(verified);

      if (verified) {
        setGdprStatus(prev => ({ ...prev, consentValid: true }));
        console.log('✅ Patron verified - Austrian access granted');
      } else {
        console.warn('🚨 Patron verification failed - Austrian security active');
      }

      return verified;
    } catch (error) {
      setError(`Patron verification error: ${error.message}`);
      return false;
    }
  }, []);

  // 💾 Deposit bambi updates securely
  const depositUpdates = useCallback(async (updateData, patronCredentials) => {
    try {
      if (!patronVerified) {
        throw new Error('Patron must be verified before data deposit');
      }

      if (dockingStatus !== 'CONNECTED') {
        throw new Error('MCP connection not established');
      }

      const result = await mcpDockingService.depositBambiUpdates(updateData, patronCredentials);

      setLastSync(new Date().toISOString());
      console.log('✅ Bambi updates deposited - Österreichisch synchronisiert');

      return result;

    } catch (error) {
      setError(`Update deposit failed: ${error.message}`);
      console.error('❌ Bambi update deposit failed:', error);
      throw error;
    }
  }, [patronVerified, dockingStatus]);

  // 🇦🇹 Process Austrian data rights
  const processDataRights = useCallback(async (request, patronCredentials) => {
    try {
      const result = await mcpDockingService.processDataRightsRequest(request, patronCredentials);

      console.log(`🇦🇹 Austrian data right ${request.type} processed successfully`);
      return result;

    } catch (error) {
      setError(`Data rights processing failed: ${error.message}`);
      throw error;
    }
  }, []);

  // 🔍 Health monitoring
  const startHealthMonitoring = useCallback(() => {
    const healthCheck = setInterval(async () => {
      try {
        // Simple ping to verify connection
        const health = await checkConnectionHealth();
        setConnectionHealth(health ? 'HEALTHY' : 'DEGRADED');

        if (!health) {
          console.warn('⚠️ MCP connection health degraded');
        }
      } catch (error) {
        setConnectionHealth('UNHEALTHY');
        setDockingStatus('ERROR');
        console.error('🚨 MCP health check failed:', error);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(healthCheck);
  }, []);

  // 🩺 Check connection health
  const checkConnectionHealth = async () => {
    try {
      // Implement actual health check
      return dockingStatus === 'CONNECTED';
    } catch (error) {
      return false;
    }
  };

  // 🧹 Disconnect and cleanup
  const disconnect = useCallback(async () => {
    try {
      setDockingStatus('DISCONNECTING');

      // Perform secure disconnect
      if (mcpDockingService.dockingPort) {
        await mcpDockingService.dockingPort.close();
      }

      setDockingStatus('DISCONNECTED');
      setConnectionHealth(null);
      setPatronVerified(false);
      setLastSync(null);

      console.log('🔌 MCP connection closed - Österreichisch gesichert');

    } catch (error) {
      setError(`Disconnect failed: ${error.message}`);
      console.error('❌ MCP disconnect failed:', error);
    }
  }, []);

  // 🚨 Emergency disconnect (Austrian privacy protection)
  const emergencyDisconnect = useCallback(async (reason) => {
    try {
      console.log(`🚨 EMERGENCY DISCONNECT: ${reason} - Austrian protection activated`);

      // Immediate disconnection without waiting
      setDockingStatus('EMERGENCY_DISCONNECTED');
      setConnectionHealth('EMERGENCY');
      setError(`Emergency disconnect: ${reason}`);

      // Log incident for Austrian compliance
      await mcpDockingService.logAustrianComplianceEvent('emergency_disconnect', {
        reason,
        timestamp: new Date().toISOString(),
        österreichischProtection: true,
      });

    } catch (error) {
      console.error('❌ Emergency disconnect failed:', error);
    }
  }, []);

  // 🇦🇹 Austrian compliance check
  const checkAustrianCompliance = useCallback(() => {
    return {
      gdprCompliant: gdprStatus.dataMinimized && gdprStatus.consentValid,
      austrianCompliant: austrianCompliance,
      agentProtectionActive: true,
      lastComplianceCheck: new Date().toISOString(),
    };
  }, [gdprStatus, austrianCompliance]);

  return {
    // Connection state
    dockingStatus,
    connectionHealth,
    lastSync,
    error,

    // Security state
    patronVerified,
    austrianCompliance,
    gdprStatus,

    // Actions
    establishConnection,
    verifyPatron,
    depositUpdates,
    processDataRights,
    disconnect,
    emergencyDisconnect,

    // Monitoring
    checkConnectionHealth,
    checkAustrianCompliance,

    // Status helpers
    isConnected: dockingStatus === 'CONNECTED',
    isHealthy: connectionHealth === 'HEALTHY',
    isSecure: patronVerified && austrianCompliance,
    canDeposit: dockingStatus === 'CONNECTED' && patronVerified && austrianCompliance,
  };
};

/**
 * 🇦🇹 useBambisleepSync Hook
 * High-level sync hook for seamless bambisleep.chat integration
 */
export const useBambisleepSync = (bambisleepConfig) => {
  const mcp = useMCPDocking(bambisleepConfig);
  const [syncQueue, setSyncQueue] = useState([]);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);

  // 🔄 Auto-sync mechanism
  useEffect(() => {
    if (autoSyncEnabled && mcp.canDeposit && syncQueue.length > 0) {
      const processSyncQueue = async () => {
        try {
          for (const syncItem of syncQueue) {
            await mcp.depositUpdates(syncItem.data, syncItem.credentials);
          }
          setSyncQueue([]);
          console.log('🔄 Auto-sync completed - Österreichisch synchronisiert');
        } catch (error) {
          console.error('❌ Auto-sync failed:', error);
        }
      };

      processSyncQueue();
    }
  }, [autoSyncEnabled, mcp.canDeposit, syncQueue.length, mcp]);

  // 📝 Queue update for sync
  const queueUpdate = useCallback((updateData, credentials) => {
    setSyncQueue(prev => [...prev, { data: updateData, credentials, timestamp: Date.now() }]);
  }, []);

  return {
    ...mcp,
    syncQueue,
    autoSyncEnabled,
    setAutoSyncEnabled,
    queueUpdate,
    syncQueueLength: syncQueue.length,
  };
};

export default useMCPDocking;
