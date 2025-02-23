// Core IPC interfaces for Goose Desktop

/**
 * Main electron API interface exposed to renderer process
 */
export interface ElectronAPI {
	// Configuration
	getConfig: () => Record<string, any>;

	// Window Management
	hideWindow: () => void;
	createChatWindow: (query?: string, dir?: string, version?: string) => void;
	createWingToWingWindow: (query: string) => void;

	// File System Operations
	directoryChooser: (replace: boolean) => void;
	selectFileOrDirectory: () => Promise<string | null>;

	// System Integration
	openInChrome: (url: string) => void;
	fetchMetadata: (url: string) => Promise<string>;
	reloadApp: () => void;
	getBinaryPath: (binaryName: string) => Promise<string>;

	// Notifications & Logging
	logInfo: (txt: string) => void;
	showNotification: (data: NotificationData) => void;

	// Power Management
	startPowerSaveBlocker: () => Promise<boolean>;
	stopPowerSaveBlocker: () => Promise<boolean>;

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

	// Test Ping Pong
	ping: () => void;
	onPong: (callback: (data: PongResponse) => void) => () => void;
}

/**
 * App configuration API interface
 */
export interface AppConfigAPI {
	get: (key: keyof AppConfig) => any;
	getAll: () => Record<string, any>;
}

/**
 * Main application configuration interface
 */
export interface AppConfig {
	GOOSE_PROVIDER: string;
	GOOSE_MODEL: string;
	GOOSE_API_HOST: string;
	GOOSE_PORT: number;
	GOOSE_WORKING_DIR: string;
	secretKey: string;
	REQUEST_DIR?: string;
}

/**
 * Notification data interface
 */
export interface NotificationData {
	title: string;
	body: string;
}

/**
 * Ping pong response interface
 */
export interface PongResponse {
	message: string;
	app: string;
}

export interface GoosedResponse {
	isRunning: boolean;
	port?: number;
	error?: string;
}

/**
 * IPC channel names
 */
export const IPC_CHANNELS = {
	// Window Management
	HIDE_WINDOW: 'hide-window',
	CREATE_CHAT_WINDOW: 'create-chat-window',
	CREATE_WING_TO_WING_WINDOW: 'create-wing-to-wing-window',
	DIRECTORY_CHOOSER: 'directory-chooser',
	ADD_EXTENSION: 'add-extension',

	// System Integration
	OPEN_IN_CHROME: 'open-in-chrome',
	FETCH_METADATA: 'fetch-metadata',
	RELOAD_APP: 'reload-app',
	GET_BINARY_PATH: 'get-binary-path',
	SELECT_FILE_OR_DIRECTORY: 'select-file-or-directory',

	// Notifications & Logging
	LOG_INFO: 'logInfo',
	NOTIFY: 'notify',

	// Power Management
	START_POWER_SAVE_BLOCKER: 'start-power-save-blocker',
	STOP_POWER_SAVE_BLOCKER: 'stop-power-save-blocker',

	// Ollama Integration
	CHECK_OLLAMA: 'check-ollama',

	// Error Handling
	FATAL_ERROR: 'fatal-error',

	// Test Ping Pong
	PING: 'app:ping',
	PONG: 'app:pong',

	// App Lifecycle
	APP_READY: 'app:ready',

	// Goosed Management
	START_GOOSED: 'goosed:start',
	STOP_GOOSED: 'goosed:stop',
	CHECK_GOOSED: 'goosed:check'
} as const;

export type IpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS];
