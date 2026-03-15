---
name: planning
description: "Use when starting any implementation task, feature request, bug fix, or refactoring work. Triggers on /plan command, before any code is written, when requirements need structured analysis, or when transitioning from brainstorming to implementation. Forces question-asking, approach comparison, and explicit approval before any code."
---

# Structured Planning

## Overview

Structured planning converts vague requirements into approved, documented implementation plans before any code is written. It forces clarifying questions, approach comparison with trade-offs, and explicit user approval — preventing the most common cause of wasted effort: building the wrong thing. Every task, regardless of perceived simplicity, goes through this process.

**Announce at start:** "I'm using the planning skill to create a structured implementation plan."

## Trigger Conditions

- User requests a new feature, enhancement, or change
- A bug fix requires more than a one-line change
- Refactoring work spanning multiple files
- Any task where the approach is not already documented and approved
- Transition from brainstorming skill with an approved design
- `/plan` command invoked

---

## Phase 1: Context Gathering

**Goal:** Understand the codebase and existing patterns before asking questions.

1. Read relevant files, docs, recent commits, and CLAUDE.md
2. Check memory files for known project context, stack, and conventions
3. Review existing plans in `docs/plans/` for related work
4. Identify existing patterns the new work should follow
5. Note technical constraints discovered during exploration

**STOP — Do NOT proceed to Phase 2 until:**
- [ ] You have explored the relevant parts of the codebase
- [ ] You understand the existing architecture and patterns
- [ ] You have checked memory files for prior decisions

---

## Phase 2: Clarifying Questions

**Goal:** Eliminate ambiguity by asking targeted questions one at a time.

1. Ask ONE question per message — never overwhelm with multiple questions
2. Prefer multiple choice questions when possible
3. Study the codebase before asking — do not ask what you can discover
4. Convert vague requirements into specific, testable criteria

### Question Category Priority

| Priority | Category | Example Question |
|----------|----------|-----------------|
| 1 | Purpose | "What problem does this solve? Who is it for?" |
| 2 | Success criteria | "How will we know it works? What does 'done' look like?" |
| 3 | Constraints | "Are there performance, compatibility, or timeline constraints?" |
| 4 | Non-goals | "What should we explicitly NOT build?" |
| 5 | Existing patterns | "Should we follow the pattern used in X, or is a new approach needed?" |
| 6 | Edge cases | "What should happen when [boundary condition]?" |

### Question Rules

| Rule | Rationale |
|------|-----------|
| One question per message | Prevents cognitive overload |
| Multiple choice preferred | Faster to answer, reduces ambiguity |
| Research before asking | Respect user's time — discover what you can |
| Testable criteria | Vague answers lead to vague implementations |

**STOP — Do NOT proceed to Phase 3 until:**
- [ ] You understand the purpose and success criteria
- [ ] You have identified constraints and non-goals
- [ ] No critical ambiguities remain

---

## Phase 3: Approach Design

**Goal:** Propose 2-3 concrete approaches with trade-offs and a clear recommendation.

For each approach, include:

| Section | Content |
|---------|---------|
| Architecture summary | 2-3 sentences describing the approach |
| Key files | Exact paths to create/modify |
| Dependencies | External deps or breaking changes |
| Trade-offs | Explicit pros and cons |
| Effort estimate | Number of tasks (not hours) |
| Risk level | Low / Medium / High with explanation |

### Approach Selection Decision Table

| Factor | Weight | How to Evaluate |
|--------|--------|----------------|
| Alignment with existing patterns | High | Does it match current codebase conventions? |
| Simplicity | High | Fewest moving parts that meet requirements |
| Testability | Medium | Can each component be independently tested? |
| Future extensibility | Low | Only consider if user mentioned future plans |
| Performance | Varies | Only if user specified performance constraints |

**Lead with your recommended approach.** Explain why it is the best choice given the constraints. Present alternatives to show you considered the trade-off space.

**STOP — Do NOT proceed to Phase 4 until:**
- [ ] You have proposed at least 2 approaches
- [ ] Each approach has trade-offs documented
- [ ] You have made a clear recommendation with reasoning

---

## Phase 4: Plan Documentation

**Goal:** Write a detailed, executable plan document and get explicit approval.

### Plan Document Format

