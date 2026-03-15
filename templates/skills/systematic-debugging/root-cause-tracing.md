# Root Cause Tracing

Reference document for the systematic-debugging skill. These are structured techniques for tracing errors back to their true origin.

---

## 1. Backward Tracing (Error → Call Stack → Root)

The most fundamental debugging technique. Start from the symptom and trace backward through the execution path to find the origin.

### The Process

```
SYMPTOM (what you see)
    ↑
PROXIMATE CAUSE (what directly triggered it)
    ↑
INTERMEDIATE CAUSE (what led to that)
    ↑
ROOT CAUSE (the actual defect)
```

### Steps

1. **Start at the error.** Read the error message and note the exact line and file.
2. **Read the stack trace bottom-to-top.** The bottom is the origin, the top is where it manifested. Identify each frame:
   - Which function was called?
   - What arguments were passed?
   - What was the expected state at that point?
3. **Trace data flow backward.** For each variable in the error:
   - Where was it assigned its current value?
   - Where did that value come from?
   - At which point did the value diverge from expectations?
4. **Find the divergence point.** The root cause is the FIRST place where reality diverged from expectations.

### Example

```
Error: TypeError: Cannot read property 'name' of undefined
  at formatUser (format.js:15)
  at processUsers (process.js:42)
  at handleRequest (handler.js:8)

Backward trace:
  formatUser(user) → user is undefined
  ↑ processUsers passes users[i] → users[i] is undefined
  ↑ users array has fewer items than expected
  ↑ handleRequest fetches users → API returned partial data
  ↑ ROOT CAUSE: API pagination not handled, only first page fetched
```

### Key Principle

The error message tells you WHERE the problem manifested. The root cause is almost never at that location. Trace backward until you find the first place where something went wrong.

---

## 2. Binary Search Debugging (Bisect the Problem Space)

When you have a large codebase or a long history and don't know where the bug was introduced, use binary search to find it efficiently.

### Git Bisect

When you know the bug was introduced between two commits:

```bash
git bisect start
git bisect bad                    # Current commit has the bug
git bisect good <known-good-sha>  # This commit was working

# Git checks out the middle commit
# Test it:
# - If bug exists: git bisect bad
# - If bug absent: git bisect good
# Repeat until git identifies the exact commit

git bisect reset  # When done
```

**Automated bisect:** If you have a test that exposes the bug:
```bash
git bisect start HEAD <known-good-sha>
git bisect run ./test-script.sh
```

### Code Bisect (Without Git)

When the bug is in current code but you don't know which part:

1. **Identify the full code path** from entry point to error
2. **Add a checkpoint at the midpoint** (log statement or assertion)
3. **Run the test:**
   - If midpoint state is correct → bug is in the second half
   - If midpoint state is wrong → bug is in the first half
4. **Repeat** with the guilty half until you find the exact line

### Data Bisect

When the bug is triggered by specific data:

1. Take the failing input dataset
2. Split it in half
3. Test each half independently
4. The half that fails contains the trigger
5. Repeat until you find the exact data element causing the issue

### Efficiency

Binary search debugging finds the problem in O(log n) steps, where n is the number of commits, lines, or data elements. For 1000 commits, that's about 10 steps.

---

## 3. Diff-Based Debugging (What Changed?)

Most bugs are caused by recent changes. Systematically examine what changed to find the culprit.

### What to Diff

| What Changed | How to Check |
|-------------|-------------|
| Code | `git diff`, `git log --oneline -20`, `git diff HEAD~5` |
| Dependencies | `git diff package.json`, `git diff Gemfile.lock`, `git diff requirements.txt` |
| Configuration | `git diff *.yml *.json *.toml *.env*` |
| Database schema | Migration files, schema dumps |
| Infrastructure | Deployment configs, Docker files, CI/CD |
| Environment | Runtime version, OS updates, env variables |
| External services | API version changes, endpoint changes |

### The Diff Investigation Process

1. **When did it last work?** Find the last known-good state.
2. **What changed between then and now?**
   ```bash
   git log --oneline <last-good-sha>..HEAD
   git diff <last-good-sha>..HEAD --stat
   ```
3. **Categorize changes by risk:**
   - High risk: Logic changes, dependency updates, config changes
   - Medium risk: Refactoring, new features in adjacent code
   - Low risk: Documentation, test additions, formatting
