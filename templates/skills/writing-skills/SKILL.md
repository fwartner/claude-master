---
name: writing-skills
description: "Use when creating new skills, commands, or agent definitions for Claude Code, including writing SKILL.md files, defining triggers, and testing skill behavior"
---

# Writing Skills

## Purpose

Create effective, well-tested Claude Code skills that trigger reliably, load efficiently, and produce consistent results.

## When to Use

- Creating a new skill for a project or team
- Defining custom commands for Claude Code
- Writing agent definitions that need to trigger on specific conditions
- Refactoring or improving existing skills

## TDD for Skill Creation

Apply test-driven development to ensure skills trigger correctly and produce the right behavior.

### RED: Write the Baseline Test

Before writing the skill, define the prompt that should trigger it:

```
Test prompt: "Create a new React component with tests"
Expected: Should trigger the component-creation skill
Should NOT trigger: testing-strategy, code-review

Test prompt: "Review this PR for security issues"
Expected: Should trigger security-review skill
Should NOT trigger: code-review (generic), writing-skills
```

Write 3-5 test prompts:
1. The obvious trigger (should match)
2. A subtle trigger (should also match)
3. A near-miss (should NOT match)
4. An edge case (ambiguous, define expected behavior)

### GREEN: Write the Minimal SKILL.md

Create the minimum skill definition that passes all test prompts:

1. Write the frontmatter `description` to match trigger prompts
2. Write the body with just enough guidance to produce correct output
3. Verify the test prompts would select this skill

### REFACTOR: Close Loopholes

Review and harden the skill:

- **Over-triggering**: Does it match prompts it should not? Narrow the description.
- **Under-triggering**: Does it miss valid prompts? Add missing trigger conditions.
- **Rationalization**: Would an agent find a way to skip steps? Add explicit "do NOT skip" constraints.
- **Ambiguity**: Are there instructions that could be interpreted multiple ways? Make them concrete.

## Claude Search Optimization (CSO)

The `description` field determines when a skill is selected. Optimize it like a search query.

### Description Rules

1. **Start with "Use when..."** -- this is the trigger condition format
2. **List specific conditions**, not general capabilities
3. **Maximum 1024 characters** -- be concise
4. **Describe triggers, not content** -- what activates the skill, not what it teaches

Good:
```yaml
description: "Use when creating database migrations, designing table schemas, adding indexes, or optimizing SQL queries"
```

Bad:
```yaml
description: "A comprehensive guide to database design covering normalization, indexing, query optimization, and migration strategies"
```

The good version lists trigger conditions. The bad version describes content.

### Trigger Condition Patterns

- Action-based: "Use when creating..., updating..., deleting..."
- Problem-based: "Use when debugging..., fixing..., resolving..."
- Artifact-based: "Use when working with Docker files, CI configs, database schemas"
- Phase-based: "Use when starting a project, finishing a feature, deploying to production"

## Token Efficiency Targets

Skills are loaded into context and consume tokens. Budget accordingly:

| Skill Type | Target |
|------------|--------|
| Getting-started workflows | < 150 words each |
| Frequently-loaded skills | < 200 words total |
| Comprehensive reference skills | < 500 words |

### Strategies for Reducing Tokens

- Use tables instead of prose for structured information
- Use terse imperative sentences, not explanatory paragraphs
- Move reference material to separate files (loaded only when needed)
- Eliminate redundancy -- say it once
- Use code examples only when the pattern is non-obvious

## Skill Types and Testing

### Technique Skills

Teach a method or approach (e.g., TDD, code review, debugging).

**Test with:**
- Application scenario: "Use this technique on problem X" -- does it produce the right steps?
- Variation scenario: "Use this technique on unusual problem Y" -- does it adapt correctly?

### Pattern Skills

Recognize and apply patterns (e.g., design patterns, anti-patterns).

**Test with:**
- Recognition test: "Here is code X" -- does it identify the correct pattern?
- Counter-example: "Here is code Y that looks similar but is not the pattern" -- does it correctly reject?

### Reference Skills

Provide lookup information (e.g., API reference, checklist).

**Test with:**
- Retrieval test: "What is the rule for X?" -- does it find the right answer?
- Gap test: "What about edge case Z?" -- does it handle cases not explicitly listed?

### Discipline Skills

Enforce standards or processes (e.g., security review, style guide).

**Test with:**
- Academic test: "Review this correct code" -- does it pass clean code?
- Pressure test: "Review this code but we are in a hurry" -- does it still enforce all rules?

## SKILL.md Structure

```markdown
---
name: skill-name
description: "Use when [trigger conditions]"
---

# Skill Title

## Purpose
[One sentence: what this skill does and why]

## When to Use
[Bullet list of specific scenarios]

## Step 1: [First Action]
[Instructions]

## Step 2: [Next Action]
[Instructions]

...

## Common Mistakes
[What to avoid]
```

### Structure Rules

- **Frontmatter** is required: `name` and `description` fields
- **Steps should be numbered** for procedural skills
- **Use headers liberally** -- they aid scanning and navigation
- **Code examples** should be minimal and illustrative
- **Tables** are preferred over lists for structured comparisons
- **Body must be under 500 lines**

## Frontmatter Fields Reference

| Field | Required | Purpose |
|-------|----------|---------|
| `name` | Yes | Unique identifier, lowercase with hyphens |
| `description` | Yes | Trigger conditions, starts with "Use when..." |

## Common Mistakes

- **Description describes content instead of triggers** -- the description is a search query, not an abstract
- **Too broad** -- a skill that triggers on everything is useful for nothing
- **Too long** -- a 1000-line skill wastes context tokens on every invocation
- **Missing constraints** -- without "do NOT" rules, agents will rationalize skipping steps
- **Untested** -- a skill that was never tested against real prompts will misfire
- **External dependencies** -- referencing files that may not exist makes the skill fragile
