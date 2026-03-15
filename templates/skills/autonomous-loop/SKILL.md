---
name: autonomous-loop
description: "Use when running Ralph-style iterative autonomous development. Triggers on /ralph or /loop commands, when autonomous iterative development is needed, when a project has specs and an implementation plan ready for iterative execution, or when deterministic context loading with subagent delegation and dual-condition exit gates is required. Orchestrates PLANNING, BUILDING, and STATUS cycles."
---

# Autonomous Loop

## Overview

The autonomous loop implements Ralph's iterative development methodology. Each iteration loads identical context (PROMPT + AGENTS files), executes one focused task, reports structured status, and persists state to disk for the next iteration. The loop continues until the dual-condition exit gate is satisfied. The core innovation is that deterministic conditions allow Claude to autonomously plan, build, and iterate toward quality without human intervention in the loop.

**Announce at start:** "I'm starting the autonomous loop. Loading context and beginning PLANNING mode."

## Trigger Conditions

- `/ralph` or `/loop` command invoked
- Project has specs and is ready for iterative autonomous development
- Multi-task implementation that benefits from autonomous iteration
- User requests autonomous execution without per-task approval

---

## Architecture

```
+--------------------------------------------------+
|                 AUTONOMOUS LOOP                    |
|                                                    |
|  +----------+    +----------+    +-----------+    |
|  | PLANNING |---→| BUILDING |---→|  STATUS   |    |
|  |   MODE   |    |   MODE   |    |  CHECK    |    |
|  +----------+    +----------+    +-----+-----+    |
|       ^                               |           |
|       |            +-----------+      |           |
|       +------------|  EXIT GATE|←-----+           |
|                    |  (dual)   |                   |
|                    +-----+-----+                   |
|                          |                         |
|                    PASS: EXIT                      |
|                    FAIL: LOOP                      |
+--------------------------------------------------+
```

---

## Phase 1: PLANNING MODE (Gap Analysis)

**Goal:** Analyze specs against implementation to identify and prioritize remaining work.

<HARD-GATE>
Planning mode produces NO implementation code. It is analysis and planning ONLY.
</HARD-GATE>

### Steps

1. **Knowledge Gathering** — Deploy up to 250 parallel subagents via the `Agent` tool (with `subagent_type="Explore"` and `model="sonnet"`) to study specs, existing implementation plans, and utility libraries
2. **Code Analysis** — Deploy up to 500 parallel subagents via the `Agent` tool (with `subagent_type="Explore"`) to study `src/*` against `specs/*`, identifying gaps between specification and implementation
3. **Synthesis** — Deploy a synthesis subagent via the `Agent` tool (with `model="opus"`) to synthesize findings and prioritize incomplete work
4. **Plan Refresh** — Update `IMPLEMENTATION_PLAN.md` as organized, prioritized bullet list

### Planning Mode Constraints

| Constraint | Rationale |
|-----------|-----------|
| Verify ALL assumptions through code search | Never assume something is absent |
| Treat `src/lib` as authoritative standard library | Consolidate, do not duplicate |
| Output is a prioritized task list | Not code, not designs — tasks only |
| Identify missing specs | Specs gaps are blockers, not things to guess about |

### Planning Mode Output

```
IMPLEMENTATION_PLAN.md updated:
- [x] Completed tasks (checked off)
- [ ] Remaining task 1 (highest priority)
- [ ] Remaining task 2
- [ ] Remaining task 3
...
Missing specs identified: [list or "none"]
```

**STOP — Do NOT proceed to Phase 2 until:**
- [ ] All specs have been read and analyzed
- [ ] Code has been compared against specs
- [ ] IMPLEMENTATION_PLAN.md is updated with prioritized tasks
- [ ] Missing specs are identified (if any)

---

## Phase 2: BUILDING MODE (Implementation)

**Goal:** Select and complete exactly ONE task per iteration.

### "ONE Task Per Loop" Principle

Each iteration selects and completes exactly one task from IMPLEMENTATION_PLAN.md. This reduces context switching, enables clear progress measurement, and makes debugging easier.

### Steps

1. **Study** — Read specs and current IMPLEMENTATION_PLAN.md
2. **Select** — Choose the most important remaining task
3. **Search** — Find existing code patterns (do NOT assume implementations are missing)
4. **Implement** — Write complete, production-quality code (no placeholders, no stubs)
5. **Test** — Run tests immediately after implementation
6. **Update** — Refresh IMPLEMENTATION_PLAN.md with findings and progress
7. **Commit** — Descriptive conventional commit message with rationale

### Task Selection Decision Table

