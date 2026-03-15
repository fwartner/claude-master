# Contributing to superkit-agents

Thank you for your interest in contributing! This guide covers the process for submitting changes.

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/claude-master.git
   cd claude-master
   ```
3. **Install** dependencies:
   ```bash
   npm install
   ```
4. **Build** the project:
   ```bash
   npm run build
   ```
5. **Run tests** to make sure everything works:
   ```bash
   npm test
   ```

## Development Workflow

### Making Changes

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/my-change
   ```
2. Make your changes
3. Run the full validation suite:
   ```bash
   npm run build && npm test && npm run lint
   ```
4. Commit your changes using [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat: add new skill for X"
   git commit -m "fix: correct Y behavior in Z"
   git commit -m "docs: update skill authoring guide"
   ```

### Commit Convention

| Prefix | Use When |
|--------|----------|
| `feat:` | Adding new functionality |
| `fix:` | Fixing a bug |
| `docs:` | Documentation changes only |
| `test:` | Adding or updating tests |
| `refactor:` | Code changes that don't add features or fix bugs |
| `chore:` | Build process, dependency updates, etc. |

## Contributing Skills

Skills are the most common contribution. To add a new skill:

1. Create a directory: `templates/skills/my-skill/`
2. Add `SKILL.md` with YAML frontmatter:
   ```markdown
   ---
   name: my-skill
   description: One-line description of what this skill does
   triggers:
     - keyword that activates this skill
   ---

   ## Overview
   ...

   ## Skill Type
   rigid | flexible
   ```
3. Register the skill in `src/config.ts` under the appropriate category
4. Update the skill count in tests (`tests/cli.test.ts`)
5. Add a test case in `tests/new-skills.test.ts`
6. If the skill warrants a slash command, add it to `COMMANDS` in `src/config.ts` and create `templates/commands/my-skill.md`

See [Skill Authoring Guide](docs/skill-authoring.md) for the full format reference.

## Contributing Agents

1. Create `templates/agents/my-agent.md` with YAML frontmatter
2. Register in `src/config.ts` under `AGENTS`
3. Update agent count in tests

## Contributing Plugins

See [Plugin Development Guide](docs/plugin-development.md) for creating plugins that extend superkit-agents.

## Pull Request Process

1. Ensure your branch builds, tests pass, and lint is clean
2. Open a PR against `main`
3. Fill in the PR template with a clear description
4. Wait for CI checks to pass
5. A maintainer will review and provide feedback

## Code Style

- TypeScript with strict mode enabled
- ESM modules (`import`/`export`, not `require`)
- Use `fs-extra` for file operations
- Use `chalk` for terminal colors, `ora` for spinners
- Tests use Vitest

## Questions?

Open an issue on GitHub if you have questions or need help.
