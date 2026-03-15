import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import ora from 'ora';
import chalk from 'chalk';
import type { InstallConfig } from './config';
import {
  getPluginsDir,
  loadRegistry,
  registerPlugin,
  unregisterPlugin,
  getInstalledPlugin,
  validateManifest,
} from './plugin-registry';
import type { PluginManifest, InstalledPlugin } from './plugin-registry';

export interface NpmSearchResult {
  name: string;
  version: string;
  description: string;
}

/**
 * Resolve a plugin from an npm package name or local path.
 * Returns the validated manifest and the resolved path.
 */
export async function resolvePlugin(
  nameOrPath: string,
  local = false,
): Promise<{ manifest: PluginManifest; resolvedPath: string }> {
  if (local || (await fs.pathExists(nameOrPath))) {
    // Local path
    const resolvedPath = path.resolve(nameOrPath);
    const manifestPath = path.join(resolvedPath, 'superkit-plugin.json');
    const manifest = await validateManifest(manifestPath);
    return { manifest, resolvedPath };
  }

  // npm package — pack and extract
  const pluginsDir = getPluginsDir();
  const tmpDir = path.join(pluginsDir, '.tmp-install');
  await fs.ensureDir(tmpDir);

  try {
    execSync(`npm pack ${nameOrPath} --pack-destination "${tmpDir}"`, {
      stdio: 'pipe',
      encoding: 'utf8',
      timeout: 60000,
    });

    // Find the tarball
    const files = await fs.readdir(tmpDir);
    const tarball = files.find(f => f.endsWith('.tgz'));
    if (!tarball) {
      throw new Error(`Failed to download package: ${nameOrPath}`);
    }

    // Extract
    const extractDir = path.join(tmpDir, 'extracted');
    await fs.ensureDir(extractDir);
    execSync(`tar -xzf "${path.join(tmpDir, tarball)}" -C "${extractDir}"`, {
      stdio: 'pipe',
    });

    const packageDir = path.join(extractDir, 'package');
    const manifestPath = path.join(packageDir, 'superkit-plugin.json');
    const manifest = await validateManifest(manifestPath);

    // Move to permanent location
    const finalPath = path.join(pluginsDir, manifest.name);
    await fs.remove(finalPath);
    await fs.move(packageDir, finalPath);

    return { manifest, resolvedPath: finalPath };
  } finally {
    await fs.remove(tmpDir);
  }
}

/**
 * Install a plugin's content (skills, agents, commands) into the target directory.
 */
export async function installPlugin(
  nameOrPath: string,
  config: InstallConfig,
  local = false,
): Promise<void> {
  const spinner = ora();

  spinner.start(`Resolving plugin: ${nameOrPath}...`);
  const { manifest, resolvedPath } = await resolvePlugin(nameOrPath, local);
  spinner.succeed(`Resolved plugin: ${manifest.name}@${manifest.version}`);

  const baseDir = config.format === 'plugin'
    ? path.join(process.cwd(), '.claude-plugin')
    : path.join(process.cwd(), '.claude');

  if (config.scope === 'global') {
    const home = process.env.HOME || '';
    const globalBase = config.format === 'plugin'
      ? path.join(home, '.claude-plugin')
      : path.join(home, '.claude');
    await installPluginContent(manifest, resolvedPath, globalBase, local, spinner);
  } else {
    await installPluginContent(manifest, resolvedPath, baseDir, local, spinner);
  }

  // Register in the plugin registry
  const plugin: InstalledPlugin = {
    name: manifest.name,
    version: manifest.version,
    source: local ? 'local' : 'npm',
    path: resolvedPath,
    manifest,
  };
  await registerPlugin(plugin);

  console.log('');
  console.log(chalk.green(`  Plugin "${manifest.name}" installed successfully.`));

  const skillCount = manifest.skills ? Object.keys(manifest.skills).length : 0;
  const agentCount = manifest.agents ? Object.keys(manifest.agents).length : 0;
  const commandCount = manifest.commands ? Object.keys(manifest.commands).length : 0;

  if (skillCount > 0) console.log(chalk.dim(`    ${skillCount} skill(s)`));
  if (agentCount > 0) console.log(chalk.dim(`    ${agentCount} agent(s)`));
  if (commandCount > 0) console.log(chalk.dim(`    ${commandCount} command(s)`));
  console.log('');
}