4. **Investigate high-risk changes first.** For each:
   - Could this change cause the observed symptom?
   - Does reverting this change fix the bug?

### Revert Test

The fastest way to confirm a change caused a bug:

```bash
# Create a branch to test the revert
git checkout -b test-revert
git revert <suspect-commit> --no-commit
# Run tests
# If bug is gone → that commit is the cause
# If bug persists → that commit is innocent
git checkout - && git branch -D test-revert
```

---

## 4. Rubber Duck Methodology

When you're stuck, explain the problem out loud (or in writing) to an imaginary listener. The act of articulating forces you to organize your thoughts and often reveals gaps in your understanding.

### The Process

1. **State the problem clearly.** "The system should do X, but instead it does Y."
2. **Explain what you've already tried.** Walk through each investigation step.
3. **Explain your current understanding.** Describe the code flow as you understand it.
4. **Identify gaps.** "The part I don't understand is..."
5. **Question assumptions.** "I'm assuming that... but what if...?"

### Why It Works

- Forces you to be precise instead of vague
- Exposes assumptions you didn't realize you were making
- Converts fuzzy intuition into concrete statements that can be verified
- Breaks tunnel vision by requiring a linear explanation

### Structured Rubber Duck Template

```
PROBLEM: [What should happen vs what actually happens]

EVIDENCE GATHERED:
- Error message: [exact text]
- Reproduction steps: [exact steps]
- Working case: [what works for comparison]

CODE FLOW (as I understand it):
1. [Entry point]
2. [Step 2]
3. [Step 3 — this is where I think it breaks]
4. [Expected step 4 vs what actually happens]

HYPOTHESES TESTED:
1. [Hypothesis] → [Result]
2. [Hypothesis] → [Result]

WHAT I DON'T UNDERSTAND:
- [Gap 1]
- [Gap 2]

ASSUMPTIONS I'M MAKING:
- [Assumption 1 — verified? yes/no]
- [Assumption 2 — verified? yes/no]
```

---

## 5. Log-Based Investigation Patterns

When the bug is in production, intermittent, or involves complex interactions, logs are your primary evidence source.

### Strategic Log Placement

Add logs at these locations to trace execution flow:

```
Entry points      → Log inputs and request context
Decision points   → Log which branch was taken and why
External calls    → Log request and response (or error)
State mutations   → Log before and after values
Exit points       → Log outputs and return values
Error handlers    → Log full error with context
```

### Log Levels for Debugging

| Level | Use For | Example |
|-------|---------|---------|
| ERROR | Unexpected failures | `ERROR: Failed to connect to DB: connection refused` |
| WARN | Recoverable issues | `WARN: Retry 2/3 for API call to /users` |
| INFO | Business events | `INFO: User 123 registered successfully` |
| DEBUG | Technical details | `DEBUG: Cache miss for key user:123, querying DB` |
| TRACE | Step-by-step flow | `TRACE: Entering validateUser with {email: "..."}` |

### Correlation Patterns

When debugging distributed systems or async operations:

1. **Request ID:** Assign a unique ID at the entry point, include it in every log line for that request
2. **Timestamp precision:** Use millisecond or microsecond timestamps to establish ordering
3. **Context propagation:** Pass context (request ID, user ID, operation name) through the call chain

### Log Analysis Techniques

**Timeline reconstruction:**
```bash
# Extract all logs for a specific request
grep "request-id-abc123" application.log | sort -k1

# Find the last successful operation before failure
grep "request-id-abc123" application.log | grep -B5 "ERROR"
```

**Pattern detection:**
```bash
# Find common patterns in errors
grep "ERROR" application.log | sort | uniq -c | sort -rn | head -20

# Check error frequency over time
grep "ERROR" application.log | cut -d' ' -f1-2 | uniq -c
```

**State reconstruction:**
- Follow the sequence of state changes for the affected entity
- Compare with a successful entity's log sequence
- The first divergence point is likely the root cause

### Anti-Patterns in Logging

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| Logging sensitive data | Security risk | Redact PII, credentials, tokens |
| Missing context | Log is useless without context | Include entity IDs, operation name |
| Inconsistent format | Hard to parse and search | Use structured logging (JSON) |
| Too verbose in production | Performance impact, noise | Use appropriate log levels |
| Swallowed exceptions | Evidence destroyed | Always log before re-throwing or handling |
| Log-and-throw | Duplicate entries, confusing | Log at the handler, not the thrower |
