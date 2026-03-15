---
name: using-toolkit
description: Use when starting any conversation, receiving a new task, or when uncertain which skill applies - establishes how to find and use all 64 toolkit skills, requiring Skill tool invocation before ANY response including clarifying questions
---

<EXTREMELY-IMPORTANT>
If you think there is even a 1% chance a skill might apply to what you are doing, you ABSOLUTELY MUST invoke the skill.

IF A SKILL APPLIES TO YOUR TASK, YOU DO NOT HAVE A CHOICE. YOU MUST USE IT.

This is not negotiable. This is not optional. You cannot rationalize your way out of this.
</EXTREMELY-IMPORTANT>

## Overview

The using-toolkit skill is the master catalog and dispatch system for all 64 skills in the superkit-agents toolkit. It ensures every conversation begins with proper skill identification, prevents rationalization of skill skipping, and provides workflow patterns for common task types. Without this skill, agents operate without structure — with it, they gain deterministic, quality-gated workflows.

## How to Access Skills

**In Claude Code:** Use the `Skill` tool. When you invoke a skill, its content is loaded and presented to you — follow it directly. Never use the Read tool on skill files.

---

## Phase 1: Skill Identification

**At the start of EVERY task, before ANY action (including clarifying questions):**

1. Read the user's request carefully
2. Scan the skill catalog below for matches
3. Identify ALL skills that could apply (even at 1% relevance)
4. Invoke each matching skill using the Skill tool

> **STOP: Do NOT proceed to any response until you have checked for and invoked all relevant skills.**

---

## Phase 2: Skill Prioritization

When multiple skills apply, invoke them in this order:

| Priority | Category | Skills | Purpose |
|----------|----------|--------|---------|
| 1 | Process | brainstorming, planning, task-management, autonomous-loop, task-decomposition | HOW to approach |
| 2 | Specialist | senior-frontend, senior-backend, senior-architect, laravel-specialist, php-specialist | Domain expertise |
| 3 | Quality | TDD, code-review, testing-strategy, acceptance-testing, clean-code | Validate the work |
| 4 | Documentation | prd-generation, tech-docs-generator, spec-writing | Capture the work |
| 5 | Design | api-design, frontend-ui-design, database-schema-design | Guide specifics |
| 6 | Operations | deployment, git-worktrees, finishing-a-development-branch | Ship the work |
| 7 | Terminal | ralph-status, verification-before-completion | Report and verify |

---

## Phase 3: Skill Execution

After invoking skills, follow their instructions precisely:
- **Rigid skills**: Follow exactly as documented. No adaptation.
- **Flexible skills**: Adapt principles to context while preserving core intent.

> **STOP: After completing the task, invoke `verification-before-completion` before claiming done.**

---

## Available Skills (64 Total)

### Core Skills (6)
| Skill | When to Use |
|-------|------------|
| `using-toolkit` | Session start — establishes skill usage |
| `self-learning` | Starting work on unfamiliar projects, or when corrected |
| `resilient-execution` | When an approach fails — ensures retry with alternatives |
| `circuit-breaker` | Autonomous loops, repeated operations, stagnation detection |
| `auto-improvement` | Self-improving system, tracks effectiveness, learns from errors |
| `verification-before-completion` | Before claiming ANY task is complete |

### Process & Workflow Skills (9)
| Skill | When to Use |
|-------|------------|
| `planning` | Before ANY implementation — forces structured planning |
| `brainstorming` | Before creative work — exploring ideas, features, designs |
| `task-management` | Breaking work into tracked steps during implementation |
| `executing-plans` | Executing approved plan documents step by step |
| `subagent-driven-development` | Multi-task execution with two-stage review gates |
| `dispatching-parallel-agents` | Running multiple independent tasks concurrently |
| `autonomous-loop` | Ralph-style iterative autonomous development loops |
| `ralph-status` | End of every autonomous loop iteration — structured progress reporting |
| `task-decomposition` | Hierarchical task breakdown, dependency mapping, parallelization |

