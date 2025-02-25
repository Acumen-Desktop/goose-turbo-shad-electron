import { IpcMainEvent, IpcMainInvokeEvent, IpcRendererEvent } from 'electron';

// Base IPC types
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

// Window specific types
export interface NotificationData {
  title: string;
  body: string;
}

export interface ChatWindowOptions {
  query?: string;
  dir?: string;
  version?: string;
}

// Type guards
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