#!/usr/bin/env node

import { Command } from 'commander';
import { runWizard } from './wizard';
import { install } from './installer';
import { SKILLS, AGENTS, COMMANDS } from './config';
import type { InstallConfig } from './config';
import chalk from 'chalk';

const program = new Command();

program
  .name('claude-toolkit')
  .description('Set up a complete AI-optimized development environment for Claude Code')
  .version('1.0.0')
  .option('--all', 'Install everything non-interactively')
  .option('--global', 'Install to ~/.claude/ instead of ./.claude/')
  .option('--plugin', 'Install as a .claude-plugin/ plugin')
  .option('--direct', 'Install directly into .claude/ directories')
  .option('--skills <list>', 'Comma-separated list of skills to install')
  .option('--no-hooks', 'Skip hooks installation')
  .option('--no-memory', 'Skip memory structure creation')
  .option('--no-claude-md', 'Skip CLAUDE.md generation')
  .option('--dry-run', 'Show what would be installed without making changes')
  .action(async (options: Record<string, unknown>) => {
    console.log('');
    console.log(chalk.bold.cyan('  superkit-agents'));
    console.log(chalk.dim('  Complete AI-optimized development environment'));
    console.log('');

    let config: InstallConfig | null = null;

    if (options.all) {
      config = {
        scope: options.global ? 'global' : 'project',
        format: options.plugin ? 'plugin' : (options.direct ? 'direct' : 'plugin'),
        skills: Object.keys(SKILLS),
        agents: Object.keys(AGENTS),
        commands: Object.keys(COMMANDS),
        hooks: options.hooks !== false,
        memory: options.memory !== false,
        claudeMd: options.claudeMd !== false,
        dryRun: (options.dryRun as boolean) || false,
      } as InstallConfig;
    } else if (options.skills) {
      const selectedSkills = (options.skills as string).split(',').map((s: string) => s.trim());
      config = {
        scope: options.global ? 'global' : 'project',
        format: options.plugin ? 'plugin' : (options.direct ? 'direct' : 'plugin'),
        skills: selectedSkills,
        agents: Object.keys(AGENTS),
        commands: Object.keys(COMMANDS),
        hooks: options.hooks !== false,
        memory: options.memory !== false,
        claudeMd: options.claudeMd !== false,
        dryRun: (options.dryRun as boolean) || false,
      } as InstallConfig;
    } else {
      config = await runWizard(options as { global?: boolean; dryRun?: boolean });
    }

    if (!config) {
      console.log(chalk.yellow('\n  Setup cancelled.\n'));
      process.exit(0);
    }

    await install(config);
  });

program.parse();
