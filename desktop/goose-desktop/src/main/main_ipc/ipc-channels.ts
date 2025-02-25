import type { IPCChannelTypes } from './types';
import {
  isMcpToolExecuteParams,
  isMcpToolListParams,
  isMcpExtensionRegisterParams
} from './types/extension.types';

// Type-safe channel names
export const IPC = {
  WINDOW: {
    HIDE: 'hide-window',
    CREATE_CHAT: 'create-chat-window',
  },
  FILE_SYSTEM: {
    CHOOSE_DIRECTORY: 'directory-chooser',
    SELECT: 'select-file-or-directory',
  },
  SYSTEM: {
    RELOAD_APP: 'reload-app',
    CHECK_OLLAMA: 'check-ollama',
    GET_BINARY_PATH: 'get-binary-path',
    POWER_SAVE: {
      START: 'start-power-save-blocker',
      STOP: 'stop-power-save-blocker',
    },
    CHECK_GOOSED: 'goose:status',
    START_GOOSED: 'goose:start',
    STOP_GOOSED: 'goose:stop',
  },
  NOTIFICATION: {
    SHOW: 'notify',
    LOG_INFO: 'logInfo',
    FATAL_ERROR: 'fatal-error',
  },
  BROWSER: {
    OPEN_CHROME: 'open-in-chrome',
    FETCH_METADATA: 'fetch-metadata',
  },
  EXTENSION: {
    ADD: 'add-extension',
    INSTALL_URL: 'install-extension-url',
    MCP: {
      EXECUTE_TOOL: 'mcp:execute-tool',
      LIST_TOOLS: 'mcp:list-tools',
      REGISTER_EXTENSION: 'mcp:register-extension',
      LIST_EXTENSIONS: 'mcp:list-extensions',
    },
  },
  TEST: {
    PING: 'test:ping',
  },
} as const;

// Type helpers
type ValueOf<T> = T[keyof T];
type NestedValueOf<T> = T extends object
  ? ValueOf<{ [K in keyof T]: T[K] extends object ? NestedValueOf<T[K]> : T[K] }>
  : T;

// Extract all possible channel names
export type IPCChannelName = NestedValueOf<typeof IPC>;

// Type guard to check if a string is a valid channel name
export const isValidChannel = (channel: string): channel is IPCChannelName => {
  const allChannels = new Set<string>();
  
  const addChannels = (obj: any) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        allChannels.add(obj[key]);
      } else if (typeof obj[key] === 'object') {
        addChannels(obj[key]);
      }
    }
  };
  
  addChannels(IPC);
  return allChannels.has(channel);
};

// Type-safe parameter and return type helpers
export type IPCParams<T extends IPCChannelName> = T extends keyof IPCChannelTypes 
  ? IPCChannelTypes[T]['params'] 
  : never;

export type IPCReturns<T extends IPCChannelName> = T extends keyof IPCChannelTypes 
  ? IPCChannelTypes[T]['returns'] 
  : never;

// Type-safe channel validation
export const validateChannelParams = <T extends IPCChannelName>(
  channel: T,
  params?: unknown
): params is IPCParams<T> => {
  switch (channel) {
    case IPC.NOTIFICATION.SHOW:
      return params !== undefined && 
        typeof params === 'object' && 
        params !== null &&
        'title' in params &&
        'body' in params;
    
    case IPC.FILE_SYSTEM.CHOOSE_DIRECTORY:
      return params !== undefined && 
        typeof params === 'object' && 
        params !== null &&
        'replace' in params;
    
    case IPC.SYSTEM.STOP_GOOSED:
      return typeof params === 'number';
    
    case IPC.EXTENSION.MCP.EXECUTE_TOOL:
      return isMcpToolExecuteParams(params);
    
    case IPC.EXTENSION.MCP.LIST_TOOLS:
      return params === undefined || isMcpToolListParams(params);
    
    case IPC.EXTENSION.MCP.REGISTER_EXTENSION:
      return isMcpExtensionRegisterParams(params);
    
    case IPC.EXTENSION.MCP.LIST_EXTENSIONS:
      return params === undefined;
    
    // Add more specific validations as needed
    default:
      return true;
  }
};

// Type-safe handler type
export type IPCHandler<T extends IPCChannelName> = (
  channel: T,
  ...args: IPCParams<T> extends void ? [] : [IPCParams<T>]
) => Promise<IPCReturns<T>>;

// Type-safe listener type
export type IPCListener<T extends IPCChannelName> = (
  channel: T,
  ...args: IPCParams<T> extends void ? [] : [IPCParams<T>]
) => void;
