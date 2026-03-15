---
name: auto-improvement
description: When the system needs to track its own effectiveness, learn from errors, adapt workflows, and continuously improve its performance through structured self-assessment.
---

# Auto-Improvement

## Overview

Implement a self-improving system that tracks effectiveness metrics, learns from errors, identifies recurring failure patterns, and adapts workflows to prevent repeated mistakes. This skill covers error classification and tracking, performance metric collection, retrospective analysis, pattern recognition for common failures, workflow adaptation, and feedback loop integration. It enables the agent to become measurably better over time through structured self-assessment rather than ad-hoc adjustments.

## Process

### Phase 1: Metric Collection
1. Define effectiveness metrics for the current workflow
2. Instrument key decision points with outcome tracking
3. Record task completion time, accuracy, and revision count
4. Log errors with full context (what happened, why, what was tried)
5. Track user corrections and feedback as improvement signals

### Phase 2: Error Analysis
1. Classify each error by type, severity, and root cause
2. Identify recurring error patterns (same mistake > 2 times)
3. Trace errors to their origin (bad assumption, missing context, wrong approach)
4. Calculate error frequency and impact metrics
5. Prioritize errors by frequency x impact for improvement focus

### Phase 3: Pattern Recognition
1. Group related errors into failure categories
2. Identify environmental triggers (specific file types, frameworks, patterns)
3. Detect workflow bottlenecks causing consistent slowdowns
4. Recognize successful patterns worth reinforcing
5. Map anti-patterns to their corrective actions

### Phase 4: Adaptation
1. Generate improvement hypotheses from error patterns
2. Implement workflow adjustments (checklists, guardrails, new heuristics)
3. Update memory files with learned patterns
4. Create or refine pre-flight checks for high-risk operations
5. Validate improvements against historical error data

### Phase 5: Feedback Loop
1. Measure effectiveness of implemented improvements
2. Compare current error rates against baseline
3. Archive improvements that work, revert those that don't
4. Share learnings across sessions via memory files
5. Schedule periodic full retrospectives

## Error Classification Framework

### Error Taxonomy
| Category | Subcategory | Example | Typical Root Cause |
|---|---|---|---|
| **Comprehension** | Misread requirement | Built feature X when Y was asked | Insufficient clarification |
| **Comprehension** | Wrong assumption | Assumed REST when GraphQL was used | Missing context discovery |
| **Execution** | Syntax error | Invalid TypeScript type annotation | Unfamiliar API surface |
| **Execution** | Logic error | Off-by-one in pagination | Insufficient test coverage |
| **Execution** | Integration error | Wrong API endpoint or payload format | Missing documentation check |
| **Process** | Skipped step | Forgot to run tests before commit | Process not followed |
| **Process** | Wrong order | Wrote code before understanding spec | Eagerness over methodology |
| **Judgment** | Over-engineering | Built abstraction for single use case | Premature optimization |
| **Judgment** | Under-engineering | Skipped error handling for "simple" task | Underestimated complexity |
| **Knowledge** | Unknown API | Used deprecated method | Outdated training data |
| **Knowledge** | Framework gap | Wrong Next.js pattern for app router | Need to check docs first |

### Severity Levels
| Level | Definition | Response Required |
|---|---|---|
| **Critical** | Task must be completely redone | Immediate root cause analysis, add guardrail |
| **Major** | Significant rework needed (> 50% of task) | Root cause analysis, add checklist item |
| **Minor** | Small fix needed (< 30 minutes) | Log pattern, review if recurring |
| **Cosmetic** | Style or preference issue | Note for future, no process change |

## Effectiveness Metrics

### Core Metrics
| Metric | Formula | Target | Measurement |
|---|---|---|---|
| First-attempt success rate | Tasks completed without revision / Total tasks | > 80% | Per session |
| Average revision count | Total revisions / Total tasks | < 1.5 | Per session |
| Error recurrence rate | Repeated errors / Total errors | < 10% | Rolling 10 sessions |
| Time-to-completion accuracy | Actual time / Estimated time | 0.8 - 1.2 | Per task |
| User correction rate | User corrections / Total outputs | < 5% | Per session |

### Tracking Template
```markdown
## Session Metrics — [Date]

### Tasks
| Task | Estimated | Actual | Revisions | Success | Error Type |
|------|-----------|--------|-----------|---------|------------|
| ...  | 30m       | 45m    | 1         | Partial | Execution  |

### Summary
- Tasks completed: X
- First-attempt success: X/Y (Z%)
- Total revisions: N
- Errors by category: Comprehension(n), Execution(n), Process(n)
- Improvement actions taken: [list]
```

## Error Log Format

```markdown
## Error Log Entry

**ID:** ERR-2026-0315-001
**Date:** 2026-03-15
**Task:** Implement user search API endpoint
**Severity:** Major
**Category:** Knowledge > Framework gap

### What Happened
Used `getServerSideProps` pattern in a Next.js App Router project.
The page rendered but hydration failed with runtime errors.

### Root Cause
Assumed Pages Router patterns. Did not check which Next.js router
the project uses before writing code.

### What Was Tried
1. Attempted to fix hydration by adding "use client" — partially worked
2. Realized the fundamental approach was wrong
3. Rewrote using App Router server component pattern

### Resolution
Rewrote the component as an async server component with direct
database queries instead of API route + getServerSideProps.

### Time Lost
45 minutes (estimated: 30 minutes without the error)

### Prevention
- **New checklist item:** Before writing Next.js code, verify router
  type by checking for `app/` vs `pages/` directory
- **Memory update:** Added to `learned-patterns.md`

### Recurrence Check
- [ ] Similar error seen before? No — first occurrence
- [ ] Guardrail added? Yes — pre-flight check for Next.js projects
```

