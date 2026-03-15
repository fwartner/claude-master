import { execSync } from 'child_process';
import chalk from 'chalk';

type Platform = 'macos' | 'linux-apt' | 'linux-yum' | 'windows-choco' | 'windows-winget';

interface Requirement {
  name: string;
  check: () => Promise<boolean>;
  required: boolean;
  installCmd: Partial<Record<Platform, string>>;
}

const REQUIREMENTS: Requirement[] = [
  {
    name: 'Node.js >= 18',
    check: async () => {
      const major = parseInt(process.version.slice(1));
      return major >= 18;
    },
    required: true,
    installCmd: {
      'macos': 'brew install node',
      'linux-apt': 'curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs',
      'linux-yum': 'curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash - && sudo yum install -y nodejs',
      'windows-choco': 'choco install nodejs',
      'windows-winget': 'winget install OpenJS.NodeJS',
    },
  },
  {
    name: 'Git',
    check: async () => {
      try {
        execSync('git --version', { stdio: 'pipe' });
        return true;
      } catch {
        return false;
      }
    },
    required: true,
    installCmd: {
      'macos': 'brew install git',
      'linux-apt': 'sudo apt-get install -y git',
      'linux-yum': 'sudo yum install -y git',
      'windows-choco': 'choco install git',
      'windows-winget': 'winget install Git.Git',
    },
  },
  {
    name: 'Claude Code CLI',
    check: async () => {
      try {
        execSync('claude --version', { stdio: 'pipe' });
        return true;
      } catch {
        return false;
      }
    },
    required: false,
    installCmd: {
      'macos': 'npm install -g @anthropic-ai/claude-code',
      'linux-apt': 'npm install -g @anthropic-ai/claude-code',
      'linux-yum': 'npm install -g @anthropic-ai/claude-code',
      'windows-choco': 'npm install -g @anthropic-ai/claude-code',
      'windows-winget': 'npm install -g @anthropic-ai/claude-code',
    },
  },
];

export function detectPlatform(): Platform {
  const platform = process.platform;

  if (platform === 'darwin') return 'macos';
  if (platform === 'win32') return 'windows-winget';
  if (platform === 'linux') {
    try {
      execSync('which apt-get', { stdio: 'pipe' });
      return 'linux-apt';
    } catch {
      return 'linux-yum';
    }
  }
  return 'linux-apt';
}

export { REQUIREMENTS };
export type { Requirement, Platform };

export async function checkRequirements(): Promise<void> {
  const platform = detectPlatform();
  const results: { name: string; passed: boolean; required: boolean; installCmd?: string }[] = [];

  for (const req of REQUIREMENTS) {
    const passed = await req.check();
    results.push({
      name: req.name,
      passed,
      required: req.required,
      installCmd: req.installCmd[platform],
    });
  }

  console.log(chalk.bold('  System Requirements'));
  console.log('');

  let hasFailedRequired = false;

  for (const result of results) {
    const icon = result.passed
      ? chalk.green('\u2713')
      : result.required
        ? chalk.red('\u2717')
        : chalk.yellow('!');
    const label = result.required ? '' : chalk.dim(' (recommended)');
    console.log(`    ${icon} ${result.name}${label}`);

    if (!result.passed && result.required) {
      hasFailedRequired = true;
    }
  }

  console.log('');

  // Show install commands for missing items
  const missing = results.filter(r => !r.passed);
  if (missing.length > 0) {
    const missingRequired = missing.filter(r => r.required);
    const missingOptional = missing.filter(r => !r.required);

    if (missingRequired.length > 0) {
      console.log(chalk.red('  Missing required dependencies:'));
      for (const m of missingRequired) {
        if (m.installCmd) {
          console.log(chalk.dim(`    ${m.name}: ${m.installCmd}`));
        }
      }
      console.log('');
    }

    if (missingOptional.length > 0) {
      console.log(chalk.yellow('  Recommended (not required):'));
      for (const m of missingOptional) {
        if (m.installCmd) {
          console.log(chalk.dim(`    ${m.name}: ${m.installCmd}`));
        }
      }
      console.log('');
    }
  }

  if (hasFailedRequired) {
    console.log(chalk.red('  Cannot continue — install required dependencies first.'));
    console.log('');
    process.exit(1);
  }
}
