# Testing Anti-Patterns

Reference document for the test-driven-development skill. These are common patterns that undermine test quality, cause maintenance burden, and reduce confidence in the test suite.

---

## 1. Testing Implementation Details vs Behavior

**The Problem:** Tests that verify HOW something works rather than WHAT it does. These tests break whenever you refactor, even if behavior is unchanged.

**Symptoms:**
- Tests assert on internal method calls
- Tests check private state or internal data structures
- Tests verify the order of operations rather than the outcome
- Refactoring production code breaks tests even though behavior is identical

**Examples of the anti-pattern:**
```
# BAD: Testing implementation
def test_sort_uses_quicksort():
    sorter = Sorter()
    sorter.sort(data)
    assert sorter._algorithm_used == "quicksort"

# GOOD: Testing behavior
def test_sort_returns_elements_in_ascending_order():
    sorter = Sorter()
    result = sorter.sort([3, 1, 2])
    assert result == [1, 2, 3]
```

**Fix:** Ask "If I changed the implementation but kept the same inputs and outputs, would this test still pass?" If no, you're testing implementation.

---

## 2. Excessive Mocking

**The Problem:** So many mocks that the test no longer verifies real behavior. The test passes but the real system could be broken.

**Symptoms:**
- More mock setup code than actual test code
- Mocking the thing you're supposed to be testing
- Mock returning mocks returning mocks (mock chains)
- Tests pass but integration fails
- Changing any interface breaks dozens of mocks

**Rule of Thumb:**
- Mock external services (APIs, databases, filesystems) at boundaries
- Do NOT mock the unit under test
- Do NOT mock value objects or simple data structures
- Prefer fakes (in-memory implementations) over mocks for complex dependencies

**Fix:** If your test has more than 3 mocks, your code probably has a design problem. Refactor to reduce coupling rather than adding more mocks.

---

## 3. Brittle Selectors

**The Problem:** Tests that depend on specific CSS selectors, DOM structure, XPaths, or other structural details that change frequently.

**Symptoms:**
- Tests break when UI layout changes but functionality is unchanged
- Selectors like `div > div:nth-child(3) > span.class-name`
- Tests break after CSS class renames
- Team avoids UI changes because tests will break

**Fix:**
- Use `data-testid` attributes for test selectors
- Use accessible selectors (role, label text) when possible
- Select by user-visible text or semantic meaning
- Avoid selecting by CSS class, tag nesting, or positional index

---

## 4. Test Interdependence

**The Problem:** Tests that depend on other tests running first, or that share mutable state.

**Symptoms:**
- Tests pass when run in order but fail when run individually
- Tests pass when run individually but fail when run together
- Test A sets up state that Test B relies on
- Shared database or file state between tests
- Test results change when tests run in parallel

**Fix:**
- Each test must set up its own state (Arrange phase)
- Each test must clean up after itself (or use per-test isolation)
- Use `beforeEach`/`setUp` for common setup, not shared test state
- Run tests in random order to catch hidden dependencies
- Never rely on test execution order

---

## 5. Slow Test Suites

**The Problem:** Test suite takes so long that developers stop running it, or only run it in CI where feedback is delayed.

**Symptoms:**
- Test suite takes more than 30 seconds for unit tests
- Developers skip running tests locally
- "I'll let CI catch it" mentality
- Real network calls, file I/O, or database operations in unit tests
- Sleep/wait calls in tests

**Causes and fixes:**

| Cause | Fix |
|-------|-----|
| Real database calls | Use in-memory database or repository fakes |
| Real network calls | Mock HTTP clients at the boundary |
| Sleep statements | Use event-based waiting or mock timers |
| Expensive setup | Lazy initialization, share immutable fixtures |
| Too many integration tests | Convert to unit tests where possible |
| Large test data | Use minimal data sets, builder patterns |

**Target:** Unit test suite should complete in under 10 seconds. Integration tests under 60 seconds.

---

## 6. Snapshot Overuse

**The Problem:** Using snapshot tests as a lazy substitute for specific assertions. Snapshots capture everything, making it unclear what behavior matters.

**Symptoms:**
- Snapshot files with hundreds or thousands of lines
- Developers update snapshots without reviewing changes
- `--update-snapshots` run reflexively when tests fail
- No one knows what the snapshot is actually testing
- Snapshot diffs are noise, not signal

**When snapshots ARE appropriate:**
- Serialization formats (JSON API responses, GraphQL schemas)
- Generated output that is complex but must remain stable
- Visual regression testing (with proper review tooling)

**When snapshots are NOT appropriate:**
- Testing business logic
- Testing individual component behavior
- Testing anything where you can write a specific assertion

**Fix:** For each snapshot test, ask: "What specific behavior would break if this snapshot changed?" Write a targeted assertion for that behavior instead.

---

## 7. Testing Third-Party Code

**The Problem:** Writing tests that verify your dependency works correctly. That's the dependency's job, not yours.

**Symptoms:**
- Tests for standard library functions
- Tests that verify ORM query behavior
- Tests that check if HTTP client sends requests correctly
- Tests that validate framework routing works

