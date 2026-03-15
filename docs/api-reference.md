# API Reference

superkit-agents exports a programmatic API from `src/index.ts` for use in scripts or other tools.

## Installation

```typescript
import { install } from '@pixelandprocess/superkit-agents';
import type { InstallConfig } from '@pixelandprocess/superkit-agents';
```

## Core Functions

### `install(config: InstallConfig): Promise<void>`

Runs the full installation process.

```typescript
await install({
  scope: 'project',
  format: 'plugin',
  skills: ['planning', 'tdd', 'code-review'],
  agents: ['planner', 'code-reviewer'],
  commands: ['plan', 'tdd', 'review'],
  hooks: true,
  memory: true,
  claudeMd: true,
  dryRun: false,
  laravelBoost: false,
});
```

### `runWizard(options?): Promise<InstallConfig | null>`

Launches the interactive wizard. Returns `null` if the user cancels.

```typescript
const config = await runWizard({ global: false, dryRun: false });
if (config) await install(config);
```

### `checkForUpdates(): Promise<void>`

Checks npm for newer versions and prints upgrade instructions.

### `checkRequirements(): Promise<void>`

Validates system requirements (Node.js, Git, Claude Code CLI). Exits with code 1 if required dependencies are missing.

## Plugin Functions

### `installPlugin(nameOrPath: string, config: InstallConfig, local?: boolean): Promise<void>`

Installs a plugin from npm or a local path.

```typescript
await installPlugin('my-plugin', config);
await installPlugin('./local-plugin', config, true);
```

### `listPlugins(): Promise<InstalledPlugin[]>`

Returns all installed plugins.

### `removePlugin(name: string, config: InstallConfig): Promise<void>`

Removes an installed plugin and cleans up its files.

### `searchPlugins(query?: string): Promise<NpmSearchResult[]>`

Searches npm for superkit-agents plugins.

## Config Exports

### `SKILLS: Record<string, Skill>`

All 64 built-in skill definitions.

### `AGENTS: Record<string, Agent>`

All 20 built-in agent definitions.

### `COMMANDS: Record<string, Command>`

All 31 built-in command definitions.

### `MEMORY_FILES: string[]`

List of memory file names.

### `SKILL_CATEGORIES: Record<SkillCategory, string>`

Human-readable category labels.

## Types

```typescript
interface Skill {
  name: string;
  description: string;
  category: SkillCategory;
}

interface Agent {
  name: string;
  description: string;
}

interface Command {
  name: string;
  skill: string;
  description: string;
}

interface InstallConfig {
  scope: 'project' | 'global';
  format: 'plugin' | 'direct';
  skills: string[];
  agents: string[];
  commands: string[];
  hooks: boolean;
  memory: boolean;
  claudeMd: boolean;
  dryRun: boolean;
  laravelBoost: boolean;
}

interface PluginManifest {
  name: string;
  version: string;
  description: string;
  skills?: Record<string, { name: string; description: string; category?: string; path: string }>;
  agents?: Record<string, { name: string; description: string; path: string }>;
  commands?: Record<string, { name: string; skill: string; description: string; path: string }>;
}

interface InstalledPlugin {
  name: string;
  version: string;
  source: 'npm' | 'local';
  path: string;
  manifest: PluginManifest;
}
```
