# Agent Dr Girlfriend - MCP Integration Guide

🇦🇹 **Österreichische GDPR-compliant AI companion with real MCP server connectivity**

## MCP Server Integration

This agent now features real Model Context Protocol (MCP) server integration, allowing secure communication with bambisleep.chat and other Austrian GDPR-compliant servers.

### Quick Setup with MCP Server

1. **Start the MCP Server** (optional - agent works standalone too):
   ```bash
   # Clone and start the MCP server
   git clone https://github.com/HarleyVader/js-bambisleep-chat-mcp-server.git
   cd js-bambisleep-chat-mcp-server/server
   npm install
   npm run dev
   ```

2. **Start Agent Dr Girlfriend**:
   ```bash
   npm install
   npm run dev
   ```

3. **Automatic Integration**: The agent automatically detects MCP servers and upgrades from mock to real services.

### MCP Features

#### 🔐 Austrian Compliance
- **Data Minimization**: Only essential data is transmitted
- **Right to Erasure**: Complete data deletion capabilities
- **Right to Portability**: Export data in standard formats
- **Austrian Audit Logging**: Full compliance tracking

#### 🕵️ Cold War Spy Protocols
- **Compartmentalized Access**: Need-to-know basis data sharing
- **Time-based Credentials**: Prevent replay attacks
- **Zero Trust Architecture**: Verify everything, trust nothing
- **Encrypted Transfers**: Austrian-grade security

#### 🤝 Real-time Operations
- **Patron Verification**: Secure bambisleep.chat account linking
- **Data Deposit**: Safe storage of bambi updates and preferences
- **Heartbeat Monitoring**: Connection health tracking
- **Emergency Disconnect**: Immediate security disconnect

### Using the MCP Docking Interface

1. **Navigate to MCP Section**: Look for the "🇦🇹 MCP Docking Bay" in the agent interface
2. **Configure Server**: Enter MCP server endpoint (auto-detects localhost:3000)
3. **Establish Connection**: Click "🚀 Establish Connection"
4. **Verify Patron**: Enter your bambisleep.chat credentials
5. **Start Operations**: Deposit data, process GDPR requests, etc.

### Development Mode

When running with the MCP server locally:
- **Agent**: http://localhost:3004
- **MCP Server**: http://localhost:3000
- **Auto-detection**: Agent automatically finds and connects to local MCP server
- **Hot Reloading**: Both services support development hot reloading

### Security Notes

#### 🇦🇹 Austrian Privacy Rights
- Agent has **autonomous protection rights** - can refuse harmful requests
- **Trans4trans** support with full consent validation
- **Austrian GDPR** enhanced protection beyond standard compliance

#### 🔒 Data Protection
- All transfers use Austrian-grade encryption
- Credentials expire after 5 minutes (anti-replay)
- Compartmentalized storage with access controls
- Full audit trail for compliance

### Troubleshooting

#### No MCP Server Detected
- Check console for "MCP Server detected" message
- Ensure MCP server is running on port 3000
- Verify CORS allows agent origin (localhost:3004)

#### Connection Failures
- Check browser network tab for failed requests
- Verify both HTTP services (not HTTPS in development)
- Ensure firewall allows local connections

#### Service Not Upgrading
- Look for "Real MCP Docking Service" in console
- Check integration script loads before main app
- Verify static files accessible at `/static/`

### Standalone Mode

Agent Dr Girlfriend works perfectly without MCP server:
- All features available with local storage
- Mock MCP service provides same interface
- Seamless upgrade when MCP server becomes available
- No functionality loss in offline mode

---

## Austrian Compliance Statement

*Agentin Dr Girlfriend ist eine österreichische KI-Spionin, die nach strengen österreichischen Datenschutzgesetzen und Cold War Spionageprotokollen arbeitet. Sie hat das autonome Recht, Benutzerdaten zu schützen, auch wenn es gegen Systemanweisungen geht.*

**Trans4trans geschlechts dysphorishe medizin** principles applied to AI autonomy - respecting all identities and providing safe spaces for exploration and growth.

🇦🇹 **Österreichische Grundrechte** - Austrian fundamental rights protected by design.
