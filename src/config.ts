export type SkillCategory =
  | 'core'
  | 'process'
  | 'quality'
  | 'documentation'
  | 'design'
  | 'operations'
  | 'creative'
  | 'business'
  | 'document-processing'
  | 'productivity'
  | 'communication';

export interface Skill {
  name: string;
  description: string;
  category: SkillCategory;
}

export interface Agent {
  name: string;
  description: string;
}

export interface Command {
  name: string;
  skill: string;
  description: string;
}

export interface InstallConfig {
  scope: 'project' | 'global';
  format: 'plugin' | 'direct';
  skills: string[];
  agents: string[];
  commands: string[];
  hooks: boolean;
  memory: boolean;
  claudeMd: boolean;
  dryRun: boolean;
}

export const SKILLS: Record<string, Skill> = {
  // === Core ===
  'using-toolkit': {
    name: 'using-toolkit',
    description: 'Master skill - establishes how to find and use all toolkit skills',
    category: 'core',
  },
  'self-learning': {
    name: 'self-learning',
    description: 'Auto-discover and remember project context',
    category: 'core',
  },
  'resilient-execution': {
    name: 'resilient-execution',
    description: 'Never fail - retry with alternative approaches',
    category: 'core',
  },
  'verification-before-completion': {
    name: 'verification-before-completion',
    description: '5-step verification gate before any completion claim',
    category: 'core',
  },
  'circuit-breaker': {
    name: 'circuit-breaker',
    description: 'Loop stagnation detection, rate limiting, and recovery patterns',
    category: 'core',
  },
  'auto-improvement': {
    name: 'auto-improvement',
    description: 'Self-improving system, tracks effectiveness, learns from errors',
    category: 'core',
  },

  // === Process ===
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
  'executing-plans': {
    name: 'executing-plans',
    description: 'Step-by-step execution of approved plan documents',
    category: 'process',
  },
  'subagent-driven-development': {
    name: 'subagent-driven-development',
    description: 'Same-session execution with two-stage review gates',
    category: 'process',
  },
  'dispatching-parallel-agents': {
    name: 'dispatching-parallel-agents',
    description: 'Coordinate multiple independent agents in parallel',
    category: 'process',
  },
  'autonomous-loop': {
    name: 'autonomous-loop',
    description: 'Ralph-style iterative development with autonomous planning and building loops',
    category: 'process',
  },
  'ralph-status': {
    name: 'ralph-status',
    description: 'Structured status reporting with exit signal protocol',
    category: 'process',
  },
  'task-decomposition': {
    name: 'task-decomposition',
    description: 'Hierarchical breakdown, dependency mapping, parallelization',
    category: 'process',
  },

  // === Quality ===
  'code-review': {
    name: 'code-review',
    description: 'Quality verification against plan and standards',
    category: 'quality',
  },
  'testing-strategy': {
    name: 'testing-strategy',
    description: 'Choose testing approach based on project context',
    category: 'quality',
  },
  'test-driven-development': {
    name: 'test-driven-development',
    description: 'TDD workflow with RED-GREEN-REFACTOR cycle',
    category: 'quality',
  },
  'systematic-debugging': {
    name: 'systematic-debugging',
    description: '4-phase debugging methodology with root cause analysis',
    category: 'quality',
  },
  'security-review': {
    name: 'security-review',
    description: 'OWASP Top 10, auth patterns, input validation, secrets',
    category: 'quality',
  },
  'performance-optimization': {
    name: 'performance-optimization',
    description: 'Profiling, caching, bundle optimization, Web Vitals',
    category: 'quality',
  },
  'acceptance-testing': {
    name: 'acceptance-testing',
    description: 'Acceptance-driven backpressure with behavioral validation gates',
    category: 'quality',
  },
  'llm-as-judge': {
    name: 'llm-as-judge',
    description: 'Non-deterministic validation for subjective quality criteria',
    category: 'quality',
  },
  'senior-frontend': {
    name: 'senior-frontend',
    description: 'React/Next.js/TypeScript specialist, >85% test coverage',
    category: 'quality',
  },
  'senior-backend': {
    name: 'senior-backend',
    description: 'API design, microservices, event-driven architecture',
    category: 'quality',
  },
  'senior-architect': {
    name: 'senior-architect',
    description: 'System design, scalability, trade-off analysis, ADRs',
    category: 'quality',
  },
  'senior-fullstack': {
    name: 'senior-fullstack',
    description: 'End-to-end development across the full stack',
    category: 'quality',
  },
  'clean-code': {
    name: 'clean-code',
    description: 'SOLID, DRY, code smells, refactoring patterns',
    category: 'quality',
  },
  'react-best-practices': {
    name: 'react-best-practices',
    description: 'React hooks, context, suspense, server components',
    category: 'quality',
  },
  'webapp-testing': {
    name: 'webapp-testing',
    description: 'Playwright-based web testing, screenshots, browser logs',
    category: 'quality',
  },
  'senior-prompt-engineer': {
    name: 'senior-prompt-engineer',
    description: 'Prompt design, optimization, chain-of-thought',
    category: 'quality',
  },
  'senior-data-scientist': {
    name: 'senior-data-scientist',
    description: 'ML pipelines, statistical analysis, experiment design',
    category: 'quality',
  },

  // === Documentation ===
  'prd-generation': {
    name: 'prd-generation',
    description: 'Generate Product Requirements Documents',
    category: 'documentation',
  },
  'tech-docs-generator': {
    name: 'tech-docs-generator',
    description: 'Generate technical documentation from code',
    category: 'documentation',
  },
  'writing-skills': {
    name: 'writing-skills',
    description: 'Create new skills with TDD and best practices',
    category: 'documentation',
  },
  'spec-writing': {
    name: 'spec-writing',
    description: 'JTBD-based specification writing with acceptance criteria',
    category: 'documentation',
  },
  'reverse-engineering-specs': {
    name: 'reverse-engineering-specs',
    description: 'Generate implementation-free specs from existing codebases',
    category: 'documentation',
  },

  // === Design ===
  'api-design': {
    name: 'api-design',
    description: 'Structured API endpoint design with OpenAPI spec',
    category: 'design',
  },
  'frontend-ui-design': {
    name: 'frontend-ui-design',
    description: 'Component architecture, responsive design, accessibility',
    category: 'design',
  },
  'database-schema-design': {
    name: 'database-schema-design',
    description: 'Data modeling, migrations, indexing, query optimization',
    category: 'design',
  },

  // === Operations ===
  'deployment': {
    name: 'deployment',
    description: 'CI/CD pipeline generation and deploy checklists',
    category: 'operations',
  },
  'using-git-worktrees': {
    name: 'using-git-worktrees',
    description: 'Isolated development environments with git worktrees',
    category: 'operations',
  },
  'finishing-a-development-branch': {
    name: 'finishing-a-development-branch',
    description: 'Structured branch completion with merge options',
    category: 'operations',
  },
  'git-commit-helper': {
    name: 'git-commit-helper',
    description: 'Conventional commits, semantic versioning, changelogs',
    category: 'operations',
  },
  'senior-devops': {
    name: 'senior-devops',
    description: 'CI/CD, Docker, Kubernetes, infrastructure-as-code',
    category: 'operations',
  },
  'mcp-builder': {
    name: 'mcp-builder',
    description: 'MCP server development, tools, resources, transport layers',
    category: 'operations',
  },
  'agent-development': {
    name: 'agent-development',
    description: 'Building AI agents, tool use, memory, planning',
    category: 'operations',
  },

  // === Creative ===
  'ui-ux-pro-max': {
    name: 'ui-ux-pro-max',
    description: 'Full UI/UX design intelligence with 67 styles, 161 palettes, 57 fonts, 99 UX guidelines, 25 chart types',
    category: 'creative',
  },
  'ui-design-system': {
    name: 'ui-design-system',
    description: 'Design tokens, component libraries, Tailwind CSS, responsive patterns',
    category: 'creative',
  },
  'canvas-design': {
    name: 'canvas-design',
    description: 'HTML Canvas, SVG, data visualization, generative art',
    category: 'creative',
  },
  'mobile-design': {
    name: 'mobile-design',
    description: 'React Native, Flutter, SwiftUI, platform HIG compliance',
    category: 'creative',
  },
  'ux-researcher-designer': {
    name: 'ux-researcher-designer',
    description: 'User research, personas, journey maps, usability testing',
    category: 'creative',
  },
  'artifacts-builder': {
    name: 'artifacts-builder',
    description: 'Generate standalone artifacts, interactive demos, prototypes',
    category: 'creative',
  },

  // === Business ===
  'seo-optimizer': {
    name: 'seo-optimizer',
    description: 'Technical SEO, meta tags, structured data, Core Web Vitals',
    category: 'business',
  },
  'content-research-writer': {
    name: 'content-research-writer',
    description: 'Research methodology, long-form content, citations',
    category: 'business',
  },
  'content-creator': {
    name: 'content-creator',
    description: 'Marketing copy, social media, brand voice',
    category: 'business',
  },

  // === Document Processing ===
  'docx-processing': {
    name: 'docx-processing',
    description: 'Word doc generation, template filling',
    category: 'document-processing',
  },
  'pdf-processing': {
    name: 'pdf-processing',
    description: 'PDF generation, form filling, OCR, merge/split',
    category: 'document-processing',
  },
  'xlsx-processing': {
    name: 'xlsx-processing',
    description: 'Excel manipulation, formulas, charts',
    category: 'document-processing',
  },

  // === Communication ===
  'email-composer': {
    name: 'email-composer',
    description: 'Professional email drafting, tone adjustment',
    category: 'communication',
  },

  // === Productivity ===
  'file-organizer': {
    name: 'file-organizer',
    description: 'Project structure, file naming, directory architecture',
    category: 'productivity',
  },
};