async function installPluginContent(
  manifest: PluginManifest,
  sourcePath: string,
  targetBase: string,
  local: boolean,
  spinner: ReturnType<typeof ora>,
): Promise<void> {
  const namespace = `plugins/${manifest.name}`;

  // Install skills
  if (manifest.skills) {
    spinner.start(`Installing ${Object.keys(manifest.skills).length} skills...`);
    for (const [, skill] of Object.entries(manifest.skills)) {
      const src = path.join(sourcePath, skill.path);
      const dest = path.join(targetBase, 'skills', namespace, skill.name);
      if (local) {
        await fs.ensureDir(path.dirname(dest));
        await fs.ensureSymlink(src, dest);
      } else {
        await fs.ensureDir(dest);
        await fs.copy(src, dest);
      }
    }
    spinner.succeed(`${Object.keys(manifest.skills).length} plugin skills installed`);
  }

  // Install agents
  if (manifest.agents) {
    spinner.start(`Installing ${Object.keys(manifest.agents).length} agents...`);
    for (const [, agent] of Object.entries(manifest.agents)) {
      const src = path.join(sourcePath, agent.path);
      const dest = path.join(targetBase, 'agents', `${manifest.name}-${agent.name}.md`);
      if (local) {
        await fs.ensureDir(path.dirname(dest));
        await fs.ensureSymlink(src, dest);
      } else {
        await fs.ensureDir(path.dirname(dest));
        await fs.copy(src, dest);
      }
    }
    spinner.succeed(`${Object.keys(manifest.agents).length} plugin agents installed`);
  }

  // Install commands
  if (manifest.commands) {
    spinner.start(`Installing ${Object.keys(manifest.commands).length} commands...`);
    for (const [, cmd] of Object.entries(manifest.commands)) {
      const src = path.join(sourcePath, cmd.path);
      const dest = path.join(targetBase, 'commands', `${manifest.name}-${cmd.name}.md`);
      if (local) {
        await fs.ensureDir(path.dirname(dest));
        await fs.ensureSymlink(src, dest);
      } else {
        await fs.ensureDir(path.dirname(dest));
        await fs.copy(src, dest);
      }
    }
    spinner.succeed(`${Object.keys(manifest.commands).length} plugin commands installed`);
  }
}

/**
 * List all installed plugins.
 */
export async function listPlugins(): Promise<InstalledPlugin[]> {
  const registry = await loadRegistry();
  return Object.values(registry.plugins);
}

/**
 * Remove an installed plugin.
 */
export async function removePlugin(name: string, config: InstallConfig): Promise<void> {
  const spinner = ora();
  const plugin = await getInstalledPlugin(name);

  if (!plugin) {
    console.log(chalk.yellow(`  Plugin "${name}" is not installed.`));
    return;
  }

  spinner.start(`Removing plugin: ${name}...`);

  const baseDir = config.scope === 'global'
    ? path.join(process.env.HOME || '', config.format === 'plugin' ? '.claude-plugin' : '.claude')
    : path.join(process.cwd(), config.format === 'plugin' ? '.claude-plugin' : '.claude');

  const namespace = `plugins/${name}`;

  // Remove installed skills
  const skillsDir = path.join(baseDir, 'skills', namespace);
  await fs.remove(skillsDir);

  // Remove installed agents (prefixed with plugin name)
  if (plugin.manifest.agents) {
    for (const [, agent] of Object.entries(plugin.manifest.agents)) {
      const agentPath = path.join(baseDir, 'agents', `${name}-${agent.name}.md`);
      await fs.remove(agentPath);
    }
  }

  // Remove installed commands (prefixed with plugin name)
  if (plugin.manifest.commands) {
    for (const [, cmd] of Object.entries(plugin.manifest.commands)) {
      const cmdPath = path.join(baseDir, 'commands', `${name}-${cmd.name}.md`);
      await fs.remove(cmdPath);
    }
  }

  // Remove from plugins directory if npm-installed
  if (plugin.source === 'npm') {
    const pluginDir = path.join(getPluginsDir(), name);
    await fs.remove(pluginDir);
  }

  await unregisterPlugin(name);
  spinner.succeed(`Plugin "${name}" removed`);
  console.log('');
}

/**
 * Search npm for superkit-agents plugins.
 */
export async function searchPlugins(query?: string): Promise<NpmSearchResult[]> {
  const searchTerm = query
    ? `superkit-plugin ${query}`
    : 'superkit-plugin';

  try {
    const output = execSync(`npm search "${searchTerm}" --json`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 15000,
    });

    const results = JSON.parse(output) as NpmSearchResult[];
    return results.filter(r => r.name.includes('superkit'));
  } catch {
    return [];
  }
}
