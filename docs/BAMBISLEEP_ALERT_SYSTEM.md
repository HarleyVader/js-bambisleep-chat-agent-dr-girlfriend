# 🚨 Bambisleep Prime Alert System

## Overview

The header-spacer features a secure Socket.IO-based alert system that displays notifications from bambisleep prime with elegant fade in/out animations. Includes WebSocket fallback for compatibility.

## Features

### ✨ Visual Effects

- **Top-down fade in/out** with smooth CSS transitions
- **Alert type styling**: Update (cyan), Warning (orange), Critical (red), Info (green)
- **Pulsing animations** for critical alerts
- **Backdrop blur** effects for modern glass morphism

### 🔌 Socket.IO Integration (Primary)

- **Secure real-time communication** with authentication support
- **Auto-reconnection** with configurable retry limits
- **Room-based alerts** for user/session-specific notifications
- **Transport fallbacks** (WebSocket → Polling automatically)
- **HTTPS/WSS** support for production environments

### ⚠️ WebSocket Fallback (Deprecated)

- **Legacy support** for environments without Socket.IO server
- **Simple WebSocket** connection as fallback
- **TODO:** Remove once Socket.IO integration is complete

### 📱 User Experience

- **Accessible design** with ARIA labels and screen reader support
- **Mobile responsive** layout with adapted styling
- **Manual dismissal** with dismiss button
- **Auto-hide** after configurable duration (default 5 seconds)

## Implementation

### Hook: `useBambisleepAlerts`

```javascript
import useBambisleepAlerts from './hooks/useBambisleepAlerts.js';

const {
    isAlertVisible,     // Boolean: alert currently showing
    currentAlert,       // Object: current alert data
    alertQueue,         // Number: alerts in queue
    connectionStatus,   // String: websocket connection state
    ALERT_TYPES,        // Object: available alert types
    dismissAlert        // Function: manually dismiss current alert
} = useBambisleepAlerts();
```

### Alert Types

- `ALERT_TYPES.UPDATE` - System updates (cyan)
- `ALERT_TYPES.WARNING` - Warnings (orange)
- `ALERT_TYPES.ALERT` - Critical alerts (red, pulsing)
- `ALERT_TYPES.INFO` - Information (green)

### WebSocket Message Format

```javascript
{
    "type": "update|warning|alert|info",
    "title": "Alert Title",
    "message": "Alert description",
    "priority": "normal|high",
    "duration": 5000  // milliseconds
}
```

## CSS Classes

### Core Alert Structure

```css
.bambisleep-alert              /* Base alert container */
.bambisleep-alert.visible      /* Visible state with animations */
.alert-{type}                  /* Type-specific styling */
```

### Content Elements

```css
.alert-content                 /* Main content wrapper */
.alert-main                    /* Icon + text area */
.alert-icon                    /* Alert type icon */
.alert-title                   /* Alert heading */
.alert-message                 /* Alert description */
.alert-actions                 /* Timestamp + dismiss button */
```

### Status Indicators

```css
.alert-connection-status       /* WebSocket connection indicator */
.alert-queue-badge            /* Queue count badge */
```

## Configuration

### Environment Variables

```bash
# Socket.IO server URL for bambisleep prime (primary)
REACT_APP_BAMBISLEEP_SOCKET_URL=http://localhost:3001

# WebSocket URL for bambisleep prime (fallback - deprecated)
REACT_APP_BAMBISLEEP_WS_URL=ws://localhost:8080/alerts
```

### Customizable Parameters

- `MAX_RECONNECT_ATTEMPTS` - Maximum reconnection tries (default: 5)
- `RECONNECT_DELAY` - Base delay between reconnections (default: 3000ms)
- `ALERT_DISPLAY_DURATION` - Default alert display time (default: 5000ms)

## Usage Examples

### Basic Integration

```javascript
// In any component
import useBambisleepAlerts from './hooks/useBambisleepAlerts.js';

const MyComponent = () => {
    const { connectionStatus, alertQueue } = useBambisleepAlerts();

    return (
        <div>
            <span>Status: {connectionStatus}</span>
            {alertQueue > 0 && <span>Alerts pending: {alertQueue}</span>}
        </div>
    );
};
```

### Testing Alerts (Development)

```javascript
// Trigger test alerts
const { triggerTestAlert, ALERT_TYPES } = useBambisleepAlerts();

// Test different alert types
triggerTestAlert(ALERT_TYPES.UPDATE);
triggerTestAlert(ALERT_TYPES.WARNING);
triggerTestAlert(ALERT_TYPES.ALERT);
triggerTestAlert(ALERT_TYPES.INFO);
```

### Manual Alert Dismissal

```javascript
const { dismissAlert } = useBambisleepAlerts();

// Dismiss current alert
const handleDismiss = () => {
    dismissAlert();
};
```

## Header Integration

The alert system is seamlessly integrated into the existing Header component:

1. **Connection status** shown in navbar
2. **Queue indicator** displays pending alerts count
3. **Alert display** in header-spacer with proper z-index layering
4. **Accessibility** with proper ARIA roles and screen reader support

## Development Tools

### Browser Console

- Connection status logs
- Error handling messages
- Reconnection attempt tracking

## Browser Support

- **Modern browsers** with WebSocket support
- **Fallback styling** for browsers without backdrop-filter
- **Reduced motion** support for accessibility
- **Mobile responsive** design

## Future Enhancements

- [ ] Sound notifications for critical alerts
- [ ] Custom alert templates
- [ ] Alert history/log viewer
- [ ] Integration with system notifications API
- [ ] Batch alert management
- [ ] Priority-based queue sorting
