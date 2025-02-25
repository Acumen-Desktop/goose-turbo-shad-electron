// File system related types
export interface DirectoryChooserOptions {
  replace: string;
}

export interface FileSystemResponse {
  path: string;
  error?: string;
}

// Type guards
export const isDirectoryChooserOptions = (data: any): data is DirectoryChooserOptions => {
  return typeof data === 'object' && data !== null &&
    typeof data.replace === 'string';
};

export const isFileSystemResponse = (data: any): data is FileSystemResponse => {
  return typeof data === 'object' && data !== null &&
    typeof data.path === 'string' &&
    (data.error === undefined || typeof data.error === 'string');
};