# Project Development Guidelines

## Core Principles

1. **Always plan before implementing** — Use `/plan` or the planning skill before writing any code
2. **Always use skills** — If a toolkit skill might apply, invoke it before taking action
3. **Always use subagents** — Dispatch subagents for independent parallel work without asking
4. **Never fail silently** — Try at least 3 approaches before escalating (resilient-execution)
5. **Self-learn continuously** — Discover and remember project context, patterns, preferences
6. **Be extremely detailed** — In all plans, reviews, documentation, and communication

## Workflow

### For New Features
1. `/brainstorm` or brainstorming skill — explore the idea, create design doc
2. `/plan` or planning skill — create implementation plan with bite-sized tasks
3. Task management skill — execute plan with tracked progress
4. `/review` or code-review skill — verify against plan and standards

### For Bug Fixes
1. Resilient execution skill — systematic debugging with 3+ approaches
2. Code review skill — verify the fix
3. Commit with descriptive message

### For Documentation
1. `/docs` or tech-docs-generator skill — generate from code
2. `/prd` or prd-generation skill — create product requirements

### For API Work
1. API design skill — design endpoints, generate OpenAPI spec
2. Planning skill — create implementation plan
3. Testing strategy skill — define test approach

## Quality Gates

- No implementation without an approved plan
- No completion claims without verification (run tests, check output)
- No merge without code review
- Evidence before assertions, always

## Memory System

Project context and learned patterns are stored in `memory/`:
- `project-context.md` — Tech stack, architecture, dependencies
- `learned-patterns.md` — Coding conventions and patterns
- `user-preferences.md` — Communication and workflow preferences
- `decisions-log.md` — Architectural decisions with rationale

These files are auto-loaded on session start and updated by the self-learning skill.

## Available Commands

| Command | Purpose |
|---------|---------|
| `/plan` | Start structured planning |
| `/review` | Request code review |
| `/prd` | Generate PRD |
| `/learn` | Scan and learn project |
| `/docs` | Generate technical docs |
