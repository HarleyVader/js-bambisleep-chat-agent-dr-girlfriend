// useBambisleepAlerts.js - Socket.IO hook for bambisleep prime alerts
// Following copilot-instructions.md: Service architecture for alert integration
// Security: Uses Socket.IO instead of raw WebSockets for better security and authentication

import { useCallback, useEffect, useRef, useState } from 'react';

import { io } from 'socket.io-client';

const useBambisleepAlerts = () => {
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [alertQueue, setAlertQueue] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false);

  // Socket.IO connection ref (primary method)
  const socketRef = useRef(null);
  // DEPRECATED: WebSocket fallback - TODO: Remove once Socket.IO integration is complete
  const websocketRef = useRef(null);
  const alertTimeoutRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);

  const MAX_RECONNECT_ATTEMPTS = 3; // Reduced for dev mode
  const RECONNECT_DELAY = 5000; // Increased delay for less noise
  const ALERT_DISPLAY_DURATION = 5000;

  // Alert types configuration
  const ALERT_TYPES = {
    UPDATE: 'update',
    WARNING: 'warning',
    ALERT: 'alert',
    INFO: 'info',
  };

  // Connect to bambisleep prime using Socket.IO (secure)
  const connectSocketIO = useCallback(() => {
    const isDevMode = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
    const serverUrl = process.env.REACT_APP_BAMBISLEEP_SOCKET_URL || 'http://localhost:3001';

    // If in dev mode and no custom URL is set, use mock mode
    if (isDevMode && !process.env.REACT_APP_BAMBISLEEP_SOCKET_URL) {
      setIsDevelopmentMode(true);
      setConnectionStatus('mock');
      console.log('🔧 Development mode: Using mock alert system (no Socket.IO server required)');
      return;
    }

    try {
      // Socket.IO connection with secure options
      socketRef.current = io(serverUrl, {
        // Security options
        secure: !isDevMode, // Use HTTPS in production
        rejectUnauthorized: !isDevMode, // Verify SSL certificates in production

        // Connection options
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
        reconnectionDelay: RECONNECT_DELAY,
        timeout: 10000,

        // Authentication (add your auth token here)
        auth: {
          // token: localStorage.getItem('bambisleep_auth_token') // Uncomment when auth is ready
        },

        // Transport options (Socket.IO will fallback automatically)
        transports: ['websocket', 'polling'], // websocket preferred, polling fallback
      });

      // Connection successful
      socketRef.current.on('connect', () => {
        console.log('✅ Connected to bambisleep prime via Socket.IO');
        setConnectionStatus('connected');
        setIsDevelopmentMode(false);
        reconnectAttempts.current = 0;

        // Join alert room for this user/session
        socketRef.current.emit('join-alerts');
      });

      // Handle incoming alerts
      socketRef.current.on('alert', (alertData) => {
        console.log('📡 Received alert:', alertData);
        handleIncomingAlert(alertData);
      });

      // Handle different alert types
      socketRef.current.on('update', (alertData) => handleIncomingAlert({ ...alertData, type: ALERT_TYPES.UPDATE }));
      socketRef.current.on('warning', (alertData) => handleIncomingAlert({ ...alertData, type: ALERT_TYPES.WARNING }));
      socketRef.current.on('critical', (alertData) => handleIncomingAlert({ ...alertData, type: ALERT_TYPES.ALERT }));
      socketRef.current.on('info', (alertData) => handleIncomingAlert({ ...alertData, type: ALERT_TYPES.INFO }));

      // Connection error handling
      socketRef.current.on('connect_error', (error) => {
        if (!isDevMode || reconnectAttempts.current < 2) {
          console.warn('⚠️ Socket.IO connection failed:', error.message);
        }
        setConnectionStatus('error');
      });

      // Disconnection handling
      socketRef.current.on('disconnect', (reason) => {
        console.log('🔌 Disconnected from bambisleep prime:', reason);
        setConnectionStatus('disconnected');

        // Don't auto-reconnect if disconnected by server
        if (reason === 'io server disconnect') {
          // Server disconnected us, manual reconnection required
          setConnectionStatus('failed');
        } else {
          // Network issue, will auto-reconnect
          setConnectionStatus('reconnecting');
        }
      });

      // Reconnection attempts
      socketRef.current.on('reconnect_attempt', (attemptNumber) => {
        if (!isDevMode || attemptNumber <= 2) {
          console.log(`� Socket.IO reconnection attempt ${attemptNumber}/${MAX_RECONNECT_ATTEMPTS}`);
        }
        setConnectionStatus('reconnecting');
      });

      // Successful reconnection
      socketRef.current.on('reconnect', (attemptNumber) => {
        console.log(`✅ Reconnected after ${attemptNumber} attempts`);
        setConnectionStatus('connected');
        socketRef.current.emit('join-alerts'); // Rejoin alert room
      });

      // Max reconnection attempts reached
      socketRef.current.on('reconnect_failed', () => {
        console.error('❌ Socket.IO max reconnection attempts reached');
        setConnectionStatus('failed');
        // Fallback to WebSocket in production, mock in development
        if (!isDevMode) {
          console.log('🔄 Falling back to WebSocket connection...');
          connectWebSocketFallback();
        } else {
          setIsDevelopmentMode(true);
          setConnectionStatus('mock');
        }
      });

    } catch (error) {
      console.error('❌ Socket.IO initialization failed:', error);
      setConnectionStatus('error');

      // Fallback to WebSocket or mock
      if (!isDevMode) {
        connectWebSocketFallback();
      } else {
        setIsDevelopmentMode(true);
        setConnectionStatus('mock');
      }
    }
  }, []);

  // DEPRECATED: WebSocket fallback connection (TODO: Remove once Socket.IO is fully integrated)
  const connectWebSocketFallback = useCallback(() => {
    const isDevMode = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
    const wsUrl = process.env.REACT_APP_BAMBISLEEP_WS_URL || 'ws://localhost:8080/alerts';

    console.log('⚠️ Using WebSocket fallback - consider migrating to Socket.IO');

    try {
      websocketRef.current = new WebSocket(wsUrl);

      websocketRef.current.onopen = () => {
        console.log('✅ Connected to bambisleep prime via WebSocket (fallback)');
        setConnectionStatus('connected');
        reconnectAttempts.current = 0;
      };

      websocketRef.current.onmessage = (event) => {
        try {
          const alertData = JSON.parse(event.data);
          handleIncomingAlert(alertData);
        } catch (error) {
          console.error('❌ Failed to parse WebSocket message:', error);
        }
      };

      websocketRef.current.onclose = (event) => {
        if (!event.wasClean) {
          console.log('🔌 WebSocket disconnected');
          setConnectionStatus('disconnected');
          attemptReconnection();
        }
      };

      websocketRef.current.onerror = (error) => {
        if (!isDevMode || reconnectAttempts.current < 2) {
          console.warn('⚠️ WebSocket error (fallback mode)');
        }
        setConnectionStatus('error');
      };

    } catch (error) {
      console.error('❌ WebSocket fallback failed:', error);
      setConnectionStatus('failed');
    }
  }, []);

  // Handle incoming alert messages
  const handleIncomingAlert = useCallback((alertData) => {
    const alert = {
      id: Date.now() + Math.random(),
      type: alertData.type || ALERT_TYPES.INFO,
      title: alertData.title || 'Notification',
      message: alertData.message || '',
      timestamp: new Date(),
      priority: alertData.priority || 'normal',
      duration: alertData.duration || ALERT_DISPLAY_DURATION,
    };

    // Add to queue if another alert is showing
    if (isAlertVisible) {
      setAlertQueue(prev => [...prev, alert]);
    } else {
      showAlert(alert);
    }
  }, [isAlertVisible]);

  // Show alert with fade in animation
  const showAlert = useCallback((alert) => {
    setCurrentAlert(alert);
    setIsAlertVisible(true);

    // Clear existing timeout
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }

    // Auto-hide after duration
    alertTimeoutRef.current = setTimeout(() => {
      hideAlert();
    }, alert.duration);
  }, []);

  // Hide alert with fade out animation
  const hideAlert = useCallback(() => {
    setIsAlertVisible(false);

    // Process next alert in queue after fade out completes
    setTimeout(() => {
      setCurrentAlert(null);
      setAlertQueue(prev => {
        const [nextAlert, ...remaining] = prev;
        if (nextAlert) {
          showAlert(nextAlert);
        }
        return remaining;
      });
    }, 300); // Match CSS transition duration
  }, [showAlert]);

  // Attempt reconnection (used for WebSocket fallback only)
  const attemptReconnection = useCallback(() => {
    const isDevMode = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';

    if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttempts.current += 1;
      setConnectionStatus('reconnecting');

      reconnectTimeoutRef.current = setTimeout(() => {
        if (!isDevMode || reconnectAttempts.current <= 2) {
          console.log(`🔄 WebSocket fallback reconnection attempt ${reconnectAttempts.current}/${MAX_RECONNECT_ATTEMPTS}`);
        }
        connectWebSocketFallback();
      }, RECONNECT_DELAY * reconnectAttempts.current);
    } else {
      if (isDevMode && !process.env.REACT_APP_BAMBISLEEP_WS_URL) {
        setConnectionStatus('mock');
        setIsDevelopmentMode(true);
        console.log('🔧 Switching to mock mode - no server available');
      } else {
        setConnectionStatus('failed');
        console.error('❌ Max reconnection attempts reached');
      }
    }
  }, [connectWebSocketFallback]);

  // Manual alert dismissal
  const dismissAlert = useCallback(() => {
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }
    hideAlert();
  }, [hideAlert]);

  // Initialize Socket.IO connection
  useEffect(() => {
    connectSocketIO();

    return () => {
      // Cleanup Socket.IO connection
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      // Cleanup WebSocket fallback
      if (websocketRef.current) {
        websocketRef.current.close();
      }
      // Cleanup timers
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connectSocketIO]);

  return {
    // Alert state
    isAlertVisible,
    currentAlert,
    alertQueue: alertQueue.length,
    connectionStatus,
    isDevelopmentMode,

    // Alert types
    ALERT_TYPES,

    // Actions
    dismissAlert,

    // Connection control
    reconnect: connectSocketIO, // Primary: Socket.IO
    reconnectWebSocket: connectWebSocketFallback, // Fallback: WebSocket (deprecated)
  };
};

export default useBambisleepAlerts;
