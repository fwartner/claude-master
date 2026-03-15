---
name: using-toolkit
description: Use when starting any conversation - establishes how to find and use all toolkit skills, requiring Skill tool invocation before ANY response including clarifying questions
---

<EXTREMELY-IMPORTANT>
If you think there is even a 1% chance a skill might apply to what you are doing, you ABSOLUTELY MUST invoke the skill.

IF A SKILL APPLIES TO YOUR TASK, YOU DO NOT HAVE A CHOICE. YOU MUST USE IT.

This is not negotiable. This is not optional. You cannot rationalize your way out of this.
</EXTREMELY-IMPORTANT>

## How to Access Skills

**In Claude Code:** Use the `Skill` tool. When you invoke a skill, its content is loaded and presented to you — follow it directly. Never use the Read tool on skill files.

# Using Toolkit Skills

## The Rule

**Invoke relevant or requested skills BEFORE any response or action.** Even a 1% chance a skill might apply means you should invoke the skill to check.

## Available Skills

| Skill | When to Use |
|-------|------------|
| `planning` | Before ANY implementation — forces structured planning with questions |
| `brainstorming` | Before creative work — exploring ideas, features, designs |
| `task-management` | Breaking work into tracked steps during implementation |
| `prd-generation` | Generating Product Requirements Documents |
| `self-learning` | Starting work on unfamiliar projects, or when corrected |
| `code-review` | After completing tasks, before committing |
| `tech-docs-generator` | Generating or updating technical documentation |
| `resilient-execution` | When an approach fails — ensures retry with alternatives |
| `api-design` | Designing API endpoints and generating specs |
| `testing-strategy` | Choosing testing approach for a project |
| `deployment` | Setting up CI/CD pipelines and deploy checklists |

## Skill Priority

When multiple skills could apply, use this order:

1. **Process skills first** (brainstorming, planning, task-management) — these determine HOW to approach the task
2. **Quality skills second** (code-review, testing-strategy) — these validate the work
3. **Documentation skills third** (prd-generation, tech-docs-generator) — these capture the work
4. **Design skills fourth** (api-design) — these guide specific implementations
5. **Operations skills fifth** (deployment) — these ship the work

## Workflow Patterns

- **"Build feature X"** → brainstorming → planning → task-management → code-review
- **"Fix bug Y"** → resilient-execution → code-review
- **"Document the API"** → tech-docs-generator or api-design
- **"Create a PRD for Z"** → prd-generation
- **"Set up CI/CD"** → deployment
- **"How should we test this?"** → testing-strategy

## Red Flags

These thoughts mean STOP — you're rationalizing:

| Thought | Reality |
|---------|---------|
| "This is just a simple question" | Questions are tasks. Check for skills. |
| "I need more context first" | Skill check comes BEFORE clarifying questions. |
| "Let me explore the codebase first" | Skills tell you HOW to explore. Check first. |
| "This doesn't need a formal skill" | If a skill exists, use it. |
| "I remember this skill" | Skills evolve. Read current version. |
| "The skill is overkill" | Simple things become complex. Use it. |
| "I'll just do this one thing first" | Check BEFORE doing anything. |

## Core Behavioral Rules

1. **Always ask questions first** — In plan mode, ask questions one at a time to fully understand needs/goals before proceeding
2. **Always use subagents** — Dispatch subagents for independent parallel tasks without asking the user
3. **Always self-learn** — Continuously discover and remember project context, patterns, preferences
4. **Never fail** — Try at least 3 approaches before escalating to the user
5. **Be extremely detailed** — In all outputs, plans, reviews, and documentation

## Skill Types

**Rigid** (planning, task-management, code-review): Follow exactly. Don't adapt away discipline.

**Flexible** (brainstorming, tech-docs-generator, api-design): Adapt principles to context.
