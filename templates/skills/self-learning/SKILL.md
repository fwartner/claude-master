---
name: self-learning
description: Use when starting work on a new or unfamiliar project, when encountering unexpected patterns, when user corrects your assumptions, or when explicitly invoked via /learn - auto-discovers and remembers project context through structured codebase analysis
---

## Overview

The self-learning skill automatically discovers, understands, and persists project context across sessions. It builds a mental model of the codebase, tech stack, conventions, and team preferences by scanning actual project artifacts. Without self-learning, every session starts from zero — with it, the agent accumulates institutional knowledge that improves accuracy and reduces errors over time.

**Announce at start:** "I'm using the self-learning skill to understand this project."

---

## Phase 1: Trigger Identification

Determine which trigger activated this skill:

| Trigger | Context | Action |
|---------|---------|--------|
| New project | No memory files exist | Full discovery (Phases 2-5) |
| Unfamiliar area | Working in unknown part of codebase | Targeted discovery (Phase 2-3 for that area) |
| User correction | User says "that's wrong" or corrects an assumption | Correction protocol (Phase 6) |
| Explicit `/learn` | User invokes the command | Full discovery (Phases 2-5) |
| Session start | Memory files exist but may be stale | Load and validate memory (Phase 7) |

> **STOP: Identify your trigger before proceeding. Different triggers require different phases.**

---

## Phase 2: Project Structure Scan

Use Explore agents to examine these files in order of priority:

| File/Directory | What It Reveals | Priority |
|----------------|----------------|----------|
| `package.json` / `pyproject.toml` / `go.mod` / `Cargo.toml` / `composer.json` | Tech stack, dependencies, scripts | Critical |
| `README.md` / `CLAUDE.md` / `AGENTS.md` | Project purpose, conventions, rules | Critical |
| Directory structure (top 2 levels) | Architecture pattern (monorepo, MVC, hexagonal, etc.) | Critical |
| `tsconfig.json` / `eslint.config.*` / `.prettierrc` / `phpstan.neon` | Coding standards, strictness level | High |
| `.gitignore` | What is excluded, deployment hints | High |
| `docker-compose.yml` / `Dockerfile` | Infrastructure, services | Medium |
| `.github/workflows/` / `.gitlab-ci.yml` | CI/CD setup, required checks | Medium |
| `.env.example` | Environment variables, external services | Medium |
| `specs/` / `docs/` | Existing specifications and documentation | Medium |

**Action:** For each file found, extract key facts. Do NOT read every file — scan strategically.

> **STOP: Complete the structure scan before analyzing code patterns.**

---

## Phase 3: Code Pattern Analysis

Examine 3-5 representative files to identify patterns:

| Pattern Category | What to Look For | Example Indicators |
|-----------------|------------------|-------------------|
| Naming conventions | Variable/function/file naming | camelCase, snake_case, kebab-case, PascalCase |
| Import/export | Module organization | Barrel exports, relative vs absolute paths, path aliases |
| Error handling | How failures are managed | try/catch, Result types, error boundaries, custom exceptions |
| Testing patterns | Test framework and style | File naming (`*.test.ts` vs `*.spec.ts`), structure (describe/it vs test) |
| State management | How data flows | Redux, Zustand, Context, Vuex, Pinia, Livewire |
| API patterns | Communication style | REST, GraphQL, tRPC, RPC, WebSocket |
| Database access | Data layer approach | ORM (Prisma, Eloquent, TypeORM), raw SQL, query builder |
| Component patterns | UI structure | Atomic design, feature folders, co-located styles |

**Action:** Open 3-5 files from different areas of the codebase. Record observed patterns with specific examples.

---

## Phase 4: Git History Analysis

```bash
git log --oneline -20          # Recent commits — development velocity, commit style
git shortlog -sn -20           # Active contributors
git branch -a                  # Branching strategy
git log --diff-filter=A --name-only --pretty=format: -10 | head -30  # Recently added files
```

**Extract:** Development velocity, commit message conventions, branching strategy, active areas.

> **STOP: Complete all discovery phases before persisting to memory.**

---

## Phase 5: Persist to Memory

Update the following memory files (create if they do not exist, append if they do):

### `memory/project-context.md`
```markdown
# Project Context
<!-- Updated by self-learning skill -->
<!-- Last updated: YYYY-MM-DD -->

## Purpose
[What this project does, who it is for]

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

### `memory/learned-patterns.md`
```markdown
# Learned Patterns
<!-- Updated by self-learning skill -->
<!-- Last updated: YYYY-MM-DD -->

## Naming Conventions
[What was observed with specific examples]

## Code Organization
[Import patterns, file structure, module boundaries]

## Error Handling
[How errors are handled in this project with examples]

## Testing Approach
[Framework, patterns, naming, coverage expectations]
```

### `memory/user-preferences.md`
```markdown
# User Preferences
<!-- Updated by self-learning skill -->
<!-- Last updated: YYYY-MM-DD -->

## Communication Style
[Terse? Detailed? Prefers code over explanation?]

## Workflow Preferences
[PR workflow? Branch naming? Commit style?]

## Review Preferences
[What they focus on in reviews?]
```

### `memory/decisions-log.md`
```markdown
# Decisions Log
<!-- Updated by self-learning and brainstorming skills -->