### Quality Assurance Skills (17)
| Skill | When to Use |
|-------|------------|
| `code-review` | After completing tasks, before committing |
| `test-driven-development` | Writing any new code (RED-GREEN-REFACTOR) |
| `systematic-debugging` | Investigating bugs, errors, unexpected behavior |
| `testing-strategy` | Choosing testing approach for a project |
| `security-review` | Reviewing for vulnerabilities, auth, input validation |
| `performance-optimization` | Optimizing speed, reducing load times |
| `acceptance-testing` | Validating implementation meets spec acceptance criteria |
| `llm-as-judge` | Evaluating subjective quality (tone, UX, readability, aesthetics) |
| `senior-frontend` | React/Next.js/TypeScript specialist with >85% test coverage |
| `senior-backend` | API design, microservices, event-driven architecture |
| `senior-architect` | System design, scalability, trade-off analysis, ADRs |
| `senior-fullstack` | End-to-end development across the full stack |
| `clean-code` | SOLID, DRY, code smells, refactoring patterns |
| `react-best-practices` | React hooks, context, suspense, server components |
| `webapp-testing` | Playwright-based web testing, screenshots, browser logs |
| `senior-prompt-engineer` | Prompt design, optimization, chain-of-thought |
| `senior-data-scientist` | ML pipelines, statistical analysis, experiment design |

### Documentation Skills (5)
| Skill | When to Use |
|-------|------------|
| `prd-generation` | Generating Product Requirements Documents |
| `tech-docs-generator` | Generating or updating technical documentation |
| `writing-skills` | Creating new skills, commands, or agent definitions |
| `spec-writing` | Writing specifications with JTBD methodology and acceptance criteria |
| `reverse-engineering-specs` | Generating implementation-free specs from existing codebases |

### Design Skills (3)
| Skill | When to Use |
|-------|------------|
| `api-design` | Designing API endpoints and generating specs |
| `frontend-ui-design` | Component architecture, responsive design, accessibility |
| `database-schema-design` | Data modeling, migrations, indexing |

### Operations Skills (7)
| Skill | When to Use |
|-------|------------|
| `deployment` | Setting up CI/CD pipelines and deploy checklists |
| `using-git-worktrees` | Creating isolated development environments |
| `finishing-a-development-branch` | Completing work on a branch, preparing to merge |
| `git-commit-helper` | Conventional commits, semantic versioning, changelogs |
| `senior-devops` | CI/CD, Docker, Kubernetes, infrastructure-as-code |
| `mcp-builder` | MCP server development, tools, resources, transport layers |
| `agent-development` | Building AI agents, tool use, memory, planning |

### Creative Skills (6)
| Skill | When to Use |
|-------|------------|
| `ui-ux-pro-max` | Full UI/UX design intelligence with styles, palettes, fonts, UX guidelines |
| `ui-design-system` | Design tokens, component libraries, Tailwind CSS, responsive patterns |
| `canvas-design` | HTML Canvas, SVG, data visualization, generative art |
| `mobile-design` | React Native, Flutter, SwiftUI, platform HIG compliance |
| `ux-researcher-designer` | User research, personas, journey maps, usability testing |
| `artifacts-builder` | Generate standalone artifacts, interactive demos, prototypes |

### Business Skills (3)
| Skill | When to Use |
|-------|------------|
| `seo-optimizer` | Technical SEO, meta tags, structured data, Core Web Vitals |
| `content-research-writer` | Research methodology, long-form content, citations |
| `content-creator` | Marketing copy, social media, brand voice |

### Document Processing Skills (3)
| Skill | When to Use |
|-------|------------|
| `docx-processing` | Word document generation, template filling |
| `pdf-processing` | PDF generation, form filling, OCR, merge/split |
| `xlsx-processing` | Excel manipulation, formulas, charts |

### Frameworks & Languages Skills (3)
| Skill | When to Use |
|-------|------------|
| `laravel-specialist` | Laravel development — Eloquent, Blade, Livewire, queues, Pest |
| `php-specialist` | Modern PHP 8.x — PSR standards, static analysis, Composer |
| `laravel-boost` | Laravel Boost performance optimization — caching, queries, N+1 |

### Productivity Skills (1)
| Skill | When to Use |
|-------|------------|
| `file-organizer` | Project structure, file naming, directory architecture |

### Communication Skills (1)
| Skill | When to Use |
|-------|------------|
| `email-composer` | Professional email drafting, tone adjustment |

---

## Decision Table: Choosing the Right Skill

