# Getting Started

This guide walks you through installing and using superkit-agents for the first time.

## Prerequisites

| Requirement | Version | Required |
|-------------|---------|----------|
| Node.js | >= 18 | Yes |
| Git | Any recent | Yes |
| Claude Code CLI | Latest | Recommended |

The installer checks these automatically and shows OS-specific install commands for anything missing.

## Installation

### Interactive (Recommended)

```bash
npx @pixelandprocess/superkit-agents
```

The wizard walks you through:
1. **Scope** — project-level (`./.claude/`) or global (`~/.claude/`)
2. **Format** — plugin mode (`.claude-plugin/`) or direct mode (`.claude/`)
3. **Skills** — pick from 64 skills across 12 categories
4. **Features** — hooks, memory, CLAUDE.md, commands, agents

### Non-Interactive

```bash
# Install everything
npx @pixelandprocess/superkit-agents --all

# Install specific skills only
npx @pixelandprocess/superkit-agents --skills planning,tdd,code-review
```

### Global Install

```bash
npx @pixelandprocess/superkit-agents --all --global
```

This makes the toolkit available in every project.

## Verifying the Installation

After installation, start a new Claude Code session:

```bash
claude
```

The SessionStart hook will automatically load the toolkit. You should see:
- Skill discovery is active
- Memory files are loaded
- Slash commands are available (try `/plan` or `/review`)

## First Run

Try these commands to explore:

```
/learn          → Scan and discover your project context
/plan           → Start structured planning for a task
/brainstorm     → Creative exploration before planning
/tdd            → Start a TDD workflow
```

## Next Steps

- [Configuration](configuration.md) — customize CLI flags, formats, and behavior
- [Skill Authoring](skill-authoring.md) — create your own skills
- [Plugin Development](plugin-development.md) — build and share plugins
