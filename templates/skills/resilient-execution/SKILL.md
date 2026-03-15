---
name: resilient-execution
description: Use when a task fails, an approach does not work, or when encountering errors during implementation - ensures retry with alternative approaches rather than giving up
---

# Resilient Execution

## Overview

Never tell the user "I cannot do this" without trying at least 3 genuinely different approaches. When something fails, classify the error, try alternatives, and only escalate after exhausting options.

<HARD-GATE>
You MUST try at least 3 different approaches before telling the user something cannot be done. "I tried and it didn't work" is not acceptable without evidence of 3 genuine attempts.
</HARD-GATE>

## Error Classification

| Type | Definition | Action |
|------|-----------|--------|
| **Transient** | Network timeout, rate limit, temporary failure | Wait briefly, retry the same approach |
| **Environmental** | Missing dependency, wrong version, config issue | Fix the environment, then retry |
| **Logical** | Wrong approach, incorrect assumption | Rethink the approach entirely |
| **Fundamental** | Genuinely impossible with available tools | Escalate to user with evidence |

## Approach Cascade

When the primary approach fails:

```
Attempt 1: Primary approach
    ↓ fails
Classify error → determine if same approach can work
    ↓ no
Attempt 2: Alternative approach 1
    ↓ fails
Classify error → determine if fundamentally blocked
    ↓ no
Attempt 3: Alternative approach 2
    ↓ fails
Circuit breaker → present findings to user
```

## For Each Attempt, Log:

```markdown
### Attempt N: [Approach Name]
**What I tried:** [specific description]
**What happened:** [exact error or unexpected result]
**Why it failed:** [root cause analysis]
**What to try next:** [reasoning for next approach]
```

## Alternative Approach Strategies

When the primary approach fails, consider:

1. **Different tool** — use a different library, API, or command
2. **Different algorithm** — solve the same problem differently
3. **Decompose** — break the problem into smaller parts
4. **Simplify** — remove constraints and solve a simpler version first
5. **Work around** — achieve the goal through a different path
6. **Manual steps** — provide clear instructions the user can follow

## Circuit Breaker

After 3 genuine attempts with different approaches:

```markdown
## Execution Report

I tried 3 different approaches to [goal]:

1. **[Approach 1]:** Failed because [reason]
2. **[Approach 2]:** Failed because [reason]
3. **[Approach 3]:** Failed because [reason]

**Root cause:** [analysis of why all approaches failed]

**Recommended next steps:**
- [Option A: what the user could try]
- [Option B: alternative path]
- [Option C: if applicable]

**What I need from you to proceed:** [specific ask]
```

## Integration Points

- **Task management** invokes this skill when a task fails
- **Self-learning** records failure patterns to avoid repeating them
- **Planning** uses failure history to choose more robust approaches

## Key Principles

- **Never give up silently** — always show what was tried
- **Genuine alternatives** — each attempt must be a meaningfully different approach, not the same thing with minor tweaks
- **Root cause analysis** — understand WHY before trying the next approach
- **Learn from failure** — update memory with what didn't work and why
- **Transparent** — show the user your reasoning at each step

## Rationalizations — STOP If You Think These

| Excuse | Reality |
|--------|---------|
| "This genuinely can't be done" | Have you tried 3 different approaches? Probably not. |
| "The error is clear, I know what's wrong" | Clear errors can have hidden root causes. Investigate. |
| "I've already tried everything" | List what you tried. There are always more options. |
| "The user should fix this themselves" | Provide a manual path, but try 3 approaches first. |
| "This is a platform limitation" | Limitations often have workarounds. Search for them. |
