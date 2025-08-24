# Socket.IO Server Example for Bambisleep Prime Alerts

This is a simple Socket.IO server example for testing the alert system. Use this as a reference for implementing the actual bambisleep prime server.

## Installation

```bash
npm install socket.io cors express
```

## Server Code (server.js)

```javascript
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = createServer(app);

// CORS configuration for development
app.use(cors({
    origin: ['http://localhost:3004', 'http://localhost:3000'],
    credentials: true
}));

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3004', 'http://localhost:3000'],
        methods: ['GET', 'POST'],
        credentials: true
    },
    transports: ['websocket', 'polling']
});

// Alert types
const ALERT_TYPES = {
    UPDATE: 'update',
    WARNING: 'warning',
    ALERT: 'alert',
    INFO: 'info'
};

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join alerts room
    socket.on('join-alerts', () => {
        socket.join('alerts');
        console.log(`${socket.id} joined alerts room`);

        // Send welcome message
        socket.emit('alert', {
            type: ALERT_TYPES.INFO,
            title: 'Connected to Bambisleep Prime',
            message: 'Alert system ready for notifications',
            priority: 'normal'
        });
    });

    // Handle test alerts from client
    socket.on('test-alert', (alertData) => {
        console.log('Test alert received:', alertData);

        // Broadcast to all clients in alerts room
        io.to('alerts').emit('alert', {
            ...alertData,
            timestamp: new Date(),
            from: 'test'
        });
    });

    // Disconnect handling
    socket.on('disconnect', (reason) => {
        console.log(`Client disconnected: ${socket.id} (${reason})`);
    });
});

// API endpoint to send alerts
app.use(express.json());

app.post('/api/alert', (req, res) => {
    const { type, title, message, priority = 'normal' } = req.body;

    if (!type || !title) {
        return res.status(400).json({ error: 'Type and title are required' });
    }

    const alert = {
        type,
        title,
        message,
        priority,
        timestamp: new Date()
    };

    // Send to all connected clients
    io.to('alerts').emit('alert', alert);

    console.log('Alert sent:', alert);
    res.json({ success: true, alert });
});

// Test alerts endpoint
app.get('/api/test-alerts', (req, res) => {
    const testAlerts = [
        {
            type: ALERT_TYPES.UPDATE,
            title: 'System Update',
            message: 'Bambisleep Prime has been updated to version 2.1.0',
            priority: 'normal'
        },
        {
            type: ALERT_TYPES.WARNING,
            title: 'Session Warning',
            message: 'Your session will expire in 10 minutes',
            priority: 'normal'
        },
        {
            type: ALERT_TYPES.ALERT,
            title: 'Security Alert',
            message: 'Unusual login activity detected',
            priority: 'high'
        },
        {
            type: ALERT_TYPES.INFO,
            title: 'New Feature',
            message: 'Dream journal sync is now available',
            priority: 'normal'
        }
    ];

    // Send each alert with a delay
    testAlerts.forEach((alert, index) => {
        setTimeout(() => {
            io.to('alerts').emit('alert', {
                ...alert,
                timestamp: new Date()
            });
        }, index * 2000); // 2 second delay between alerts
    });

    res.json({ message: 'Test alerts scheduled', count: testAlerts.length });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`Bambisleep Prime Alert Server running on port ${PORT}`);
    console.log(`Test alerts: http://localhost:${PORT}/api/test-alerts`);
});
```

## Usage

### Start the server

```bash
node server.js
```

### Test endpoints

- **Trigger test alerts**: `GET http://localhost:3001/api/test-alerts`
- **Send custom alert**: `POST http://localhost:3001/api/alert`

### Custom alert payload

```json
{
    "type": "update|warning|alert|info",
    "title": "Alert Title",
    "message": "Alert message",
    "priority": "normal|high"
}
```

## Security Notes for Production

1. **Authentication**: Add JWT token validation
2. **Rate limiting**: Prevent spam alerts
3. **HTTPS**: Use SSL certificates
4. **Input validation**: Sanitize all inputs
5. **Room management**: User-specific alert rooms
6. **Logging**: Comprehensive audit logs

## Integration with Client

The client will automatically connect to `http://localhost:3001` in development mode when `REACT_APP_BAMBISLEEP_SOCKET_URL` is set.
