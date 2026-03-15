import fs from 'fs-extra';
import path from 'path';
import ora from 'ora';
import chalk from 'chalk';
import {
  TEMPLATES_DIR,
  getTargetDir,
  getPluginDir,
  getClaudeMdPath,
  backupIfExists,
  mergeClaudeMd,
} from './utils.js';
import { MEMORY_FILES } from './config.js';

export async function install(config) {
  const spinner = ora();
  const installed = { skills: [], agents: [], commands: [], hooks: false, memory: false, claudeMd: false };

  if (config.dryRun) {
    console.log(chalk.yellow('\n  DRY RUN — no files will be written.\n'));
  }

  const baseDir = config.format === 'plugin'
    ? getPluginDir(config)
    : getTargetDir(config);

  const skillsDir = config.format === 'plugin'
    ? path.join(path.dirname(baseDir), 'skills')
    : path.join(baseDir, 'skills');
  const agentsDir = config.format === 'plugin'
    ? path.join(path.dirname(baseDir), 'agents')
    : path.join(baseDir, 'agents');
  const commandsDir = config.format === 'plugin'
    ? path.join(path.dirname(baseDir), 'commands')
    : path.join(baseDir, 'commands');
  const hooksDir = config.format === 'plugin'
    ? path.join(path.dirname(baseDir), 'hooks')
    : path.join(baseDir, 'hooks');

  // --- Plugin manifest ---
  if (config.format === 'plugin') {
    spinner.start('Installing plugin manifest...');
    if (!config.dryRun) {
      await fs.ensureDir(baseDir);
      await fs.copy(
        path.join(TEMPLATES_DIR, 'claude-plugin', 'plugin.json'),
        path.join(baseDir, 'plugin.json')
      );
    }
    spinner.succeed('Plugin manifest installed');
  }

  // --- Skills ---
  if (config.skills.length > 0) {
    spinner.start(`Installing ${config.skills.length} skills...`);
    for (const skill of config.skills) {
      const src = path.join(TEMPLATES_DIR, 'skills', skill);
      const dest = path.join(skillsDir, skill);
      if (!config.dryRun) {
        await fs.ensureDir(dest);
        await fs.copy(src, dest);
      }
      installed.skills.push(skill);
    }
    spinner.succeed(`${config.skills.length} skills installed`);
  }

  // --- Agents ---
  if (config.agents.length > 0) {
    spinner.start(`Installing ${config.agents.length} agents...`);
    for (const agent of config.agents) {
      const src = path.join(TEMPLATES_DIR, 'agents', `${agent}.md`);
      const dest = path.join(agentsDir, `${agent}.md`);
      if (!config.dryRun) {
        await fs.ensureDir(agentsDir);
        await fs.copy(src, dest);
      }
      installed.agents.push(agent);
    }
    spinner.succeed(`${config.agents.length} agents installed`);
  }

  // --- Commands ---
  if (config.commands.length > 0) {
    spinner.start(`Installing ${config.commands.length} commands...`);
    for (const cmd of config.commands) {
      const src = path.join(TEMPLATES_DIR, 'commands', `${cmd}.md`);
      const dest = path.join(commandsDir, `${cmd}.md`);
      if (!config.dryRun) {
        await fs.ensureDir(commandsDir);
        await fs.copy(src, dest);
      }
    }
    spinner.succeed(`${config.commands.length} commands installed`);
  }

  // --- Hooks ---
  if (config.hooks) {
    spinner.start('Installing hooks...');
    if (!config.dryRun) {
      await fs.ensureDir(hooksDir);
      await fs.copy(
        path.join(TEMPLATES_DIR, 'hooks', 'hooks.json'),
        path.join(hooksDir, 'hooks.json')
      );
      const sessionStartSrc = path.join(TEMPLATES_DIR, 'hooks', 'session-start');
      const sessionStartDest = path.join(hooksDir, 'session-start');
      await fs.copy(sessionStartSrc, sessionStartDest);
      await fs.chmod(sessionStartDest, 0o755);
    }
    installed.hooks = true;
    spinner.succeed('Hooks installed');
  }

  // --- Memory ---
  if (config.memory) {
    spinner.start('Setting up memory system...');
    const memoryDir = config.format === 'plugin'
      ? path.join(path.dirname(baseDir), 'memory')
      : path.join(baseDir, 'memory');

    if (!config.dryRun) {
      await fs.ensureDir(memoryDir);
      for (const memFile of MEMORY_FILES) {
        const src = path.join(TEMPLATES_DIR, 'memory', memFile);
        const dest = path.join(memoryDir, memFile);
        if (!(await fs.pathExists(dest))) {
          await fs.copy(src, dest);
        }
      }
    }
    installed.memory = true;
    spinner.succeed('Memory system initialized');
  }

  // --- CLAUDE.md ---
  if (config.claudeMd) {
    spinner.start('Setting up CLAUDE.md...');
    const claudeMdPath = getClaudeMdPath(config);
    if (!config.dryRun) {
      const templateContent = await fs.readFile(
        path.join(TEMPLATES_DIR, 'CLAUDE.md'),
        'utf8'
      );
      const merged = await mergeClaudeMd(claudeMdPath, templateContent);
      await backupIfExists(claudeMdPath);
      await fs.writeFile(claudeMdPath, merged, 'utf8');
    }
    installed.claudeMd = true;
    spinner.succeed('CLAUDE.md configured');
  }

  // --- Summary ---
  console.log('');
  console.log(chalk.bold.green('  Installation complete!'));
  console.log('');

  if (installed.skills.length > 0) {
    const prefix = config.format === 'plugin' ? 'toolkit:' : '';
    console.log(chalk.bold('  Skills:'));
    for (const skill of installed.skills) {
      console.log(`    ${chalk.green('+')} ${prefix}${skill}`);
    }
    console.log('');
  }

  if (installed.agents.length > 0) {
    console.log(chalk.bold('  Agents:'));
    for (const agent of installed.agents) {
      console.log(`    ${chalk.green('+')} ${agent}`);
    }
    console.log('');
  }

  if (config.commands.length > 0) {
    console.log(chalk.bold('  Commands:'));
    for (const cmd of config.commands) {
      console.log(`    ${chalk.green('+')} /${cmd}`);
    }
    console.log('');
  }

  console.log(chalk.dim('  Start a new Claude Code session to activate the toolkit.'));
  console.log('');
}
