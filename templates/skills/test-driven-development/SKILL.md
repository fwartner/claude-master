---
name: test-driven-development
description: "Use when writing any new code, adding features, or fixing bugs that require code changes. Enforces strict RED-GREEN-REFACTOR cycle with no production code without a failing test first."
---

# Test-Driven Development

## Iron Law

**NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST.**

This is non-negotiable. There are no exceptions. If you are writing production code and there is no failing test demanding that code, you are violating this skill. Stop immediately and write the test first.

## The RED-GREEN-REFACTOR Cycle

Every code change follows this exact three-phase cycle. You cannot skip phases. You cannot reorder phases. You cannot combine phases.

### Phase 1: RED (Write a Failing Test)

**Goal:** Write exactly ONE test that fails for the right reason.

Steps:
1. Identify the smallest unit of behavior to implement next
2. Write a test that asserts that behavior exists
3. Run the test suite - confirm the new test FAILS
4. Read the failure message - confirm it fails for the RIGHT reason (missing functionality, not syntax error or import error)
5. If it fails for the wrong reason, fix the test until it fails correctly

**STOP MARKER - Do not proceed to GREEN until:**
- [ ] Test is written and saved
- [ ] Test suite has been run
- [ ] New test fails
- [ ] Failure reason is correct (tests the intended behavior)

### Phase 2: GREEN (Make It Pass)

**Goal:** Write the MINIMUM production code to make the failing test pass.

Steps:
1. Write only enough code to make the failing test pass
2. Do NOT refactor. Do NOT clean up. Do NOT optimize
3. Hardcode values if that makes the test pass - that is fine
4. Run the full test suite
5. ALL tests must pass (not just the new one)

**STOP MARKER - Do not proceed to REFACTOR until:**
- [ ] Production code is written
- [ ] Full test suite has been run
- [ ] ALL tests pass (new and existing)
- [ ] No more code was written than necessary

### Phase 3: REFACTOR (Clean Up)

**Goal:** Improve code quality without changing behavior.

Steps:
1. Look for duplication, poor naming, long methods, code smells
2. Make ONE refactoring change at a time
3. Run the full test suite after EACH change
4. If any test fails, undo the refactoring immediately
5. Continue until the code is clean

**STOP MARKER - Do not proceed to next RED until:**
- [ ] Code is clean and readable
- [ ] All tests still pass after refactoring
- [ ] No behavior was changed during refactoring

## HARD-GATE Enforcement

```
┌─────────────────────────────────────────────────┐
│  HARD-GATE: PHASE COMPLETION CHECK              │
│                                                 │
│  Before moving to next phase, ALL items in the  │
│  STOP MARKER checklist must be satisfied.        │
│                                                 │
│  If ANY item is not satisfied:                  │
│  → STOP                                        │
│  → Complete the missing item                    │
│  → Re-verify ALL items                          │
│  → ONLY THEN proceed                            │
└─────────────────────────────────────────────────┘
```

## Watch Mode Discipline

After every change to any file (test or production), run the relevant test suite. No exceptions.

- After writing a test: run tests (expect failure)
- After writing production code: run tests (expect pass)
- After refactoring: run tests (expect pass)
- After ANY edit: run tests

If your test runner supports watch mode, use it. If not, run tests manually after every save.

## Rationalization Prevention

When tempted to skip TDD, consult this table:

| Excuse | Reality |
|--------|---------|
| "It's just a small change" | Small changes cause production outages. Test it. |
| "I'll write the tests after" | You won't. And if you do, they'll be weaker because they were shaped to pass, not to specify. |
| "This is just a refactor" | Refactors change behavior more often than you think. The test suite proves they don't. |
| "I know this works" | You don't. You think you do. The test proves it. |
| "Tests would slow me down" | Debugging without tests slows you down 10x more. |
| "This code is too simple to test" | If it's too simple to test, it's too simple to get wrong - so the test will be trivial to write. Write it. |
| "I can't test this because of dependencies" | Then your design has a coupling problem. Fix the design. |
| "The test would be harder to write than the code" | That means you don't understand the requirements well enough. The test forces you to clarify. |
| "I'll just manually verify it" | Manual verification is not repeatable, not documented, and not trustworthy. |
| "This is throwaway/prototype code" | Prototype code has a habit of becoming production code. Test it now or regret it later. |
| "The framework makes it hard to test" | Use the framework's testing utilities, or isolate your logic from the framework. |
| "I'm under time pressure" | TDD is faster over any timeline longer than 20 minutes. The pressure is exactly why you need it. |

