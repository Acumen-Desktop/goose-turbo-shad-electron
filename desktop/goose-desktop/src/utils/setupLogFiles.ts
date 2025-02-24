import fs from 'fs';
import path from 'path';

const setupLogFiles = (port: number, dir: string) => {
  const logDir = path.join(__dirname, '../../../logs');
  
  // Create logs directory if it doesn't exist
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // Create log file streams with timestamp and port in filename
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const stdoutStream = fs.createWriteStream(
    path.join(logDir, `goosed-stdout-${port}-${timestamp}.log`),
    { flags: 'a' }
  );
  const stderrStream = fs.createWriteStream(
    path.join(logDir, `goosed-stderr-${port}-${timestamp}.log`),
    { flags: 'a' }
  );

  return { stdoutStream, stderrStream };
};

export default setupLogFiles;
