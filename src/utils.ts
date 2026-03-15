import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import type { InstallConfig } from './config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const TEMPLATES_DIR: string = path.join(__dirname, '..', 'templates');

export function getTargetDir(config: Pick<InstallConfig, 'scope'>): string {
  if (config.scope === 'global') {
    return path.join(process.env.HOME || '', '.claude');
  }
  return path.join(process.cwd(), '.claude');
}

export function getPluginDir(config: Pick<InstallConfig, 'scope'>): string {
  if (config.scope === 'global') {
    return path.join(process.env.HOME || '', '.claude-plugin');
  }
  return path.join(process.cwd(), '.claude-plugin');
}

export function getClaudeMdPath(config: Pick<InstallConfig, 'scope'>): string {
  if (config.scope === 'global') {
    return path.join(process.env.HOME || '', 'CLAUDE.md');
  }
  return path.join(process.cwd(), 'CLAUDE.md');
}

export async function backupIfExists(filePath: string): Promise<string | null> {
  if (await fs.pathExists(filePath)) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${filePath}.backup-${timestamp}`;
    await fs.copy(filePath, backupPath);
    return backupPath;
  }
  return null;
}

export async function detectLaravel(): Promise<boolean> {
  try {
    const composerPath = path.join(process.cwd(), 'composer.json');
    if (await fs.pathExists(composerPath)) {
      const composer = await fs.readJson(composerPath);
      return !!(composer.require?.['laravel/framework'] || composer['require-dev']?.['laravel/framework']);
    }
  } catch {
    // ignore parse errors
  }
  return false;
}

export async function mergeClaudeMd(existingPath: string, newContent: string): Promise<string> {
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
