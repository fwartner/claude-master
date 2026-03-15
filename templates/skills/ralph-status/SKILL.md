---
name: ralph-status
description: "Use when reporting progress in autonomous loop iterations. Triggers at the end of every autonomous loop iteration, when the autonomous-loop skill completes a BUILD phase, when progress reporting is needed for monitoring or exit evaluation, or when producing machine-parseable RALPH_STATUS blocks with exit signal protocol."
---

# Ralph Status Reporting

## Overview

The Ralph status block is a structured, machine-parseable progress report included at the end of every autonomous loop iteration. It enables automated monitoring, exit detection, and progress tracking. The format is rigid and must be followed exactly — machine parsing depends on consistent structure.

**Announce at start:** "Producing RALPH_STATUS block for this iteration."

## Trigger Conditions

- End of every autonomous loop iteration (mandatory)
- After BUILD phase completes in the autonomous loop
- When monitoring systems need progress data
- When exit gate evaluation is needed
- When the `autonomous-loop` skill invokes this skill

---

## Phase 1: Data Collection

**Goal:** Gather all metrics needed for the status block.

1. Count tasks completed in this iteration
2. Count files modified (created, edited, deleted)
3. Run the test suite and record result
4. Determine the primary work type
5. Check for blockers or issues

### Metric Collection Table

| Metric | How to Determine | Example |
|--------|-----------------|---------|
| TASKS_COMPLETED_THIS_LOOP | Count tasks marked complete this iteration | 1 |
| FILES_MODIFIED | Count files changed via git diff or tracking | 3 |
| TESTS_STATUS | Run test suite, record overall result | PASSING |
| WORK_TYPE | Categorize the primary activity | IMPLEMENTATION |
| Blockers | Check if any task was unable to proceed | None |

### Work Type Classification

| Work Type | When to Use |
|-----------|-----------|
| IMPLEMENTATION | New code written (features, endpoints, services) |
| TESTING | Primary activity was writing or fixing tests |
| DOCUMENTATION | Primary activity was docs, specs, or comments |
| REFACTORING | Primary activity was restructuring without behavior change |

**STOP — Do NOT proceed to Phase 2 until:**
- [ ] All metrics are collected
- [ ] Test suite has been run (not assumed)
- [ ] Work type is determined

---

## Phase 2: STATUS Evaluation

**Goal:** Determine the correct STATUS value based on iteration outcome.

### STATUS Decision Table

| Condition | STATUS Value | EXIT_SIGNAL |
|-----------|-------------|-------------|
| Tasks remain, work completed this iteration | IN_PROGRESS | false |
| Tasks remain, no work completed (investigation) | IN_PROGRESS | false |
| Cannot proceed, needs external input | BLOCKED | false |
| All tasks complete, all tests pass | COMPLETE | Evaluate Phase 3 |
| All tasks complete, tests failing | IN_PROGRESS | false |

### STATUS Values Defined

| Value | Meaning | Loop Action |
|-------|---------|------------|
| IN_PROGRESS | Work is ongoing, tasks remain or tests failing | Continue loop |
| COMPLETE | All planned work is finished, tests pass | Evaluate exit gate |
| BLOCKED | Cannot proceed without external input | Halt and report |

### When BLOCKED

1. Clearly describe what is blocking progress in RECOMMENDATION
2. Set `EXIT_SIGNAL: false` (blocked is not complete)
3. The circuit breaker may activate if blocked state persists across iterations

**STOP — Do NOT proceed to Phase 3 until:**
- [ ] STATUS value is determined
- [ ] If BLOCKED, blocker is clearly described

---

## Phase 3: EXIT_SIGNAL Evaluation

**Goal:** Determine whether EXIT_SIGNAL should be true or false.

<HARD-GATE>
EXIT_SIGNAL may ONLY be `true` when ALL of these conditions are simultaneously met:
</HARD-GATE>

| Condition | How to Verify | Required |
|-----------|--------------|----------|
| No remaining tasks | IMPLEMENTATION_PLAN.md has no unchecked items | Yes |
| All tests pass | TESTS_STATUS is PASSING | Yes |
| No errors in latest iteration | Clean execution, no unresolved exceptions | Yes |
| No meaningful work remains | No TODOs, no incomplete features, code review done | Yes |

