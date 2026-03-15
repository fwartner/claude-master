---
name: code-review
description: "Use when completing a task, implementing a feature, or before committing to verify work meets requirements and coding standards. Triggers: task completion, pre-commit check, pre-merge validation, plan alignment verification, post-refactor quality gate."
---

# Code Review

## Overview

Comprehensive code review against the original plan, coding standards, and learned project patterns. This skill dispatches a dedicated code-reviewer agent for thorough analysis, ensuring every change is evidence-based, plan-aligned, and convention-aware before it reaches the main branch.

**Announce at start:** "I'm using the code-review skill to review the implementation."

---

## Phase 1: Gather Context

**Goal:** Identify what changed, what the plan required, and what conventions apply.

### Actions

1. Retrieve the changes to review:
```bash
git diff HEAD~N..HEAD          # or specific commit range
git log --oneline HEAD~N..HEAD # what was done
```

2. Locate the plan document:
```bash
ls docs/plans/*.md | tail -1
```

3. Load project conventions from `memory/learned-patterns.md`

4. Identify:
   - What files were changed
   - What the plan/spec required
   - What conventions apply

### STOP — Do NOT proceed to Phase 2 until:
- [ ] All changed files are identified
- [ ] The plan or spec requirements are loaded
- [ ] Relevant conventions from memory are loaded
- [ ] You can state what was supposed to be built

---

## Phase 2: Dispatch Code Reviewer

**Goal:** Send structured review request to the `code-reviewer` agent.

### Review Prompt Template

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

### STOP — Do NOT proceed to Phase 3 until:
- [ ] Review request has been dispatched
- [ ] Reviewer agent has returned findings

---

## Phase 3: Categorize and Resolve Issues

**Goal:** Classify findings and fix all Critical issues.

### Issue Categorization Table

| Category | Definition | Action Required |
|----------|-----------|-----------------|
| **Critical** | Bugs, security issues, data loss risk, plan violations | Must fix before merge |
| **Important** | Code quality, missing tests, convention violations | Should fix before merge |
| **Suggestions** | Style, naming, minor improvements | Nice to have, fix if time allows |

### Fix Loop

For Critical and Important issues:
1. Fix the issue
2. Run tests to verify the fix
3. Re-dispatch code-reviewer agent for the specific fix
4. Repeat until no Critical issues remain

### STOP — Do NOT proceed to Phase 4 until:
- [ ] All Critical issues are resolved
- [ ] All Important issues are resolved or explicitly deferred with justification
- [ ] Test suite passes after all fixes

---

## Phase 4: Self-Learning Integration

**Goal:** Persist patterns discovered during review for future sessions.

### Actions

1. If new patterns were identified, update `memory/learned-patterns.md`
2. If a common mistake was found, note it for future reference
3. If the plan needed adjustment, update `memory/decisions-log.md`

---

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

---

## Decision Table: Review Depth

| Change Type | Review Depth | Reviewer |
|-------------|-------------|----------|
| New feature (>100 lines) | Full review: plan alignment + quality + security + tests | code-reviewer agent |
| Bug fix (<50 lines) | Focused review: regression test + root cause + fix correctness | code-reviewer agent |
| Refactor (no behavior change) | Behavior preservation: all tests pass + no regressions | code-reviewer agent |
| Config/infra change | Security + correctness: no secrets exposed, valid syntax | code-reviewer agent |
| Documentation only | Accuracy + completeness: matches current code behavior | Inline review |

---

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Is Wrong | Correct Approach |
|-------------|----------------|-----------------|
| Skipping review for "small fixes" | Small changes cause production outages | Review everything |
| Reviewing without the plan | Cannot verify correctness without requirements | Always load the plan first |
| Fixing issues without re-running tests | Fixes can introduce new bugs | Run full test suite after every fix |
| Generic feedback ("looks good") | Not actionable, misses real issues | Cite specific code lines with fix recommendations |
| Reviewing your own code alone | Author blindness misses defects | Always dispatch code-reviewer agent |
| Deferring Critical issues | Critical issues become production incidents | Must fix before merge, no exceptions |

---

## Rationalizations — STOP If You Think These

| Excuse | Reality |
|--------|---------|
| "It's just a typo fix" | Typo fixes can break APIs. Review it. |
| "I'm confident in this code" | Confidence does not equal correctness. Review it. |
| "The tests pass" | Tests can miss bugs. Review it. |
| "It's just styling/formatting" | Style changes can introduce bugs. Review it. |
| "Nobody will notice" | That is exactly when bugs ship. Review it. |
| "I'll review it later" | Later never comes. Review it now. |
| "The deadline is tight" | Shipping bugs costs more than reviewing. Review it. |

---

## Subagent Dispatch Opportunities

| Task Pattern | Dispatch To | When |
|---|---|---|
| Reviewing multiple independent files/modules | `Agent` tool with `subagent_type="Explore"` | When review scope spans multiple unrelated modules |
| Security-focused review pass | `Agent` tool invoking `security-review` skill | When changes touch auth, input handling, or external APIs |
| Performance impact assessment | `Agent` tool invoking `performance-optimization` skill | When changes affect hot paths or data-heavy operations |

Follow the `dispatching-parallel-agents` skill protocol when dispatching.

---

## Integration Points

| Skill | Relationship |
|-------|-------------|
| `planning` | Review checks implementation against the approved plan |
| `test-driven-development` | Review verifies test coverage and TDD compliance |
| `verification-before-completion` | Review is a prerequisite for verification |
| `self-learning` | Review findings feed into learned patterns |
| `acceptance-testing` | Review checks that acceptance tests exist for all criteria |
| `systematic-debugging` | If review reveals a bug, switch to debugging skill |
| `security-review` | Security findings during review trigger deeper security analysis |

---

## Iron Law

```
┌─────────────────────────────────────────────────────────────────┐
│  HARD-GATE: NO MERGE WITHOUT REVIEW                            │
│                                                                 │
│  Every change gets reviewed. No exceptions for "small fixes"   │
│  or "obvious changes." If you are about to merge without       │
│  review, STOP immediately.                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Skill Type

**RIGID** — The four-phase process is mandatory. Every change must be reviewed by the code-reviewer agent. No merge without review. No exceptions.
