---
name: git-commit-helper
description: Use when creating git commits, generating changelogs, applying conventional commit format, or determining semantic version bumps.
---

# Git Commit Helper

## Overview
Enforces conventional commit standards for consistent, machine-readable commit history. Covers commit message formatting, semantic versioning, changelog generation, and commit quality validation. Ensures every commit tells a clear story of what changed and why.

## Process

### 1. Stage Changes Review
- [ ] Run `git diff --staged` to review exactly what will be committed
- [ ] Verify no unintended files are staged (secrets, build artifacts, IDE configs)
- [ ] Confirm changes are logically cohesive (one concern per commit)
- [ ] If changes span multiple concerns, split into separate commits

### 2. Determine Commit Type

| Type | Description | Semver Impact | Example |
|------|-------------|---------------|---------|
| `feat` | New feature for the user | MINOR | `feat(auth): add OAuth2 login flow` |
| `fix` | Bug fix for the user | PATCH | `fix(api): handle null response from payment gateway` |
| `docs` | Documentation only | None | `docs(readme): update installation instructions` |
| `style` | Formatting, no code change | None | `style(lint): apply prettier formatting` |
| `refactor` | Code change, no feature/fix | None | `refactor(user): extract validation into separate module` |
| `perf` | Performance improvement | PATCH | `perf(query): add index for user lookup` |
| `test` | Adding or fixing tests | None | `test(auth): add integration tests for login` |
| `chore` | Maintenance, tooling | None | `chore(deps): update eslint to v9` |
| `ci` | CI/CD configuration | None | `ci(github): add playwright to CI pipeline` |
| `build` | Build system changes | None | `build(docker): optimize multi-stage build` |

### 3. Compose Commit Message

**Format:**
```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

**Rules for subject line:**
- [ ] Use imperative mood ("add" not "added" or "adds")
- [ ] Do not capitalize the first letter
- [ ] Do not end with a period
- [ ] Keep under 72 characters
- [ ] Describe what the commit does, not what you did

**Rules for body (when needed):**
- [ ] Separate from subject with a blank line
- [ ] Explain the "why" behind the change
- [ ] Wrap at 72 characters per line
- [ ] Use bullet points for multiple items

**Rules for footer (when needed):**
- [ ] `BREAKING CHANGE: <description>` for breaking changes (triggers MAJOR bump)
- [ ] `Closes #123` or `Fixes #456` for issue references
- [ ] `Refs: #789` for related but not closed issues
- [ ] `Co-authored-by: Name <email>` for pair programming

### 4. Breaking Changes
```
feat(api)!: change user endpoint response format

BREAKING CHANGE: The /api/users endpoint now returns a paginated
response object instead of a flat array. Clients must update to
access `response.data` instead of the response directly.

Migration guide: https://docs.example.com/migration/v3
```

- The `!` after scope signals a breaking change in the subject
- `BREAKING CHANGE:` footer is required for tooling to detect it
- Always include migration instructions or a link to them

### 5. Semantic Versioning Decision

Given a version `MAJOR.MINOR.PATCH`:

```
PATCH (1.0.0 → 1.0.1):
  - fix: bug fixes
  - perf: performance improvements
  - No breaking changes, no new features

MINOR (1.0.0 → 1.1.0):
  - feat: new features
  - Backward compatible additions
  - Resets PATCH to 0

MAJOR (1.0.0 → 2.0.0):
  - BREAKING CHANGE in any commit type
  - feat!:, fix!:, refactor!:
  - Resets MINOR and PATCH to 0

Pre-release:
  - 1.0.0-alpha.1, 1.0.0-beta.1, 1.0.0-rc.1
  - Used for testing before stable release
```

### 6. Changelog Generation

Changelogs are derived from conventional commits automatically:

```markdown
# Changelog

## [1.2.0] - 2026-03-15

### Features
- **auth**: add OAuth2 login flow (#123)
- **dashboard**: add export to CSV (#145)

### Bug Fixes
- **api**: handle null response from payment gateway (#130)
- **ui**: fix date picker timezone offset (#142)

### Performance
- **query**: add composite index for dashboard queries (#138)

### Breaking Changes
- **api**: change user endpoint response format (#150)
```

**Grouping rules:**
- Group by type, then by scope
- Include PR/issue number references
- List breaking changes prominently at the top or in their own section
- Only include `feat`, `fix`, `perf`, and breaking changes in user-facing changelogs

### 7. Commit Quality Checklist
- [ ] Changes are atomic (one logical change per commit)
- [ ] Type accurately reflects the nature of the change
- [ ] Scope identifies the affected module or component
- [ ] Subject is clear and under 72 characters
- [ ] Body explains "why" when the change is not obvious
- [ ] Breaking changes are explicitly marked with `BREAKING CHANGE:`
- [ ] No generated files committed (build output, node_modules)
- [ ] No secrets or credentials in the commit
- [ ] Tests pass before committing
- [ ] Linting passes before committing

### 8. Commit Message Examples

**Simple fix:**
```
fix(auth): prevent session expiry during active usage
```

**Feature with context:**
```
feat(notifications): add email digest for weekly summary

Users who opt in receive a weekly email summarizing their
activity. Digest is generated every Sunday at 08:00 UTC.

Closes #234
```

**Refactor with rationale:**
```
refactor(payments): extract Stripe integration into adapter

Preparing for multi-gateway support. The adapter pattern
allows swapping payment providers without changing
business logic.

Refs: #300
```

**Multi-line body with bullets:**
```
fix(upload): handle edge cases in file validation

- Reject files with double extensions (.jpg.exe)
- Handle zero-byte files gracefully
- Add timeout for virus scan API calls
- Log validation failures for monitoring

Closes #189, #192
```

## Key Principles
1. **Atomic commits** - Each commit should represent one complete, logical change that can be understood in isolation.
2. **Imperative mood** - Write the subject as a command: "add feature" not "added feature."
3. **Why over what** - The diff shows what changed. The message should explain why.
4. **Machine-readable** - Conventional format enables automated changelog generation, version bumping, and release notes.
5. **No noise commits** - Avoid "WIP", "fix typo", "oops" commits. Use interactive rebase to clean up before pushing.
6. **Scope consistency** - Use the same scope names across the project. Document them in CONTRIBUTING.md.

## Skill Type
Rigid
