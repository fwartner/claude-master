---
name: planning
description: Use when starting any implementation task, feature request, or bug fix - forces structured planning with question-asking before any code is written
---

# Structured Planning

<HARD-GATE>
Do NOT write any code, create any files, or take any implementation action until:
1. You have asked clarifying questions and understood the requirements
2. You have proposed approaches with trade-offs
3. The user has explicitly approved the plan

This applies to EVERY task regardless of perceived simplicity.
</HARD-GATE>

## Checklist

You MUST create a task for each of these items and complete them in order:

1. **Explore context** — read relevant files, docs, recent commits, CLAUDE.md
2. **Ask clarifying questions** — one at a time, prefer multiple choice
3. **Propose 2-3 approaches** — with trade-offs, effort estimates, and your recommendation
4. **Present the plan** — bite-sized tasks with exact file paths
5. **Get explicit approval** — user must say "yes" or "approved" before proceeding
6. **Save the plan** — to `docs/plans/YYYY-MM-DD-<feature>.md`
7. **Transition** — invoke task-management skill to begin execution

## Phase 1: Define (Ask Questions)

**Rules:**
- Ask ONE question at a time — never overwhelm with multiple questions
- Prefer multiple choice questions when possible
- Focus on: purpose, constraints, success criteria, edge cases, non-goals
- Study the existing codebase before asking — don't ask what you can discover
- Convert vague requirements into specific, testable criteria

**Question Categories:**
1. What problem does this solve? Who is it for?
2. What are the success criteria? How will we know it works?
3. What are the constraints? (performance, compatibility, timeline)
4. What are the non-goals? What should we NOT build?
5. Are there existing patterns in the codebase we should follow?

## Phase 2: Design (Propose Approaches)

**For each approach, include:**
- Architecture summary (2-3 sentences)
- Key files to create/modify (exact paths)
- Dependencies or breaking changes
- Trade-offs (pros/cons)
- Effort estimate (number of tasks)
- Your recommendation and why

**Lead with your recommended approach.** Explain why it's the best choice given the constraints.

## Phase 3: Build (After Approval)

**Plan Document Format:**

```markdown
# [Feature Name] Implementation Plan

**Goal:** [One sentence]
**Architecture:** [2-3 sentences]
**Approach:** [Which approach was approved]

---

### Task N: [Component Name]

**Files:**
- Create: `exact/path/to/file.ext`
- Modify: `exact/path/to/existing.ext`
- Test: `tests/exact/path/to/test.ext`

**Steps:**
1. Write the failing test
2. Run test to verify it fails
3. Write minimal implementation
4. Run test to verify it passes
5. Commit

**Verification:** [Exact command to verify this task]
```

## Dual Exit Gate

Both conditions must be true before implementation begins:
- [ ] Plan is documented and saved to `docs/plans/`
- [ ] User has explicitly approved the plan

## After Plan Approval

Invoke the `task-management` skill to break the plan into tracked, executable steps.

## Key Principles

- **DRY** — Don't repeat yourself
- **YAGNI** — Don't build what isn't needed yet
- **TDD** — Write tests first when applicable
- **Frequent commits** — Small, atomic commits after each task
- **Exact paths** — Always specify exact file paths in the plan

## Iron Law

**NO CODE WITHOUT AN APPROVED PLAN.** No exceptions. No "just this small thing." No "it's obvious."

## Verification Gate

Before claiming the plan is complete, invoke the `verification-before-completion` skill:
1. IDENTIFY: Plan document exists at `docs/plans/`
2. RUN: Review plan for completeness
3. READ: Verify all sections filled
4. VERIFY: User has explicitly approved
5. CLAIM: Only then transition to implementation

## Rationalizations — STOP If You Think These

| Excuse | Reality |
|--------|---------|
| "This is too simple to plan" | Simple tasks have unexamined assumptions. Plan anyway. |
| "I already know the approach" | Your approach may conflict with project patterns. Plan anyway. |
| "The user wants it fast" | Bad code is slower than planned code. Plan anyway. |
| "It's just a bug fix" | Bug fixes need root cause analysis. Plan anyway. |
| "I'll plan as I go" | That's not planning, that's improvising. Plan first. |
