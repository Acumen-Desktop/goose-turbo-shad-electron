import './index.css';

// Get button elements
const pingButton = document.getElementById('pingButton') as HTMLButtonElement;
const responseDiv = document.getElementById('response') as HTMLDivElement;
const startGoosedButton = document.getElementById('startGoosed') as HTMLButtonElement;
const stopGoosedButton = document.getElementById('stopGoosed') as HTMLButtonElement;
const checkGoosedButton = document.getElementById('checkGoosed') as HTMLButtonElement;
const goosedStatusDiv = document.getElementById('goosed-status') as HTMLDivElement;

// Add click handler for ping button
pingButton?.addEventListener('click', () => {
  const timestamp = new Date().toISOString();
  responseDiv.innerHTML = `[${timestamp}] Sending ping...\n`;
  window.testApi.sendPing().then((response) => {
    responseDiv.innerHTML += `[${response.timestamp}] Received: ${response.message}\n`;;
  }).catch((error) => {
    responseDiv.innerHTML += `[${new Date().toISOString()}] Error: ${error}\n`;
  });
});



// Track the current Goosed port
let currentGoosedPort: number | null = null;

// Function to update status display with timestamp
function updateStatus(message: string, append: boolean = false) {
  const timestamp = new Date().toISOString();
  if (append) {
    goosedStatusDiv.innerHTML += `[${timestamp}] ${message}\n`;
  } else {
    goosedStatusDiv.innerHTML = `[${timestamp}] ${message}\n`;
  }
}

// Function to update button states based on goosed running status
function updateButtonStates(isRunning: boolean) {
  startGoosedButton.disabled = isRunning;
  stopGoosedButton.disabled = !isRunning;
}

// Function to handle Goosed status updates
async function checkGoosedStatus(showMessage: boolean = true) {
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
      updateStatus(`Error checking status: ${error}`, true);
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
    updateStatus(`Error: ${error}`, true);
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
    updateStatus(`Error: ${error}`, true);
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
    updateStatus(`Error: ${error}`, true);
  }
});

// Check initial status
window.electronApi.checkGoosed().then((status) => {
  if (status.isRunning) {
    updateStatus(`Goosed is running on port ${status.port}`, true);
    currentGoosedPort = status.port;
  } else {
    updateStatus('Goosed is not running', true);
    currentGoosedPort = null;
  }
  updateButtonStates(status.isRunning);
}).catch((error) => {
  console.error('Failed to check initial goosed status:', error);
  updateStatus(`Error checking status: ${error}`, true);
  updateButtonStates(false);
});


console.warn('👋 This message is being logged by "renderer.ts", included via Vite');
