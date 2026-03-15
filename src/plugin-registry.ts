import fs from 'fs-extra';
import path from 'path';

export interface PluginManifest {
  name: string;
  version: string;
  description: string;
  skills?: Record<string, { name: string; description: string; category?: string; path: string }>;
  agents?: Record<string, { name: string; description: string; path: string }>;
  commands?: Record<string, { name: string; skill: string; description: string; path: string }>;
}

export interface InstalledPlugin {
  name: string;
  version: string;
  source: 'npm' | 'local';
  path: string;
  manifest: PluginManifest;
}

export interface PluginRegistry {
  plugins: Record<string, InstalledPlugin>;
}

const REGISTRY_DIR = path.join(process.env.HOME || '', '.superkit-agents');
const REGISTRY_PATH = path.join(REGISTRY_DIR, 'plugins.json');
const PLUGINS_DIR = path.join(REGISTRY_DIR, 'plugins');

export function getRegistryDir(): string {
  return REGISTRY_DIR;
}

export function getPluginsDir(): string {
  return PLUGINS_DIR;
}

export async function loadRegistry(): Promise<PluginRegistry> {
  try {
    if (await fs.pathExists(REGISTRY_PATH)) {
      return await fs.readJson(REGISTRY_PATH);
    }
  } catch {
    // corrupt registry — start fresh
  }
  return { plugins: {} };
}

export async function saveRegistry(registry: PluginRegistry): Promise<void> {
  await fs.ensureDir(REGISTRY_DIR);
  await fs.writeJson(REGISTRY_PATH, registry, { spaces: 2 });
}

export async function registerPlugin(plugin: InstalledPlugin): Promise<void> {
  const registry = await loadRegistry();
  registry.plugins[plugin.name] = plugin;
  await saveRegistry(registry);
}

export async function unregisterPlugin(name: string): Promise<void> {
  const registry = await loadRegistry();
  delete registry.plugins[name];
  await saveRegistry(registry);
}

export async function getInstalledPlugin(name: string): Promise<InstalledPlugin | null> {
  const registry = await loadRegistry();
  return registry.plugins[name] || null;
}

export async function validateManifest(manifestPath: string): Promise<PluginManifest> {
  if (!(await fs.pathExists(manifestPath))) {
    throw new Error(`Plugin manifest not found: ${manifestPath}`);
  }

  const manifest = await fs.readJson(manifestPath);

  if (!manifest.name || typeof manifest.name !== 'string') {
    throw new Error('Plugin manifest must have a "name" field');
  }
  if (!manifest.version || typeof manifest.version !== 'string') {
    throw new Error('Plugin manifest must have a "version" field');
  }

  return manifest as PluginManifest;
}