## Improvement Patterns

### Pre-Flight Checklists
Create checklists that run before high-risk operations to prevent known errors.

```markdown
## Pre-Flight: Before Writing Framework Code
- [ ] Identify the framework and version (check package.json)
- [ ] Identify the routing pattern (pages/ vs app/, file-based vs code-based)
- [ ] Check for existing patterns in the codebase (find similar files)
- [ ] Verify the API surface in documentation (don't assume from memory)
- [ ] Check for project-specific conventions (eslint config, tsconfig)
```

### Guardrail Rules
```markdown
## Guardrail: Database Operations
BEFORE any database migration or schema change:
1. Check if there is an existing migration framework
2. Verify the current schema state
3. Create a rollback plan
4. Test migration on a copy first

TRIGGERED BY: any task involving database, schema, migration, model
ADDED BECAUSE: ERR-2026-0212-003 (dropped production table)
```

### Pattern Reinforcement
```markdown
## Positive Pattern: Context Discovery First
OBSERVATION: Tasks where project context was gathered first had
a 92% first-attempt success rate vs. 64% without.

REINFORCEMENT: Always run context discovery before implementation.
Minimum: check package.json, read existing code in same domain,
identify conventions.

EVIDENCE: Sessions 2026-02-01 through 2026-03-15 (47 tasks)
```

## Retrospective Template

```markdown
## Retrospective — [Period]

### What Went Well
- [Pattern/approach that consistently succeeded]
- [New technique that improved outcomes]

### What Went Poorly
- [Recurring error pattern with frequency]
- [Process gap that caused rework]

### Error Trends
| Category | This Period | Last Period | Trend |
|----------|------------|-------------|-------|
| Comprehension | 3 | 5 | Improving |
| Execution | 7 | 4 | Worsening — investigate |
| Process | 1 | 3 | Improving |
| Knowledge | 4 | 4 | Stable |

### Root Cause Analysis (Top 3 Errors)
1. **[Error pattern]** — Root cause: [analysis] — Fix: [action]
2. **[Error pattern]** — Root cause: [analysis] — Fix: [action]
3. **[Error pattern]** — Root cause: [analysis] — Fix: [action]

### Improvement Actions
| Action | Priority | Status | Expected Impact |
|--------|----------|--------|-----------------|
| Add pre-flight check for X | High | Planned | -30% execution errors |
| Update memory with Y pattern | Medium | Done | -20% knowledge errors |
| Create guardrail for Z | High | In Progress | Prevent critical error class |

### Metrics vs. Targets
| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| First-attempt success | > 80% | 75% | Below target |
| Revision count | < 1.5 | 1.8 | Below target |
| Error recurrence | < 10% | 8% | On target |
```

## Memory File Integration

### What to Persist
| File | Update When | Content |
|---|---|---|
| `learned-patterns.md` | New pattern discovered or error pattern identified | Coding conventions, framework patterns, anti-patterns |
| `user-preferences.md` | User corrects style, format, or approach | Communication preferences, code style, tool choices |
| `decisions-log.md` | Significant architectural or approach decision | Decision, rationale, alternatives considered |
| `project-context.md` | New project context discovered | Tech stack, architecture, dependencies |

### Update Protocol
1. Identify the learning from the error or success
2. Check if it conflicts with existing memory entries
3. If conflict: update the existing entry with new information
4. If new: add entry with context, evidence, and date
5. Remove entries that are no longer valid (tech changed, project evolved)

## Continuous Improvement Cycle

```
  ┌──────────────┐
  │   Execute     │
  │   Tasks       │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │   Collect     │
  │   Metrics     │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │   Analyze     │
  │   Errors      │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │   Identify    │
  │   Patterns    │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │   Implement   │
  │   Improvements│
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │   Validate    │──── Did it work? ──── No ──→ Revert, try different approach
  │   Impact      │
  └──────┬───────┘
         │ Yes
         ▼
  ┌──────────────┐
  │   Persist to  │
  │   Memory      │
  └──────┬───────┘
         │
         └──────→ (back to Execute Tasks)
```

## Anti-Patterns

- Making the same mistake three times without creating a guardrail
- Tracking metrics without acting on them (measurement theater)
- Over-correcting from a single error (one bad experience with a tool does not mean avoid it forever)
- Not distinguishing between systemic issues and one-off flukes
- Updating memory files without evidence (gut feeling is not a pattern)
- Creating so many checklists that they become overhead instead of help
- Blaming external factors without examining internal process gaps
- Not validating that improvements actually reduce error rates
- Persisting outdated patterns that no longer apply to the current project
- Treating all errors equally instead of prioritizing by frequency and impact

## Skill Type

**RIGID** — Error tracking, classification, and the improvement cycle must be followed consistently. Every recurring error must result in a concrete preventive action. Memory files must be updated with evidence-based patterns only. The retrospective cadence and metric collection are mandatory for continuous improvement.
