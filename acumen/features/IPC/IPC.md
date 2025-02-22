# Goose Desktop IPC Reference

This document provides a comprehensive reference of all IPC (Inter-Process Communication) implementations in the Goose Desktop application.

## Overview

The IPC system in Goose Desktop follows Electron's security best practices:

- Uses `contextBridge` for secure preload scripts
- Implements proper context isolation
- Avoids exposing the entire `ipcRenderer` object
- Provides typed interfaces for all IPC communications
- Handles configuration through process arguments
- Implements comprehensive error handling

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
	showNotification: (data: { title: string; body: string }) => void;

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
	send: (channel: string, ...args: any[]) => void;
};
```

### AppConfigAPI Interface

```typescript
type AppConfigAPI = {
	get: (key: string) => any;
	getAll: () => Record<string, any>;
};
```

### Configuration Interface

```typescript
interface AppConfig {
	GOOSE_PROVIDER: string;
	GOOSE_MODEL: string;
	GOOSE_API_HOST: string;
	GOOSE_PORT: number;
	GOOSE_WORKING_DIR: string;
	secretKey: string;
	REQUEST_DIR?: string;
}
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

```typescript
// Configuration parsing from process arguments
const config = JSON.parse(process.argv.find((arg) => arg.startsWith('{')) || '{}');

// AppConfig exposure
contextBridge.exposeInMainWorld('appConfig', {
	get: (key) => config[key],
	getAll: () => config
});

// ElectronAPI exposure
contextBridge.exposeInMainWorld('electron', {
	getConfig: () => config,
	hideWindow: () => ipcRenderer.send('hide-window'),
	directoryChooser: (replace) => ipcRenderer.send('directory-chooser', replace),
	createChatWindow: (query, dir, version) =>
		ipcRenderer.send('create-chat-window', query, dir, version),
	// ... other methods
	on: (channel, callback) => ipcRenderer.on(channel, callback),
	off: (channel, callback) => ipcRenderer.off(channel, callback),
	send: (channel, ...args) => ipcRenderer.send(channel, ...args)
});
```

### Main Process (main.ts)

- Implements IPC handlers for all channels
- Manages window creation and lifecycle
- Handles system integration
- Manages application state and configuration

#### Error Handling Example

```typescript
// Global error handler
const handleFatalError = (error: Error) => {
	const windows = BrowserWindow.getAllWindows();
	windows.forEach((win) => {
		win.webContents.send('fatal-error', error.message || 'An unexpected error occurred');
	});
};

process.on('uncaughtException', (error) => {
	console.error('Uncaught Exception:', error);
	handleFatalError(error);
});

process.on('unhandledRejection', (error) => {
	console.error('Unhandled Rejection:', error);
	handleFatalError(error instanceof Error ? error : new Error(String(error)));
});
```

## Security Considerations

1. Context Isolation

   - Enabled by default
   - Prevents direct access to Node.js and Electron APIs from renderer
   - Configuration passed through process arguments

2. Preload Security

   - Uses contextBridge for safe exposure of APIs
   - Implements proper type checking
   - Avoids exposing entire IPC interfaces
   - Validates configuration data

3. Event Handling

   - Implements proper cleanup of event listeners
   - Uses typed event interfaces
   - Validates event data
   - Handles errors gracefully

4. Window Management
   - Implements secure window creation
   - Manages window lifecycle properly
   - Handles window state persistence
   - Implements proper window cleanup

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
const handleEvent = (event: Electron.IpcRendererEvent, ...args: any[]) => {
	// Handle event
};
window.electron.on('custom-event', handleEvent);

// Clean up listeners
window.electron.off('custom-event', handleEvent);
```

### Error Handling

```typescript
// Handle fatal errors
window.electron.on('fatal-error', (event, errorMessage) => {
	console.error('Fatal error:', errorMessage);
	// Handle error appropriately
});
```

### Configuration Access

```typescript
// Get specific config value
const provider = window.appConfig.get('GOOSE_PROVIDER');

// Get all config
const config = window.appConfig.getAll();
```

## Best Practices

1. Always use typed interfaces for IPC communication
2. Implement proper error handling for all IPC calls
3. Clean up event listeners when components unmount
4. Validate data before sending through IPC channels
5. Use invoke for operations that need responses
6. Keep IPC operations atomic and focused
7. Use proper window management practices
8. Implement proper security measures
9. Handle configuration securely
10. Clean up resources properly

## Testing Considerations

1. Test error scenarios
2. Validate type safety
3. Test window lifecycle
4. Verify event cleanup
5. Test configuration handling
6. Verify security measures
7. Test system integration
8. Validate error handling
9. Test resource cleanup
10. Verify IPC communication
