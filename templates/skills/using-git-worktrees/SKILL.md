---
name: using-git-worktrees
description: "Use when starting a new feature branch, creating isolated development environments, or working on multiple tasks simultaneously without stashing or switching branches"
---

# Using Git Worktrees

## Purpose

Create isolated working directories for parallel development tasks using `git worktree`, allowing multiple branches to be checked out simultaneously without conflicts.

## When to Use

- Starting a new feature branch that should not interfere with current work
- Working on multiple tasks simultaneously (bug fix + feature)
- Creating a clean environment for testing or code review
- Running long processes (tests, builds) while continuing development

## Step 1: Select Worktree Directory

Follow this priority order:

### Priority 1: Existing Worktree Matching Task

Check if a worktree already exists for the task:

```bash
git worktree list
```

If a matching worktree exists, use it. Do not create a duplicate.

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

## Step 2: Safety Verification

Before creating a worktree, verify these conditions:

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

## Step 3: Create the Worktree

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

## Step 4: Project Setup and Auto-Detection

After creating the worktree, detect and run the project's setup commands.

### Node.js

Detect by presence of `package.json`:

```bash
# Check lock file to determine package manager
if [ -f "pnpm-lock.yaml" ]; then
    pnpm install
elif [ -f "yarn.lock" ]; then
    yarn install
elif [ -f "package-lock.json" ]; then
    npm install
else
    npm install
fi
```

### Python

Detect by presence of `pyproject.toml`, `setup.py`, or `requirements.txt`:

```bash
if [ -f "pyproject.toml" ]; then
    # Check for poetry
    if grep -q "tool.poetry" pyproject.toml; then
        poetry install
    else
        pip install -e .
    fi
elif [ -f "setup.py" ]; then
    pip install -e .
elif [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
fi
```

### Go

Detect by presence of `go.mod`:

```bash
go mod download
```

### Rust

Detect by presence of `Cargo.toml`:

```bash
cargo build
```

### Multiple Ecosystems

If the project uses multiple ecosystems (e.g., a Go backend with a Node.js frontend), run setup for each detected ecosystem in the appropriate subdirectories.

## Step 5: Clean Baseline Test Verification

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

## Step 6: Location Reporting

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

## Common Issues

| Issue | Solution |
|-------|----------|
| Branch already checked out | Use the existing worktree or create a new branch |
| Dirty worktree on removal | Commit, stash, or use `--force` |
| Missing dependencies | Re-run project setup in the worktree |
| Tests fail in worktree but pass in main | Check for environment-specific config or missing env vars |
| Worktree path shows in git status | Add path to `.gitignore` |

## Integration with Other Skills

- After completing work in a worktree, use **finishing-a-development-branch** to merge or create a PR
- Use **dispatching-parallel-agents** to run agents in separate worktrees for true isolation
- Use **verification-before-completion** to validate work before leaving the worktree
