export const SKILLS = {
  'using-toolkit': {
    name: 'using-toolkit',
    description: 'Master skill - establishes how to find and use all toolkit skills',
    category: 'core',
  },
  'planning': {
    name: 'planning',
    description: 'Structured planning before any implementation work',
    category: 'process',
  },
  'brainstorming': {
    name: 'brainstorming',
    description: 'Creative exploration and design before planning',
    category: 'process',
  },
  'task-management': {
    name: 'task-management',
    description: 'Break work into discrete tracked steps',
    category: 'process',
  },
  'prd-generation': {
    name: 'prd-generation',
    description: 'Generate Product Requirements Documents',
    category: 'documentation',
  },
  'self-learning': {
    name: 'self-learning',
    description: 'Auto-discover and remember project context',
    category: 'core',
  },
  'code-review': {
    name: 'code-review',
    description: 'Quality verification against plan and standards',
    category: 'quality',
  },
  'tech-docs-generator': {
    name: 'tech-docs-generator',
    description: 'Generate technical documentation from code',
    category: 'documentation',
  },
  'resilient-execution': {
    name: 'resilient-execution',
    description: 'Never fail - retry with alternative approaches',
    category: 'core',
  },
  'api-design': {
    name: 'api-design',
    description: 'Structured API endpoint design with OpenAPI spec',
    category: 'design',
  },
  'testing-strategy': {
    name: 'testing-strategy',
    description: 'Choose testing approach based on project context',
    category: 'quality',
  },
  'deployment': {
    name: 'deployment',
    description: 'CI/CD pipeline generation and deploy checklists',
    category: 'operations',
  },
};

export const AGENTS = {
  'planner': {
    name: 'planner',
    description: 'Senior architect creating implementation plans',
  },
  'code-reviewer': {
    name: 'code-reviewer',
    description: 'Reviews code against plan and standards',
  },
  'prd-writer': {
    name: 'prd-writer',
    description: 'Generates PRD from collected requirements',
  },
  'doc-generator': {
    name: 'doc-generator',
    description: 'Generates technical documentation from code',
  },
};

export const COMMANDS = {
  'plan': { name: 'plan', skill: 'planning', description: 'Start structured planning' },
  'review': { name: 'review', skill: 'code-review', description: 'Request code review' },
  'prd': { name: 'prd', skill: 'prd-generation', description: 'Generate a PRD' },
  'learn': { name: 'learn', skill: 'self-learning', description: 'Scan and learn project context' },
  'docs': { name: 'docs', skill: 'tech-docs-generator', description: 'Generate technical docs' },
};

export const MEMORY_FILES = [
  'project-context.md',
  'learned-patterns.md',
  'user-preferences.md',
  'decisions-log.md',
];

export const SKILL_CATEGORIES = {
  core: 'Core (always recommended)',
  process: 'Process & Workflow',
  quality: 'Quality Assurance',
  documentation: 'Documentation',
  design: 'Design',
  operations: 'Operations',
};