## Red Flags

If you observe any of these, STOP and reassess:

- **Writing production code with no failing test:** Immediate violation. Stop. Write the test.
- **Test passes immediately on first run:** Either the test is wrong or the behavior already exists. Investigate.
- **More than 5 minutes in GREEN phase:** You're writing too much code. Simplify. Make the test more specific.
- **Refactoring changes behavior:** A test should have failed. If none did, your test coverage has a gap.
- **Tests are being modified to pass:** Tests specify behavior. If you're changing tests to match code, you have it backwards.
- **Multiple tests written before any production code:** Write ONE test, make it pass, then write the next. Batch testing defeats the purpose.
- **Test suite not run after a change:** Run it. Always. Every time.

## Test Quality Standards

Each test must be:
- **Fast:** Milliseconds, not seconds
- **Isolated:** No shared state between tests, no test ordering dependencies
- **Repeatable:** Same result every time, no flakiness
- **Self-validating:** Pass or fail, no manual interpretation needed
- **Timely:** Written before the production code (that's the whole point)

Each test should:
- Test ONE behavior or scenario
- Have a descriptive name that explains the scenario and expected outcome
- Follow Arrange-Act-Assert (or Given-When-Then) structure
- Use the minimum setup necessary
- Assert outcomes, not implementation details

## Checklist: Starting a New Feature with TDD

1. [ ] Understand the requirement fully before writing any code
2. [ ] Break the requirement into a list of specific behaviors
3. [ ] Order behaviors from simplest to most complex
4. [ ] Create a task for the first behavior
5. [ ] Enter RED phase: write failing test for first behavior
6. [ ] Enter GREEN phase: write minimal code to pass
7. [ ] Enter REFACTOR phase: clean up
8. [ ] Create task for next behavior, repeat from step 5
9. [ ] After all behaviors are implemented, run full test suite
10. [ ] Invoke `verification-before-completion` before claiming done

## Integration with Other Skills

- **verification-before-completion:** MUST be invoked before claiming any TDD work is complete. Fresh test run required.
- **systematic-debugging:** When a test fails unexpectedly during REFACTOR, switch to systematic-debugging to find root cause.
- **code-review:** After completing a feature via TDD, review the test suite for completeness.

## Test Types in TDD

### Unit Tests (Primary)
- Test individual functions, methods, or classes in isolation
- Mock external dependencies
- Run in milliseconds
- These are the tests you write in the RED phase

### Integration Tests (Secondary)
- Test interactions between components
- Use after unit tests cover individual behaviors
- May use real dependencies or test doubles

### End-to-End Tests (Tertiary)
- Test complete user workflows
- Write sparingly - they are slow and brittle
- Use to verify critical paths after unit and integration tests are solid

## Example Cycle

```
Requirement: "Users can register with email and password"

Behavior List:
1. Registration with valid email and password succeeds
2. Registration fails if email is empty
3. Registration fails if password is too short
4. Registration fails if email is already taken

Cycle 1 - Behavior 1:
  RED:   test_registration_with_valid_email_and_password_succeeds → FAIL (no register function)
  GREEN: def register(email, password): return User(email=email) → PASS
  REFACTOR: rename variable for clarity → PASS

Cycle 2 - Behavior 2:
  RED:   test_registration_fails_if_email_is_empty → FAIL (no validation)
  GREEN: add if not email: raise ValueError → PASS
  REFACTOR: extract validation to separate method → PASS

...continue for each behavior...
```

## Anti-Pattern Reference

See `testing-anti-patterns.md` for common mistakes that undermine test quality and TDD effectiveness.
