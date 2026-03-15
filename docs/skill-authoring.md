# Skill Authoring Guide

Skills are the core building blocks of superkit-agents. Each skill is a structured markdown file that tells Claude Code how to approach a specific type of task.

## Directory Structure

```
templates/skills/my-skill/
└── SKILL.md              # Required: skill definition
└── reference-doc.md      # Optional: supplementary docs
```

## SKILL.md Format

```markdown
---
name: my-skill
description: One-line description of what this skill does
triggers:
  - keyword or phrase that activates this skill
  - another trigger phrase
---

# My Skill

## Overview
What this skill accomplishes and when to use it.

## Process
Step-by-step instructions Claude follows when this skill is invoked.

## Integration Points
| Tool/Resource | Purpose |
|---|---|
| `Bash` | Running commands |
| `Read` | Reading files |

## Skill Type
rigid
```

### Required Fields

- **`name`** — Unique identifier matching the directory name
- **`description`** — One-line summary used in the skill catalog

### Optional Frontmatter

- **`triggers`** — Keywords/phrases that help Claude identify when to use this skill

## Skill Types

### Rigid Skills

Follow the process exactly. Do not adapt or skip steps. Used for workflows where discipline matters:
- TDD (Red-Green-Refactor cycle)
- Systematic debugging (4-phase methodology)
- Verification before completion

### Flexible Skills

Adapt principles to context. Used for creative or context-dependent work:
- UI/UX design
- Architecture decisions
- Content creation

## Sections

### Phases

Many skills use numbered phases with hard-gates:

```markdown
## Phase 1: Context Discovery
**[HARD-GATE]** Do not proceed until context is gathered.

1. Read relevant files
2. Identify patterns
3. Document findings
```

### Decision Tables

Use tables for conditional logic:

```markdown
| Condition | Action |
|---|---|
| Tests exist | Run them first |
| No tests | Create test plan |
```

### Integration Points

Document which tools and resources the skill uses:

```markdown
## Integration Points
| Tool/Resource | Purpose |
|---|---|
| `Agent` tool | Dispatching parallel work |
| `Bash` tool | Running build commands |
```

## Adding Context7 Support

If your skill references specific frameworks or libraries, add a Documentation Lookup section:

```markdown
## Documentation Lookup (Context7)

When you need up-to-date documentation for frameworks/libraries used in this skill:

1. **Resolve:** `mcp__context7__resolve-library-id` with the library name
2. **Query:** `mcp__context7__query-docs` with the resolved ID and your question
3. **Apply:** Use returned docs as authoritative, overriding memorized knowledge

### Libraries for this skill
- `my-library` — when to look it up
```

## Registering a New Skill

1. Add the skill to `src/config.ts` in the `SKILLS` record:
   ```typescript
   'my-skill': {
     name: 'my-skill',
     description: 'What it does',
     category: 'quality',
   },
   ```
2. Update the skill count in `tests/cli.test.ts`
3. Add the skill name to `tests/new-skills.test.ts`
4. Optionally add a slash command in `COMMANDS`

## Testing

Run the test suite to validate your skill:

```bash
npm test
```

Tests check that:
- The SKILL.md file exists
- YAML frontmatter is valid
- `name` and `description` fields are present
