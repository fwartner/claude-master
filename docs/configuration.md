# Configuration

## CLI Flags

| Flag | Description | Default |
|------|-------------|---------|
| `--all` | Install everything non-interactively | Off |
| `--global` | Install to `~/.claude/` instead of `./.claude/` | Project scope |
| `--plugin` | Install as a `.claude-plugin/` plugin | Plugin mode |
| `--direct` | Install directly into `.claude/` directories | Off |
| `--skills <list>` | Comma-separated list of skills to install | All (with `--all`) |
| `--no-hooks` | Skip hooks installation | Hooks enabled |
| `--no-memory` | Skip memory structure creation | Memory enabled |
| `--no-claude-md` | Skip CLAUDE.md generation | CLAUDE.md enabled |
| `--dry-run` | Show what would be installed without making changes | Off |
| `--skip-checks` | Skip system requirements check | Checks enabled |

## InstallConfig Interface

The programmatic API uses the `InstallConfig` interface:

```typescript
interface InstallConfig {
  scope: 'project' | 'global';
  format: 'plugin' | 'direct';
  skills: string[];
  agents: string[];
  commands: string[];
  hooks: boolean;
  memory: boolean;
  claudeMd: boolean;
  dryRun: boolean;
  laravelBoost: boolean;
}
```

## Scope & Format

### Scope

- **Project** (`scope: 'project'`): Installs into the current directory. Affects only this project.
- **Global** (`scope: 'global'`): Installs into `~/`. Available in all projects.

### Format

- **Plugin** (`format: 'plugin'`): Installs into `.claude-plugin/`. Isolated namespace, supports `/reload-plugins`.
- **Direct** (`format: 'direct'`): Installs into `.claude/`. Merges with existing Claude Code config.

## CLAUDE.md Merge Behavior

The installer handles existing `CLAUDE.md` files safely:

1. Wraps toolkit content in `<!-- TOOLKIT START -->` / `<!-- TOOLKIT END -->` markers
2. Backs up existing file before modifying
3. Preserves all user content outside the markers
4. Re-running the installer updates only the toolkit section

## Memory System

Five persistent markdown files store project knowledge:

| File | Purpose |
|------|---------|
| `project-context.md` | Tech stack, architecture, dependencies |
| `learned-patterns.md` | Coding conventions and patterns |
| `user-preferences.md` | Communication and workflow preferences |
| `decisions-log.md` | Architectural decisions with rationale |
| `improvement-log.md` | Self-improvement tracking and effectiveness metrics |

These are auto-loaded on session start and updated by the `self-learning` skill.

## Hooks

The SessionStart hook triggers on `startup`, `resume`, `clear`, and `compact` events:

1. Loads the `using-toolkit` skill into context
2. Injects memory files
3. Provides the full skill catalog and workflow guidance

## Saved Preferences

Installation preferences are saved to `~/.superkit-agents/config.json` and reused on update. Run `superkit-agents update` to re-install with saved preferences.

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `HOME` | Used to resolve global install paths |
| `NODE_ENV` | Standard Node.js environment |
