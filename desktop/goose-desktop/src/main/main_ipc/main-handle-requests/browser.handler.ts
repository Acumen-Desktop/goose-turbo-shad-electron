import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { IPC } from '../ipc-channels';
import { MetadataResponse, Metadata, IPCMainHandler } from '../types';
import log from '../../../utils/logger';
import * as cheerio from 'cheerio';

function isValidUrl(urlString: string): boolean {
  try {
    // Add protocol if missing
    if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
      urlString = 'https://' + urlString;
    }
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
}

function formatUrl(urlString: string): string {
  if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
    return 'https://' + urlString;
  }
  return urlString;
}

async function extractMetadata(html: string, baseUrl: string): Promise<Metadata> {
  const $ = cheerio.load(html);

  // Extract title
  const title =
    $('title').text() ||
    $('meta[property="og:title"]').attr('content');

  // Extract description
  const description =
    $('meta[name="description"]').attr('content') ||
    $('meta[property="og:description"]').attr('content');

  // Extract favicon
  const faviconLink =
    $('link[rel="icon"]').attr('href') ||
    $('link[rel="shortcut icon"]').attr('href') ||
    $('link[rel="apple-touch-icon"]').attr('href') ||
    $('link[rel="apple-touch-icon-precomposed"]').attr('href');

  let favicon = faviconLink;
  if (favicon) {
    try {
      favicon = new URL(favicon, baseUrl).toString();
    } catch (e) {
      favicon = new URL('/favicon.ico', baseUrl).toString();
    }
  } else {
    // Fallback to /favicon.ico
    favicon = new URL('/favicon.ico', baseUrl).toString();
  }

  // Extract OpenGraph image
  let image = $('meta[property="og:image"]').attr('content');
  if (image) {
    try {
      image = new URL(image, baseUrl).toString();
    } catch (e) {
      image = undefined;
    }
  }

  return {
    title: title || baseUrl,
    description,
    favicon,
    image,
    url: baseUrl,
  };
}

const handleFetchMetadata: IPCMainHandler<string, MetadataResponse> = async (event, url) => {
  try {
    if (!isValidUrl(url)) {
      throw new Error('Invalid URL format');
    }

    const formattedUrl = formatUrl(url);
    const response = await fetch(formattedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Goose/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const metadata = await extractMetadata(html, formattedUrl);

    return { 
      success: true, 
      metadata 
    };
  } catch (error) {
    log.error('Error fetching metadata:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      metadata: {
        title: url,
        url
      }
    };
  }
};

const handleOpenInChrome: IPCMainHandler<string, void> = async (event, url) => {
  if (!isValidUrl(url)) {
    throw new Error('Invalid URL parameter');
  }
  // Implementation handled by the system's default handler
};

export function registerBrowserHandlers(): () => void {
  // Register handlers
  ipcMain.handle(IPC.BROWSER.FETCH_METADATA, handleFetchMetadata);
  ipcMain.handle(IPC.BROWSER.OPEN_CHROME, handleOpenInChrome);

  // Return cleanup function
  return () => {
    ipcMain.removeHandler(IPC.BROWSER.FETCH_METADATA);
    ipcMain.removeHandler(IPC.BROWSER.OPEN_CHROME);
  };
}
