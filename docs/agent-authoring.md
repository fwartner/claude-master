# Agent Authoring Guide

Agents are specialized sub-agents that Claude Code dispatches for focused or parallel work.

## File Format

Each agent is a single markdown file in `templates/agents/`:

```markdown
---
name: my-agent
description: One-line description of what this agent does
model: sonnet
---

# My Agent

## Role
You are a specialized agent for [specific domain].

## Capabilities
- Capability 1
- Capability 2

## Process
1. Step one
2. Step two

## Output Format
Describe what the agent should return.
```

## Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique identifier matching the filename (without `.md`) |
| `description` | Yes | One-line summary |
| `model` | No | Preferred model (`sonnet`, `opus`, `haiku`). Defaults to parent model. |

## Dispatch Triggers

Agents are dispatched by skills or by the user via the `Agent` tool. Document when your agent should be dispatched:

- From which skills
- Under what conditions
- What input it expects

## Output Format

Define a clear output structure so the calling context can use the agent's results:

```markdown
## Output Format
Return a JSON-structured summary:
- `findings`: array of issues found
- `severity`: high/medium/low for each
- `recommendations`: suggested fixes
```

## Registering

1. Add to `AGENTS` in `src/config.ts`:
   ```typescript
   'my-agent': {
     name: 'my-agent',
     description: 'What it does',
   },
   ```
2. Update agent count in `tests/cli.test.ts`
3. Add to `tests/new-skills.test.ts` NEW_AGENTS array
