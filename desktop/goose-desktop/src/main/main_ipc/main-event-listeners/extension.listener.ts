import { ipcMain, IpcMainEvent } from 'electron';
import { IPC } from '../ipc-channels';
import { IPCMainListener, ExtensionInstallOptions } from '../types';
import log from '../../../utils/logger';

function isValidExtensionUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    // Add any specific extension URL validation if needed
    return true;
  } catch (e) {
    return false;
  }
}

const handleExtensionInstall: IPCMainListener<ExtensionInstallOptions> = (
  event: IpcMainEvent,
  { url, name }: ExtensionInstallOptions
) => {
  try {
    if (!url?.trim()) {
      throw new Error('Empty extension URL received');
    }

    if (!isValidExtensionUrl(url)) {
      throw new Error('Invalid extension URL format');
    }

    const mockEvent = {
      preventDefault: () => {
        log.info('Default handling prevented for extension URL');
      },
    };

    // Re-emit as an open-url event which is handled by the app
    event.sender.send('open-url', mockEvent, url);

    log.info(`Extension installation initiated for: ${name || url}`);
  } catch (error) {
    log.error('Error handling extension installation:', error);
    event.sender.send('extension-install-error', {
      url,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export function registerExtensionListeners(): () => void {
  // Register listeners
  ipcMain.on(IPC.EXTENSION.INSTALL_URL, handleExtensionInstall);

  // Return cleanup function
  return () => {
    ipcMain.removeListener(IPC.EXTENSION.INSTALL_URL, handleExtensionInstall);
  };
}