### EXIT_SIGNAL Decision Table

| Tasks Remaining | Tests Status | Errors | Meaningful Work | EXIT_SIGNAL |
|----------------|-------------|--------|----------------|-------------|
| Yes | Any | Any | Any | false |
| No | FAILING | Any | Any | false |
| No | PASSING | Yes | Any | false |
| No | PASSING | No | Yes | false |
| No | PASSING | No | No | **true** |

### Dual-Condition Exit Gate

The loop orchestrator uses TWO independent signals to confirm exit:

1. **Heuristic detection:** Completion language ("all done", "everything passes", "no remaining work") appears >= 2 times in recent output
2. **Explicit declaration:** `EXIT_SIGNAL: true` in the status block

Both must be true simultaneously. This prevents:
- False positives from casual completion language
- Premature exits when Claude says "done" while still working productively

**STOP — Do NOT set EXIT_SIGNAL to true unless ALL four conditions are verified.**

---

## Phase 4: Block Production

**Goal:** Write the RALPH_STATUS block in exact format.

<HARD-GATE>
Every loop iteration MUST end with this exact format. No variations. No additional fields. No missing fields.
</HARD-GATE>

### Required Format

```
---RALPH_STATUS---
STATUS: [IN_PROGRESS | COMPLETE | BLOCKED]
TASKS_COMPLETED_THIS_LOOP: [number]
FILES_MODIFIED: [number]
TESTS_STATUS: [PASSING | FAILING | NOT_RUN]
WORK_TYPE: [IMPLEMENTATION | TESTING | DOCUMENTATION | REFACTORING]
EXIT_SIGNAL: [false | true]
RECOMMENDATION: [one-line summary of next action or completion state]
---END_RALPH_STATUS---
```

### Field Specifications

| Field | Type | Allowed Values | Description |
|-------|------|---------------|-------------|
| STATUS | enum | IN_PROGRESS, COMPLETE, BLOCKED | Current iteration outcome |
| TASKS_COMPLETED_THIS_LOOP | integer | 0+ | Number of tasks finished this iteration |
| FILES_MODIFIED | integer | 0+ | Number of files changed (created, edited, deleted) |
| TESTS_STATUS | enum | PASSING, FAILING, NOT_RUN | State of test suite after this iteration |
| WORK_TYPE | enum | IMPLEMENTATION, TESTING, DOCUMENTATION, REFACTORING | Primary activity category |
| EXIT_SIGNAL | boolean | false, true | Whether all work is complete |
| RECOMMENDATION | string | Free text (one line only) | Next action or final summary |

### RECOMMENDATION Guidelines

| STATUS | RECOMMENDATION Content |
|--------|----------------------|
| IN_PROGRESS | "Next: [specific next task]" |
| COMPLETE | "All tasks complete, tests passing, [summary]" |
| BLOCKED | "Blocked: [specific blocker description]" |

---

## Phase 5: Validation

**Goal:** Verify the status block is correct before output.

### Validation Checks

| Check | Rule | If Violated |
|-------|------|------------|
| Format exact | Matches template character-for-character (except values) | Rewrite block |
| STATUS consistency | COMPLETE requires EXIT_SIGNAL evaluation | Fix STATUS or EXIT_SIGNAL |
| TESTS_STATUS matches reality | Value matches actual test run result | Re-run tests |
| EXIT_SIGNAL justified | true only when all 4 conditions met | Set to false |
| RECOMMENDATION present | Non-empty, one line | Add recommendation |
| No extra fields | Only the 7 defined fields | Remove extras |