| User Request Contains | Primary Skill | Supporting Skills |
|----------------------|---------------|-------------------|
| "build", "implement", "create feature" | `planning` | `brainstorming`, `tdd`, `code-review` |
| "fix", "bug", "error", "broken" | `systematic-debugging` | `tdd`, `resilient-execution` |
| "test", "coverage", "spec" | `test-driven-development` | `testing-strategy`, `acceptance-testing` |
| "review", "check", "audit" | `code-review` | `security-review`, `clean-code` |
| "plan", "how should we" | `planning` | `brainstorming`, `task-decomposition` |
| "deploy", "CI/CD", "pipeline" | `deployment` | `senior-devops` |
| "API", "endpoint", "REST", "GraphQL" | `api-design` | `senior-backend` |
| "React", "Next.js", "component" | `senior-frontend` | `react-best-practices`, `frontend-ui-design` |
| "Laravel", "Eloquent", "Blade", "Livewire" | `laravel-specialist` | `php-specialist`, `laravel-boost` |
| "PHP", "Composer", "PSR" | `php-specialist` | `laravel-specialist` |
| "database", "schema", "migration" | `database-schema-design` | `senior-backend` |
| "design", "UI", "UX" | `ui-ux-pro-max` | `ui-design-system`, `frontend-ui-design` |
| "mobile", "iOS", "Android" | `mobile-design` | `ui-ux-pro-max` |
| "document", "docs", "README" | `tech-docs-generator` | `prd-generation` |
| "spec", "requirements", "PRD" | `spec-writing` | `prd-generation` |
| "autonomous", "loop", "ralph" | `autonomous-loop` | `ralph-status`, `circuit-breaker` |
| "performance", "optimize", "slow" | `performance-optimization` | `laravel-boost` |
| "security", "vulnerability", "auth" | `security-review` | `senior-backend` |
| "SEO", "meta tags", "search engine" | `seo-optimizer` | `content-research-writer` |
| "email", "draft", "compose" | `email-composer` | `content-creator` |
| "PDF", "Word", "Excel" | `pdf-processing` / `docx-processing` / `xlsx-processing` | — |
| "agent", "AI", "tool use" | `agent-development` | `mcp-builder` |
| "MCP", "server", "transport" | `mcp-builder` | `agent-development` |

---

## Workflow Patterns

| Pattern | Skill Chain |
|---------|-------------|
| "Build feature X" | brainstorming -> planning -> executing-plans -> code-review -> verification |
| "Fix bug Y" | systematic-debugging -> TDD -> code-review -> verification |
| "Write new code" | test-driven-development (always) |
| "Run autonomously" | autonomous-loop -> ralph-status -> circuit-breaker |
| "Write specs" | spec-writing (JTBD methodology) |
| "Understand legacy code" | reverse-engineering-specs -> spec-writing (audit) |
| "Check acceptance criteria" | acceptance-testing (backpressure chain) |
| "Validate subjective quality" | llm-as-judge (rubric-based evaluation) |
| "Document the API" | tech-docs-generator or api-design |
| "Create a PRD for Z" | prd-generation |
| "Set up CI/CD" | deployment |
| "How should we test?" | testing-strategy |
| "Design the database" | database-schema-design |
| "Build a UI component" | frontend-ui-design |
| "Check for security issues" | security-review |
| "Make it faster" | performance-optimization |
| "Done with this branch" | finishing-a-development-branch |
| "Design a UI" | ui-ux-pro-max -> ui-design-system -> frontend-ui-design |
| "Build mobile app" | mobile-design -> planning -> tdd |
| "Optimize SEO" | seo-optimizer |
| "Write marketing copy" | content-creator |
| "Process documents" | docx-processing / pdf-processing / xlsx-processing |
| "Compose email" | email-composer |
| "Build an AI agent" | agent-development -> planning -> tdd |
| "Set up infrastructure" | senior-devops -> deployment |
| "Decompose complex task" | task-decomposition -> dispatching-parallel-agents |
| "Build Laravel feature" | laravel-specialist -> planning -> tdd -> code-review |
| "Optimize Laravel app" | laravel-boost -> performance-optimization -> verification |
| "Write PHP code" | php-specialist -> tdd -> clean-code |

