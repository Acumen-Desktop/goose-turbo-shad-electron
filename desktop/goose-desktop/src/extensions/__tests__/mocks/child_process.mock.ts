import { EventEmitter } from 'events';
import { vi } from 'vitest';

export class MockChildProcess extends EventEmitter {
  stdin: { write: ReturnType<typeof vi.fn> };
  stderr: EventEmitter;
  kill: ReturnType<typeof vi.fn>;

  constructor() {
    super();
    // Increase max listeners to prevent warnings
    this.setMaxListeners(20);
    
    this.stdin = {
      write: vi.fn()
    };
    this.stderr = new EventEmitter();
    this.stderr.setMaxListeners(20);
    this.kill = vi.fn();
  }

  // Helper to clean up event listeners
  cleanup() {
    this.removeAllListeners();
    this.stderr.removeAllListeners();
  }
}

// Create a factory function to get fresh instances
export const createMockProcess = () => new MockChildProcess();
export const mockSpawn = vi.fn().mockImplementation(createMockProcess);

vi.mock('child_process', () => ({
  spawn: mockSpawn
}));