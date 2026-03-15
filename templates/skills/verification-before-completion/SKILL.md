---
name: verification-before-completion
description: "Use before claiming any task is complete, any feature works, or any bug is fixed. Enforces fresh verification evidence before any completion claim."
---

# Verification Before Completion

## Iron Law

**NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE.**

You cannot say "it works," "it's done," "the bug is fixed," or "the feature is complete" without running verification commands and reading their output in this session. Cached results, previous runs, and assumptions do not count.

## HARD-GATE: 5 Steps Before ANY Completion Claim

Every time you are about to claim something is complete, you MUST execute all five steps in order. There are no exceptions.

```
┌─────────────────────────────────────────────────────────────┐
│  HARD-GATE: COMPLETION VERIFICATION                         │
│                                                             │
│  Step 1: IDENTIFY → What command(s) verify this is done?   │
│  Step 2: RUN      → Execute them fresh, right now          │
│  Step 3: READ     → Read the FULL output, every line       │
│  Step 4: VERIFY   → Does output match your completion claim?│
│  Step 5: CLAIM    → Only now may you say "done"            │
│                                                             │
│  If ANY step fails → FIX and restart from Step 1           │
└─────────────────────────────────────────────────────────────┘
```

### Step 1: IDENTIFY the Verification Commands

Before running anything, explicitly list what needs to pass:

| Verification Type | Example Commands |
|------------------|-----------------|
| Unit tests | `npm test`, `pytest`, `go test ./...`, `cargo test` |
| Integration tests | `npm run test:integration`, `pytest tests/integration/` |
| Type checking | `tsc --noEmit`, `mypy .`, `pyright` |
| Linting | `eslint .`, `ruff check .`, `golint ./...` |
| Build | `npm run build`, `cargo build`, `go build ./...` |
| Format check | `prettier --check .`, `black --check .`, `gofmt -l .` |

Not all projects have all of these. Identify which ones apply to the current project and list them explicitly.

### Step 2: RUN the Commands Fresh

- Run every verification command identified in Step 1
- Do NOT rely on cached results from earlier in the session
- Do NOT skip commands because "they passed earlier"
- Run the FULL suite, not a subset (unless the full suite is prohibitively slow)
- If a command takes too long, note this explicitly and explain what was run instead

### Step 3: READ the Full Output

- Read the entire output of each verification command
- Do NOT skip warnings
- Do NOT ignore non-zero exit codes
- Pay attention to:
  - Number of tests run (did any get skipped?)
  - Warning messages (even if tests pass)
  - Deprecation notices
  - Performance regression indicators

### Step 4: VERIFY Output Matches Your Claim

Ask yourself:
- Do ALL tests pass? (not just the ones you wrote)
- Does the build succeed without errors?
- Does the type checker find no errors?
- Does the linter pass?
- Are there any new warnings that weren't there before?

If the answer to any of these is "no" or "I'm not sure," you cannot proceed to Step 5.

### Step 5: ONLY THEN Make the Completion Claim

Now, and only now, may you say the task is complete. Include evidence:
- Which commands were run
- Summary of results (X tests passed, build succeeded, etc.)
- Any caveats or known issues

---

## Common Failure Patterns

These are the most common ways verification is skipped or undermined. Watch for them.

| Pattern | What Happens | Why It's Dangerous |
|---------|-------------|-------------------|
| Tests pass but lint fails | Code works but has style/quality issues | Lint failures often indicate real problems (unused vars, unreachable code) |
| Tests pass but build fails | Test environment differs from build | Production deployments will fail |
| Tests pass but type-check fails | Runtime works but types are wrong | Bugs hiding behind `any` types, wrong interfaces |
| Tests pass in isolation but fail together | Shared state between tests | Flaky CI, unreliable test suite |
| Manual testing passes but automated fails | Manual test missed edge cases | The automated test is right, your manual test is incomplete |
| Tests pass but new warnings appeared | Something degraded | Warnings become errors over time |
| Subset of tests pass | Only ran related tests | Regression in unrelated area possible |
| Tests pass but coverage decreased | New code isn't tested | Untested code is unverified code |
| Old test run used as evidence | Results are stale | Code changed since that run |
| "It compiled, so it works" | Compilation is necessary but not sufficient | Compiled code can still be wrong |

