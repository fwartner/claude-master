# superkit-agents

**Install AI-powered skills, agents, and slash commands into Claude Code in 30 seconds.**

[![npm version](https://img.shields.io/npm/v/@pixelandprocess/superkit-agents)](https://www.npmjs.com/package/@pixelandprocess/superkit-agents)
[![license](https://img.shields.io/npm/l/@pixelandprocess/superkit-agents)](LICENSE)
[![node](https://img.shields.io/node/v/@pixelandprocess/superkit-agents)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](tsconfig.json)
[![CI](https://github.com/fwartner/claude-master/actions/workflows/ci.yml/badge.svg)](https://github.com/fwartner/claude-master/actions/workflows/ci.yml)
[![Test](https://github.com/fwartner/claude-master/actions/workflows/test.yml/badge.svg)](https://github.com/fwartner/claude-master/actions/workflows/test.yml)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## Quick Start

```bash
npx @pixelandprocess/superkit-agents
```

That's it. The interactive wizard walks you through everything. For a full non-interactive install:

```bash
npx @pixelandprocess/superkit-agents --all
```

## What You Get

| 64 Skills | 20 Agents | 31 Commands | Hooks | Memory System |
|:---------:|:--------:|:-----------:|:-----:|:-------------:|
| Structured workflows for every phase of development | Specialized sub-agents for parallel work | Slash commands that trigger skills | Session-start context injection | Persistent project knowledge |

## How It Works

1. **Run the CLI** — `npx @pixelandprocess/superkit-agents`
2. **Pick your skills** — choose from 64 skills across 12 categories, or install all
3. **Files are installed** — skills, agents, commands, hooks, and memory files go into `.claude/` or `.claude-plugin/`
4. **Start Claude Code** — the SessionStart hook loads your toolkit automatically

## Prerequisites

- **Node.js >= 18** (required)
- **Git** (required)
- **Claude Code CLI** (recommended) — `npm install -g @anthropic-ai/claude-code`

The installer checks these automatically and shows OS-specific install commands if anything is missing.

---

## Installation Options

```bash
# Interactive wizard (recommended)
npx @pixelandprocess/superkit-agents

# Full install, no prompts
npx @pixelandprocess/superkit-agents --all

# Global install (available in all projects)
npx @pixelandprocess/superkit-agents --all --global

# Direct mode (no plugin wrapper)
npx @pixelandprocess/superkit-agents --all --direct

# Selective skills only
npx @pixelandprocess/superkit-agents --skills planning,tdd,code-review,autonomous-loop

# Install a third-party plugin
superkit-agents plugin add some-plugin

# Install a local plugin (for development)
superkit-agents plugin add ./my-plugin --local
```

| Mode | Directory | Use Case |
|------|-----------|----------|
| **Plugin** (default) | `.claude-plugin/` | Isolated, portable, easy to update |
| **Direct** | `.claude/` | Merged into existing Claude Code config |

| Scope | Path | Use Case |
|-------|------|----------|
| **Project** (default) | `./.claude/` or `./.claude-plugin/` | Per-project setup |
| **Global** | `~/.claude/` or `~/.claude-plugin/` | Available everywhere |

---

## Skills Overview

<details>
<summary><strong>Core (6)</strong> — Foundation skills always recommended</summary>

| Skill | Description |
|-------|-------------|
| `using-toolkit` | Master skill — establishes how to find and use all toolkit skills |
| `self-learning` | Auto-discover and remember project context |
| `resilient-execution` | Never fail — retry with alternative approaches |
| `circuit-breaker` | Loop stagnation detection, rate limiting, and recovery patterns |
| `auto-improvement` | Self-improving system, tracks effectiveness, learns from errors |
| `verification-before-completion` | 5-step verification gate before any completion claim |

</details>

<details>
<summary><strong>Process & Workflow (9)</strong> — Planning, execution, and autonomous loops</summary>

| Skill | Description |
|-------|-------------|
| `brainstorming` | Creative exploration and design before planning |
| `planning` | Structured planning before any implementation work |
| `task-management` | Break work into discrete tracked steps |
| `executing-plans` | Step-by-step execution of approved plan documents |
| `subagent-driven-development` | Same-session execution with two-stage review gates |
| `dispatching-parallel-agents` | Coordinate multiple independent agents in parallel |
| `autonomous-loop` | Ralph-style iterative development with autonomous planning and building loops |
| `ralph-status` | Structured status reporting with exit signal protocol |
| `task-decomposition` | Hierarchical breakdown, dependency mapping, parallelization |

</details>

<details>
<summary><strong>Quality Assurance (17)</strong> — Testing, review, debugging, and specialist roles</summary>

| Skill | Description |
|-------|-------------|
| `code-review` | Quality verification against plan and standards |
| `test-driven-development` | TDD workflow with RED-GREEN-REFACTOR cycle |
| `testing-strategy` | Choose testing approach based on project context |
| `systematic-debugging` | 4-phase debugging methodology with root cause analysis |
| `security-review` | OWASP Top 10, auth patterns, input validation, secrets |
| `performance-optimization` | Profiling, caching, bundle optimization, Web Vitals |
| `acceptance-testing` | Acceptance-driven backpressure with behavioral validation gates |
| `llm-as-judge` | Non-deterministic validation for subjective quality criteria |
| `senior-frontend` | React/Next.js/TypeScript specialist, >85% test coverage |
| `senior-backend` | API design, microservices, event-driven architecture |
| `senior-architect` | System design, scalability, trade-off analysis, ADRs |
| `senior-fullstack` | End-to-end development across the full stack |
| `clean-code` | SOLID, DRY, code smells, refactoring patterns |
| `react-best-practices` | React hooks, context, suspense, server components |
| `webapp-testing` | Playwright-based web testing, screenshots, browser logs |
| `senior-prompt-engineer` | Prompt design, optimization, chain-of-thought |
| `senior-data-scientist` | ML pipelines, statistical analysis, experiment design |

</details>

<details>
<summary><strong>Design (3)</strong> — API, UI, and database design</summary>

| Skill | Description |
|-------|-------------|
| `api-design` | Structured API endpoint design with OpenAPI spec |
| `frontend-ui-design` | Component architecture, responsive design, accessibility |
| `database-schema-design` | Data modeling, migrations, indexing, query optimization |

</details>

<details>
<summary><strong>Documentation (5)</strong> — PRDs, specs, and technical docs</summary>

| Skill | Description |
|-------|-------------|
| `prd-generation` | Generate Product Requirements Documents |
| `tech-docs-generator` | Generate technical documentation from code |
| `writing-skills` | Create new skills with TDD and best practices |
| `spec-writing` | JTBD-based specification writing with acceptance criteria |
| `reverse-engineering-specs` | Generate implementation-free specs from existing codebases |

</details>

<details>
<summary><strong>Operations (7)</strong> — Git, CI/CD, DevOps, and MCP</summary>

| Skill | Description |
|-------|-------------|
| `deployment` | CI/CD pipeline generation and deploy checklists |
| `using-git-worktrees` | Isolated development environments with git worktrees |
| `finishing-a-development-branch` | Structured branch completion with merge options |
| `git-commit-helper` | Conventional commits, semantic versioning, changelogs |
| `senior-devops` | CI/CD, Docker, Kubernetes, infrastructure-as-code |
| `mcp-builder` | MCP server development, tools, resources, transport layers |
| `agent-development` | Building AI agents, tool use, memory, planning |

</details>

<details>
<summary><strong>Creative (6)</strong> — UI/UX, design systems, mobile, and canvas</summary>

| Skill | Description |
|-------|-------------|
| `ui-ux-pro-max` | Full UI/UX design intelligence with 67 styles, 161 palettes, 57 fonts |
| `ui-design-system` | Design tokens, component libraries, Tailwind CSS, responsive patterns |
| `canvas-design` | HTML Canvas, SVG, data visualization, generative art |
| `mobile-design` | React Native, Flutter, SwiftUI, platform HIG compliance |
| `ux-researcher-designer` | User research, personas, journey maps, usability testing |
| `artifacts-builder` | Generate standalone artifacts, interactive demos, prototypes |

</details>

<details>
<summary><strong>Business (3)</strong> — SEO, content, and marketing</summary>

| Skill | Description |
|-------|-------------|
| `seo-optimizer` | Technical SEO, meta tags, structured data, Core Web Vitals |
| `content-research-writer` | Research methodology, long-form content, citations |
| `content-creator` | Marketing copy, social media, brand voice |

</details>

<details>
<summary><strong>Document Processing (3)</strong> — Word, PDF, and Excel</summary>

| Skill | Description |
|-------|-------------|
| `docx-processing` | Word document generation, template filling |
| `pdf-processing` | PDF generation, form filling, OCR, merge/split |
| `xlsx-processing` | Excel manipulation, formulas, charts |

</details>

<details>
<summary><strong>Productivity & Communication (2)</strong></summary>

| Skill | Description |
|-------|-------------|
| `file-organizer` | Project structure, file naming, directory architecture |
| `email-composer` | Professional email drafting, tone adjustment |

</details>

<details>
<summary><strong>Frameworks & Languages (3)</strong> — Laravel and PHP</summary>

| Skill | Description |
|-------|-------------|
| `laravel-specialist` | Laravel development — Eloquent, Blade, Livewire, queues, Pest testing |
| `php-specialist` | Modern PHP 8.x — enums, fibers, readonly, PSR standards, static analysis |
| `laravel-boost` | Laravel Boost performance optimization — caching, database, Octane |

</details>

---

## Agents & Commands

<details>
<summary><strong>20 Agents</strong> — Specialized sub-agents for parallel work</summary>

| Agent | Description |
|-------|-------------|
| `planner` | Senior architect creating implementation plans |
| `code-reviewer` | Reviews code against plan and standards |
| `prd-writer` | Generates PRD from collected requirements |
| `doc-generator` | Generates technical documentation from code |
| `spec-reviewer` | Reviews implementation against spec compliance |
| `quality-reviewer` | Reviews code quality, patterns, performance, security |
| `loop-orchestrator` | Manages autonomous development loop iterations |
| `spec-writer` | Generates JTBD specifications with acceptance criteria |
| `acceptance-judge` | Evaluates subjective quality via LLM-as-judge pattern |
| `frontend-developer` | Three-phase frontend dev with context discovery, development, handoff |
| `ui-ux-designer` | Design system generation, component specs, style guides |
| `backend-architect` | Service boundaries, contract-first API, scaling |
| `context-manager` | Project context tracking, dependency mapping |
| `database-architect` | Multi-DB strategy, domain-driven design, event sourcing |
| `architect-reviewer` | Architecture review, scalability assessment, tech debt |
| `typescript-pro` | Advanced type patterns, conditional types, branded types |
| `task-decomposer` | Hierarchical task breakdown, parallelization strategy |
| `mobile-developer` | Cross-platform mobile, platform-specific patterns |
| `laravel-developer` | Laravel specialist with Eloquent, Blade, Livewire, and Pest expertise |
| `php-developer` | Modern PHP 8.x development with PSR compliance and static analysis |

</details>

<details>
<summary><strong>31 Slash Commands</strong> — Trigger skills directly in Claude Code</summary>

| Command | Description |
|---------|-------------|
| `/plan` | Start structured planning |
| `/brainstorm` | Start brainstorming session |
| `/execute` | Execute an approved plan |
| `/tdd` | Start TDD workflow |
| `/debug` | Start debugging methodology |
| `/review` | Request code review |
| `/verify` | Verify completion claim |
| `/prd` | Generate a PRD |
| `/learn` | Scan and learn project context |
| `/docs` | Generate technical docs |
| `/worktree` | Set up git worktree |
| `/ralph` | Start Ralph autonomous development loop |
| `/specs` | Write or audit specifications |
| `/loop` | Start autonomous loop iteration |
| `/frontend` | Senior frontend development |
| `/backend` | Senior backend development |
| `/architect` | Architecture design and review |
| `/fullstack` | Full-stack development |
| `/design-system` | Design system generation |
| `/ui-ux` | UI/UX design intelligence |
| `/mobile` | Mobile design patterns |
| `/clean` | Clean code review |
| `/devops` | DevOps and infrastructure |
| `/agent` | AI agent development |
| `/seo` | SEO optimization |
| `/email` | Email composition |
| `/mcp` | MCP server development |
| `/commit` | Git commit helper |
| `/decompose` | Task decomposition |
| `/laravel` | Laravel development |
| `/php` | Modern PHP development |

</details>

---

## Plugin System

Extend superkit-agents with third-party or custom plugins.

### Installing Plugins

```bash
# From npm
superkit-agents plugin add my-awesome-plugin

# From a local directory (symlinks for live dev)
superkit-agents plugin add ./my-plugin --local

# List installed plugins
superkit-agents plugin list

# Remove a plugin
superkit-agents plugin remove my-plugin

# Search npm for plugins
superkit-agents plugin search [query]
```

### Creating Plugins

A plugin is a directory with a `superkit-plugin.json` manifest:

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "Custom skills for my framework",
  "skills": {
    "my-skill": {
      "name": "my-skill",
      "description": "Does something useful",
      "category": "framework",
      "path": "skills/my-skill"
    }
  },
  "agents": {
    "my-agent": { "name": "my-agent", "description": "...", "path": "agents/my-agent.md" }
  },
  "commands": {
    "my-cmd": { "name": "my-cmd", "skill": "my-skill", "description": "...", "path": "commands/my-cmd.md" }
  }
}
```

See [Plugin Development Guide](docs/plugin-development.md) for the full walkthrough.

---

<details>
<summary><strong>Ralph Integration</strong> — Autonomous iterative development loops</summary>

The toolkit integrates key concepts from [Ralph](https://github.com/frankbria/ralph-claude-code) and the [Ralph Playbook](https://github.com/ClaytonFarr/ralph-playbook) — an autonomous AI development methodology by Geoffrey Huntley.

### Autonomous Loop (`/ralph` or `/loop`)

Iterative development cycle: **PLANNING** → **BUILDING** → **STATUS CHECK** → repeat until done.

- **ONE task per loop** — each iteration selects and completes exactly one task
- **Context efficiency** — main context at 40-60% utilization, up to 500 parallel read subagents
- **Upstream/downstream steering** — specs shape inputs, tests/builds/lints create backpressure
- **Dual-condition exit gate** — requires both completion language AND explicit `EXIT_SIGNAL: true`

### Circuit Breaker

Safety mechanism preventing infinite loops and resource exhaustion:

- Opens after 3 loops with no progress, 5 identical errors, or 70% output decline
- 30-minute cooldown before retry
- Rate limiting (configurable calls per hour)
- File protection prevents accidental config deletion

### JTBD Specifications (`/specs`)

Jobs to Be Done methodology for writing implementation-free specs:

- Break requirements into topics of concern
- "One Sentence Without 'And'" test for proper scoping
- Acceptance criteria in Given/When/Then format
- SLC (Simple/Lovable/Complete) release planning

### Acceptance Testing & LLM-as-Judge

- **Acceptance testing** — backpressure chain: specs → tests → code (fix code, not specs)
- **LLM-as-judge** — structured rubric evaluation for subjective criteria (tone, UX, readability)

</details>

---

## Configuration

### CLI Flags

| Flag | Description |
|------|-------------|
| `--all` | Install everything non-interactively |
| `--global` | Install to `~/.claude/` instead of `./.claude/` |
| `--plugin` | Install as a `.claude-plugin/` plugin |
| `--direct` | Install directly into `.claude/` directories |
| `--skills <list>` | Comma-separated list of skills to install |
| `--no-hooks` | Skip hooks installation |
| `--no-memory` | Skip memory structure creation |
| `--no-claude-md` | Skip CLAUDE.md generation |
| `--dry-run` | Show what would be installed without making changes |
| `--skip-checks` | Skip system requirements check |

### Update

```bash
superkit-agents update
```

Checks npm for newer versions and provides upgrade instructions. Your preferences are saved automatically.

---

## FAQ

<details>
<summary><strong>Do I need to install all 64 skills?</strong></summary>

No. The interactive wizard lets you pick exactly the skills you want. You can also use `--skills` to install a specific set. Only `self-learning` and `auto-improvement` are mandatory.

</details>

<details>
<summary><strong>What's the difference between plugin and direct mode?</strong></summary>

**Plugin mode** (default) installs into `.claude-plugin/`, keeping your toolkit isolated and portable. **Direct mode** installs into `.claude/`, merging with any existing Claude Code config. Plugin mode is recommended for most users.

</details>

<details>
<summary><strong>Can I use this alongside other Claude Code plugins?</strong></summary>

Yes. Plugin mode is designed to coexist with other plugins. Each plugin has its own namespace.

</details>

<details>
<summary><strong>How do I create my own skills?</strong></summary>

See the [Skill Authoring Guide](docs/skill-authoring.md). Each skill is a directory with a `SKILL.md` file containing YAML frontmatter and structured instructions.

</details>

<details>
<summary><strong>How do I update to the latest version?</strong></summary>

Run `superkit-agents update` or re-run `npx @pixelandprocess/superkit-agents --all`. Your preferences are saved and reused.

</details>

<details>
<summary><strong>Does it work with Laravel?</strong></summary>

Yes. When running in a Laravel project, it auto-detects the framework, offers to install Laravel Boost, and auto-selects `laravel-specialist`, `php-specialist`, and `laravel-boost` skills.

</details>

<details>
<summary><strong>What happens to my existing CLAUDE.md?</strong></summary>

Your content is preserved. The toolkit wraps its own content in `<!-- TOOLKIT START -->` / `<!-- TOOLKIT END -->` markers and backs up the original file before modifying.

</details>

<details>
<summary><strong>Can I extend superkit-agents with plugins?</strong></summary>

Yes. Use `superkit-agents plugin add <name>` to install plugins from npm or local directories. See [Plugin Development](docs/plugin-development.md) for creating your own.

</details>

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to fork, develop, test, and submit pull requests.

---

## License

[MIT](LICENSE)
