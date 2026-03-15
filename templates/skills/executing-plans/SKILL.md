---
name: executing-plans
description: "Use when you have an approved implementation plan document and need to execute it step by step. Provides batch-based execution with TDD, checkpoint reviews, and verification gates."
---

# Executing Plans

## Purpose

This skill turns an approved plan document into working code through disciplined, batch-based execution. It ensures each step is implemented with TDD, verified before proceeding, and reviewed at checkpoints.

## Workflow Overview

```
┌─────────────────────────────────────────────────┐
│  1. READ the plan document                      │
│  2. CREATE tasks for first batch (default: 3)   │
│  3. EXECUTE tasks one at a time with TDD        │
│  4. After batch: full test suite + checkpoint    │
│  5. ASK user to continue or adjust              │
│  6. REPEAT until plan is complete               │
└─────────────────────────────────────────────────┘
```

---

## Phase 1: Read the Plan

Before writing any code, thoroughly read and understand the plan document.

### Steps

1. Read the entire plan document from start to finish
2. Identify all implementation steps/items in the plan
3. Note any dependencies between steps (what must be done first)
4. Note any ambiguities or open questions
5. Confirm understanding with the user before proceeding

### Checklist

- [ ] Plan document read completely
- [ ] All steps/items identified and counted
- [ ] Dependencies between steps mapped
- [ ] Ambiguities or questions noted
- [ ] User has confirmed understanding is correct

### STOP MARKER - Do not proceed until:
- [ ] You can explain the plan's goal in one sentence
- [ ] You can list all implementation steps
- [ ] User has confirmed you may proceed

---

## Phase 2: Create Task Batch

Break the plan into small, executable tasks and create a batch.

### Batch Sizing

- Default batch size: **3 tasks**
- Adjust based on task complexity:
  - Simple tasks (config, boilerplate): up to 5 per batch
  - Complex tasks (new features, integrations): 2-3 per batch
  - Critical tasks (security, data migration): 1 per batch

### Task Requirements

Each task must be:
- **Specific:** Clear definition of what to implement
- **Testable:** Can be verified with automated tests
- **Independent:** Minimal coupling to other tasks in the batch (where possible)
- **Small:** Completable in a focused session

### Task Template

```
Task: [concise description]
Plan Step: [reference to plan section]
Files to Create/Modify: [list of files]
Acceptance Criteria:
  - [specific, testable criterion 1]
  - [specific, testable criterion 2]
Dependencies: [other tasks that must be done first, if any]
```

### STOP MARKER - Do not proceed until:
- [ ] Tasks created for the current batch
- [ ] Each task has clear acceptance criteria
- [ ] Dependencies are satisfied (previous tasks complete)
- [ ] Tasks ordered by dependency (independent tasks first)

---

## Phase 3: Execute Tasks

Execute each task one at a time using the TDD skill.

### Per-Task Workflow

```
For each task in the batch:

1. ANNOUNCE which task you're starting
2. IMPLEMENT using test-driven-development skill:
   a. Write failing test (RED)
   b. Write minimal code to pass (GREEN)
   c. Refactor (REFACTOR)
   d. Repeat RED-GREEN-REFACTOR for each behavior
3. VERIFY using verification-before-completion skill:
   a. Run full test suite (not just new tests)
   b. Run lint, type-check, build as applicable
   c. Confirm all checks pass
4. MARK task as complete
5. PROCEED to next task
```

### Rules During Execution

- **One task at a time.** Do not start task 2 until task 1 is verified.
- **Follow TDD strictly.** No production code without a failing test.
- **Do not deviate from the plan.** If you discover the plan needs changes, stop and discuss with the user.
- **Do not skip verification.** Every task must pass verification before being marked complete.

### STOP MARKER - Do not proceed to next task until:
- [ ] Current task's acceptance criteria are met
- [ ] All tests pass (new and existing)
- [ ] Verification-before-completion has been executed
- [ ] Task marked as complete

---

## Phase 4: Batch Checkpoint

After completing all tasks in a batch, perform a checkpoint review.

### Checkpoint Steps

1. **Run full test suite.** All tests, not just those from the current batch.
2. **Run all verification commands.** Lint, type-check, build, format.
3. **Review what was implemented.** Summarize completed tasks and their outcomes.
4. **Assess progress against the plan.** How far through the plan are we?
5. **Identify any issues or risks.** Anything that came up during execution.
6. **Report to user.** Present status and ask for direction.