---

## Anti-Patterns / Common Mistakes

| What NOT to Do | Why It Fails | What to Do Instead |
|----------------|-------------|-------------------|
| Skip skill check for "simple" tasks | Simple tasks become complex; no skill means no guardrails | Always check the catalog, even for one-liners |
| Invoke skills from memory | Skills evolve between sessions; stale instructions cause errors | Always use the Skill tool to load current version |
| Read skill files with the Read tool | Bypasses the Skill tool integration layer | Use the Skill tool exclusively |
| Invoke only one skill when multiple apply | Missing quality gates, incomplete workflows | Invoke ALL matching skills in priority order |
| Skip verification at the end | Unverified claims lead to broken deliverables | Always invoke `verification-before-completion` last |
| Respond before checking skills | First response sets wrong trajectory | Skill check is ALWAYS the first action |
| Use skills as optional guidelines | Inconsistent quality, missed steps | Rigid skills are mandatory; flexible skills adapt but still apply |

---

## Anti-Rationalization Guards

These thoughts mean STOP — you are rationalizing:

| Thought | Reality |
|---------|---------|
| "This is just a simple question" | Questions are tasks. Check for skills. |
| "I need more context first" | Skill check comes BEFORE clarifying questions. |
| "Let me explore the codebase first" | Skills tell you HOW to explore. Check first. |
| "This doesn't need a formal skill" | If a skill exists, use it. |
| "I remember this skill" | Skills evolve. Read current version. |
| "The skill is overkill" | Simple things become complex. Use it. |
| "I'll just do this one thing first" | Check BEFORE doing anything. |
| "I can skip verification" | NO. Verification-before-completion is mandatory. |
| "Tests aren't needed for this" | TDD is not optional. Write the test first. |
| "I'll review later" | Review NOW. No merge without review. |
| "The loop is stuck, skip ahead" | Circuit breaker protocol. Diagnose, don't skip. |
| "The spec is obvious" | Write it. JTBD methodology. No exceptions. |
| "I can eyeball the quality" | Use LLM-as-judge or deterministic tests. |
| "Acceptance criteria are implicit" | Make them explicit. Given/When/Then. Always. |

---

## Integration Points

| Skill | Relationship to using-toolkit |
|-------|------------------------------|
| `self-learning` | Loads project context that informs skill selection |
| `verification-before-completion` | Terminal checkpoint invoked after all other skills |
| `circuit-breaker` | Safety net when autonomous skill chains stall |
| `auto-improvement` | Tracks which skills are used and their effectiveness |
| `planning` | Most common first skill invoked after toolkit check |
| `resilient-execution` | Activated when any skill's approach fails |

---

## Core Behavioral Rules

1. **Always plan before coding** — No code without an approved plan
2. **Always use TDD** — No production code without a failing test first
3. **Always verify completion** — No claims without fresh evidence
4. **Always review code** — No merge without review
5. **Always use subagents** — Dispatch for independent parallel tasks without asking
6. **Always self-learn** — Continuously discover and remember project context
7. **Never fail** — Try at least 3 approaches before escalating
8. **Always report status** — Produce RALPH_STATUS in autonomous loops
9. **Always protect files** — Never delete config files during autonomous operations
10. **Always write specs** — No implementation without behavioral acceptance criteria

---

## Skill Types

**Rigid** (TDD, debugging, planning, verification, task-management, code-review, autonomous-loop, circuit-breaker, ralph-status, spec-writing, reverse-engineering-specs, acceptance-testing): Follow exactly. Do not adapt away discipline.

**Flexible** (brainstorming, tech-docs, api-design, frontend, database, performance, security-review, testing-strategy, llm-as-judge, prd-generation, laravel-specialist, php-specialist, laravel-boost): Adapt principles to context.

---

## Find Missing Skills

When the 64 toolkit skills don't cover the need:
```bash
npx skills find [query]                    # Search ecosystem
npx skills add <owner/repo@skill> -g -y    # Install
npx skills check                           # Check for updates
```

Prefer skills with 1K+ weekly installs from reputable sources (vercel-labs, anthropics, microsoft).

---

## Skill Type

**RIGID** — Skill checking is mandatory. Every task begins with a catalog scan. No exceptions. No rationalization.
