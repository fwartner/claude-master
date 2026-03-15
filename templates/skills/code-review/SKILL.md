---
name: code-review
description: Use when completing a task, implementing a feature, or before committing to verify work meets requirements and coding standards. Enhanced version with plan alignment and self-learning integration.
---

# Code Review

## Overview

Comprehensive code review against the original plan, coding standards, and learned project patterns. Dispatches a dedicated code-reviewer agent for thorough analysis.

**Announce at start:** "I'm using the code-review skill to review the implementation."

## Checklist

1. **Gather context** — identify what changed and what the plan required
2. **Dispatch reviewer** — send to code-reviewer agent
3. **Categorize issues** — Critical, Important, Suggestions
4. **Fix critical issues** — must be resolved before proceeding
5. **Re-review if needed** — iterate until no Critical issues remain
6. **Update self-learning** — persist any new patterns discovered

## Step 1: Gather Context

```bash
# Get the changes to review
git diff HEAD~N..HEAD          # or specific commit range
git log --oneline HEAD~N..HEAD # what was done

# Find the plan (if it exists)
ls docs/plans/*.md | tail -1
```

Identify:
- What files were changed
- What the plan/spec required
- What conventions apply (from memory/learned-patterns.md)

## Step 2: Dispatch Code Reviewer

Launch the `code-reviewer` agent with this structured prompt:

```
Review the following changes against:
1. Plan: [plan document or requirements]
2. Conventions: [learned patterns from memory]
3. Standards: [CLAUDE.md rules]

Changes:
[git diff output or file list]

Check for:
- Plan alignment (did we build what was specified?)
- Code quality (DRY, YAGNI, naming, structure)
- Error handling (edge cases, failure modes)
- Security (injection, XSS, auth issues)
- Test coverage (are changes tested?)
- Performance (obvious bottlenecks)
- Documentation (are public APIs documented?)
```

## Step 3: Issue Categorization

| Category | Definition | Action |
|----------|-----------|--------|
| **Critical** | Bugs, security issues, data loss risk, plan violations | Must fix before merge |
| **Important** | Code quality, missing tests, convention violations | Should fix |
| **Suggestions** | Style, naming, minor improvements | Nice to have |

## Step 4: Fix and Re-Review

For Critical and Important issues:
1. Fix the issue
2. Run tests to verify the fix
3. Re-dispatch code-reviewer agent for the specific fix
4. Repeat until no Critical issues remain

## Step 5: Self-Learning Integration

After review:
- If new patterns were identified, update `memory/learned-patterns.md`
- If a common mistake was found, note it for future reference
- If the plan needed adjustment, update `memory/decisions-log.md`

## Review Output Format

```markdown
## Code Review Summary

**Scope:** [files/components reviewed]
**Plan alignment:** [aligned / minor deviations / major deviations]

### Critical Issues (N)
1. **[Issue title]** — `file:line`
   Problem: [description]
   Fix: [specific recommendation]

### Important Issues (N)
1. **[Issue title]** — `file:line`
   Problem: [description]
   Fix: [specific recommendation]

### Suggestions (N)
1. **[Suggestion]** — `file:line`

### What Was Done Well
- [Positive observations]
```

## Key Principles

- **Evidence-based** — cite specific code, not general advice
- **Plan-first** — always check against the original plan
- **Constructive** — lead with what was done well
- **Actionable** — every issue has a specific fix recommendation
- **Convention-aware** — use learned patterns as the standard
