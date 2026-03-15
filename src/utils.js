import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

export function getTargetDir(config) {
  if (config.scope === 'global') {
    return path.join(process.env.HOME, '.claude');
  }
  return path.join(process.cwd(), '.claude');
}

export function getPluginDir(config) {
  if (config.scope === 'global') {
    return path.join(process.env.HOME, '.claude-plugin');
  }
  return path.join(process.cwd(), '.claude-plugin');
}

export function getClaudeMdPath(config) {
  if (config.scope === 'global') {
    return path.join(process.env.HOME, 'CLAUDE.md');
  }
  return path.join(process.cwd(), 'CLAUDE.md');
}

export async function backupIfExists(filePath) {
  if (await fs.pathExists(filePath)) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${filePath}.backup-${timestamp}`;
    await fs.copy(filePath, backupPath);
    return backupPath;
  }
  return null;
}

export async function mergeClaudeMd(existingPath, newContent) {
  const START_MARKER = '<!-- TOOLKIT START -->';
  const END_MARKER = '<!-- TOOLKIT END -->';

  if (await fs.pathExists(existingPath)) {
    let existing = await fs.readFile(existingPath, 'utf8');

    const startIdx = existing.indexOf(START_MARKER);
    const endIdx = existing.indexOf(END_MARKER);

    if (startIdx !== -1 && endIdx !== -1) {
      existing = existing.substring(0, startIdx) + existing.substring(endIdx + END_MARKER.length);
    }

    return existing.trimEnd() + '\n\n' + START_MARKER + '\n' + newContent + '\n' + END_MARKER + '\n';
  }

  return START_MARKER + '\n' + newContent + '\n' + END_MARKER + '\n';
}