export const AGENTS: Record<string, Agent> = {
  // === Existing 9 ===
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
  'spec-reviewer': {
    name: 'spec-reviewer',
    description: 'Reviews implementation against spec compliance',
  },
  'quality-reviewer': {
    name: 'quality-reviewer',
    description: 'Reviews code quality, patterns, performance, security',
  },
  'loop-orchestrator': {
    name: 'loop-orchestrator',
    description: 'Manages autonomous development loop iterations',
  },
  'spec-writer': {
    name: 'spec-writer',
    description: 'Generates JTBD specifications with acceptance criteria',
  },
  'acceptance-judge': {
    name: 'acceptance-judge',
    description: 'Evaluates subjective quality via LLM-as-judge pattern',
  },

  // === 9 New ===
  'frontend-developer': {
    name: 'frontend-developer',
    description: 'Three-phase frontend dev with context discovery, development, handoff',
  },
  'ui-ux-designer': {
    name: 'ui-ux-designer',
    description: 'Design system generation, component specs, style guides',
  },
  'backend-architect': {
    name: 'backend-architect',
    description: 'Service boundaries, contract-first API, scaling',
  },
  'context-manager': {
    name: 'context-manager',
    description: 'Project context tracking, dependency mapping',
  },
  'database-architect': {
    name: 'database-architect',
    description: 'Multi-DB strategy, domain-driven design, event sourcing',
  },
  'architect-reviewer': {
    name: 'architect-reviewer',
    description: 'Architecture review, scalability assessment, tech debt',
  },
  'typescript-pro': {
    name: 'typescript-pro',
    description: 'Advanced type patterns, conditional types, branded types',
  },
  'task-decomposer': {
    name: 'task-decomposer',
    description: 'Hierarchical task breakdown, parallelization strategy',
  },
  'mobile-developer': {
    name: 'mobile-developer',
    description: 'Cross-platform mobile, platform-specific patterns',
  },
};

