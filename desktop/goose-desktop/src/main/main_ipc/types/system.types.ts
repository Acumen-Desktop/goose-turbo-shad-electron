// System related types
export interface GoosedStatus {
  isRunning: boolean;
  port?: number;
  error?: string;
}

// Response types for Goosed operations
export type GoosedStartResponse = {
  port?: number;
  error?: string;
};

export type GoosedStopResponse = {
  isRunning: boolean;
  error?: string;
};

export type GoosedCheckResponse = {
  isRunning: boolean;
  port?: number;
};

export interface BinaryPathResponse {
  path: string;
  error?: string;
}

export interface PowerSaveBlockerResponse {
  id: number;
  error?: string;
}

// Type guards
export const isGoosedStatus = (data: any): data is GoosedStatus => {
  return typeof data === 'object' && data !== null &&
    typeof data.isRunning === 'boolean' &&
    (data.port === undefined || typeof data.port === 'number') &&
    (data.error === undefined || typeof data.error === 'string');
};

export const isGoosedStartResponse = (data: any): data is GoosedStartResponse => {
  return typeof data === 'object' && data !== null &&
    (data.port === undefined || typeof data.port === 'number') &&
    (data.error === undefined || typeof data.error === 'string');
};

export const isGoosedStopResponse = (data: any): data is GoosedStopResponse => {
  return typeof data === 'object' && data !== null &&
    typeof data.isRunning === 'boolean' &&
    (data.error === undefined || typeof data.error === 'string');
};

export const isGoosedCheckResponse = (data: any): data is GoosedCheckResponse => {
  return typeof data === 'object' && data !== null &&
    typeof data.isRunning === 'boolean' &&
    (data.port === undefined || typeof data.port === 'number');
};

export const isBinaryPathResponse = (data: any): data is BinaryPathResponse => {
  return typeof data === 'object' && data !== null &&
    typeof data.path === 'string' &&
    (data.error === undefined || typeof data.error === 'string');
};

export const isPowerSaveBlockerResponse = (data: any): data is PowerSaveBlockerResponse => {
  return typeof data === 'object' && data !== null &&
    typeof data.id === 'number' &&
    (data.error === undefined || typeof data.error === 'string');
};