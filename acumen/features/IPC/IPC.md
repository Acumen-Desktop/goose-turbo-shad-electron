# Goose Desktop IPC Reference

This document provides a comprehensive reference of all IPC (Inter-Process Communication) implementations in the Goose Desktop application.

## Overview

The IPC system in Goose Desktop follows Electron's security best practices:

- Uses `contextBridge` for secure preload scripts
- Implements proper context isolation
- Avoids exposing the entire `ipcRenderer` object
- Provides typed interfaces for all IPC communications

## API Interfaces

### ElectronAPI Interface

```typescript
type ElectronAPI = {
	// Configuration
	getConfig: () => Record<string, any>;

	// Window Management
	hideWindow: () => void;
	createChatWindow: (query?: string, dir?: string, version?: string) => void;
	createWingToWingWindow: (query: string) => void;

	// File System Operations
	directoryChooser: (replace: string) => void;
	selectFileOrDirectory: () => Promise<string>;

	// System Integration
	openInChrome: (url: string) => void;
	fetchMetadata: (url: string) => Promise<any>;
	reloadApp: () => void;
	getBinaryPath: (binaryName: string) => Promise<string>;

	// Notifications & Logging
	logInfo: (txt: string) => void;
	showNotification: (data: any) => void;

	// Power Management
	startPowerSaveBlocker: () => Promise<number>;
	stopPowerSaveBlocker: () => Promise<void>;

	// Ollama Integration
	checkForOllama: () => Promise<boolean>;

	// Event Management
	on: (
		channel: string,
		callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void
	) => void;
	off: (
		channel: string,
		callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void
	) => void;
};
```

### AppConfigAPI Interface

```typescript
type AppConfigAPI = {
	get: (key: string) => any;
	getAll: () => Record<string, any>;
};
```

## IPC Channels

### Window Management

- `hide-window`: Hides the current window
- `create-chat-window`: Creates a new chat window with optional query, directory, and version
- `create-wing-to-wing-window`: Creates a wing-to-wing window with a query
- `directory-chooser`: Opens directory chooser dialog
- `add-extension`: Handles extension URLs (goose:// protocol)

### System Integration

- `open-in-chrome`: Opens a URL in Chrome browser
- `fetch-metadata`: Fetches metadata from a URL
- `reload-app`: Triggers application reload
- `get-binary-path`: Gets the path of a binary
- `select-file-or-directory`: Opens file/directory selection dialog

### Notifications & Logging

- `logInfo`: Logs information to the main process
- `notify`: Shows system notification

### Power Management

- `start-power-save-blocker`: Starts power save blocking
- `stop-power-save-blocker`: Stops power save blocking

### Ollama Integration

- `check-ollama`: Checks if Ollama is available

## Implementation Details

### Preload Script (preload.ts)

- Establishes secure bridge between renderer and main processes
- Exposes APIs through contextBridge
- Implements type-safe interfaces
- Handles cleanup of event listeners

### Main Process (main.ts)

- Implements IPC handlers for all channels
- Manages window creation and lifecycle
- Handles system integration
- Manages application state and configuration

## Security Considerations

1. Context Isolation

   - Enabled by default
   - Prevents direct access to Node.js and Electron APIs from renderer

2. Preload Security

   - Uses contextBridge for safe exposure of APIs
   - Implements proper type checking
   - Avoids exposing entire IPC interfaces

3. Event Handling
   - Implements proper cleanup of event listeners
   - Uses typed event interfaces
   - Validates event data

## Usage Examples

### Window Management

```typescript
// Create a new chat window
window.electron.createChatWindow('initial query', '/path/to/dir', '1.0.0');

// Hide current window
window.electron.hideWindow();
```

### File Operations

```typescript
// Choose directory
window.electron.directoryChooser('replace_window');

// Select file or directory
const path = await window.electron.selectFileOrDirectory();
```

### Event Handling

```typescript
// Listen for events
window.electron.on('custom-event', (event, ...args) => {
	// Handle event
});

// Clean up listeners
window.electron.off('custom-event', eventHandler);
```

## Best Practices

1. Always use typed interfaces for IPC communication
2. Implement proper error handling for all IPC calls
3. Clean up event listeners when components unmount
4. Validate data before sending through IPC channels
5. Use invoke for operations that need responses
6. Keep IPC operations atomic and focused
