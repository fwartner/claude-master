import { describe, it, expect } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatesDir = path.join(__dirname, '..', 'templates');

const NEW_SKILLS = [
  'autonomous-loop', 'circuit-breaker', 'ralph-status', 'spec-writing',
  'reverse-engineering-specs', 'acceptance-testing', 'llm-as-judge',
  'ui-ux-pro-max', 'ui-design-system', 'canvas-design', 'mobile-design',
  'ux-researcher-designer', 'artifacts-builder', 'senior-frontend',
  'senior-backend', 'senior-architect', 'senior-fullstack', 'clean-code',
  'react-best-practices', 'webapp-testing', 'git-commit-helper',
  'senior-devops', 'mcp-builder', 'agent-development', 'senior-prompt-engineer',
  'senior-data-scientist', 'docx-processing', 'pdf-processing', 'xlsx-processing',
  'seo-optimizer', 'content-research-writer', 'content-creator', 'email-composer',
  'file-organizer', 'task-decomposition', 'auto-improvement',
  'laravel-specialist', 'php-specialist', 'laravel-boost',
];

const NEW_AGENTS = [
  'loop-orchestrator', 'spec-writer', 'acceptance-judge',
  'frontend-developer', 'ui-ux-designer', 'backend-architect',
  'context-manager', 'database-architect', 'architect-reviewer',
  'typescript-pro', 'task-decomposer', 'mobile-developer',
  'laravel-developer', 'php-developer',
];

const NEW_COMMANDS = [
  'ralph', 'specs', 'loop',
  'frontend', 'backend', 'architect', 'fullstack', 'design-system',
  'ui-ux', 'mobile', 'clean', 'devops', 'agent', 'seo', 'email',
  'mcp', 'commit', 'decompose', 'laravel', 'php',
];

describe('New Skills', () => {
  for (const skill of NEW_SKILLS) {
    it(`${skill}/SKILL.md exists and has valid frontmatter`, async () => {
      const skillPath = path.join(templatesDir, 'skills', skill, 'SKILL.md');
      expect(await fs.pathExists(skillPath)).toBe(true);

      const content = await fs.readFile(skillPath, 'utf8');
      expect(content).toMatch(/^---\n/);
      expect(content).toMatch(/name:\s+/);
      expect(content).toMatch(/description:\s+/);
    });
  }

  it('autonomous-loop contains RALPH_STATUS reference', async () => {
    const content = await fs.readFile(
      path.join(templatesDir, 'skills', 'autonomous-loop', 'SKILL.md'), 'utf8',
    );
    expect(content).toContain('RALPH_STATUS');
    expect(content).toContain('ONE task per loop');
    expect(content).toContain('EXIT_SIGNAL');
  });

  it('ui-ux-pro-max contains design intelligence', async () => {
    const content = await fs.readFile(
      path.join(templatesDir, 'skills', 'ui-ux-pro-max', 'SKILL.md'), 'utf8',
    );
    expect(content).toContain('accessibility');
    expect(content).toMatch(/color|palette/i);
    expect(content).toMatch(/typography|font/i);
  });

  it('auto-improvement contains self-learning', async () => {
    const content = await fs.readFile(
      path.join(templatesDir, 'skills', 'auto-improvement', 'SKILL.md'), 'utf8',
    );
    expect(content).toMatch(/improve|learn|pattern/i);
    expect(content).toMatch(/memory|track/i);
  });
});

describe('New Agents', () => {
  for (const agent of NEW_AGENTS) {
    it(`${agent}.md exists and has valid frontmatter`, async () => {
      const agentPath = path.join(templatesDir, 'agents', `${agent}.md`);
      expect(await fs.pathExists(agentPath)).toBe(true);

      const content = await fs.readFile(agentPath, 'utf8');
      expect(content).toMatch(/^---\n/);
      expect(content).toMatch(/name:\s+/);
      expect(content).toMatch(/description:\s+/);
    });
  }
});

describe('New Commands', () => {
  for (const cmd of NEW_COMMANDS) {
    it(`${cmd}.md exists and is user-invocable`, async () => {
      const cmdPath = path.join(templatesDir, 'commands', `${cmd}.md`);
      expect(await fs.pathExists(cmdPath)).toBe(true);

      const content = await fs.readFile(cmdPath, 'utf8');
      expect(content).toContain('user-invocable: true');
    });
  }
});

describe('Hooks', () => {
  const HOOKS = ['smart-commit', 'lint-on-save', 'update-search-year', 'nextjs-code-quality', 'security-scanner'];

  for (const hook of HOOKS) {
    it(`${hook}.json exists and is valid JSON`, async () => {
      const hookPath = path.join(templatesDir, 'hooks', `${hook}.json`);
      expect(await fs.pathExists(hookPath)).toBe(true);

      const content = await fs.readFile(hookPath, 'utf8');
      expect(() => JSON.parse(content)).not.toThrow();
    });
  }
});

describe('Ralph Templates', () => {
  const RALPH_FILES = [
    'PROMPT_plan.md', 'PROMPT_build.md', 'PROMPT_specs.md',
    'PROMPT_reverse_engineer.md', 'AGENTS.md', 'IMPLEMENTATION_PLAN.md',
    'loop.sh', 'ralphrc.template',
  ];

  for (const file of RALPH_FILES) {
    it(`ralph/${file} exists`, async () => {
      const filePath = path.join(templatesDir, 'ralph', file);
      expect(await fs.pathExists(filePath)).toBe(true);
    });
  }
});

describe('Memory', () => {
  it('improvement-log.md exists', async () => {
    const filePath = path.join(templatesDir, 'memory', 'improvement-log.md');
    expect(await fs.pathExists(filePath)).toBe(true);
  });
});
