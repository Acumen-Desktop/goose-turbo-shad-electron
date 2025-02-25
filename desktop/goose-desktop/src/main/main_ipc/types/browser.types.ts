// Browser related types
export interface Metadata {
  title?: string;
  description?: string;
  favicon?: string;
  image?: string;
  url: string;
}

export interface MetadataResponse {
  success: boolean;
  metadata?: Metadata;
  error?: string;
}

// Type guard
export const isMetadata = (data: any): data is Metadata => {
  return typeof data === 'object' && data !== null &&
    typeof data.url === 'string' &&
    (data.title === undefined || typeof data.title === 'string') &&
    (data.description === undefined || typeof data.description === 'string') &&
    (data.favicon === undefined || typeof data.favicon === 'string') &&
    (data.image === undefined || typeof data.image === 'string');
};