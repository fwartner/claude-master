---
name: finishing-a-development-branch
description: "Use when completing work on a feature branch, preparing to merge, or cleaning up after development is done"
---

# Finishing a Development Branch

## Purpose

Provide a structured, safe process for completing work on a development branch, including verification, merge strategy selection, and cleanup.

## When to Use

- All planned work on a feature branch is complete
- A branch is ready for code review or merge
- Cleaning up after development work is finished
- Preparing a pull request for team review

## Step 1: Verify All Tests Pass

Before any merge or PR activity, invoke **verification-before-completion** to confirm:

- All tests pass (unit, integration, e2e as applicable)
- No lint errors or warnings
- Build succeeds
- No untracked files that should be committed

```bash
# Run the project's full verification suite
# Do NOT skip this step even if "tests were passing earlier"
```

If verification fails, stop. Fix the failures before proceeding. Do not create PRs or merge branches with failing tests.

## Step 2: Determine Base Branch

Identify the branch to merge into, using this detection logic:

### Auto-Detection

```bash
# Check for common base branch names
git branch -a | grep -E 'remotes/origin/(main|master|develop)$'

# Check what branch was the fork point
git log --oneline --decorate --graph HEAD...main --first-parent 2>/dev/null
git log --oneline --decorate --graph HEAD...master --first-parent 2>/dev/null
```

### Priority Order

1. **main** -- if it exists, this is the default
2. **master** -- legacy default, still common
3. **develop** -- if the project uses GitFlow
4. **Ask the user** -- if none of the above exist or multiple candidates are found

### Verify Base Branch is Up to Date

```bash
git fetch origin
git log HEAD..<base-branch> --oneline
```

If the base branch has advanced since the feature branch was created, inform the user. They may want to rebase or merge base into the feature branch first.

## Step 3: Present Merge Options

Present exactly these four options to the user. Do not add or remove options.

### Option A: Create Pull Request

Push the branch to the remote and open a pull request.

- Best for: team projects, code review workflows, CI/CD pipelines
- The branch remains open until the PR is reviewed and merged

### Option B: Merge Locally

Merge the feature branch into the base branch using a merge commit.

- Best for: solo projects, local-only workflows
- Preserves full branch history

### Option C: Squash Merge

Squash all commits into a single commit and merge into the base branch.

- Best for: branches with many small/WIP commits, cleaner history
- Individual commit history is lost on the base branch

### Option D: Leave Branch As-Is

Keep the branch in its current state without merging.

- Best for: work that is complete but not ready to merge, pausing for later
- No changes to any other branch

Present them clearly:

```
How would you like to finish this branch?

  A) Create PR    -- push and open a pull request for review
  B) Merge        -- merge into <base> with a merge commit
  C) Squash merge -- squash into one commit, merge into <base>
  D) Leave as-is  -- keep the branch, decide later
```

## Step 4: Execute Chosen Option

### Option A: Create Pull Request

```bash
# Push the branch
git push -u origin <branch-name>

# Generate PR title from branch name or recent commits
# Generate PR body from commit messages and diff summary
gh pr create --title "<title>" --body "<body>"
```

**PR Title Generation:**
- Derive from branch name: `feature/add-auth` becomes `Add authentication`
- Keep under 70 characters
- Use imperative mood

**PR Body Generation:**
- Summarize the changes (what and why)
- List key modifications
- Note any breaking changes
- Include test plan

### Option B: Merge Locally

```bash
# Switch to base branch
git checkout <base-branch>

# Merge feature branch
git merge <feature-branch>

# Delete the feature branch
git branch -d <feature-branch>
```

**Confirmation required** before executing the merge.

### Option C: Squash Merge

```bash
# Switch to base branch
git checkout <base-branch>

# Squash merge
git merge --squash <feature-branch>

# Commit with a comprehensive message
git commit -m "<squash commit message>"

# Delete the feature branch
git branch -d <feature-branch>
```

**Squash commit message** should summarize all changes from the branch, not just the last commit.

**Confirmation required** before executing the squash merge.

### Option D: Leave Branch As-Is

No action needed. Inform the user:

```
Branch <branch-name> left as-is.
You can return to it later with: git checkout <branch-name>
```

## Step 5: Cleanup

After executing options A, B, or C, perform cleanup:

### Remove Worktree (if applicable)

If the branch was developed in a git worktree:

```bash
# Navigate out of the worktree first
git worktree remove <worktree-path>
git worktree prune
```

### Clean Up Remote Tracking (Option B and C only)

If the branch was previously pushed:

```bash
# Delete remote branch after local merge
git push origin --delete <branch-name>
```

**Confirmation required** before deleting remote branches.

### Verify Final State

```bash
git status
git log --oneline -5
```

Confirm the base branch is in the expected state.

## Confirmation Requirements

The following operations require explicit user confirmation before execution:

| Operation | Why |
|-----------|-----|
| Merge into base branch | Destructive: changes base branch history |
| Squash merge | Destructive: loses individual commit history |
| Delete local branch | Cannot be undone if not pushed |
| Delete remote branch | Affects other collaborators |
| Force remove worktree | May discard uncommitted changes |

Never proceed with these operations on assumption. Always ask.

## Error Handling

| Error | Action |
|-------|--------|
| Merge conflicts | Report conflicts, ask user to resolve, do not auto-resolve |
| Push rejected | Fetch and check if rebase/merge is needed |
| PR creation fails | Check gh auth status, report error details |
| Branch already deleted | Skip deletion, continue with remaining cleanup |
| Tests fail | Stop immediately, do not merge or create PR |
