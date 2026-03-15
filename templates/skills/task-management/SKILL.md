---
name: task-management
description: Use when breaking work into discrete steps, tracking progress through multi-step implementations, or managing implementation task lists
---

# Task Management

## Overview

Break approved plans into bite-sized, trackable tasks. Each task is a single action that takes 2-5 minutes. Track progress, checkpoint regularly, and integrate with code review.

**Announce at start:** "I'm using the task-management skill to break this plan into tracked tasks."

## Task Granularity

**Each task is ONE action (2-5 minutes):**
- "Write the failing test for X" — one task
- "Run the test to verify it fails" — one task
- "Implement the minimal code to pass the test" — one task
- "Run tests and verify they pass" — one task
- "Commit the changes" — one task

**NOT a task:** "Implement the authentication system" — this is 10+ tasks.

## Workflow

### Step 1: Parse the Plan

Read the approved plan document and extract tasks. Create a TodoWrite/TaskCreate entry for each task with:
- Clear, specific description
- Exact file paths involved
- Verification command (how to know it's done)
- Dependencies (which tasks must complete first)

### Step 2: Execute Tasks

For each task:
1. Set status to `in_progress`
2. Execute the task
3. Run verification command
4. Set status to `completed`
5. Report progress: `[N/Total] Task completed: <description>`

### Step 3: Checkpoint Every 3 Tasks

After every 3 completed tasks:
- Show progress summary
- Run full test suite
- Ask user if direction is still correct
- Invoke code-review skill if significant code was written

### Step 4: Batch Review

After completing a logical batch (e.g., one component, one API endpoint):
- Dispatch code-reviewer agent to review the batch
- Fix any Critical or Important issues before proceeding
- Commit the batch

## Task Status Flow

```
pending → in_progress → completed
                     → blocked (needs user input)
                     → failed (invoke resilient-execution)
```

## Progress Reporting

After each task:
```
[3/15] ✓ Write failing test for UserService.create
       Files: tests/services/user.test.ts
       Verification: npm test -- --grep "UserService.create" → PASS
```

After each checkpoint:
```
── Checkpoint [6/15] ──
Completed: 6 | Remaining: 9 | Blocked: 0
Tests: 12 passing, 0 failing
Next batch: Tasks 7-9 (API endpoint implementation)
```

## Integration Points

- **On task failure:** Invoke `resilient-execution` skill
- **On batch complete:** Invoke `code-review` skill
- **On all tasks complete:** Run final verification, commit, report summary

## Key Principles

- **One task at a time** — Don't parallelize unless tasks are truly independent
- **Verify after each task** — Run the verification command before marking complete
- **Checkpoint regularly** — Every 3 tasks, pause and assess
- **Track everything** — No task without a status
- **Small commits** — Commit after each logical batch
