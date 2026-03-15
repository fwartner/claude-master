---
name: using-git-worktrees
description: >
  Use when starting a new feature branch, creating isolated development environments, or working on
  multiple tasks simultaneously without stashing or switching branches. Triggers: user says "worktree",
  "new branch for work", "parallel development", "isolated environment", needs to work on two things at once.
---

# Using Git Worktrees

## Overview

Create isolated working directories for parallel development tasks using `git worktree`, allowing multiple branches to be checked out simultaneously without conflicts. This skill enforces a deterministic, multi-phase process from directory selection through setup verification, ensuring every worktree is production-ready before any work begins.

## When to Use

- Starting a new feature branch that should not interfere with current work
- Working on multiple tasks simultaneously (bug fix + feature)
- Creating a clean environment for testing or code review
- Running long processes (tests, builds) while continuing development

## Phase 1: Select Worktree Directory

[HARD-GATE] Do NOT skip directory selection. Do NOT assume a default path without checking priorities.

Follow this priority order exactly:

### Priority 1: Existing Worktree Matching Task

Check if a worktree already exists for the task:

```bash
git worktree list
```

If a matching worktree exists, use it. Do NOT create a duplicate.

### Priority 2: CLAUDE.md Worktree Directory Hint

Check the project's CLAUDE.md for a configured worktree directory:

```
# Example CLAUDE.md entry
worktree-directory: ../worktrees
```

If specified, create worktrees under that directory.

### Priority 3: Ask the User

If no hint is configured and no convention is obvious, ask the user where worktrees should be created. Suggest a sensible default:

```
../worktrees/<project-name>/<branch-name>
```

**STOP — Confirm the worktree directory with the user before proceeding.**

### Directory Selection Decision Table

| Condition | Action |
|---|---|
| Worktree for this branch already exists | Navigate to existing worktree |
| CLAUDE.md has `worktree-directory` | Use configured path |
| Project has existing worktrees | Use same parent directory pattern |
| No convention found | Ask user, suggest `../worktrees/<project>/<branch>` |
| User specifies path inside repo root | Warn — must add to `.gitignore` |

## Phase 2: Safety Verification

[HARD-GATE] Do NOT create any worktree until all safety checks pass.

### Check .gitignore Coverage

If the worktree directory is inside the repository root, ensure it is in `.gitignore`:

```bash
# Check if the worktree path would be tracked
git check-ignore <worktree-path>
```

If not ignored, warn the user and suggest adding it to `.gitignore`.

### Verify Clean Working Tree

Check for uncommitted changes that could cause issues:

```bash
git status --porcelain
```

If the working tree is dirty, inform the user and ask how to proceed:
- Commit changes first
- Stash changes
- Proceed anyway (worktree creation itself is safe)

### Verify Branch Does Not Exist in Another Worktree

```bash
git worktree list
```

A branch cannot be checked out in two worktrees simultaneously. If the branch is already checked out, navigate to that existing worktree instead.

### Safety Check Decision Table

| Check | Result | Action |
|---|---|---|
| Path inside repo, not in `.gitignore` | FAIL | Add to `.gitignore` first |
| Branch already in another worktree | FAIL | Use existing worktree |
| Working tree dirty | WARN | Inform user, ask preference |
| Path already exists (not worktree) | FAIL | Choose different path |
| All checks pass | PASS | Proceed to Phase 3 |

## Phase 3: Create the Worktree

```bash
# For a new branch
git worktree add <path> -b <branch-name> <base-branch>

# For an existing branch
git worktree add <path> <existing-branch>
```

Always tell the user the full path where the worktree was created:

```
Worktree created at: /absolute/path/to/worktree
Branch: feature/my-feature
Base: main
```

**STOP — Confirm the worktree was created successfully before proceeding to setup.**

## Phase 4: Project Setup and Auto-Detection

After creating the worktree, detect and run the project's setup commands.

### Setup Detection Decision Table

