export interface NotificationData {
  title: string;
  body: string;
}

export interface ChatWindowOptions {
  query?: string;
  dir?: string;
  version?: string;
}

export interface MetadataResponse {
  success: boolean;
  data?: string;
  error?: string;
}
