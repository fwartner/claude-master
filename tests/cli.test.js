import { describe, it, expect } from 'vitest';
import { SKILLS, AGENTS, COMMANDS, MEMORY_FILES, SKILL_CATEGORIES } from '../src/config.js';

describe('Config', () => {
  it('has 12 skills defined', () => {
    expect(Object.keys(SKILLS)).toHaveLength(12);
  });

  it('has all expected skills', () => {
    const expected = [
      'using-toolkit', 'planning', 'brainstorming', 'task-management',
      'prd-generation', 'self-learning', 'code-review', 'tech-docs-generator',
      'resilient-execution', 'api-design', 'testing-strategy', 'deployment',
    ];
    expect(Object.keys(SKILLS)).toEqual(expect.arrayContaining(expected));
  });

  it('has 4 agents defined', () => {
    expect(Object.keys(AGENTS)).toHaveLength(4);
  });

  it('has 5 commands defined', () => {
    expect(Object.keys(COMMANDS)).toHaveLength(5);
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
});
