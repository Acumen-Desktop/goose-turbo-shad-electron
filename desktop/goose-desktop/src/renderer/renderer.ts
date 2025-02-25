import './index.css';
import type { IpcRendererEvent } from 'electron';

// Get button elements
const pingButton = document.getElementById('pingButton') as HTMLButtonElement;
const responseDiv = document.getElementById('response') as HTMLDivElement;
const startGoosedButton = document.getElementById('startGoosed') as HTMLButtonElement;
const stopGoosedButton = document.getElementById('stopGoosed') as HTMLButtonElement;
const checkGoosedButton = document.getElementById('checkGoosed') as HTMLButtonElement;
const goosedStatusDiv = document.getElementById('goosed-status') as HTMLDivElement;

// Get file system elements
const selectFileOrDirButton = document.getElementById('selectFileOrDir') as HTMLButtonElement;
const selectDirButton = document.getElementById('selectDir') as HTMLButtonElement;
const fileSystemResultDiv = document.getElementById('file-system-result') as HTMLDivElement;

// Get metadata elements
const urlInput = document.getElementById('urlInput') as HTMLInputElement;
const fetchMetadataButton = document.getElementById('fetchMetadata') as HTMLButtonElement;
const metadataResultDiv = document.getElementById('metadata-result') as HTMLDivElement;

// Add click handler for ping button
pingButton?.addEventListener('click', () => {
  const timestamp = new Date().toISOString();
  responseDiv.innerHTML = `[${timestamp}] Sending ping...\n`;
  window.testApi.sendPing().then((response: { timestamp: string; message: string }) => {
    responseDiv.innerHTML += `[${response.timestamp}] Received: ${response.message}\n`;
  }).catch((error: Error) => {
    responseDiv.innerHTML += `[${new Date().toISOString()}] Error: ${error}\n`;
  });
});

// Function to update file system result with timestamp
function updateFileSystemResult(message: string, append: boolean = false): void {
  const timestamp = new Date().toISOString();
  if (append) {
    fileSystemResultDiv.innerHTML += `[${timestamp}] ${message}\n`;
  } else {
    fileSystemResultDiv.innerHTML = `[${timestamp}] ${message}\n`;
  }
}

// Add click handler for select file/directory button
selectFileOrDirButton?.addEventListener('click', async () => {
  updateFileSystemResult('Opening file/directory selector...');
  try {
    const path = await window.electronApi.selectFileOrDirectory();
    if (path) {
      updateFileSystemResult(`Selected: ${path}`, true);
    } else {
      updateFileSystemResult('Selection cancelled', true);
    }
  } catch (error) {
    updateFileSystemResult(`Error: ${error instanceof Error ? error.message : String(error)}`, true);
  }
});

// Add click handler for select directory button
selectDirButton?.addEventListener('click', async () => {
  updateFileSystemResult('Opening directory selector...');
  try {
    const path = await window.electronApi.directoryChooser();
    if (path) {
      updateFileSystemResult(`Selected directory: ${path}`, true);
    } else {
      updateFileSystemResult('Selection cancelled', true);
    }
  } catch (error) {
    updateFileSystemResult(`Error: ${error instanceof Error ? error.message : String(error)}`, true);
  }
});

// Function to format metadata for display
function formatMetadata(metadata: { title?: string; description?: string; favicon?: string; image?: string; url: string }): string {
  const lines = [
    `Title: ${metadata.title || 'N/A'}`,
    `Description: ${metadata.description || 'N/A'}`,
    `Favicon: ${metadata.favicon || 'N/A'}`,
    `Image: ${metadata.image || 'N/A'}`,
    `URL: ${metadata.url}`
  ];
  return lines.join('\n');
}

// Function to update metadata result with timestamp
function updateMetadataResult(message: string, append: boolean = false): void {
  const timestamp = new Date().toISOString();
  if (append) {
    metadataResultDiv.innerHTML += `[${timestamp}] ${message}\n`;
  } else {
    metadataResultDiv.innerHTML = `[${timestamp}] ${message}\n`;
  }
}

// Add click handler for fetch metadata button
fetchMetadataButton?.addEventListener('click', async () => {
  const url = urlInput.value.trim();
  if (!url) {
    updateMetadataResult('Please enter a URL');
    return;
  }

  updateMetadataResult('Fetching metadata...');
  try {
    const result = await window.electronApi.fetchMetadata(url);
    if (result.success && result.metadata) {
      updateMetadataResult(`Success!\n${formatMetadata(result.metadata)}`, true);
    } else {
      updateMetadataResult(`Error: ${result.error}`, true);
    }
  } catch (error) {
    updateMetadataResult(`Error: ${error instanceof Error ? error.message : String(error)}`, true);
  }
});

