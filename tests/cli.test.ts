import { describe, it, expect } from 'vitest';
import { SKILLS, AGENTS, COMMANDS, MEMORY_FILES, SKILL_CATEGORIES } from '../src/config';

describe('Config', () => {
  it('has 61 skills defined', () => {
    expect(Object.keys(SKILLS)).toHaveLength(61);
  });

  it('has all expected skills', () => {
    const expected = [
      // Core (5)
      'using-toolkit', 'self-learning', 'resilient-execution', 'circuit-breaker', 'auto-improvement',
      // Process (8)
      'planning', 'brainstorming', 'task-management', 'executing-plans',
      'subagent-driven-development', 'dispatching-parallel-agents', 'autonomous-loop', 'task-decomposition',
      // Quality (14)
      'code-review', 'test-driven-development', 'testing-strategy', 'systematic-debugging',
      'security-review', 'performance-optimization', 'acceptance-testing', 'llm-as-judge',
      'senior-frontend', 'senior-backend', 'senior-architect', 'senior-fullstack',
      'clean-code', 'react-best-practices', 'webapp-testing', 'senior-prompt-engineer', 'senior-data-scientist',
      // Documentation (5)
      'prd-generation', 'tech-docs-generator', 'writing-skills', 'spec-writing', 'reverse-engineering-specs',
      // Design (3)
      'api-design', 'frontend-ui-design', 'database-schema-design',
      // Operations (7)
      'deployment', 'using-git-worktrees', 'finishing-a-development-branch',
      'git-commit-helper', 'senior-devops', 'mcp-builder', 'agent-development',
      // Creative (6)
      'ui-ux-pro-max', 'ui-design-system', 'canvas-design', 'mobile-design',
      'ux-researcher-designer', 'artifacts-builder',
      // Status (2)
      'ralph-status', 'verification-before-completion',
      // Document Processing (3)
      'docx-processing', 'pdf-processing', 'xlsx-processing',
      // Business (3)
      'seo-optimizer', 'content-research-writer', 'content-creator',
      // Communication (1)
      'email-composer',
      // Productivity (1)
      'file-organizer',
    ];
    expect(Object.keys(SKILLS)).toEqual(expect.arrayContaining(expected));
    expect(expected).toHaveLength(61);
  });

  it('has 18 agents defined', () => {
    expect(Object.keys(AGENTS)).toHaveLength(18);
  });

  it('has all expected agents', () => {
    const expected = [
      'planner', 'code-reviewer', 'prd-writer', 'doc-generator',
      'spec-reviewer', 'quality-reviewer', 'loop-orchestrator',
      'spec-writer', 'acceptance-judge',
      'frontend-developer', 'ui-ux-designer', 'backend-architect',
      'context-manager', 'database-architect', 'architect-reviewer',
      'typescript-pro', 'task-decomposer', 'mobile-developer',
    ];
    expect(Object.keys(AGENTS)).toEqual(expect.arrayContaining(expected));
    expect(expected).toHaveLength(18);
  });

  it('has 29 commands defined', () => {
    expect(Object.keys(COMMANDS)).toHaveLength(29);
  });

  it('has all expected commands', () => {
    const expected = [
      'plan', 'review', 'prd', 'learn', 'docs', 'tdd', 'debug',
      'verify', 'execute', 'worktree', 'brainstorm', 'ralph', 'specs', 'loop',
      'frontend', 'backend', 'architect', 'fullstack', 'design-system',
      'ui-ux', 'mobile', 'clean', 'devops', 'agent', 'seo', 'email',
      'mcp', 'commit', 'decompose',
    ];
    expect(Object.keys(COMMANDS)).toEqual(expect.arrayContaining(expected));
    expect(expected).toHaveLength(29);
  });

  it('has 5 memory files defined', () => {
    expect(MEMORY_FILES).toHaveLength(5);
  });

  it('every skill has name, description, and category', () => {
    for (const [key, skill] of Object.entries(SKILLS)) {
      expect(skill.name).toBe(key);
      expect(skill.description).toBeTruthy();
      expect(skill.category).toBeTruthy();
      expect(SKILL_CATEGORIES[skill.category]).toBeTruthy();
    }
  });

  it('every command references a valid skill', () => {
    for (const cmd of Object.values(COMMANDS)) {
      expect(SKILLS[cmd.skill]).toBeTruthy();
    }
  });

  it('every agent has name and description', () => {
    for (const [key, agent] of Object.entries(AGENTS)) {
      expect(agent.name).toBe(key);
      expect(agent.description).toBeTruthy();
    }
  });
});
