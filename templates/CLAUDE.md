# Project Development Guidelines

## Core Principles

1. **Always plan before implementing** — No code without an approved plan (`/plan`)
2. **Always use TDD** — No production code without a failing test first (`/tdd`)
3. **Always verify completion** — No claims without fresh evidence (`/verify`)
4. **Always review code** — No merge without review (`/review`)
5. **Always use skills** — If a toolkit skill might apply, invoke it before taking action
6. **Always use subagents** — Dispatch for independent parallel work without asking
7. **Never fail silently** — Try at least 3 approaches before escalating
8. **Self-learn continuously** — Discover and remember project context, patterns, preferences

## Workflow

### For New Features
1. `/brainstorm` — explore the idea, create design doc
2. `/plan` — create implementation plan with bite-sized tasks
3. `/execute` — execute plan with TDD and tracked progress
4. `/review` — verify against plan and standards
5. `/verify` — confirm everything works with fresh evidence

### For Bug Fixes
1. `/debug` — systematic 4-phase debugging methodology
2. `/tdd` — write test that reproduces bug, then fix
3. `/review` — verify the fix
4. `/verify` — confirm fix with fresh evidence

### For Documentation
- `/docs` — generate technical documentation from code
- `/prd` — create Product Requirements Documents

### For API Work
1. API design skill — design endpoints, generate OpenAPI spec
2. `/plan` — create implementation plan
3. Testing strategy skill — define test approach

### For Database Work
1. Database schema design skill — model data, plan migrations
2. `/plan` — create implementation plan
3. `/tdd` — implement with tests

### For Frontend Work
1. Frontend UI design skill — component architecture, accessibility
2. `/plan` — create implementation plan
3. `/tdd` — implement with tests

## Quality Gates

- **No code without an approved plan** (planning skill)
- **No production code without a failing test** (TDD skill)
- **No completion claims without fresh verification** (verification skill)
- **No merge without code review** (code-review skill)
- Evidence before assertions, always

## Available Commands

| Command | Purpose |
|---------|---------|
| `/plan` | Start structured planning |
| `/brainstorm` | Explore ideas and create designs |
| `/execute` | Execute an approved plan |
| `/tdd` | Start TDD workflow |
| `/debug` | Start systematic debugging |
| `/review` | Request code review |
| `/verify` | Verify completion claim |
| `/prd` | Generate PRD |
| `/learn` | Scan and learn project |
| `/docs` | Generate technical docs |
| `/worktree` | Set up git worktree |

## All 25 Skills

Use the `Skill` tool to invoke any skill by name:

**Core:** using-toolkit, self-learning, resilient-execution, verification-before-completion
**Process:** planning, brainstorming, task-management, executing-plans, subagent-driven-development, dispatching-parallel-agents
**Quality:** code-review, test-driven-development, systematic-debugging, testing-strategy, security-review, performance-optimization
**Documentation:** prd-generation, tech-docs-generator, writing-skills
**Design:** api-design, frontend-ui-design, database-schema-design
**Operations:** deployment, using-git-worktrees, finishing-a-development-branch

## Memory System

Project context and learned patterns are stored in `memory/`:
- `project-context.md` — Tech stack, architecture, dependencies
- `learned-patterns.md` — Coding conventions and patterns
- `user-preferences.md` — Communication and workflow preferences
- `decisions-log.md` — Architectural decisions with rationale

These files are auto-loaded on session start and updated by the self-learning skill.
