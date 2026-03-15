---
name: finishing-a-development-branch
description: >
  Use when completing work on a feature branch, preparing to merge, or cleaning up after development
  is done. Triggers: branch work is complete, user says "merge", "create PR", "finish branch",
  "done with this branch", ready for code review.
---

# Finishing a Development Branch

## Overview

Provide a structured, safe process for completing work on a development branch, including verification, merge strategy selection, and cleanup. This skill ensures no branch is merged without passing tests, and every destructive operation requires explicit user confirmation.

## When to Use

- All planned work on a feature branch is complete
- A branch is ready for code review or merge
- Cleaning up after development work is finished
- Preparing a pull request for team review

## Phase 1: Verify All Tests Pass

[HARD-GATE] Do NOT proceed to any merge or PR activity without passing verification.

Before any merge or PR activity, invoke **verification-before-completion** to confirm:

- All tests pass (unit, integration, e2e as applicable)
- No lint errors or warnings
- Build succeeds
- No untracked files that should be committed

```bash
# Run the project's full verification suite
# Do NOT skip this step even if "tests were passing earlier"
```

If verification fails, STOP. Fix the failures before proceeding. Do NOT create PRs or merge branches with failing tests.

**STOP — Verification must pass before continuing to Phase 2.**

## Phase 2: Determine Base Branch

Identify the branch to merge into, using this detection logic:

### Auto-Detection

```bash
# Check for common base branch names
git branch -a | grep -E 'remotes/origin/(main|master|develop)$'

# Check what branch was the fork point
git log --oneline --decorate --graph HEAD...main --first-parent 2>/dev/null
git log --oneline --decorate --graph HEAD...master --first-parent 2>/dev/null
```

### Base Branch Selection Decision Table

| Condition | Base Branch | Confidence |
|---|---|---|
| `main` exists | `main` | High |
| Only `master` exists | `master` | High |
| `develop` exists and project uses GitFlow | `develop` | Medium |
| Multiple candidates found | Ask user | Required |
| None of the above exist | Ask user | Required |

### Verify Base Branch is Up to Date

```bash
git fetch origin
git log HEAD..<base-branch> --oneline
```

If the base branch has advanced since the feature branch was created, inform the user. They may want to rebase or merge base into the feature branch first.

### Base Branch Divergence Decision Table

| Divergence | Action |
|---|---|
| Base has 0 new commits | Proceed normally |
| Base has 1-5 new commits | Inform user, suggest rebase |
| Base has 6+ new commits | Warn user, recommend merge or rebase before proceeding |
| Merge conflicts detected | STOP — resolve conflicts first |

**STOP — Confirm the base branch with the user before proceeding.**

## Phase 3: Present Merge Options

Present exactly these four options to the user. Do NOT add or remove options.

```
How would you like to finish this branch?

  A) Create PR    -- push and open a pull request for review
  B) Merge        -- merge into <base> with a merge commit
  C) Squash merge -- squash into one commit, merge into <base>
  D) Leave as-is  -- keep the branch, decide later
```

### Option Selection Decision Table

| Context | Recommended Option | Why |
|---|---|---|
| Team project with code review | A) Create PR | Enables review workflow |
| Solo project, clean history | B) Merge | Preserves full branch history |
| Many WIP commits, messy history | C) Squash merge | Clean single commit on base |
| Work incomplete or uncertain | D) Leave as-is | No risk, decide later |

**STOP — Wait for user to select an option. Do NOT assume a default.**

## Phase 4: Execute Chosen Option

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

## Phase 5: Cleanup

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

[HARD-GATE] The following operations require explicit user confirmation before execution. Do NOT proceed on assumption. Always ask.

| Operation | Why Confirmation Is Required |
|---|---|
| Merge into base branch | Changes base branch history |
| Squash merge | Loses individual commit history |
| Delete local branch | Cannot be undone if not pushed |
| Delete remote branch | Affects other collaborators |
| Force remove worktree | May discard uncommitted changes |
| Rebase onto updated base | Rewrites commit history |

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Is Wrong | What to Do Instead |
|---|---|---|
| Merging without running tests | Broken code reaches base branch | Always run full verification first |
| Skipping base branch freshness check | Merge conflicts discovered late | `git fetch` and check divergence |
| Auto-selecting merge strategy | User may prefer different approach | Always present all four options |
| Deleting branch without confirmation | Data loss risk | Ask before every deletion |
| Creating PR with failing CI | Wastes reviewer time | Fix CI before creating PR |
| Squash message from last commit only | Loses context of full branch work | Summarize all changes in squash msg |
| Leaving stale remote branches | Cluttered repository | Clean up remote after merge |
| Force-pushing after PR creation | Destroys review comments | Avoid force-push on PR branches |

## Error Handling

| Error | Action |
|---|---|
| Merge conflicts | Report conflicts, ask user to resolve, do NOT auto-resolve |
| Push rejected | Fetch and check if rebase/merge is needed |
| PR creation fails | Check `gh auth status`, report error details |
| Branch already deleted | Skip deletion, continue with remaining cleanup |
| Tests fail | STOP immediately, do NOT merge or create PR |
| Base branch does not exist on remote | Ask user to confirm the correct base |

## Integration Points

| Skill | Integration |
|---|---|
| `verification-before-completion` | Must invoke in Phase 1 before any merge activity |
| `using-git-worktrees` | Cleanup includes worktree removal if applicable |
| `git-commit-helper` | Squash commit message follows conventional commit format |
| `code-review` | PR creation (Option A) feeds into code review workflow |
| `planning` | Branch completion is the final step of plan execution |
| `deployment` | Merge to main/release may trigger deployment pipeline |

## Skill Type

**RIGID** — Follow this process exactly. Every phase must be completed in order. Do NOT skip verification. Do NOT merge without user confirmation. Do NOT assume a merge strategy. Do NOT delete branches without asking.
