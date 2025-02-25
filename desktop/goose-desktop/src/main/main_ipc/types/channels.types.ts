import { ChatWindowOptions, NotificationData } from './window.types';
import { MetadataResponse } from './browser.types';
import { DirectoryChooserOptions, FileSystemResponse } from './filesystem.types';
import { 
  BinaryPathResponse, 
  GoosedStatus, 
  GoosedStartResponse,
  GoosedStopResponse,
  PowerSaveBlockerResponse 
} from './system.types';
import { ExtensionInstallOptions, ExtensionResponse } from './extension.types';

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
    returns: string | null;
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
    returns: string;
  };
  'start-power-save-blocker': {
    params: void;
    returns: number;
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
    returns: GoosedStartResponse;
  };
  'goose:stop': {
    params: number;
    returns: GoosedStopResponse;
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