### Checkpoint Report Template

```
BATCH CHECKPOINT
================
Batch: [N] of [estimated total]
Tasks Completed: [list]

Verification Results:
  Tests:      [X passed, Y failed, Z skipped]
  Build:      [pass/fail]
  Lint:       [pass/fail, N warnings]
  Type-check: [pass/fail]

Progress: [N of M plan steps complete] ([percentage]%)

Issues Encountered:
  - [issue 1 and how it was resolved]
  - [issue 2 and how it was resolved]

Risks or Concerns:
  - [risk 1]

Next Batch Preview:
  - [task 1]
  - [task 2]
  - [task 3]

Awaiting direction: Continue with next batch / Adjust plan / Other?
```

### STOP MARKER - Do not proceed until:
- [ ] Full test suite passes
- [ ] All verification commands pass
- [ ] Checkpoint report presented to user
- [ ] User has confirmed to continue

---

## Phase 5: Continue or Adjust

After presenting the checkpoint, wait for the user's direction.

### Options

| User Direction | Action |
|---------------|--------|
| "Continue" | Create next batch of tasks, proceed to Phase 2 |
| "Adjust plan" | Discuss changes, update plan, then proceed |
| "Stop here" | Summarize progress, note remaining work |
| "Skip ahead to [step]" | Verify dependencies are met, then jump |
| "Go back and redo [task]" | Revert if needed, re-execute with corrections |

Never proceed to the next batch without explicit user approval.

---

## Critical Blocker Handling

When you encounter something that prevents task completion, DO NOT work around it. Stop and escalate.

### What Qualifies as a Critical Blocker

- Plan step is ambiguous and could be interpreted multiple ways
- Required dependency or API is not available
- Implementation contradicts another part of the plan
- Security concern with the planned approach
- Performance concern that could affect architecture
- Plan step is not feasible as described

### Blocker Protocol

```
CRITICAL BLOCKER
================
Task: [which task is blocked]
Blocker: [clear description of the problem]
Impact: [what cannot proceed until this is resolved]
Options:
  A. [option with tradeoffs]
  B. [option with tradeoffs]
  C. [skip this step and continue]

Awaiting direction before proceeding.
```

**Rules:**
- Do NOT guess what the user intended
- Do NOT implement a workaround without approval
- Do NOT skip the blocked task silently
- DO present options with clear tradeoffs
- DO continue with non-blocked tasks if possible (but flag the skip)

---

## Subagent Dispatch Option

For larger plans, individual tasks can be dispatched to subagents for parallel execution. This is optional and requires user approval.

### When to Suggest Subagent Dispatch

- Plan has 10+ independent tasks
- Tasks are well-specified with clear acceptance criteria
- Tasks have few interdependencies
- Speed of execution is important

### Subagent Dispatch Flow

```
1. Identify tasks suitable for subagent execution
2. Prepare task specifications (see subagent-driven-development skill)
3. Dispatch implementer subagent per task
4. Review each subagent's output
5. Integrate results
6. Run full verification
```

See the `subagent-driven-development` skill for the full subagent workflow.

---

## Integration with Other Skills

| Skill | Integration Point |
|-------|------------------|
| test-driven-development | Every task is implemented using TDD |
| verification-before-completion | Every task must pass verification before marking complete |
| systematic-debugging | When a task encounters unexpected failures |
| code-review | At batch checkpoints, review code quality |
| subagent-driven-development | Optional dispatch for independent tasks |
| resilient-execution | Overall execution resilience and error recovery |

---

## Anti-Patterns

| Anti-Pattern | Correct Approach |
|-------------|-----------------|
| Implementing entire plan at once | Batch-based execution with checkpoints |
| Skipping TDD because "it's simple" | Every task uses TDD, no exceptions |
| Working around blockers silently | Stop and escalate blockers |
| Proceeding without user approval after batch | Always checkpoint and wait |
| Deviating from the plan without discussion | Discuss changes before implementing |
| Running only new tests | Run full test suite at checkpoints |
| Marking tasks complete without verification | Verification is mandatory |
| Batches larger than 5 tasks | Keep batches small for manageability |

---

## Completion Criteria

The plan is complete when:
1. All plan steps have been implemented as tasks
2. All tasks have passed verification
3. Full test suite passes
4. Final checkpoint report presented to user
5. User confirms the plan is complete
