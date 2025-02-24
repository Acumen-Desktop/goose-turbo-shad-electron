import { contextBridge } from 'electron';
import { sendPing } from './renderer-send-messages/ping.sender';
import { onPong } from './renderer-event-listeners/pong.listener';

// Expose test IPC functions to renderer
contextBridge.exposeInMainWorld('electron', {
  // Ping-pong test
  ping: sendPing,
  onPong: onPong,
});