**What to test instead:**
- Test YOUR code that USES the dependency
- Test your wrappers and adapters
- Test your error handling when the dependency fails
- Test your configuration of the dependency

**Example:**
```
# BAD: Testing that the HTTP library works
def test_requests_library_sends_get():
    response = requests.get("https://example.com")
    assert response.status_code == 200

# GOOD: Testing your code that uses the HTTP library
def test_user_service_returns_user_on_success():
    http_client = FakeHttpClient(response={"id": 1, "name": "Alice"})
    service = UserService(http_client)
    user = service.get_user(1)
    assert user.name == "Alice"
```

---

## 8. God Tests (Testing Too Much in One Test)

**The Problem:** A single test that verifies multiple behaviors, making it unclear what failed and why.

**Symptoms:**
- Test name includes "and" (e.g., `test_create_user_and_send_email_and_update_log`)
- More than 3 assertions per test (unless asserting properties of a single result)
- Test has multiple Act phases
- Test failure message doesn't tell you what's actually wrong
- Tests longer than 20 lines of code

**Fix:**
- One behavior per test
- One Act (action) per test
- Name tests after the specific scenario being verified
- Split God tests into multiple focused tests

**Example:**
```
# BAD: God test
def test_user_registration():
    user = register("alice@test.com", "password123")
    assert user.email == "alice@test.com"       # behavior 1
    assert user.is_active == False               # behavior 2
    assert email_sent_to("alice@test.com")       # behavior 3
    assert audit_log_contains("registration")    # behavior 4
    assert user.created_at is not None           # behavior 5

# GOOD: Focused tests
def test_registration_creates_user_with_email(): ...
def test_registration_creates_inactive_user(): ...
def test_registration_sends_confirmation_email(): ...
def test_registration_creates_audit_log_entry(): ...
def test_registration_sets_creation_timestamp(): ...
```

---

## 9. Missing Edge Cases

**The Problem:** Tests only cover the happy path, leaving boundary conditions, error states, and unusual inputs untested.

**Common missed edge cases:**

| Category | Examples |
|----------|----------|
| Boundary values | 0, -1, MAX_INT, empty string, single character |
| Empty collections | Empty list, empty map, null/None |
| Null/undefined | Null inputs, missing optional fields |
| Concurrency | Simultaneous access, race conditions |
| Error states | Network failure, disk full, permission denied |
| Unicode | Emoji, RTL text, special characters, multi-byte |
| Time zones | DST transitions, UTC vs local, date boundaries |
| Large inputs | Very long strings, very large numbers, many items |
| Duplicate data | Same item twice, duplicate keys |
| Ordering | Already sorted, reverse sorted, single element |

**Fix:** For each function, systematically consider:
1. What happens with empty/null input?
2. What happens at boundary values?
3. What happens when an external call fails?
4. What happens with malformed input?
5. What happens under concurrent access?

---

## 10. Flaky Tests (Time-Dependent, Race Conditions)

**The Problem:** Tests that sometimes pass and sometimes fail without any code changes. These destroy trust in the test suite.

**Common causes:**

### Time-Dependent Tests
```
# BAD: Depends on wall clock
def test_token_not_expired():
    token = create_token(expires_in=1)
    assert token.is_valid()  # Might fail if machine is slow

# GOOD: Control time
def test_token_not_expired():
    clock = FakeClock(now=datetime(2025, 1, 1))
    token = create_token(expires_in=3600, clock=clock)
    clock.advance(seconds=3599)
    assert token.is_valid()
```

### Race Conditions
```
# BAD: Relies on timing
def test_async_operation():
    start_background_job()
    time.sleep(2)  # Hope it's done by now
    assert job_completed()

# GOOD: Wait for completion signal
def test_async_operation():
    job = start_background_job()
    job.wait(timeout=10)
    assert job.completed
```

### Random Data Without Seeds
```
# BAD: Non-deterministic
def test_random_selection():
    result = pick_random(items)
    assert result in items  # Always passes, tests nothing

# GOOD: Seed the randomness
def test_random_selection_with_seed():
    result = pick_random(items, seed=42)
    assert result == items[3]  # Deterministic, verifiable
```

**Fix checklist for flaky tests:**
1. Control time with fake clocks
2. Control randomness with seeds
3. Use deterministic waits (signals, not sleeps)
4. Isolate filesystem and network access
5. Avoid shared mutable state
6. Run the test 100 times in a loop to confirm it's stable

---

## Summary: Quick Reference

| Anti-Pattern | One-Line Fix |
|-------------|-------------|
| Implementation testing | Assert outcomes, not internals |
| Excessive mocking | Reduce coupling, use fakes |
| Brittle selectors | Use data-testid or accessible selectors |
| Test interdependence | Each test owns its own state |
| Slow suites | Mock I/O, minimize data, no sleeps |
| Snapshot overuse | Write specific assertions |
| Testing third-party code | Test your code, not theirs |
| God tests | One behavior per test |
| Missing edge cases | Systematically check boundaries |
| Flaky tests | Control time, randomness, concurrency |