---

## Rationalization Prevention

When tempted to skip verification, consult this table:

| Excuse | Reality |
|--------|---------|
| "I only changed one line" | One-line changes cause production outages. Verify. |
| "The tests passed 5 minutes ago" | You made changes since then. Run them again. |
| "I've tested this pattern before" | This is a different instance. Verify this specific one. |
| "The change is obviously correct" | Obvious changes fail more often than complex ones because they're not verified. |
| "Running tests takes too long" | Not running tests takes longer when the bug reaches production. |
| "I'll verify after I submit" | You won't. And if the verification fails, you'll have to undo and redo. |
| "It's just a config change" | Config changes are the #1 cause of outages. Verify. |
| "The linter warnings are false positives" | Review each one. If truly false positive, suppress with a comment explaining why. |
| "The type errors are in unrelated code" | They might interact. Run the full check. |
| "I tested it manually" | Manual testing is incomplete and unrepeatable. Run automated verification. |

---

## Enforcement by Other Skills

This skill is invoked by ALL other skills at completion time. It is not optional.

| Skill | When Verification Is Required |
|-------|------------------------------|
| test-driven-development | After completing RED-GREEN-REFACTOR cycle for a feature |
| systematic-debugging | After applying a bug fix |
| executing-plans | After each task and after each batch |
| subagent-driven-development | After implementer delivers, after reviewers approve |
| code-review | Before approving any code review |
| resilient-execution | Before marking any task as complete |

---

## Verification Checklist Template

Copy and fill this out before any completion claim:

```
VERIFICATION EVIDENCE
=====================
Task: [what was being done]
Date: [timestamp]

Commands Run:
  [ ] Tests:      [command] → [result: X passed, Y failed, Z skipped]
  [ ] Build:      [command] → [result: success/failure]
  [ ] Lint:       [command] → [result: X errors, Y warnings]
  [ ] Type-check: [command] → [result: X errors]
  [ ] Format:     [command] → [result: clean/X files to format]

All Green?  [ ] YES  [ ] NO
If NO, what needs fixing: _______________

New warnings introduced?  [ ] YES  [ ] NO
If YES, are they acceptable? Explain: _______________

Completion claim: [specific claim, e.g., "Feature X is implemented and all tests pass"]
```

---

## What Counts as "Fresh" Evidence

| Counts as Fresh | Does NOT Count as Fresh |
|----------------|------------------------|
| Ran command after the latest code change | Ran before the latest code change |
| Full test suite executed | Subset of tests executed |
| Output read and analyzed | Output skimmed or ignored |
| All verification types run | Only tests run (no lint, no build) |
| Command run in current session | Recalled from memory of a previous session |
| Actual command output available | "I remember it passed" |

---

## Edge Cases

### When the Full Suite Is Too Slow

If the full test suite takes more than 5 minutes:
1. Run the tests directly related to your changes
2. Run a smoke test suite if one exists
3. Explicitly note that the full suite was not run and why
4. State what was run instead and what risk remains
5. Recommend running the full suite in CI before merging

### When There Are No Automated Tests

If the project has no test infrastructure:
1. Note this as a significant risk
2. Perform manual verification and document exact steps
3. Recommend adding test infrastructure as a follow-up task
4. At minimum, verify the code compiles/runs without errors

### When Tests Are Flaky

If tests fail but the failure appears unrelated to your changes:
1. Re-run the failing test in isolation
2. If it passes in isolation, it's likely a flaky test (test interdependence)
3. Note the flaky test explicitly
4. Verify your changes did not introduce the flakiness (check if it was flaky before your changes)
5. Do NOT use flakiness as an excuse to skip verification

---

## Integration Points

This skill is a terminal checkpoint. It is called at the end of work, never at the beginning. The pattern is:

```
[Do the work using other skills]
    │
    ▼
[Think you're done?]
    │
    ▼
[Invoke verification-before-completion]
    │
    ├── All checks pass → Claim completion with evidence
    │
    └── Any check fails → Fix and re-verify (do NOT claim completion)
```
