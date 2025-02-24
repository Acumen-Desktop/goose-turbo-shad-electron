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
  },
  TEST: {
    PING: 'test:ping',
  },
} as const;

// Type-safe channel names
export type IPCChannel = typeof IPC[keyof typeof IPC][keyof typeof IPC[keyof typeof IPC]];