// Track the current Goosed port
let currentGoosedPort: number | null = null;

// Function to update status display with timestamp
function updateStatus(message: string, append: boolean = false): void {
  const timestamp = new Date().toISOString();
  if (append) {
    goosedStatusDiv.innerHTML += `[${timestamp}] ${message}\n`;
  } else {
    goosedStatusDiv.innerHTML = `[${timestamp}] ${message}\n`;
  }
}

// Function to update button states based on goosed running status
function updateButtonStates(isRunning: boolean): void {
  startGoosedButton.disabled = isRunning;
  stopGoosedButton.disabled = !isRunning;
}

interface GoosedStatus {
  isRunning: boolean;
  port?: number;
}

// Function to handle Goosed status updates
async function checkGoosedStatus(showMessage: boolean = true): Promise<GoosedStatus> {
  try {
    if (showMessage) {
      updateStatus('Checking Goosed status...');
    }
    const result = await window.electronApi.checkGoosed();
    if (result.isRunning) {
      currentGoosedPort = result.port;
      if (showMessage) {
        updateStatus(`Goosed is running on port ${result.port}`, true);
      }
    } else {
      currentGoosedPort = null;
      if (showMessage) {
        updateStatus('Goosed is not running', true);
      }
    }
    updateButtonStates(result.isRunning);
    return result;
  } catch (error) {
    if (showMessage) {
      updateStatus(`Error checking status: ${error instanceof Error ? error.message : String(error)}`, true);
    }
    updateButtonStates(false);
    return { isRunning: false };
  }
}

// Add click handler for start goosed button
startGoosedButton?.addEventListener('click', async () => {
  updateStatus('Starting Goosed...');
  
  try {
    await window.electronApi.startPowerSaveBlocker();
    const result = await window.electronApi.startGoosed();
    if (result.error) {
      updateStatus(`Error: ${result.error}`, true);
      currentGoosedPort = null;
    } else {
      currentGoosedPort = result.port;
      updateStatus(`Goosed running on port ${result.port}`, true);
    }
    updateButtonStates(!result.error);
    // Check status after starting to ensure everything is running
    await checkGoosedStatus(false);
  } catch (error) {
    updateStatus(`Error: ${error instanceof Error ? error.message : String(error)}`, true);
    updateButtonStates(false);
  }
});

// Add click handler for stop goosed button
stopGoosedButton?.addEventListener('click', async () => {
  updateStatus('Stopping Goosed...');
  
  try {
    await window.electronApi.stopPowerSaveBlocker();
    if (!currentGoosedPort) {
      updateStatus('Error: No active Goosed server to stop', true);
      return;
    }
    const result = await window.electronApi.stopGoosed(currentGoosedPort);
    if (result.error) {
      updateStatus(`Error: ${result.error}`, true);
    } else {
      updateStatus(`Goosed stopped on port ${currentGoosedPort}`, true);
      currentGoosedPort = null;
    }
    updateButtonStates(result.isRunning);
    // Verify the status after stopping
    await checkGoosedStatus(false);
  } catch (error) {
    updateStatus(`Error: ${error instanceof Error ? error.message : String(error)}`, true);
    updateButtonStates(false);
  }
});

// Add click handler for check goosed button
checkGoosedButton?.addEventListener('click', async () => {
  updateStatus('Checking goosed status...');
  
  try {
    const result = await window.electronApi.checkGoosed();
    if (result.isRunning) {
      updateStatus(`Goosed is running on port ${result.port}`, true);
    } else {
      updateStatus('Goosed is not running', true);
    }
    updateButtonStates(result.isRunning);
  } catch (error) {
    updateStatus(`Error: ${error instanceof Error ? error.message : String(error)}`, true);
  }
});

// Check initial status
setTimeout(() => {
  window.electronApi.checkGoosed().then((status: GoosedStatus) => {
    if (status.isRunning) {
      updateStatus(`Goosed is running on port ${status.port}`, true);
      currentGoosedPort = status.port;
    } else {
      updateStatus('Goosed is not running', true);
      currentGoosedPort = null;
    }
    updateButtonStates(status.isRunning);
  }).catch((error: Error) => {
    console.error('Failed to check initial goosed status:', error);
    updateStatus(`Error checking status: ${error.message}`, true);
    updateButtonStates(false);
  });
}, 3000);

console.warn('👋 This message is being logged by "renderer.ts", included via Vite');
