---
name: brainstorming
description: "Use before any creative work - creating features, building components, adding functionality, or modifying behavior. Triggers on /brainstorm command, when exploring ideas before planning, when user describes a vague goal or feature request, or when design decisions need collaborative exploration. Explores user intent, requirements and design before implementation."
---

# Brainstorming Ideas Into Designs

## Overview

Brainstorming transforms vague ideas into validated designs through structured collaborative dialogue. It bridges the gap between "I want X" and a concrete design that can be handed to the planning skill. This enhanced version integrates with the self-learning skill to build on known project context and avoid re-asking previously answered questions.

**Announce at start:** "I'm using the brainstorming skill to explore this idea and create a design before implementation."

## Trigger Conditions

- User describes a new feature idea or goal
- User asks "how should we build X?"
- Creative work requires design exploration before planning
- `/brainstorm` command invoked
- Transition from a vague requirement to structured design is needed

---

## Phase 1: Context Loading

**Goal:** Load everything known about the project before asking the user anything.

1. Check memory files (`project-context.md`, `learned-patterns.md`, `decisions-log.md`) for known patterns, stack, and conventions
2. Read relevant existing code, docs, and recent commits
3. Review existing designs in `docs/plans/` for related prior work
4. Identify constraints from the existing architecture
5. Note what you already know — do NOT re-ask the user for information you can discover

### Context Sources Priority

| Source | What to Extract | Priority |
|--------|----------------|----------|
| Memory files | Stack, conventions, past decisions | Highest |
| CLAUDE.md | Project structure, hard gates | High |
| Existing code | Current patterns, architecture | High |
| Recent commits | Direction of development | Medium |
| docs/plans/ | Prior designs and decisions | Medium |

**STOP — Do NOT proceed to Phase 2 until:**
- [ ] Memory files have been checked
- [ ] Relevant codebase areas have been explored
- [ ] You can summarize what you already know about this domain

---

## Phase 2: Idea Exploration

**Goal:** Understand the user's intent through focused, one-at-a-time questions.

1. Ask ONE question per message — never multiple questions
2. Prefer multiple choice questions when possible
3. Focus on understanding purpose, constraints, and success criteria
4. Build on context loaded in Phase 1 — skip questions you can already answer
5. Convert vague answers into specific, testable criteria

### Question Flow Decision Table

| What You Need to Know | Question Type | Example |
|-----------------------|--------------|---------|
| Core purpose | Open-ended | "What problem does this solve for the user?" |
| Scope boundaries | Multiple choice | "Should this handle: (A) only logged-in users, (B) all users, (C) depends on role?" |
| Technical constraints | Yes/No + follow-up | "Does this need to work offline?" |
| Priority trade-offs | Forced ranking | "Rank these: speed, correctness, simplicity" |
| Success criteria | Measurable target | "What does 'working' look like? Can you describe the happy path?" |
| Non-goals | Explicit exclusion | "What should we explicitly NOT build in this iteration?" |

### Question Rules

| Rule | Rationale |
|------|-----------|
| One question per message | Prevents cognitive overload |
| Multiple choice preferred | Faster to answer, reduces ambiguity |
| Research before asking | Respect user's time |
| Build on memory | Do not re-ask known things |
| Testable outcomes | Vague success criteria lead to vague designs |

**STOP — Do NOT proceed to Phase 3 until:**
- [ ] You understand the core purpose and who it serves
- [ ] You know the constraints (technical, timeline, scope)
- [ ] You have identified success criteria and non-goals
- [ ] No critical ambiguities remain about intent

---

## Phase 3: Approach Exploration

**Goal:** Propose 2-3 distinct approaches with trade-offs and a clear recommendation.

For each approach, present:

| Section | Content |
|---------|---------|
| Name | Short descriptive label |
| Architecture summary | 2-3 sentences |
| Key trade-offs | Pros and cons |
| Complexity | Low / Medium / High |
| Risk | What could go wrong |
| Your assessment | Why you do or do not recommend it |

### Approach Comparison Template

```
## Approach A: [Name] (Recommended)
**Summary:** [2-3 sentences]
**Pros:** [list]
**Cons:** [list]
**Complexity:** [Low/Medium/High]
**Risk:** [What could go wrong]
**Why recommended:** [1-2 sentences]

## Approach B: [Name]
...

## Approach C: [Name] (if needed)
...
```

**Lead with your recommended approach** and explain why it is the best fit given the constraints discussed in Phase 2.

**STOP — Do NOT proceed to Phase 4 until:**
- [ ] You have proposed at least 2 approaches
- [ ] Each approach has explicit trade-offs
- [ ] You have made a clear recommendation
- [ ] User has indicated which approach to pursue

---

## Phase 4: Design Presentation

**Goal:** Present the detailed design in sections, getting approval incrementally.

1. Present the design in logical sections scaled to complexity
2. Ask after each section whether it looks right so far
3. Be ready to go back and revise any section based on feedback
4. Cover all relevant design dimensions

### Design Sections by Complexity

| Complexity | Required Sections | Optional Sections |
|-----------|-------------------|-------------------|
| Simple (1-3 tasks) | Architecture, Components | — |
| Medium (4-10 tasks) | Architecture, Components, Data Flow, Error Handling | Testing Strategy |
| Complex (10+ tasks) | Architecture, Components, Data Flow, Error Handling, Testing Strategy, Performance, Security | Migration Plan |

