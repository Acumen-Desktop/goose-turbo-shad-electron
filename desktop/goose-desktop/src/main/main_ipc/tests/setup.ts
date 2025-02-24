import { registerPingListener } from './main-event-listeners/ping.listener';

export function setupTestHandlers(): () => void {
  // Register ping-pong test
  registerPingListener();

  // Return cleanup function
  return () => {
    // No cleanup needed for now
  };
}
