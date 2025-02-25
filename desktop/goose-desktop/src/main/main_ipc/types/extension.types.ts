// Extension related types
export interface ExtensionInstallOptions {
  url: string;
  name?: string;
}

export interface ExtensionResponse {
  success: boolean;
  error?: string;
}

// Type guards
export const isExtensionInstallOptions = (data: any): data is ExtensionInstallOptions => {
  return typeof data === 'object' && data !== null &&
    typeof data.url === 'string' &&
    (data.name === undefined || typeof data.name === 'string');
};

export const isExtensionResponse = (data: any): data is ExtensionResponse => {
  return typeof data === 'object' && data !== null &&
    typeof data.success === 'boolean' &&
    (data.error === undefined || typeof data.error === 'string');
};