| Indicator File | Ecosystem | Setup Command |
|---|---|---|
| `pnpm-lock.yaml` | Node.js (pnpm) | `pnpm install` |
| `yarn.lock` | Node.js (yarn) | `yarn install` |
| `package-lock.json` | Node.js (npm) | `npm install` |
| `package.json` (no lock) | Node.js (npm) | `npm install` |
| `pyproject.toml` + `tool.poetry` | Python (poetry) | `poetry install` |
| `pyproject.toml` (no poetry) | Python (pip) | `pip install -e .` |
| `setup.py` | Python (pip) | `pip install -e .` |
| `requirements.txt` | Python (pip) | `pip install -r requirements.txt` |
| `go.mod` | Go | `go mod download` |
| `Cargo.toml` | Rust | `cargo build` |
| `Gemfile` | Ruby | `bundle install` |
| `composer.json` | PHP | `composer install` |

### Multiple Ecosystems

If the project uses multiple ecosystems (e.g., a Go backend with a Node.js frontend), run setup for each detected ecosystem in the appropriate subdirectories.

### Environment Files

If the project has `.env.example` or `.env.template`:

```bash
# Copy environment template if .env does not exist in worktree
cp .env.example .env  # then inform user to update values
```

## Phase 5: Clean Baseline Test Verification

[HARD-GATE] Do NOT proceed with any work until baseline tests pass or failures are acknowledged.

Run the project's test suite to establish a clean baseline BEFORE starting any work:

```bash
# Use the project's test command
# Node.js: npm test / yarn test / pnpm test
# Python: pytest / python -m pytest
# Go: go test ./...
# Rust: cargo test
```

Purpose:
- Confirms the worktree is set up correctly
- Establishes that all tests pass before changes are made
- Any test failures after this point are caused by your changes, not pre-existing issues

If baseline tests fail:
- Report the failures to the user
- Do NOT proceed with work until the baseline is understood
- The base branch may have broken tests that need addressing first

## Phase 6: Location Reporting

Always report the worktree location clearly to the user:

```
Worktree ready:
  Path:    /Users/dev/worktrees/myproject/feature-auth
  Branch:  feature/auth-refactor
  Base:    main
  Setup:   npm install (completed)
  Tests:   24 passed, 0 failed
```

## Cleanup Patterns

### After Merging or Completing Work

```bash
# Remove the worktree
git worktree remove <path>

# If files remain (dirty worktree), force removal
git worktree remove --force <path>

# Prune stale worktree references
git worktree prune
```

### List All Worktrees

```bash
git worktree list
```

### Handling Locked Worktrees

If a worktree is locked (to prevent accidental removal):

```bash
# Unlock before removing
git worktree unlock <path>
git worktree remove <path>
```

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Is Wrong | What to Do Instead |
|---|---|---|
| Creating duplicate worktree for same branch | Git does not allow it; wastes time | Check `git worktree list` first |
| Worktree inside repo without `.gitignore` | Worktree files show as untracked | Add path to `.gitignore` |
| Skipping dependency install in worktree | Build/test failures from missing deps | Always run project setup |
| Skipping baseline test run | Cannot distinguish pre-existing vs new failures | Run tests before starting work |
| Assuming worktree has same env vars | `.env` files are not shared between worktrees | Copy and configure `.env` |
| Leaving stale worktrees after merge | Disk waste, confusing `git worktree list` | Remove worktrees after branch completion |
| Force-removing worktree with uncommitted work | Permanent data loss | Commit or stash first |

## Integration Points

| Skill | Integration |
|---|---|
| `finishing-a-development-branch` | After completing work in a worktree, use this to merge or create a PR |
| `dispatching-parallel-agents` | Run agents in separate worktrees for true isolation |
| `verification-before-completion` | Validate work before leaving the worktree |
| `self-learning` | Check CLAUDE.md for worktree directory preferences |
| `planning` | Worktree creation is often the first step of plan execution |

## Skill Type

**RIGID** — Follow this process exactly. Every phase must be completed in order. Do NOT skip safety checks. Do NOT skip baseline test verification. Do NOT create worktrees without confirming the directory.