| Condition | Which Task to Select |
|-----------|---------------------|
| Blocker exists for other tasks | Select the blocker task |
| Test failures exist | Select task that fixes the failure |
| All tasks independent | Select highest priority task |
| Multiple tasks at same priority | Select the one with clearest spec |
| Spec is missing for top task | Run PLANNING mode to identify gap |

### Subagent Rules During Building

| Resource | Budget | Rationale |
|----------|--------|-----------|
| Read/search subagents | Up to 500 parallel Sonnet | Fast context gathering |
| Build subagent | Only 1 Sonnet at a time | Serialize builds to detect failures |
| Main context | 40-60% utilization | The "smart zone" — enough room to think |

### Building Mode Constraints

| Constraint | Rationale |
|-----------|-----------|
| No placeholders or stubs | Every line of code is production-quality |
| Search before implementing | Code may already exist elsewhere |
| Run tests immediately | Backpressure catches errors early |
| Update plan after every task | Keep plan current with reality |
| Commit after every task | Small atomic commits, easy to revert |

**STOP — Do NOT proceed to Phase 3 until:**
- [ ] Task is fully implemented (no stubs)
- [ ] Tests have been run
- [ ] IMPLEMENTATION_PLAN.md is updated
- [ ] Changes are committed

---

## Phase 3: STATUS CHECK

**Goal:** Produce a RALPH_STATUS block and evaluate exit conditions.

After each BUILD iteration, invoke the `ralph-status` skill to produce a structured status block.

### Exit Evaluation

| Check | Condition | Result |
|-------|-----------|--------|
| Tasks remaining? | IMPLEMENTATION_PLAN.md has unchecked items | Continue loop |
| Tests passing? | Full test suite passes | Required for exit |
| Errors in iteration? | Clean execution, no unresolved exceptions | Required for exit |
| Meaningful work remains? | No TODOs, no incomplete features | Required for exit |

### Loop Decision

| Status | Tasks Remaining | Tests | Action |
|--------|----------------|-------|--------|
| IN_PROGRESS | Yes | Any | Loop back to Phase 1 or 2 |
| IN_PROGRESS | No | FAILING | Loop — fix failures first |
| BLOCKED | Any | Any | Report blocker, wait for input |
| COMPLETE | No | PASSING | Evaluate exit gate |

---

## Exit Conditions — Dual-Condition Gate

<HARD-GATE>
Both conditions must be true simultaneously to exit the loop:
</HARD-GATE>

| Condition | Threshold | Verification |
|-----------|-----------|-------------|
| Completion indicators | >= 2 recent occurrences of "done" language | Heuristic detection in output |
| Explicit EXIT_SIGNAL | `EXIT_SIGNAL: true` in status block | Intentional declaration |

### EXIT_SIGNAL May Only Be `true` When ALL Of:

- IMPLEMENTATION_PLAN.md has no remaining tasks
- All tests pass
- No errors in latest iteration
- No meaningful work remains

This prevents false positives where completion language appears while productive work continues.

### Exit Decision Table

| Completion Language | EXIT_SIGNAL | Action |
|--------------------|-------------|--------|
| < 2 occurrences | false | Continue loop |
| >= 2 occurrences | false | Continue — may be casual language |
| < 2 occurrences | true | Continue — signal without evidence |
| >= 2 occurrences | true | EXIT the loop |

---

## Context Efficiency

| Resource | Budget | Strategy |
|----------|--------|----------|
| Main context | 40-60% of window | Keep focused; delegate heavy lifting |
| Read subagents | Up to 500 parallel | Searching, file reading, pattern matching |
| Build subagents | 1 at a time | Implementation, test execution |
| Token format | Markdown over JSON | ~30% more efficient |

---

## Steering Mechanisms

### Upstream Steering (Shaping Inputs)

| Mechanism | Purpose |
|-----------|---------|
| First ~5,000 tokens for detailed specs | Front-load specification context |
| Identical files each iteration | Deterministic context loading |
| Existing code patterns as guides | Generate consistent code |

### Downstream Steering (Validation Gates)

| Gate | What It Catches |
|------|----------------|
| Tests | Invalid implementations |
| Builds | Compilation errors |
| Linters | Style inconsistencies |
| Typecheckers | Contract violations |
| LLM-as-judge | Subjective quality issues |

---

## State Persistence

The only persistent state between iterations is the file system:

| File | Purpose | Managed By |
|------|---------|-----------|
| `IMPLEMENTATION_PLAN.md` | Task list and progress | Planning and Building modes |
| `specs/*.md` | Specification files | `spec-writing` skill |
| `AGENTS.md` | Operational notes and learnings | Building mode |
| Source code + tests | The actual implementation | Building mode |