### Section Presentation Order

1. **Architecture** — High-level structure and key decisions
2. **Components** — What pieces exist and how they relate
3. **Data Flow** — How data moves through the system
4. **Error Handling** — What can go wrong and how to handle it
5. **Testing Strategy** — How to verify correctness
6. **Performance** — Only if relevant constraints exist
7. **Security** — Only if handling sensitive data or auth

Present one section at a time. Wait for user confirmation before proceeding.

**STOP — Do NOT proceed to Phase 5 until:**
- [ ] All relevant design sections have been presented
- [ ] User has approved each section (or revisions were made)
- [ ] The complete design is coherent and addresses all requirements

---

## Phase 5: Documentation and Transition

**Goal:** Persist the design and hand off to the planning skill.

1. Write the validated design to `docs/plans/YYYY-MM-DD-<topic>-design.md`
2. Commit the design document
3. Update self-learning memory:
   - `memory/decisions-log.md` — any architectural decisions made
   - `memory/learned-patterns.md` — any new conventions discussed
4. Invoke the `planning` skill to create a detailed implementation plan

### Design Document Template

```markdown
# [Topic] Design Document

**Date:** YYYY-MM-DD
**Status:** Approved
**Approach:** [Which approach was chosen]

## Problem Statement
[What problem this solves and for whom]

## Design

### Architecture
[High-level structure]

### Components
[Key pieces and their relationships]

### Data Flow
[How data moves through the system]

### Error Handling
[What can go wrong and how it is handled]

## Decisions Made
- [Decision 1]: [Rationale]
- [Decision 2]: [Rationale]

## Non-Goals
- [What was explicitly excluded and why]

## Next Steps
Invoke planning skill to create implementation plan.
```

**STOP — Do NOT proceed until:**
- [ ] Design document is saved to `docs/plans/`
- [ ] Memory files are updated with new decisions/patterns
- [ ] User has confirmed the design is complete

---

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Fails | Correct Approach |
|-------------|-------------|-----------------|
| "This is too simple to brainstorm" | Every project needs a design, even simple ones | Design can be brief, but must exist |
| "The user already knows what they want" | Users know WHAT, not HOW | Explore the HOW through approaches |
| "I can just start coding" | Code without design is technical debt from line 1 | Design first, code second |
| "We don't have time to brainstorm" | We don't have time to rebuild from poor assumptions | Brainstorming prevents costly rework |
| "The requirements are clear" | Requirements are not design — you still need approaches | Explore trade-offs even with clear requirements |
| Asking 5 questions at once | Overwhelms the user, gets shallow answers | One question per message |
| Skipping context loading | Re-asks things already known | Check memory files first |
| Not proposing alternatives | Anchors on first idea, misses better options | Always propose 2-3 approaches |
| Presenting entire design at once | Too much to review, user skims | Section by section with approval |
| Not persisting decisions | Same discussions repeat in future sessions | Update memory files |

---

## Anti-Rationalization Guards

<HARD-GATE>
Do NOT invoke any implementation skill, write any code, scaffold any project, or take any implementation action until you have presented a design and the user has approved it. This applies to EVERY project regardless of perceived simplicity.
</HARD-GATE>

If you catch yourself thinking:
- "Let me just scaffold the project first..." — No. Design first.
- "The design is obvious..." — Then it will be quick to document. Do it.
- "The user seems impatient..." — Poor design wastes more time than brainstorming.

---

## Integration Points

| Skill | Relationship | When |
|-------|-------------|------|
| `self-learning` | Upstream — provides project context from memory | Phase 1: context loading |
| `planning` | Downstream — receives approved design | Phase 5: transition to planning |
| `task-decomposition` | Complementary — breaks design into work breakdown | When design reveals complex scope |
| `spec-writing` | Complementary — can formalize design into specs | When formal specifications are needed |
| `verification-before-completion` | Downstream — verifies design completeness | Before claiming design is done |

---

## Concrete Examples

### Example: Simple Feature Brainstorm

```
User: "I want to add dark mode to the app"

Phase 1: [Check memory — React app, Tailwind CSS, no current theme system]
Phase 2: "Should dark mode (A) follow system preference automatically,
          (B) be a manual toggle only, or (C) both with manual override?"
Phase 3: Approach A: CSS variables + Tailwind dark: prefix
         Approach B: Theme context provider with CSS-in-JS
         Recommend A — aligns with existing Tailwind usage
Phase 4: Section 1: Architecture — Tailwind dark mode with class strategy
         Section 2: Components — ThemeToggle component, layout wrapper
Phase 5: Save design doc, invoke planning skill
```

### Example: Transition to Planning

```
Design approved and saved to docs/plans/2026-03-15-dark-mode-design.md.
Updated memory/decisions-log.md with theme system decision.
Invoking planning skill to create implementation plan.
```

---

## Key Principles

- **One question at a time** — Do not overwhelm
- **Multiple choice preferred** — Easier to answer
- **YAGNI ruthlessly** — Remove unnecessary features
- **Explore alternatives** — Always propose 2-3 approaches
- **Incremental validation** — Present and approve in sections
- **Build on context** — Use self-learning memory to avoid re-asking known things

---

## Skill Type

**RIGID** — Follow this process exactly. Every idea goes through all five phases. The design can be brief for simple projects, but it must be documented and approved before any implementation begins.
