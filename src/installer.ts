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
} from './utils';
import { MEMORY_FILES } from './config';
import type { InstallConfig } from './config';

interface InstallResult {
  skills: string[];
  agents: string[];
  commands: string[];
  hooks: boolean;
  memory: boolean;
  claudeMd: boolean;
}

function generateSessionStartScript(rootDir: string): string {
  return `#!/usr/bin/env bash
# SessionStart hook for @fwartner/claude-toolkit (direct mode)
set -euo pipefail

TOOLKIT_ROOT="${rootDir}"

# Read using-toolkit skill content
using_toolkit_content=$(cat "\${TOOLKIT_ROOT}/skills/using-toolkit/SKILL.md" 2>&1 || echo "Error reading using-toolkit skill")

# Read memory files if they exist
memory_context=""
MEMORY_DIR="\${TOOLKIT_ROOT}/memory"
if [ -d "$MEMORY_DIR" ]; then
    for memfile in project-context.md learned-patterns.md user-preferences.md; do
        filepath="\${MEMORY_DIR}/\${memfile}"
        if [ -f "$filepath" ] && [ -s "$filepath" ]; then
            content=$(cat "$filepath" 2>/dev/null || true)
            if [ -n "$content" ]; then
                memory_context="\${memory_context}\\\\n\\\\n--- \${memfile} ---\\\\n\${content}"
            fi
        fi
    done
fi

escape_for_json() {
    local s="$1"
    s="\${s//\\\\/\\\\\\\\}"
    s="\${s//\\"/\\\\\\"}"
    s="\${s//$'\\n'/\\\\n}"
    s="\${s//$'\\r'/\\\\r}"
    s="\${s//$'\\t'/\\\\t}"
    printf '%s' "$s"
}

using_toolkit_escaped=$(escape_for_json "$using_toolkit_content")
memory_escaped=$(escape_for_json "$memory_context")

session_context="<EXTREMELY_IMPORTANT>\\nYou have the Claude Toolkit installed.\\n\\n**Below is the full content of your 'toolkit:using-toolkit' skill. For all other skills, use the 'Skill' tool:**\\n\\n\${using_toolkit_escaped}\\n\\n**Project Memory:**\\n\${memory_escaped}\\n</EXTREMELY_IMPORTANT>"

cat <<EOF
{
  "additional_context": "\${session_context}",
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "\${session_context}"
  }
}
EOF

exit 0
`;
}

export async function install(config: InstallConfig): Promise<void> {
  const spinner = ora();
  const installed: InstallResult = {
    skills: [],
    agents: [],
    commands: [],
    hooks: false,
    memory: false,
    claudeMd: false,
  };

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

      if (config.format === 'plugin') {
        // Plugin mode: use ${CLAUDE_PLUGIN_ROOT} variable
        await fs.copy(
          path.join(TEMPLATES_DIR, 'hooks', 'hooks.json'),
          path.join(hooksDir, 'hooks.json')
        );
        await fs.copy(
          path.join(TEMPLATES_DIR, 'hooks', 'session-start'),
          path.join(hooksDir, 'session-start')
        );
      } else {
        // Direct mode: generate hooks with correct paths
        const rootDir = config.scope === 'global'
          ? path.join(process.env.HOME || '', '.claude')
          : path.join(process.cwd(), '.claude');

        const hooksJsonContent = {
          hooks: {
            SessionStart: [{
              matcher: 'startup|resume|clear|compact',
              hooks: [{
                type: 'command',
                command: `'${path.join(rootDir, 'hooks', 'session-start')}'`,
                async: false,
              }],
            }],
          },
        };
        await fs.writeJson(path.join(hooksDir, 'hooks.json'), hooksJsonContent, { spaces: 2 });

        // Generate session-start script with correct paths for direct mode
        const sessionStartContent = generateSessionStartScript(rootDir);
        await fs.writeFile(path.join(hooksDir, 'session-start'), sessionStartContent, 'utf8');
      }

      await fs.chmod(path.join(hooksDir, 'session-start'), 0o755);
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
