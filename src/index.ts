export { install } from './installer';
export { runWizard } from './wizard';
export { checkForUpdates, saveConfig, loadConfig } from './updater';
export { SKILLS, AGENTS, COMMANDS, MEMORY_FILES, SKILL_CATEGORIES } from './config';
export type { Skill, Agent, Command, InstallConfig, SkillCategory } from './config';
export { checkRequirements } from './requirements';
export { installPlugin, listPlugins, removePlugin, searchPlugins } from './plugins';
export type { NpmSearchResult } from './plugins';
export type { PluginManifest, InstalledPlugin, PluginRegistry } from './plugin-registry';
