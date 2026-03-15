import inquirer from 'inquirer';
import chalk from 'chalk';
import { SKILLS, AGENTS, COMMANDS, SKILL_CATEGORIES } from './config';
import type { InstallConfig, SkillCategory } from './config';
import { detectLaravel } from './utils';

interface CliOptions {
  global?: boolean;
  dryRun?: boolean;
}

export async function runWizard(cliOptions: CliOptions): Promise<InstallConfig | null> {
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

  // Laravel detection
  let laravelDetected = false;
  let installLaravelBoost = false;
  if (scope === 'project') {
    laravelDetected = await detectLaravel();
    if (laravelDetected) {
      console.log('');
      console.log(chalk.bold.magenta('  Laravel project detected!'));
      const { boost } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'boost',
          message: 'Install Laravel Boost for performance optimization? (composer require laravel/boost)',
          default: true,
        },
      ]);
      installLaravelBoost = boost as boolean;
    }
  }

  const skillChoices = Object.entries(SKILLS).map(([key, skill]) => {
    const category = SKILL_CATEGORIES[skill.category as SkillCategory] || skill.category;
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

  if ((skills as string[]).length === 0) {
    console.log(chalk.yellow('  No skills selected.'));
    return null;
  }

  // Enforce mandatory skills
  const mandatorySkills = ['self-learning', 'auto-improvement'];
  const selectedSkills = skills as string[];
  for (const mandatory of mandatorySkills) {
    if (!selectedSkills.includes(mandatory)) {
      selectedSkills.push(mandatory);
      console.log(chalk.dim(`  ${mandatory} is always active (mandatory)`));
    }
  }

  // Auto-select Laravel skills if Laravel was detected
  if (laravelDetected) {
    for (const ls of ['laravel-specialist', 'php-specialist', 'laravel-boost']) {
      if (!selectedSkills.includes(ls)) {
        selectedSkills.push(ls);
      }
    }
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

  const selectedFeatures = features as string[];

  const config: InstallConfig = {
    scope: scope as 'project' | 'global',
    format: format as 'plugin' | 'direct',
    skills: selectedSkills,
    agents: selectedFeatures.includes('agents') ? Object.keys(AGENTS) : [],
    commands: selectedFeatures.includes('commands') ? Object.keys(COMMANDS) : [],
    hooks: selectedFeatures.includes('hooks'),
    memory: selectedFeatures.includes('memory'),
    claudeMd: selectedFeatures.includes('claudeMd'),
    dryRun: cliOptions.dryRun || false,
    laravelBoost: installLaravelBoost,
  };

  console.log('');
  console.log(chalk.bold('  Installation Summary:'));
  console.log(`  Scope:    ${chalk.cyan(config.scope)}`);
  console.log(`  Format:   ${chalk.cyan(config.format)}`);
  console.log(`  Skills:   ${chalk.cyan(String(config.skills.length))} selected`);
  console.log(`  Agents:   ${chalk.cyan(String(config.agents.length))} selected`);
  console.log(`  Commands: ${chalk.cyan(String(config.commands.length))} selected`);
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
