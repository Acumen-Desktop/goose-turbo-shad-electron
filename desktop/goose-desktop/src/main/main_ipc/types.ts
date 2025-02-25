export interface NotificationData {
  title: string;
  body: string;
}

export interface ChatWindowOptions {
  query?: string;
  dir?: string;
  version?: string;
}

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
