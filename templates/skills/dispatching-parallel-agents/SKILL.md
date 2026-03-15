---
name: dispatching-parallel-agents
description: "Use when a task has multiple independent subtasks that can be executed concurrently by separate agents, such as modifying unrelated modules, running independent analyses, or generating separate deliverables in parallel"
---

# Dispatching Parallel Agents

## Purpose

Coordinate multiple agents working concurrently on independent subtasks to reduce total execution time while maintaining correctness and avoiding conflicts.

## When to Use

- A task decomposes into 2+ subtasks with no data dependencies between them
- Each subtask operates on different files or different sections of the codebase
- The combined result can be assembled after all agents complete
- Total serial time would be significantly longer than parallel time

## When NOT to Use

- Subtasks share mutable state or modify the same files
- Task B depends on the output of Task A
- The overhead of coordination exceeds the time saved
- A single agent can complete the work in under 30 seconds
- The task requires iterative refinement where each step informs the next

## Step 1: Identify Independent Domains

Decompose the task into subtasks that satisfy ALL of these criteria:

1. **No shared files** -- no two agents write to the same file
2. **No shared mutable state** -- no agent depends on a side effect of another
3. **Self-contained context** -- each agent can work with only its own inputs
4. **Independent verification** -- each agent's output can be validated alone

Example decomposition:

```
Task: "Add logging, update tests, and fix the CSS layout bug"

Agent 1: Add logging to src/api/*.ts
Agent 2: Update tests in tests/unit/*.test.ts
Agent 3: Fix CSS in src/styles/layout.css

These are independent: different files, different concerns.
```

Bad decomposition:

```
Task: "Refactor the User model and update all references"

Agent 1: Refactor User model in src/models/user.ts
Agent 2: Update controllers that import User

Problem: Agent 2 depends on Agent 1's output (new interface shape).
```

## Step 2: Write Focused Agent Prompts

Each agent prompt must contain exactly four sections.

### Scope (What to Do)

Be specific about the exact task, files, and expected changes.

```
SCOPE: Add structured JSON logging to all API route handlers in src/api/.
Replace console.log calls with the logger from src/utils/logger.ts.
Files to modify: src/api/users.ts, src/api/orders.ts, src/api/products.ts.
```

### Context (Everything Needed)

Provide all information the agent needs without requiring it to explore.

```
CONTEXT:
- Logger API: logger.info(message, metadata), logger.error(message, error)
- Import: import { logger } from '../utils/logger'
- Current pattern in files: console.log('action', data)
- Target pattern: logger.info('action', { data, requestId: req.id })
```

### Output Format (What to Return)

Define exactly what the agent should produce.

```
OUTPUT: For each modified file, return:
1. The file path
2. A summary of changes made
3. Number of console.log calls replaced
```

### Constraints (What NOT to Do)

Prevent scope creep and conflicts explicitly.

```
CONSTRAINTS:
- Do NOT modify any files outside src/api/
- Do NOT change the logger utility itself
- Do NOT add new dependencies
- Do NOT refactor function signatures
- Do NOT modify test files
```

## Step 3: Agent Prompt Template

```
You are a focused agent with a single task.

## Scope
[Specific task description with exact files]

## Context
[All information needed to complete the task]
[Relevant code patterns, APIs, conventions]

## Output Format
[Exact structure of what to return]

## Constraints
- Do NOT modify files outside: [list]
- Do NOT change: [list things to leave alone]
- Do NOT add dependencies
- If you encounter an issue outside your scope, report it but do not fix it
```

## Step 4: Dispatch and Monitor

1. Launch all agents concurrently using `TaskCreate` or sub-agents
2. Each agent works in isolation on its designated files
3. Wait for all agents to complete before proceeding

## Step 5: Review and Integrate

After all agents complete:

1. **Collect outputs** -- gather results from every agent
2. **Check for conflicts** -- verify no file was modified by multiple agents
3. **Run integration checks** -- execute the full test suite
4. **Resolve issues** -- if integration fails, identify which agent's changes caused it
5. **Commit atomically** -- all changes go in together or not at all

## Parallelization Safety Rules

| Rule | Rationale |
|------|-----------|
| No two agents modify the same file | Prevents merge conflicts and race conditions |
| No shared mutable state | Eliminates data races |
| Each agent gets complete context | Prevents agents from exploring and stepping on each other |
| Define file boundaries explicitly | Makes ownership unambiguous |
| Review integration after completion | Catches cross-cutting issues |

## Common Parallel Patterns

### By Module
Split work across independent modules or packages.

### By Layer
One agent per architectural layer (API, service, data) when layers touch different files.

### By Feature Area
Each agent handles a complete vertical slice of an independent feature.

### By Task Type
Separate agents for code changes, test updates, and documentation -- only when these touch different files.

## Example: Full Dispatch

```
TASK: "Update the API to v2, add tests, and update OpenAPI spec"

AGENT 1 - API Routes:
  Scope: Update route handlers in src/routes/v2/
  Context: [v2 API spec, breaking changes list]
  Output: Modified files list, breaking changes implemented
  Constraints: Do NOT touch tests or docs

AGENT 2 - Tests:
  Scope: Write tests in tests/v2/
  Context: [v2 API spec, test conventions, existing v1 tests as reference]
  Output: New test files, coverage summary
  Constraints: Do NOT modify source code

AGENT 3 - OpenAPI Spec:
  Scope: Update openapi/v2.yaml
  Context: [v2 API spec, OpenAPI 3.1 format]
  Output: Updated spec file
  Constraints: Do NOT modify code or tests
```

## Failure Handling

- If one agent fails, the others can still complete
- Failed agent's task can be retried independently
- If integration fails after all agents complete, identify the responsible agent and re-run only that one
- Always have a rollback path: keep the pre-dispatch state recoverable
