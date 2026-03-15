import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PACKAGE_NAME = '@pixelandprocess/superkit-agents';
const CONFIG_DIR = path.join(process.env.HOME || '', '.superkit-agents');
const CONFIG_PATH = path.join(CONFIG_DIR, 'config.json');

function getCurrentVersion(): string {
  try {
    const pkgPath = path.join(__dirname, '..', 'package.json');
    const pkg = fs.readJsonSync(pkgPath);
    return pkg.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

async function getLatestVersion(): Promise<string | null> {
  try {
    const result = execSync(`npm view ${PACKAGE_NAME} version`, {
      encoding: 'utf8',
      timeout: 15000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return result.trim();
  } catch {
    return null;
  }
}

function compareVersions(current: string, latest: string): number {
  const [aMaj, aMin, aPatch] = current.split('.').map(Number);
  const [bMaj, bMin, bPatch] = latest.split('.').map(Number);
  if (aMaj !== bMaj) return aMaj - bMaj;
  if (aMin !== bMin) return aMin - bMin;
  return aPatch - bPatch;
}

export async function saveConfig(config: Record<string, unknown>): Promise<void> {
  await fs.ensureDir(CONFIG_DIR);
  await fs.writeJson(CONFIG_PATH, config, { spaces: 2 });
}

export async function loadConfig(): Promise<Record<string, unknown> | null> {
  try {
    if (await fs.pathExists(CONFIG_PATH)) {
      return await fs.readJson(CONFIG_PATH);
    }
  } catch {
    // ignore
  }
  return null;
}

export async function checkForUpdates(): Promise<void> {
  const spinner = ora('Checking for updates...').start();

  const currentVersion = getCurrentVersion();
  const latestVersion = await getLatestVersion();

  if (!latestVersion) {
    spinner.fail('Could not check for updates (npm registry unreachable)');
    return;
  }

  const cmp = compareVersions(currentVersion, latestVersion);

  if (cmp >= 0) {
    spinner.succeed(`You are on the latest version (${chalk.green(currentVersion)})`);
    return;
  }

  spinner.info(`Update available: ${chalk.yellow(currentVersion)} → ${chalk.green(latestVersion)}`);
  console.log('');
  console.log(chalk.bold('  To update, run:'));
  console.log(`    ${chalk.cyan(`npm install -g ${PACKAGE_NAME}@latest`)}`);
  console.log('');
  console.log(chalk.bold('  Then re-install to your project:'));
  console.log(`    ${chalk.cyan('superkit-agents --all')}`);
  console.log('');

  const savedConfig = await loadConfig();
  if (savedConfig) {
    console.log(chalk.dim('  Your previous installation preferences are saved and will be used.'));
    console.log('');
  }
}
