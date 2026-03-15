import inquirer from 'inquirer';
import chalk from 'chalk';
import { SKILLS, AGENTS, COMMANDS, SKILL_CATEGORIES } from './config.js';

export async function runWizard(cliOptions) {
  const { scope } = await inquirer.prompt([
    {
      type: 'list',
      name: 'scope',
      message: 'Where should the toolkit be installed?',
      choices: [
        { name: 'Project (./.claude/) — applies to this project only', value: 'project' },
        { name: 'Global (~/.claude/) — applies to all projects', value: 'global' },
      ],
      default: cliOptions.global ? 'global' : 'project',
    },
  ]);

  const { format } = await inquirer.prompt([
    {
      type: 'list',
      name: 'format',
      message: 'Installation format?',
      choices: [
        { name: 'Plugin (.claude-plugin/) — namespaced, supports /reload-plugins', value: 'plugin' },
        { name: 'Direct (.claude/skills/) — simple, no namespacing', value: 'direct' },
      ],
      default: 'plugin',
    },
  ]);

  const skillChoices = Object.entries(SKILLS).map(([key, skill]) => {
    const category = SKILL_CATEGORIES[skill.category] || skill.category;
    return {
      name: `${chalk.bold(key)} — ${skill.description} ${chalk.dim(`[${category}]`)}`,
      value: key,
      checked: true,
    };
  });

  const { skills } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'skills',
      message: 'Which skills to install?',
      choices: skillChoices,
      pageSize: 15,
    },
  ]);

  if (skills.length === 0) {
    console.log(chalk.yellow('  No skills selected.'));
    return null;
  }

  const { features } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'features',
      message: 'Additional features to install?',
      choices: [
        { name: 'Hooks (session-start context injection)', value: 'hooks', checked: true },
        { name: 'Memory system (project context, learned patterns)', value: 'memory', checked: true },
        { name: 'CLAUDE.md (project guidelines template)', value: 'claudeMd', checked: true },
        { name: 'Slash commands (/plan, /review, /prd, /learn, /docs)', value: 'commands', checked: true },
        { name: 'Agent definitions (planner, code-reviewer, prd-writer, doc-generator)', value: 'agents', checked: true },
      ],
    },
  ]);

  const config = {
    scope,
    format,
    skills,
    agents: features.includes('agents') ? Object.keys(AGENTS) : [],
    commands: features.includes('commands') ? Object.keys(COMMANDS) : [],
    hooks: features.includes('hooks'),
    memory: features.includes('memory'),
    claudeMd: features.includes('claudeMd'),
    dryRun: cliOptions.dryRun || false,
  };

  console.log('');
  console.log(chalk.bold('  Installation Summary:'));
  console.log(`  Scope:    ${chalk.cyan(config.scope)}`);
  console.log(`  Format:   ${chalk.cyan(config.format)}`);
  console.log(`  Skills:   ${chalk.cyan(config.skills.length)} selected`);
  console.log(`  Agents:   ${chalk.cyan(config.agents.length)} selected`);
  console.log(`  Commands: ${chalk.cyan(config.commands.length)} selected`);
  console.log(`  Hooks:    ${chalk.cyan(config.hooks ? 'yes' : 'no')}`);
  console.log(`  Memory:   ${chalk.cyan(config.memory ? 'yes' : 'no')}`);
  console.log(`  CLAUDE.md: ${chalk.cyan(config.claudeMd ? 'yes' : 'no')}`);
  console.log('');

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Proceed with installation?',
      default: true,
    },
  ]);

  if (!confirm) {
    return null;
  }

  return config;
}
