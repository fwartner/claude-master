---
name: subagent-driven-development
description: "Use when executing multi-task plans where each task can be implemented independently by a subagent. Provides two-stage review gates (spec compliance and code quality) with iterative fix cycles."
---

# Subagent-Driven Development

## Purpose

This skill orchestrates implementation through subagents with built-in quality gates. Each task is implemented by a dedicated subagent, then reviewed by two specialized reviewer agents before acceptance. This ensures consistent quality at scale.

## Workflow Overview

```
For each task:
┌──────────────────────────────────────────────────────┐
│  1. DISPATCH implementer agent with task spec        │
│  2. REVIEW implementation against spec               │
│     (spec-reviewer agent) → PASS / FAIL              │
│  3. REVIEW code quality                              │
│     (quality-reviewer agent) → PASS / FAIL           │
│  4. If either gate FAILS: fix and re-review          │
│  5. Both gates PASS: accept and integrate            │
└──────────────────────────────────────────────────────┘
```

---

## Pre-Dispatch: Task Preparation

Before dispatching any subagent, ensure the task is fully specified.

### Task Specification Requirements

Each task dispatched to a subagent MUST include:

1. **Task description:** Clear, unambiguous statement of what to implement
2. **Files to create/modify:** Explicit list of files the subagent should touch
3. **Acceptance criteria:** Specific, testable conditions for success
4. **TDD requirements:** What tests to write and what behaviors they cover
5. **Quality standards:** Code style, patterns, and conventions to follow
6. **Context:** Relevant existing code, interfaces, and dependencies
7. **Constraints:** What the subagent should NOT do

### Pre-Dispatch Checklist

- [ ] Task spec is complete (all 7 sections above)
- [ ] Task is independent (no unresolved dependencies on in-progress tasks)
- [ ] Acceptance criteria are specific and testable
- [ ] Files to modify are identified and accessible
- [ ] Relevant context has been gathered and included

---

## Stage 1: Implementation Dispatch

### Process

1. Prepare the implementer prompt using `implementer-prompt.md` template
2. Include the full task specification
3. Include relevant code context (existing files, interfaces, types)
4. Dispatch the implementer subagent
5. Collect the implementation output

### Implementer Expectations

The implementer subagent MUST:
- Follow the TDD cycle (RED-GREEN-REFACTOR)
- Write tests before production code
- Only modify files listed in the task spec
- Follow the quality standards specified
- Report any questions or blockers encountered

### Question Handling

If the implementer encounters questions during implementation:

```
QUESTION PROTOCOL
=================
Before starting work:
  - Review the task spec for ambiguities
  - List any questions that need answers
  - If questions are blocking: STOP and escalate

During work:
  - If a non-blocking question arises: note it, make reasonable assumption, continue
  - If a blocking question arises: STOP and escalate
  - All assumptions must be documented in the output

After work:
  - List all assumptions made
  - List any remaining questions
  - Flag areas of uncertainty
```

---

## Stage 2: Spec Review Gate

### Process

1. Prepare the spec reviewer prompt using `spec-reviewer-prompt.md` template
2. Provide:
   - The original task specification
   - The implementer's output (code + tests)
3. Dispatch the spec-reviewer subagent
4. Collect the review result

### Spec Review Criteria

The spec reviewer checks:

| Criterion | Assessment |
|-----------|-----------|
| All acceptance criteria met | PASS / FAIL per criterion |
| Tests cover specified behaviors | PASS / FAIL |
| Files modified match spec | PASS / FAIL |
| No out-of-scope changes | PASS / FAIL |
| Implementation matches intent | PASS / FAIL |
| All constraints respected | PASS / FAIL |

### Spec Review Result

```
SPEC REVIEW: PASS / FAIL

Criteria Results:
  [criterion 1]: PASS / FAIL - [explanation if FAIL]
  [criterion 2]: PASS / FAIL - [explanation if FAIL]
  ...

Deviations from Spec:
  - [deviation 1]
  - [deviation 2]

Verification Commands:
  - [command to verify criterion 1]
  - [command to verify criterion 2]

Overall: PASS (all criteria met) / FAIL (N criteria not met)
```

### Gate Decision

- **All PASS:** Proceed to Stage 3 (quality review)
- **Any FAIL:** Return to implementer with specific failure details for fixing

---

## Stage 3: Quality Review Gate

### Process

1. Prepare the quality reviewer prompt using `code-quality-reviewer-prompt.md` template
2. Provide:
   - The implementation code
   - The test code
   - Project quality standards and conventions
3. Dispatch the quality-reviewer subagent
4. Collect the review result

### Quality Review Categories

Issues are categorized by severity:

