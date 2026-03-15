---
name: git-commit-helper
description: When the user needs help with conventional commits, semantic versioning, changelog generation, or commit message quality improvement.
---

# Git Commit Helper

## Overview

Enforce conventional commit standards, guide semantic versioning decisions, generate changelogs, and ensure commit message quality. This skill provides a structured approach to version control communication that enables automated tooling and clear project history.

## Process

1. Analyze the changes to be committed (staged diff)
2. Classify the change type (feat, fix, refactor, etc.)
3. Identify the scope (module, component, or area affected)
4. Determine if the change is breaking
5. Write a commit message following the conventional format
6. Assess version bump implications

## Conventional Commit Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Commit Types

| Type | Description | Version Bump | Example |
|---|---|---|---|
| `feat` | New feature for the user | MINOR | `feat(auth): add OAuth2 login flow` |
| `fix` | Bug fix for the user | PATCH | `fix(api): handle null response in user endpoint` |
| `docs` | Documentation only changes | None | `docs(readme): update installation steps` |
| `style` | Formatting, missing semicolons, etc. | None | `style(lint): fix trailing whitespace` |
| `refactor` | Code change that neither fixes a bug nor adds a feature | None | `refactor(utils): extract date formatting helpers` |
| `perf` | Performance improvement | PATCH | `perf(query): add index for user lookup` |
| `test` | Adding or correcting tests | None | `test(auth): add login failure scenarios` |
| `chore` | Maintenance, deps, tooling | None | `chore(deps): update typescript to 5.4` |
| `ci` | CI/CD configuration changes | None | `ci(github): add Node 20 to test matrix` |
| `build` | Build system or external dependencies | None | `build(webpack): optimize chunk splitting` |

### Scope Guidelines

Scope should identify the area of the codebase affected:

- **By module**: `auth`, `billing`, `dashboard`, `api`
- **By layer**: `db`, `ui`, `middleware`, `config`
- **By package**: `@app/core`, `@app/shared`
- **General**: `deps`, `ci`, `lint`, `types`

Rules:
- Lowercase, kebab-case
- Keep consistent within a project
- Optional but recommended for projects with > 10 files changed regularly
- Omit scope for truly cross-cutting changes

### Description Rules

- Use imperative mood: "add" not "added" or "adds"
- No capital first letter
- No period at the end
- Maximum 72 characters (type + scope + description combined)
- Describe WHAT changed, not HOW

### Body Guidelines

```
feat(cart): add quantity update functionality

Users can now change item quantities directly in the cart
without removing and re-adding items. The quantity selector
supports values from 1 to 99 with real-time price updates.

Closes #234
```

- Wrap at 72 characters
- Explain WHY the change was made (motivation)
- Explain WHAT changed at a high level
- Use blank line to separate from description and footer

### Breaking Changes

```
feat(api)!: change user endpoint response format

BREAKING CHANGE: The /api/users endpoint now returns a paginated
response object instead of a plain array. Clients must update
to read from the `data` field.

Migration guide:
- Before: const users = await fetch('/api/users').json()
- After:  const { data: users } = await fetch('/api/users').json()
```

Two ways to indicate breaking changes:
1. `!` after type/scope: `feat(api)!: description`
2. `BREAKING CHANGE:` footer (provides space for migration details)

Both trigger a MAJOR version bump.

## Semantic Versioning (SemVer)

### Version Format: MAJOR.MINOR.PATCH

| Component | Increment When | Example |
|---|---|---|
| MAJOR | Breaking changes (incompatible API changes) | 1.0.0 -> 2.0.0 |
| MINOR | New features (backward compatible) | 1.0.0 -> 1.1.0 |
| PATCH | Bug fixes (backward compatible) | 1.0.0 -> 1.0.1 |

### Version Bumping Rules

```
Commits since last release:
  fix(auth): handle expired tokens       -> PATCH
  feat(search): add fuzzy matching       -> MINOR (overrides PATCH)
  fix(ui): correct button alignment      -> already MINOR
  feat(api)!: change response format     -> MAJOR (overrides MINOR)

Result: MAJOR bump (highest wins)
```

### Pre-Release Versions
```
1.0.0-alpha.1    -> Early testing
1.0.0-beta.1     -> Feature complete, testing
1.0.0-rc.1       -> Release candidate
1.0.0            -> Stable release
```

### Initial Development (0.x.y)
- 0.1.0: First usable version
- 0.x.y: API is not stable; MINOR can include breaking changes
- 1.0.0: First stable release; SemVer rules fully apply

## Changelog Generation

### CHANGELOG.md Format
```markdown
# Changelog

## [1.2.0] - 2025-03-15

### Added
- Fuzzy search matching for product catalog (#234)
- Bulk export functionality for reports (#245)

### Fixed
- Handle expired authentication tokens gracefully (#230)
- Correct button alignment on mobile viewports (#232)

### Changed
- Update TypeScript to 5.4 (#240)

## [1.1.0] - 2025-02-28
...
```

### Mapping Commits to Changelog Sections
| Commit Type | Changelog Section |
|---|---|
| `feat` | Added |
| `fix` | Fixed |
| `perf` | Performance |
| `refactor` | Changed |
| `docs` | Documentation |
| `BREAKING CHANGE` | Breaking Changes (top of release) |
| `chore`, `ci`, `build`, `style`, `test` | Typically excluded |

### Automation Tools
- `conventional-changelog`: generate from git history
- `semantic-release`: fully automated versioning + publishing
- `changeset`: manual changeset files for monorepos
- `release-please`: Google's release automation

## Commit Message Quality Checklist

### Must Pass
- [ ] Uses conventional commit format (`type(scope): description`)
- [ ] Type is from the allowed list
- [ ] Description uses imperative mood
- [ ] Description is under 72 characters total
- [ ] No period at end of description
- [ ] Breaking changes are clearly marked

### Should Pass
- [ ] Scope accurately identifies the affected area
- [ ] Body explains WHY, not just WHAT (for non-trivial changes)
- [ ] References issue/ticket number (`Closes #123`, `Refs #456`)
- [ ] Single logical change per commit (atomic commits)
- [ ] No "WIP" or "temp" commits in main branch history

### Red Flags
- "misc changes" — too vague, split into specific commits
- "fix stuff" — specify what was fixed and where
- Huge commits touching 20+ files — likely needs splitting
- Commit message contradicts the diff
- Multiple unrelated changes in one commit

## Commit Splitting Guide

### When to Split
- Changes to different modules/features
- A refactor combined with a feature addition
- Test additions for existing code + new feature
- Config changes + code changes

### How to Split
```bash
# Interactive staging for partial commits
git add -p                    # Stage hunks interactively
git add path/to/specific/file # Stage specific files

# Example: split refactor + feature
git add src/utils/date.ts
git commit -m "refactor(utils): extract date formatting helpers"

git add src/components/DatePicker.tsx src/components/DatePicker.test.tsx
git commit -m "feat(ui): add date range picker component"
```

## Anti-Patterns

- Commits with "fix" type that actually add features
- Squashing meaningful history into single "big" commit
- Using `--no-verify` to skip commit hooks
- Amending published/pushed commits without team awareness
- Empty commit messages or "." commits
- Mixing formatting changes with logic changes
- Commit messages that duplicate the diff ("change line 45 from X to Y")

## Skill Type

**RIGID** — Conventional commit format is mandatory. Version bumping rules are deterministic. Changelog sections map directly from commit types. No deviation from the format specification.
