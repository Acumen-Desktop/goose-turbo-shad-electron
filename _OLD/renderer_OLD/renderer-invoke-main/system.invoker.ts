import { ipcRenderer } from 'electron';
import { IPC } from '../../ipc-channels';

export async function checkOllama(): Promise<boolean> {
  return await ipcRenderer.invoke(IPC.SYSTEM.CHECK_OLLAMA);
}

export async function startPowerSaveBlocker(): Promise<boolean> {
  return await ipcRenderer.invoke(IPC.SYSTEM.POWER_SAVE.START);
}

export async function stopPowerSaveBlocker(): Promise<boolean> {
  return await ipcRenderer.invoke(IPC.SYSTEM.POWER_SAVE.STOP);
}

export async function getBinaryPath(binaryName: string): Promise<string> {
  return await ipcRenderer.invoke(IPC.SYSTEM.GET_BINARY_PATH, binaryName);
}

export async function selectFileOrDirectory(): Promise<string | null> {
  return await ipcRenderer.invoke(IPC.FILE_SYSTEM.SELECT);
}

export async function fetchMetadata(url: string): Promise<string> {
  return await ipcRenderer.invoke(IPC.BROWSER.FETCH_METADATA, url);
}
