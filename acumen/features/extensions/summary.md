# Goose Extension System Summary

## Overview
The Goose extension system is built on the Model Context Protocol (MCP), providing a standardized way for AI agents to interact with external tools and resources. The system supports three types of extensions:

1. Built-in Extensions
2. Command-line (stdio) Extensions
3. Server-Sent Events (SSE) Extensions

## Core Components

### Extension Configuration Types
```typescript
type ExtensionConfig = {
  // SSE Extension
  type: 'sse';
  name: string;
  uri: string;
  env_keys?: string[];
} | {
  // Command-line Extension
  type: 'stdio';
  name: string;
  cmd: string;
  args: string[];
  env_keys?: string[];
} | {
  // Built-in Extension
  type: 'builtin';
  name: string;
  env_keys?: string[];
};
```

### Built-in Extensions
The system comes with several pre-configured extensions:
- Developer Tools (enabled by default)
- Computer Controller
- Memory System
- JetBrains IDE Integration
- Google Drive Integration (currently disabled)

## Key Features

### 1. Extension Management
- Dynamic loading/unloading of extensions
- Environment variable handling
- Local storage persistence
- Deep linking support for easy installation
- Security measures (command validation, injection prevention)

### 2. Communication Protocol
- IPC (Inter-Process Communication) between main and renderer processes
- API endpoints for extension management (/extensions/add, /extensions/remove)
- Event-based communication system

### 3. Security Features
- Command whitelisting (npx, uvx, goosed)
- Environment variable validation
- Deep link validation
- Injection prevention (e.g., blocking npx -c commands)

## Migration Considerations (React to Svelte)

### Current React Dependencies
1. Toast Notifications
   - Currently using react-toastify
   - Need to replace with Svelte equivalent (e.g., svelte-toast)

### State Management
1. Local Storage
   - Current implementation uses browser localStorage
   - Can be maintained in Svelte with minimal changes

2. UI State
   - React view state management needs to be converted to Svelte stores
   - Extension configuration storage pattern can remain similar

### API Integration
1. Extension API Endpoints
   - Current fetch-based API calls can be maintained
   - Consider moving to more Svelte-idiomatic patterns

### UI Components Needed in Svelte
1. Extension Management Interface
   - Extension list view
   - Add/Remove controls
   - Environment variable configuration
   - Status indicators

2. Notification System
   - Success/Error notifications for extension operations
   - Status updates

## Implementation Plan

1. Core Functionality
   - Port ExtensionConfig types to TypeScript
   - Implement extension management logic
   - Set up API communication

2. UI Components
   - Create Svelte components for extension management
   - Implement toast notifications
   - Build environment variable configuration interface

3. State Management
   - Set up Svelte stores for extension state
   - Implement persistence layer
   - Handle IPC communication

4. Testing & Validation
   - Unit tests for core functionality
   - Integration tests for extension management
   - Security validation for extension loading

## Security Considerations

1. Command Validation
   - Maintain whitelist of allowed commands
   - Validate all extension configurations
   - Prevent command injection

2. Environment Variables
   - Secure storage of sensitive values
   - Validation of required variables
   - Access control for env var management

3. Deep Linking
   - URL validation
   - Parameter sanitization
   - Command restriction enforcement

## Best Practices

1. Extension Development
   - Follow MCP protocol specifications
   - Implement proper error handling
   - Provide clear documentation

2. Security
   - Validate all external inputs
   - Sanitize command parameters
   - Handle sensitive data appropriately

3. Performance
   - Lazy load extensions when possible
   - Implement proper cleanup on extension removal
   - Cache extension configurations appropriately