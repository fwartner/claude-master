# Changelog

## [1.1.0] - 2026-03-15

### Added
- **Plugin system**: `superkit-agents plugin add|list|remove|search` commands for extending the toolkit with third-party or custom plugins via `superkit-plugin.json` manifests
- **System requirements checker**: Validates Node.js >= 18, Git, and Claude Code CLI at startup with OS-aware install suggestions (macOS, Linux apt/yum, Windows choco/winget)
- **Context7 integration**: 10 framework/library skills now include a "Documentation Lookup (Context7)" section for real-time doc fetching via MCP
- **Laravel docs verification protocol**: Hard-gate in `laravel-specialist` skill requiring verification via Context7 MCP or official Laravel docs before using uncertain APIs
- **Subagent dispatch guidance**: 8 skills now include "Subagent Dispatch Opportunities" tables with specific patterns for parallel work
- **Comprehensive documentation**: 9 docs in `docs/` folder (getting-started, configuration, skill/agent/command authoring, plugin development, architecture, API reference, FAQ)
- **CONTRIBUTING.md**: Contribution guidelines with commit conventions and skill contribution process
- **`--skip-checks` CLI flag**: Skip system requirements check when not needed
- **README rewrite**: Collapsible sections, prerequisites, plugin system docs, FAQ with 8 common questions

### Changed
- **README.md**: Restructured with collapsible `<details>` sections, friendlier tone, and plugin system documentation
- **CLI**: Now runs `checkRequirements()` before installation wizard

## [1.0.0] - 2026-03-15

### Added
- **64 expert-level skills** across 12 categories (Core, Process, Quality, Documentation, Design, Operations, Creative, Business, Document Processing, Productivity, Communication, Frameworks)
- **20 agent definitions** for specialized task dispatch (planner, code-reviewer, prd-writer, laravel-developer, php-developer, etc.)
- **31 slash commands** for quick skill activation (/plan, /brainstorm, /tdd, /laravel, /php, etc.)
- Laravel/PHP support: `laravel-specialist`, `php-specialist`, `laravel-boost` skills with auto-detection of Laravel projects via `composer.json`
- Laravel Boost integration prompt when Laravel project detected
- Self-learning and auto-improvement are always active (mandatory, cannot be disabled)
- `superkit-agents update` command for checking and applying updates with saved config persistence
- Session-start hooks with memory system and self-learning activation
- Ralph autonomous loop protocol with circuit breaker and exit gate
- JTBD specification methodology with Given/When/Then acceptance criteria
- Plugin manifest for Claude Code integration

### Changed
- Rebranded from `@fwartner/claude-toolkit` to `@pixelandprocess/superkit-agents`
- All 64 skills enhanced to 200-400+ lines with CSO-optimized frontmatter, decision tables, anti-patterns, integration points, and concrete examples
- ESLint migrated to typescript-eslint v8 flat config
- CI pipeline updated with explicit lint step

### Fixed
- ESLint configuration (was broken with old config format)
- GitHub Actions release pipeline (added lint step before publish)
