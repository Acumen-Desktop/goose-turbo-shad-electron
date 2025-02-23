import { ipcRenderer } from 'electron';
import { IPC } from '../../shared/ipc-channels';

type ErrorCallback = (error: string) => void;
type ExtensionCallback = (url: string) => void;

export function onFatalError(callback: ErrorCallback): () => void {
  const handler = (_: any, error: string) => callback(error);
  ipcRenderer.on(IPC.NOTIFICATION.FATAL_ERROR, handler);
  return () => ipcRenderer.off(IPC.NOTIFICATION.FATAL_ERROR, handler);
}

export function onExtensionAdd(callback: ExtensionCallback): () => void {
  const handler = (_: any, url: string) => callback(url);
  ipcRenderer.on(IPC.EXTENSION.ADD, handler);
  return () => ipcRenderer.off(IPC.EXTENSION.ADD, handler);
}