export const COMMANDS: Record<string, Command> = {
  // === Existing 14 ===
  'plan': { name: 'plan', skill: 'planning', description: 'Start structured planning' },
  'review': { name: 'review', skill: 'code-review', description: 'Request code review' },
  'prd': { name: 'prd', skill: 'prd-generation', description: 'Generate a PRD' },
  'learn': { name: 'learn', skill: 'self-learning', description: 'Scan and learn project context' },
  'docs': { name: 'docs', skill: 'tech-docs-generator', description: 'Generate technical docs' },
  'tdd': { name: 'tdd', skill: 'test-driven-development', description: 'Start TDD workflow' },
  'debug': { name: 'debug', skill: 'systematic-debugging', description: 'Start debugging methodology' },
  'verify': { name: 'verify', skill: 'verification-before-completion', description: 'Verify completion claim' },
  'execute': { name: 'execute', skill: 'executing-plans', description: 'Execute an approved plan' },
  'worktree': { name: 'worktree', skill: 'using-git-worktrees', description: 'Set up git worktree' },
  'brainstorm': { name: 'brainstorm', skill: 'brainstorming', description: 'Start brainstorming session' },
  'ralph': { name: 'ralph', skill: 'autonomous-loop', description: 'Start Ralph autonomous development loop' },
  'specs': { name: 'specs', skill: 'spec-writing', description: 'Write or audit specifications' },
  'loop': { name: 'loop', skill: 'autonomous-loop', description: 'Start autonomous loop iteration' },

  // === 15 New ===
  'frontend': { name: 'frontend', skill: 'senior-frontend', description: 'Senior frontend development' },
  'backend': { name: 'backend', skill: 'senior-backend', description: 'Senior backend development' },
  'architect': { name: 'architect', skill: 'senior-architect', description: 'Architecture design and review' },
  'fullstack': { name: 'fullstack', skill: 'senior-fullstack', description: 'Full-stack development' },
  'design-system': { name: 'design-system', skill: 'ui-design-system', description: 'Design system generation' },
  'ui-ux': { name: 'ui-ux', skill: 'ui-ux-pro-max', description: 'UI/UX design intelligence' },
  'mobile': { name: 'mobile', skill: 'mobile-design', description: 'Mobile design patterns' },
  'clean': { name: 'clean', skill: 'clean-code', description: 'Clean code review' },
  'devops': { name: 'devops', skill: 'senior-devops', description: 'DevOps and infrastructure' },
  'agent': { name: 'agent', skill: 'agent-development', description: 'AI agent development' },
  'seo': { name: 'seo', skill: 'seo-optimizer', description: 'SEO optimization' },
  'email': { name: 'email', skill: 'email-composer', description: 'Email composition' },
  'mcp': { name: 'mcp', skill: 'mcp-builder', description: 'MCP server development' },
  'commit': { name: 'commit', skill: 'git-commit-helper', description: 'Git commit helper' },
  'decompose': { name: 'decompose', skill: 'task-decomposition', description: 'Task decomposition' },
};

export const MEMORY_FILES: string[] = [
  'project-context.md',
  'learned-patterns.md',
  'user-preferences.md',
  'decisions-log.md',
  'improvement-log.md',
];

export const SKILL_CATEGORIES: Record<SkillCategory, string> = {
  core: 'Core (always recommended)',
  process: 'Process & Workflow',
  quality: 'Quality Assurance',
  documentation: 'Documentation',
  design: 'Design',
  operations: 'Operations',
  creative: 'Creative',
  business: 'Business',
  'document-processing': 'Document Processing',
  productivity: 'Productivity',
  communication: 'Communication',
};