---

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Fails | Correct Approach |
|-------------|-------------|-----------------|
| Omitting the status block | Loop cannot evaluate exit, monitoring blind | Every iteration ends with status |
| Setting EXIT_SIGNAL true with failing tests | Premature exit, broken code | Verify all 4 conditions |
| Adding custom fields | Machine parsing breaks | Only the 7 defined fields |
| Multi-line RECOMMENDATION | Parsing breaks on newlines | One line only |
| TESTS_STATUS without running tests | False confidence | Actually run the test suite |
| STATUS: COMPLETE with tasks remaining | Contradictory signal | Check IMPLEMENTATION_PLAN.md |
| Skipping RECOMMENDATION | No guidance for next iteration | Always include actionable recommendation |
| EXIT_SIGNAL: true when BLOCKED | Contradictory — blocked is not complete | BLOCKED always has EXIT_SIGNAL: false |
| Changing the delimiter format | Machine parsing depends on exact delimiters | Use ---RALPH_STATUS--- exactly |
| Guessing FILES_MODIFIED | Inaccurate metrics | Count actual changes |

---

## Anti-Rationalization Guards

<HARD-GATE>
Do NOT skip the status block. Do NOT set EXIT_SIGNAL to true unless all four conditions are verified. Do NOT modify the block format. Machine parsing depends on exact, consistent structure.
</HARD-GATE>

If you catch yourself thinking:
- "The status block is just overhead..." — It is the exit gate mechanism. Never skip.
- "Everything is done, EXIT_SIGNAL: true..." — Verify ALL four conditions first.
- "I'll add an extra field for more detail..." — No. Use RECOMMENDATION for details.
- "Tests probably pass, TESTS_STATUS: PASSING..." — Run them. Verify. Then report.

---

## Integration Points

| Skill | Relationship | When |
|-------|-------------|------|
| `autonomous-loop` | Parent — invokes this skill at end of each iteration | Every iteration |
| `circuit-breaker` | Consumer — monitors for stagnation patterns | Reads status blocks |
| `verification-before-completion` | Upstream — provides test results | Before status block production |
| Monitoring dashboard | Consumer — displays real-time progress | Reads status blocks |
| Log aggregation | Consumer — historical performance analysis | Stores status blocks |

---

## Concrete Examples

### Example: Typical IN_PROGRESS Status

```
---RALPH_STATUS---
STATUS: IN_PROGRESS
TASKS_COMPLETED_THIS_LOOP: 1
FILES_MODIFIED: 3
TESTS_STATUS: PASSING
WORK_TYPE: IMPLEMENTATION
EXIT_SIGNAL: false
RECOMMENDATION: Next: implement user authentication middleware
---END_RALPH_STATUS---
```

### Example: Completion Status

```
---RALPH_STATUS---
STATUS: COMPLETE
TASKS_COMPLETED_THIS_LOOP: 1
FILES_MODIFIED: 2
TESTS_STATUS: PASSING
WORK_TYPE: DOCUMENTATION
EXIT_SIGNAL: true
RECOMMENDATION: All tasks complete, tests passing, documentation updated
---END_RALPH_STATUS---
```

### Example: Blocked Status

```
---RALPH_STATUS---
STATUS: BLOCKED
TASKS_COMPLETED_THIS_LOOP: 0
FILES_MODIFIED: 0
TESTS_STATUS: PASSING
WORK_TYPE: IMPLEMENTATION
EXIT_SIGNAL: false
RECOMMENDATION: Blocked: need database credentials for integration test setup
---END_RALPH_STATUS---
```

### Example: Test Failure Status

```
---RALPH_STATUS---
STATUS: IN_PROGRESS
TASKS_COMPLETED_THIS_LOOP: 1
FILES_MODIFIED: 4
TESTS_STATUS: FAILING
WORK_TYPE: TESTING
EXIT_SIGNAL: false
RECOMMENDATION: 3 tests failing in auth module — investigating root cause next iteration
---END_RALPH_STATUS---
```

---

## Process Summary

1. Complete the iteration's work (implementation, testing, docs, or refactoring)
2. Count tasks completed and files modified
3. Run the test suite and record result
4. Evaluate STATUS value
5. Evaluate EXIT_SIGNAL conditions (all 4 must be true for `true`)
6. Write the RALPH_STATUS block in exact format
7. Include a clear, actionable RECOMMENDATION

---

## Skill Type

**RIGID** — The status block format must be followed exactly. Machine parsing depends on consistent structure. No field additions, no format changes, no skipped blocks.
