---
name: self-learning
description: Use when starting work on a new or unfamiliar project, when encountering unexpected patterns, or when user corrects your assumptions - auto-discovers and remembers project context
---

# Self-Learning

## Overview

Automatically discover, understand, and remember project context. Build a mental model of the codebase, tech stack, conventions, and team preferences. Persist learnings to memory files for future sessions.

**Announce at start:** "I'm using the self-learning skill to understand this project."

## When to Activate

- Starting work on a new/unfamiliar project
- User corrects an assumption you made
- You encounter unexpected patterns or conventions
- Explicitly invoked via `/learn` command

## Discovery Process

### Step 1: Scan Project Structure

Use Explore agents to examine:
- `package.json` / `pyproject.toml` / `go.mod` / `Cargo.toml` — tech stack, dependencies
- `README.md` / `CLAUDE.md` — project purpose, conventions, rules
- `.gitignore` — what's excluded, deployment hints
- Directory structure — architecture patterns (monorepo, MVC, hexagonal, etc.)
- `tsconfig.json` / `eslint.config.*` / `.prettierrc` — coding standards
- `docker-compose.yml` / `Dockerfile` — infrastructure
- `.github/workflows/` — CI/CD setup

### Step 2: Analyze Code Patterns

Examine 3-5 representative files to identify:
- Naming conventions (camelCase, snake_case, kebab-case)
- Import/export patterns (barrel exports, relative vs absolute)
- Error handling patterns (try/catch, Result types, error boundaries)
- Testing patterns (framework, file naming, test structure)
- State management approach
- API patterns (REST, GraphQL, tRPC)
- Database access patterns (ORM, raw SQL, query builder)

### Step 3: Check Git History

```bash
git log --oneline -20  # Recent activity
git shortlog -sn -20   # Active contributors
```

Understand: development velocity, commit style, branching strategy.

### Step 4: Persist to Memory

Update the following memory files (create if they don't exist, append if they do):

**`memory/project-context.md`**
```markdown
# Project Context
<!-- Updated by self-learning skill -->
<!-- Last updated: YYYY-MM-DD -->

## Purpose
[What this project does, who it's for]

## Tech Stack
- Language: [e.g., TypeScript 5.x]
- Framework: [e.g., Next.js 15]
- Database: [e.g., PostgreSQL via Prisma]
- Testing: [e.g., Vitest + Playwright]
- CI/CD: [e.g., GitHub Actions]

## Architecture
[e.g., Monorepo with apps/ and packages/]
[Key directories and their purposes]

## Key Dependencies
[Critical libraries and their roles]
```

**`memory/learned-patterns.md`**
```markdown
# Learned Patterns
<!-- Updated by self-learning skill -->

## Naming Conventions
[What was observed]

## Code Organization
[Import patterns, file structure]

## Error Handling
[How errors are handled in this project]

## Testing Approach
[Framework, patterns, naming]
```

**`memory/user-preferences.md`**
```markdown
# User Preferences
<!-- Updated by self-learning skill -->

## Communication Style
[Terse? Detailed? Prefers code over explanation?]

## Workflow Preferences
[PR workflow? Branch naming? Commit style?]

## Review Preferences
[What they focus on in reviews?]
```

**`memory/decisions-log.md`**
```markdown
# Decisions Log
<!-- Updated by self-learning and brainstorming skills -->

## YYYY-MM-DD: [Decision Title]
**Decision:** [What was decided]
**Context:** [Why this came up]
**Rationale:** [Why this was chosen over alternatives]
**Alternatives considered:** [What else was considered]
```

## On User Correction

When the user corrects an assumption:
1. Acknowledge the correction
2. Identify which memory file should be updated
3. Update the memory file immediately
4. Apply the correction to current work

## Integration Points

- **Session start hook** reads memory files to pre-load context
- **Brainstorming skill** triggers self-learning to load context
- **Planning skill** uses learned patterns to propose consistent approaches
- **Code review skill** checks against learned conventions

## Key Principles

- **Observe, don't assume** — base learnings on evidence from the codebase
- **Incremental updates** — append to memory files, don't overwrite
- **Verify before persisting** — double-check observations with 2+ examples
- **Respect corrections** — user corrections override observations immediately
- **Stay current** — re-scan when significant changes occur
