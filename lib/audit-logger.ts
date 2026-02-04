/**
 * Audit Logger - Track all access to the code explorer
 */

import { promises as fs } from 'fs';
import path from 'path';

interface AuditLogEntry {
  timestamp: string;
  eventType: 'auth' | 'browse' | 'view' | 'search';
  sessionId: string;
  ip: string;
  success: boolean;
  details: {
    path?: string;
    query?: string;
    error?: string;
    passwordAttempt?: boolean;
  };
}

// In-memory log buffer (flushes to disk periodically)
const logBuffer: AuditLogEntry[] = [];
const LOG_FILE_PATH = path.join(process.cwd(), 'data', 'audit-logs.json');
const BUFFER_SIZE = 50; // Flush after 50 entries
const FLUSH_INTERVAL = 5 * 60 * 1000; // Flush every 5 minutes

/**
 * Ensure the data directory exists
 */
async function ensureDataDirectory(): Promise<void> {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

/**
 * Flush log buffer to disk
 */
async function flushLogs(): Promise<void> {
  if (logBuffer.length === 0) {
    return;
  }

  try {
    await ensureDataDirectory();

    // Read existing logs
    let existingLogs: AuditLogEntry[] = [];
    try {
      const fileContent = await fs.readFile(LOG_FILE_PATH, 'utf-8');
      existingLogs = JSON.parse(fileContent);
    } catch (error) {
      // File doesn't exist yet, that's okay
    }

    // Append new logs
    const allLogs = [...existingLogs, ...logBuffer];

    // Keep only last 1000 entries to prevent file from growing too large
    const logsToKeep = allLogs.slice(-1000);

    // Write to disk
    await fs.writeFile(LOG_FILE_PATH, JSON.stringify(logsToKeep, null, 2), 'utf-8');

    // Clear buffer
    logBuffer.length = 0;
  } catch (error) {
    console.error('Error flushing audit logs:', error);
  }
}

// Flush logs periodically
setInterval(flushLogs, FLUSH_INTERVAL);

// Flush logs on process exit
if (typeof process !== 'undefined') {
  process.on('beforeExit', () => {
    flushLogs().catch(console.error);
  });
}

/**
 * Log an audit event
 */
export async function logAuditEvent(
  eventType: AuditLogEntry['eventType'],
  sessionId: string,
  ip: string,
  success: boolean,
  details: AuditLogEntry['details'] = {},
): Promise<void> {
  const entry: AuditLogEntry = {
    timestamp: new Date().toISOString(),
    eventType,
    sessionId,
    ip,
    success,
    details,
  };

  logBuffer.push(entry);

  // Flush if buffer is full
  if (logBuffer.length >= BUFFER_SIZE) {
    await flushLogs();
  }
}

/**
 * Log authentication attempt
 */
export async function logAuthAttempt(
  sessionId: string,
  ip: string,
  success: boolean,
): Promise<void> {
  await logAuditEvent('auth', sessionId, ip, success, {
    passwordAttempt: true,
  });
}

/**
 * Log directory browse
 */
export async function logBrowse(
  sessionId: string,
  ip: string,
  dirPath: string,
  success: boolean,
  error?: string,
): Promise<void> {
  await logAuditEvent('browse', sessionId, ip, success, {
    path: dirPath,
    error,
  });
}

/**
 * Log file view
 */
export async function logFileView(
  sessionId: string,
  ip: string,
  filePath: string,
  success: boolean,
  error?: string,
): Promise<void> {
  await logAuditEvent('view', sessionId, ip, success, {
    path: filePath,
    error,
  });
}

/**
 * Log search query
 */
export async function logSearch(
  sessionId: string,
  ip: string,
  query: string,
  success: boolean,
  error?: string,
): Promise<void> {
  await logAuditEvent('search', sessionId, ip, success, {
    query,
    error,
  });
}

/**
 * Get recent audit logs (for admin view)
 */
export async function getRecentLogs(limit: number = 100): Promise<AuditLogEntry[]> {
  try {
    const fileContent = await fs.readFile(LOG_FILE_PATH, 'utf-8');
    const logs: AuditLogEntry[] = JSON.parse(fileContent);
    return logs.slice(-limit).reverse(); // Most recent first
  } catch (error) {
    console.error('Error reading audit logs:', error);
    return [];
  }
}