| Severity | Definition | Action |
|----------|-----------|--------|
| **Critical** | Security vulnerability, data loss risk, incorrect behavior | MUST fix before acceptance |
| **Important** | Performance issue, maintainability concern, missing error handling | SHOULD fix before acceptance |
| **Suggestion** | Style improvement, alternative approach, documentation | MAY fix, at developer's discretion |

### Quality Review Areas

- **Code quality:** Readability, naming, structure, complexity
- **Pattern compliance:** Follows project patterns and conventions
- **Security:** No injection vulnerabilities, proper input validation, safe defaults
- **Performance:** No unnecessary allocations, efficient algorithms, no N+1 queries
- **Error handling:** All error paths handled, meaningful error messages
- **Test quality:** Tests are meaningful, not testing implementation details

### Gate Decision

- **No Critical or Important issues:** PASS - proceed to acceptance
- **Any Critical issues:** FAIL - must fix and re-review
- **Only Important issues:** Conditional PASS - fix recommended but not blocking (escalate to user for decision)

---

## Fix and Re-Review Cycle

When either review gate fails:

```
┌─────────────────────────────────────────────┐
│  1. Collect all failure details             │
│  2. Send failures back to implementer       │
│  3. Implementer fixes specific issues       │
│  4. Re-run the failing review gate          │
│  5. If still failing: repeat (max 3 cycles) │
│  6. After 3 failed cycles: escalate to user │
└─────────────────────────────────────────────┘
```

### Escalation After Max Retries

If a task fails review 3 times:

```
ESCALATION: REPEATED REVIEW FAILURE
====================================
Task: [task description]
Review Gate: [spec / quality]
Attempts: 3

Failure Pattern:
  Attempt 1: [what failed and why]
  Attempt 2: [what failed and why]
  Attempt 3: [what failed and why]

Root Cause Assessment: [why the implementer can't resolve this]

Options:
  A. Simplify the task specification
  B. Provide additional context/examples
  C. Break into smaller sub-tasks
  D. Implement manually (skip subagent)

Awaiting direction.
```

---

## Integration with TDD

All subagents follow the TDD cycle. This is non-negotiable.

### TDD Requirements in Task Specs

Every task spec must include:

1. **Test file location:** Where test files should be created
2. **Test behaviors:** List of behaviors to test (maps to RED phase tests)
3. **Test framework:** Which testing framework to use
4. **Test conventions:** Naming conventions, file structure, assertion style

### Verification

After the implementer completes work:
- Tests must exist for every acceptance criterion
- Tests must pass when run
- Tests must fail when the production code is removed/broken (verify they're not false positives)

---

## Integration with Verification-Before-Completion

After both review gates pass and the implementation is accepted:

1. Run the full project test suite (not just the new tests)
2. Run all verification commands (lint, type-check, build)
3. Confirm no regressions were introduced
4. Only then mark the task as complete

---

## Orchestration Workflow

### Single-Task Flow

```
1. Prepare task spec
2. Dispatch implementer
3. Run spec review
   ├── FAIL → Send failures to implementer, re-implement, re-review
   └── PASS → Continue
4. Run quality review
   ├── FAIL → Send failures to implementer, fix, re-review
   └── PASS → Continue
5. Run verification-before-completion
6. Accept and integrate
```

### Multi-Task Flow

```
1. Identify independent tasks (no dependencies on each other)
2. For each independent task: run Single-Task Flow
3. After all independent tasks complete:
   a. Run full test suite
   b. Run all verification commands
   c. Checkpoint review
4. Identify next set of independent tasks (now that dependencies are met)
5. Repeat until all tasks complete
```

---

## Prompt Templates

This skill uses three prompt templates:

| Template | Purpose | File |
|----------|---------|------|
| Implementer Prompt | Dispatches implementation work | `implementer-prompt.md` |
| Spec Reviewer Prompt | Reviews against task specification | `spec-reviewer-prompt.md` |
| Quality Reviewer Prompt | Reviews code quality | `code-quality-reviewer-prompt.md` |

Each template provides a structured format for the subagent interaction. See the individual files for details.

---

## Anti-Patterns

| Anti-Pattern | Correct Approach |
|-------------|-----------------|
| Dispatching without complete task spec | Fill out all 7 spec sections first |
| Skipping spec review ("code looks right") | Always run both review gates |
| Accepting despite Critical issues | Critical issues must be fixed |
| Letting implementer review its own code | Separate agents for implementation and review |
| Dispatching dependent tasks in parallel | Only parallelize independent tasks |
| Ignoring questions from implementer | Address all questions before proceeding |
| More than 3 fix cycles without escalating | Escalate to user for direction |
| Skipping verification after acceptance | Always run full verification |