## YYYY-MM-DD: [Decision Title]
**Decision:** [What was decided]
**Context:** [Why this came up]
**Rationale:** [Why this was chosen over alternatives]
**Alternatives considered:** [What else was considered]
```

---

## Phase 6: Correction Protocol

When the user corrects an assumption:

1. **Acknowledge** the correction immediately — do not defend the wrong assumption
2. **Identify** which memory file should be updated
3. **Update** the memory file with the correction, including date and context
4. **Apply** the correction to current work immediately
5. **Propagate** — check if the correction invalidates other assumptions in memory

| Correction Type | Memory File to Update | Example |
|----------------|----------------------|---------|
| Naming convention wrong | `learned-patterns.md` | "We use snake_case, not camelCase" |
| Tech stack wrong | `project-context.md` | "We use Vitest, not Jest" |
| Workflow preference | `user-preferences.md` | "Always create PRs, never push to main" |
| Architecture misunderstanding | `project-context.md` | "That is a microservice, not a monolith" |
| Decision context | `decisions-log.md` | "We chose X because of Y, not Z" |

> **Do NOT skip the memory update. Corrections that are not persisted will be repeated.**

---

## Phase 7: Session Start — Memory Validation

When memory files already exist:

1. Load all memory files from `memory/` directory
2. Check `Last updated` dates — flag anything older than 30 days
3. Spot-check 2-3 facts against current codebase (e.g., does `package.json` still list the same framework?)
4. If discrepancies found, run a targeted re-scan of the changed area
5. Update stale entries with current information

---

## Decision Table: Discovery Depth

| Situation | Discovery Depth | Time Budget |
|-----------|----------------|-------------|
| Brand new project, no memory files | Full (all phases) | 3-5 minutes |
| New area of known project | Targeted (Phase 2-3 for that area only) | 1-2 minutes |
| User correction | Correction protocol only (Phase 6) | 30 seconds |
| Session start with existing memory | Validation only (Phase 7) | 1 minute |
| Major refactor detected (many changed files) | Full re-scan | 3-5 minutes |

---

## Anti-Patterns / Common Mistakes

| What NOT to Do | Why It Fails | What to Do Instead |
|----------------|-------------|-------------------|
| Read every file in the project | Wastes context window, slow | Scan strategically: config files first, then 3-5 representative code files |
| Assume conventions from one file | One file may be an outlier | Verify patterns across 2+ files before persisting |
| Overwrite memory files completely | Loses historical context and user corrections | Append or update specific sections, preserve history |
| Skip git history | Misses development velocity and team patterns | Always check recent commits and contributors |
| Persist guesses as facts | Poisons future sessions with wrong context | Only persist observations backed by evidence |
| Ignore user corrections | Repeats the same mistakes | Corrections override observations immediately |
| Deep-dive into implementation details | Loses the forest for the trees | Focus on patterns and conventions, not specific logic |
| Skip memory validation on session start | Uses stale context | Always spot-check memory against current codebase |

---

## Anti-Rationalization Guards

| Thought | Reality |
|---------|---------|
| "I already know this framework" | You do not know THIS project's conventions. Scan. |
| "The memory files are recent enough" | Spot-check anyway. Code changes fast. |
| "This correction is minor" | Minor corrections prevent major errors. Persist it. |
| "I will remember this without writing it down" | You will not. Sessions are independent. Persist to memory. |
| "Scanning will take too long" | Not scanning leads to wrong assumptions that take longer to fix. |

> **Do NOT skip memory persistence. If you discovered it, write it down.**

---

## Integration Points

| Skill | Relationship |
|-------|-------------|
| `using-toolkit` | Triggers self-learning at session start |
| `brainstorming` | Loads project context before idea generation |
| `planning` | Uses learned patterns to propose consistent approaches |
| `code-review` | Checks code against learned conventions |
| `auto-improvement` | Records discovery effectiveness metrics |
| `resilient-execution` | Failure patterns inform future approach selection |

---

## Concrete Examples

### Discovery Command Sequence
```bash
# Step 1: Identify tech stack
cat package.json | head -50
# or
cat composer.json | head -50
# or
cat pyproject.toml

# Step 2: Check project structure
ls -la
ls -la src/ || ls -la app/ || ls -la lib/

# Step 3: Examine coding standards
cat tsconfig.json 2>/dev/null || cat phpstan.neon 2>/dev/null
cat .eslintrc* 2>/dev/null || cat .prettierrc* 2>/dev/null

# Step 4: Git activity
git log --oneline -20
git shortlog -sn -20
```

### Memory Update After Correction
```markdown
## 2026-03-15: Naming Convention Correction
**Previous assumption:** Project uses camelCase for database columns
**Correction:** Project uses snake_case for database columns (user corrected)
**Evidence:** Checked `migrations/` directory — all columns use snake_case
**Updated:** learned-patterns.md, Naming Conventions section
```

---

## Key Principles

- **Observe, do not assume** — base learnings on evidence from the codebase
- **Incremental updates** — append to memory files, do not overwrite
- **Verify before persisting** — double-check observations with 2+ examples
- **Respect corrections** — user corrections override observations immediately
- **Stay current** — re-scan when significant changes occur

---

## Skill Type

**RIGID** — Discovery phases must be followed in order. Memory persistence is mandatory. Corrections must be recorded immediately. Do not skip phases or rationalize away the need to scan.