```markdown
# [Feature Name] Implementation Plan

**Goal:** [One sentence]
**Architecture:** [2-3 sentences]
**Approach:** [Which approach was chosen and why]

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

### Plan Quality Checklist

| Criterion | Check |
|-----------|-------|
| Every task has exact file paths | No "somewhere in src/" |
| Every task has a verification command | No "eyeball it" |
| Tasks are ordered by dependency | No forward references |
| Tasks are 2-5 minutes each | No "implement the whole module" |
| TDD steps are explicit | RED-GREEN-REFACTOR per task |

Save the plan to `docs/plans/YYYY-MM-DD-<feature>.md`.

**STOP — Do NOT proceed to Phase 5 until:**
- [ ] Plan document is written and saved
- [ ] Every task has file paths, steps, and verification
- [ ] User has explicitly approved the plan (said "yes", "approved", "go ahead", etc.)

---

## Phase 5: Transition to Execution

**Goal:** Hand off the approved plan to the appropriate execution skill.

### Transition Decision Table

| Situation | Next Skill | Rationale |
|-----------|-----------|-----------|
| Standard implementation (< 10 tasks) | `task-management` | Sequential tracked execution |
| Large implementation (10+ independent tasks) | `subagent-driven-development` | Parallel execution with review gates |
| Autonomous development session | `autonomous-loop` | Ralph-style iterative execution |
| Single focused task | `executing-plans` | Direct plan execution |

Invoke the chosen skill and pass the plan document path.

---

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Fails | Correct Approach |
|-------------|-------------|-----------------|
| "This is too simple to plan" | Simple tasks have unexamined assumptions | Plan anyway — the plan can be short |
| "I already know the approach" | Your approach may conflict with project patterns | Document it and get approval |
| "The user wants it fast" | Bad code is slower than planned code | Planning prevents rework |
| "It's just a bug fix" | Bug fixes need root cause analysis | Plan the fix, not just the patch |
| "I'll plan as I go" | That is improvising, not planning | Plan first, execute second |
| Asking 5 questions at once | Overwhelms the user, gets vague answers | One question per message |
| Proposing only 1 approach | No trade-off analysis, may miss better options | Always propose 2-3 approaches |
| Vague file references | "Update the tests" — which tests? | Exact file paths always |
| Tasks that take 30+ minutes | Too large to track and verify | Break into 2-5 minute tasks |
| Starting code before approval | Wastes effort if direction changes | Wait for explicit "yes" |

---

## Anti-Rationalization Guards

<HARD-GATE>
Do NOT write any code, create any files, or take any implementation action until:
1. You have asked clarifying questions and understood the requirements
2. You have proposed approaches with trade-offs
3. The user has explicitly approved the plan

This applies to EVERY task regardless of perceived simplicity.
</HARD-GATE>

**Iron Law: NO CODE WITHOUT AN APPROVED PLAN.** No exceptions. No "just this small thing." No "it's obvious."

If you catch yourself thinking any of the following, STOP immediately:
- "Let me just quickly..." — No. Plan first.
- "This doesn't need a full plan..." — Yes it does. The plan can be brief.
- "I'll document it after..." — No. Document before.

---

## Integration Points

| Skill | Relationship | When |
|-------|-------------|------|
| `brainstorming` | Upstream — provides design context | Planning follows brainstorming |
| `task-management` | Downstream — receives approved plan | Standard execution path |
| `executing-plans` | Downstream — executes plan directly | Single-task execution |
| `subagent-driven-development` | Downstream — parallel execution | Large independent task sets |
| `autonomous-loop` | Downstream — iterative execution | Ralph-style sessions |
| `self-learning` | Bidirectional — informs and learns from planning | Context loading and pattern storage |
| `verification-before-completion` | Downstream — verifies plan completeness | Before claiming plan is done |
| `task-decomposition` | Complementary — provides WBS for complex plans | When plan needs hierarchical breakdown |

---

## Concrete Examples

### Example: Small Bug Fix Plan

```markdown
# Fix: Login button disabled state not clearing

**Goal:** Fix login button remaining disabled after failed login attempt
**Architecture:** State management bug in LoginForm component
**Approach:** Reset `isSubmitting` state in the catch block of handleSubmit

### Task 1: Write failing test
**Files:** Test: `tests/components/LoginForm.test.tsx`
**Steps:** Write test that submits invalid credentials and verifies button re-enables
**Verification:** `npm test -- --grep "re-enables button after failed login"`

### Task 2: Fix the bug
**Files:** Modify: `src/components/LoginForm.tsx`
**Steps:** Add `setIsSubmitting(false)` to catch block in handleSubmit
**Verification:** `npm test -- --grep "LoginForm"` — all pass
```

### Example: Transition Command

After plan approval:
```
Plan approved and saved to docs/plans/2026-03-15-login-fix.md.
Invoking task-management skill to begin tracked execution.
```

---

## Verification Gate

Before claiming the plan is complete, verify:
1. IDENTIFY: Plan document exists at `docs/plans/`
2. RUN: Review plan for completeness against quality checklist
3. READ: Verify all sections are filled with specific details
4. VERIFY: User has explicitly approved
5. CLAIM: Only then transition to implementation

---

## Key Principles

- **DRY** — Do not repeat yourself
- **YAGNI** — Do not build what is not needed yet
- **TDD** — Write tests first when applicable
- **Frequent commits** — Small, atomic commits after each task
- **Exact paths** — Always specify exact file paths in the plan

---

## Skill Type

**RIGID** — Follow this process exactly for every implementation task. The phases are sequential and non-negotiable. No code without an approved plan.
