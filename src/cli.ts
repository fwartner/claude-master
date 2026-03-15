#!/usr/bin/env node

import { Command } from 'commander';
import { runWizard } from './wizard';
import { install } from './installer';
import { SKILLS, AGENTS, COMMANDS } from './config';
import type { InstallConfig } from './config';
import { checkForUpdates } from './updater';
import chalk from 'chalk';

const MANDATORY_SKILLS = ['self-learning', 'auto-improvement'];

const program = new Command();

program
  .name('superkit-agents')
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
        laravelBoost: false,
      };
    } else if (options.skills) {
      const selectedSkills = (options.skills as string).split(',').map((s: string) => s.trim());
      // Enforce mandatory skills
      for (const mandatory of MANDATORY_SKILLS) {
        if (!selectedSkills.includes(mandatory)) {
          selectedSkills.push(mandatory);
        }
      }
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
        laravelBoost: false,
      };
    } else {
      config = await runWizard(options as { global?: boolean; dryRun?: boolean });
    }

    if (!config) {
      console.log(chalk.yellow('\n  Setup cancelled.\n'));
      process.exit(0);
    }

    await install(config);
  });

program
  .command('update')
  .description('Check for updates and re-install latest version')
  .action(async () => {
    console.log('');
    console.log(chalk.bold.cyan('  superkit-agents update'));
    console.log('');
    await checkForUpdates();
  });

program.parse();
