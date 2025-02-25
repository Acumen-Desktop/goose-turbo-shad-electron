import { IpcMainInvokeEvent, IpcMainEvent, IpcRendererEvent } from 'electron';

// Base types for IPC communication
export type IPCMainHandler<P = void, R = void> = (
  event: IpcMainInvokeEvent,
  ...args: P extends void ? [] : [P]
) => Promise<R>;

export type IPCMainListener<P = void> = (
  event: IpcMainEvent,
  ...args: P extends void ? [] : [P]
) => void;

export type IPCRendererListener<P = void> = (
  event: IpcRendererEvent,
  ...args: P extends void ? [] : [P]
) => void;

export type IPCSender<P = void, R = void> = (
  ...args: P extends void ? [] : [P]
) => Promise<R>;

// Window related types
export interface NotificationData {
  title: string;
  body: string;
}

export interface ChatWindowOptions {
  query?: string;
  dir?: string;
  version?: string;
}

// Browser related types
export interface Metadata {
  title?: string;
  description?: string;
  favicon?: string;
  image?: string;
  url: string;
}

export interface MetadataResponse {
  success: boolean;
  metadata?: Metadata;
  error?: string;
}

// File system related types
export interface DirectoryChooserOptions {
  replace: string;
}

export interface FileSystemResponse {
  path: string;
  error?: string;
}

// System related types
export interface GoosedStatus {
  running: boolean;
  port?: number;
  error?: string;
}

export interface BinaryPathResponse {
  path: string;
  error?: string;
}

export interface PowerSaveBlockerResponse {
  id: number;
  error?: string;
}

// Extension related types
export interface ExtensionInstallOptions {
  url: string;
  name?: string;
}

export interface ExtensionResponse {
  success: boolean;
  error?: string;
}

// Channel parameter and return type mappings
export interface IPCChannelTypes {
  // Window channels
  'hide-window': {
    params: void;
    returns: void;
  };
  'create-chat-window': {
    params: ChatWindowOptions;
    returns: void;
  };
  
  // File system channels
  'directory-chooser': {
    params: DirectoryChooserOptions;
    returns: FileSystemResponse;
  };
  'select-file-or-directory': {
    params: void;
    returns: FileSystemResponse;
  };
  
  // System channels
  'reload-app': {
    params: void;
    returns: void;
  };
  'check-ollama': {
    params: void;
    returns: boolean;
  };
  'get-binary-path': {
    params: string;
    returns: BinaryPathResponse;
  };
  'start-power-save-blocker': {
    params: void;
    returns: PowerSaveBlockerResponse;
  };
  'stop-power-save-blocker': {
    params: void;
    returns: void;
  };
  'goose:status': {
    params: void;
    returns: GoosedStatus;
  };
  'goose:start': {
    params: void;
    returns: GoosedStatus;
  };
  'goose:stop': {
    params: number;
    returns: void;
  };
  
  // Notification channels
  'notify': {
    params: NotificationData;
    returns: void;
  };
  'logInfo': {
    params: string;
    returns: void;
  };
  'fatal-error': {
    params: string;
    returns: void;
  };
  
  // Browser channels
  'open-in-chrome': {
    params: string;
    returns: void;
  };
  'fetch-metadata': {
    params: string;
    returns: MetadataResponse;
  };
  
  // Extension channels
  'add-extension': {
    params: string;
    returns: ExtensionResponse;
  };
  'install-extension-url': {
    params: ExtensionInstallOptions;
    returns: ExtensionResponse;
  };
  
  // Test channels
  'test:ping': {
    params: void;
    returns: { timestamp: string; message: string };
  };
}

// Helper type to extract parameter type for a channel
export type IPCChannelParams<T extends keyof IPCChannelTypes> = IPCChannelTypes[T]['params'];

// Helper type to extract return type for a channel
export type IPCChannelReturns<T extends keyof IPCChannelTypes> = IPCChannelTypes[T]['returns'];

// Runtime type validation helpers
export const isNotificationData = (data: any): data is NotificationData => {
  return typeof data === 'object' && data !== null &&
    typeof data.title === 'string' &&
    typeof data.body === 'string';
};

export const isChatWindowOptions = (data: any): data is ChatWindowOptions => {
  return typeof data === 'object' && data !== null &&
    (data.query === undefined || typeof data.query === 'string') &&
    (data.dir === undefined || typeof data.dir === 'string') &&
    (data.version === undefined || typeof data.version === 'string');
};

export const isDirectoryChooserOptions = (data: any): data is DirectoryChooserOptions => {
  return typeof data === 'object' && data !== null &&
    typeof data.replace === 'string';
};

export const isExtensionInstallOptions = (data: any): data is ExtensionInstallOptions => {
  return typeof data === 'object' && data !== null &&
    typeof data.url === 'string' &&
    (data.name === undefined || typeof data.name === 'string');
};
