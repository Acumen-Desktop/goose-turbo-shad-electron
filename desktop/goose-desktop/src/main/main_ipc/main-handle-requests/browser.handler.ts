import { ipcMain } from 'electron';
import { IPC } from '../ipc-channels';
import { MetadataResponse } from '../types';
import log from '../../../utils/logger';

export function registerBrowserHandlers(): void {
  ipcMain.handle(IPC.BROWSER.FETCH_METADATA, async (_, url: string): Promise<MetadataResponse> => {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Goose/1.0)',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      return { success: true, data };
    } catch (error) {
      log.error('Error fetching metadata:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  });
}
