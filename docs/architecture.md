# Architecture

## Overview

superkit-agents is a CLI installer that sets up AI-powered skills, agents, and commands for Claude Code. It's built with TypeScript and uses Commander.js for the CLI, Inquirer for interactive prompts, and fs-extra for file operations.

## Directory Structure

```
src/
├── cli.ts              # CLI entry point (Commander.js)
├── config.ts           # Skills, agents, commands, types
├── installer.ts        # Core installation logic
├── wizard.ts           # Interactive CLI wizard (Inquirer)
├── updater.ts          # Version checking and update
├── utils.ts            # Path helpers, backup, Laravel detection
├── requirements.ts     # System requirements checker
├── plugins.ts          # Plugin system core
└── plugin-registry.ts  # Plugin registry management

templates/
├── skills/             # 64 skill directories, each with SKILL.md
├── agents/             # 20 agent markdown files
├── commands/           # 31 command markdown files
├── hooks/              # SessionStart hook (hooks.json + session-start script)
├── memory/             # 5 memory file templates
├── ralph/              # Ralph autonomous loop templates
├── claude-plugin/      # Plugin manifest (plugin.json)
└── CLAUDE.md           # CLAUDE.md template

tests/
├── cli.test.ts         # Config validation tests
├── installer.test.ts   # Installation logic tests
├── new-skills.test.ts  # Template file validation
├── requirements.test.ts # Requirements checker tests
└── plugins.test.ts     # Plugin system tests
```

## Data Flow

```
User runs CLI
    │
    ├── checkRequirements() → validate Node.js, Git, Claude Code
    │
    ├── Interactive? → runWizard() → InstallConfig
    │   or
    ├── --all / --skills → build InstallConfig directly
    │
    └── install(config)
        ├── Copy skills from templates/ → target dir
        ├── Copy agents
        ├── Copy commands
        ├── Install hooks (plugin or direct mode)
        ├── Set up memory files
        ├── Merge CLAUDE.md
        ├── Laravel Boost (if detected)
        └── Save config for updates
```

## Build System

- **Bundler:** tsup (builds `src/cli.ts` and `src/index.ts` to ESM)
- **Test runner:** Vitest
- **Linter:** ESLint
- **TypeScript:** Strict mode, ES2022 target

## Key Design Decisions

1. **Templates as files, not code** — Skills, agents, and commands are plain markdown. No code generation.
2. **Two installation formats** — Plugin mode (`.claude-plugin/`) for isolation, direct mode (`.claude/`) for simplicity.
3. **SessionStart hook injection** — The `using-toolkit` skill and memory files are loaded at the start of every Claude Code session.
4. **Mandatory skills** — `self-learning` and `auto-improvement` are always installed to ensure the toolkit can maintain itself.
5. **Plugin system** — Third-party plugins use `superkit-plugin.json` manifests and are namespaced under `plugins/<name>/`.

## CI/CD

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `test.yml` | Push, PRs | Tests on Node 18/20/22 |
| `ci.yml` | Push, PRs | Lint + dry-run validation |
| `release.yml` | Tag push (`v*`) | Publish to npm |