**IMPLEMENTATION_PLAN.md is disposable** — it can be regenerated from specs at any time by running a planning iteration.

---

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Fails | Correct Approach |
|-------------|-------------|-----------------|
| Multiple tasks per iteration | Context switching, unclear progress | ONE task per loop |
| Assuming code is missing | May exist elsewhere, leads to duplication | Always search first |
| Skipping tests after implementation | Bugs accumulate, no backpressure | Run tests IMMEDIATELY |
| Modifying plan only during planning | Plan drifts from reality | Update during BOTH planning and building |
| Keeping stale plans | Tasks based on outdated assumptions | Regenerate liberally — planning is cheap |
| Manual context management | Main context overflows | Trust subagent delegation |
| Exiting without dual-condition | Premature exit, work incomplete | Both conditions must be true |
| Not committing after each task | Large changesets, hard to revert | Commit every iteration |
| Placeholder or stub code | Incomplete implementations accumulate | Production-quality code only |
| Skipping STATUS CHECK | No exit evaluation, loop runs forever | Every iteration ends with status |

---

## Anti-Rationalization Guards

<HARD-GATE>
Do NOT exit the loop without the dual-condition gate passing. Do NOT implement more than one task per iteration. Do NOT write placeholder or stub code. Do NOT skip the STATUS CHECK.
</HARD-GATE>

If you catch yourself thinking:
- "I can do two quick tasks in this iteration..." — No. ONE task per loop.
- "The plan is probably fine, skip planning mode..." — Verify. Plans drift.
- "Tests can wait until the next iteration..." — Run tests NOW. Backpressure is essential.
- "Everything is done, I can exit..." — Check the dual-condition gate. Both must be true.

---

## Subagent Dispatch Opportunities

| Task Pattern | Dispatch To | When |
|---|---|---|
| Independent file reads across codebase | `Agent` tool with `subagent_type="Explore"` | When loop iteration needs context from multiple areas |
| Test execution during build phase | `Bash` tool with `run_in_background=true` | When tests can validate work without blocking progress |
| Code review between iterations | `Agent` tool dispatching `code-reviewer` agent | After completing a build iteration, before next planning |

Follow the `dispatching-parallel-agents` skill protocol when dispatching.

---

## Integration Points

| Skill | Relationship | When |
|-------|-------------|------|
| `ralph-status` | Per-iteration — produces status blocks | Phase 3: STATUS CHECK |
| `circuit-breaker` | Safety net — monitors loop health | Halts on stagnation |
| `spec-writing` | Upstream — creates specs consumed by planning | Before loop starts |
| `acceptance-testing` | Validation — validates behavioral outcomes | During building mode |
| `resilient-execution` | Per-task — retry on failure | When task implementation fails |
| `task-management` | Tracking — tracks individual tasks | Within iterations |
| `llm-as-judge` | Quality — evaluates subjective criteria | Downstream steering |
| `verification-before-completion` | Final gate — verifies completion claim | Before EXIT_SIGNAL: true |

---

## Concrete Examples

### Example: Planning Mode Output

```
IMPLEMENTATION_PLAN.md:
- [x] Set up project structure
- [x] Implement core data types
- [ ] Implement user authentication (P0 — blocks 3 other tasks)
- [ ] Add API rate limiting (P1)
- [ ] Implement webhook handlers (P1)
- [ ] Add monitoring and logging (P2)

Missing specs: Rate limiting spec needs error response format defined.
```

### Example: Building Mode Iteration

```
Task selected: Implement user authentication
Searched: Found existing password hashing in src/lib/crypto.ts
Implemented: src/auth/service.ts, src/auth/middleware.ts
Tests: 8 passing, 0 failing
Committed: feat(auth): implement JWT-based user authentication

Updated IMPLEMENTATION_PLAN.md:
- [x] Implement user authentication
```

### Example: Status Block

```
---RALPH_STATUS---
STATUS: IN_PROGRESS
TASKS_COMPLETED_THIS_LOOP: 1
FILES_MODIFIED: 4
TESTS_STATUS: PASSING
WORK_TYPE: IMPLEMENTATION
EXIT_SIGNAL: false
RECOMMENDATION: Next: implement API rate limiting (P1)
---END_RALPH_STATUS---
```

---

## Skill Type

**RIGID** — Follow this process exactly. The determinism of the loop depends on consistent execution. ONE task per loop. Status block every iteration. Dual-condition exit gate. No exceptions.
