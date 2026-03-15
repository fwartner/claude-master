import { describe, it, expect } from 'vitest';
import { SKILLS, AGENTS, COMMANDS, MEMORY_FILES, SKILL_CATEGORIES } from '../src/config.js';

describe('Config', () => {
  it('has 25 skills defined', () => {
    expect(Object.keys(SKILLS)).toHaveLength(25);
  });

  it('has all expected skills', () => {
    const expected = [
      'using-toolkit', 'planning', 'brainstorming', 'task-management',
      'prd-generation', 'self-learning', 'code-review', 'tech-docs-generator',
      'resilient-execution', 'api-design', 'testing-strategy', 'deployment',
      'test-driven-development', 'systematic-debugging', 'verification-before-completion',
      'executing-plans', 'subagent-driven-development', 'dispatching-parallel-agents',
      'using-git-worktrees', 'finishing-a-development-branch', 'writing-skills',
      'frontend-ui-design', 'database-schema-design', 'security-review',
      'performance-optimization',
    ];
    expect(Object.keys(SKILLS)).toEqual(expect.arrayContaining(expected));
    expect(expected).toHaveLength(25);
  });

  it('has 6 agents defined', () => {
    expect(Object.keys(AGENTS)).toHaveLength(6);
  });

  it('has all expected agents', () => {
    const expected = ['planner', 'code-reviewer', 'prd-writer', 'doc-generator', 'spec-reviewer', 'quality-reviewer'];
    expect(Object.keys(AGENTS)).toEqual(expect.arrayContaining(expected));
  });

  it('has 11 commands defined', () => {
    expect(Object.keys(COMMANDS)).toHaveLength(11);
  });

  it('has all expected commands', () => {
    const expected = ['plan', 'review', 'prd', 'learn', 'docs', 'tdd', 'debug', 'verify', 'execute', 'worktree', 'brainstorm'];
    expect(Object.keys(COMMANDS)).toEqual(expect.arrayContaining(expected));
  });

  it('has 4 memory files defined', () => {
    expect(MEMORY_FILES).toHaveLength(4);
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
