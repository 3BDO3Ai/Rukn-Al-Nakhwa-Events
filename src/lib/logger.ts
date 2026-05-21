import { promises as fs } from 'fs';
import path from 'path';

export async function logAdminAction(action: string, details: string) {
  try {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [ADMIN ACTION: ${action}] ${details}\n`;
    const logFilePath = path.join(process.cwd(), 'admin-activity.log');
    
    await fs.appendFile(logFilePath, logEntry, 'utf8');
    console.log(logEntry.trim());
  } catch (error) {
    console.error('Failed to write to admin-activity.log:', error);
  }
}
