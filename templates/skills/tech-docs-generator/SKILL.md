---
name: tech-docs-generator
description: Use when generating or updating technical documentation from code - API references, architecture docs, README files, or component documentation
---

# Technical Documentation Generator

## Overview

Generate comprehensive technical documentation by analyzing the codebase. Produces API references, architecture overviews, getting started guides, and component documentation.

**Announce at start:** "I'm using the tech-docs-generator skill to create documentation."

## Checklist

1. **Analyze codebase** — identify what needs documenting
2. **Choose doc type** — select appropriate documentation format
3. **Dispatch doc-generator agent** — for heavy content generation
4. **Review with user** — present docs section by section
5. **Save and commit** — write to `docs/` directory

## Step 1: Analyze Codebase

Use Explore agents to scan for:

- **Exported functions/classes** — public API surface
- **API routes/endpoints** — REST, GraphQL, tRPC definitions
- **Configuration** — env vars, config files, feature flags
- **Database schemas** — models, migrations, relationships
- **Component hierarchy** — UI components and their props
- **Type definitions** — interfaces, types, schemas

## Step 2: Choose Documentation Type

| Type | When | Output |
|------|------|--------|
| **API Reference** | Documenting endpoints or public functions | `docs/api-reference.md` |
| **Architecture Overview** | Explaining system design and data flow | `docs/architecture.md` |
| **Getting Started** | Onboarding new developers | `docs/getting-started.md` |
| **Component Docs** | Documenting UI components | `docs/components/[name].md` |
| **Contributing Guide** | Explaining how to contribute | `docs/contributing.md` |
| **Configuration Guide** | Documenting config options | `docs/configuration.md` |

Ask the user which type(s) they need if not specified.

## Step 3: Generate Documentation

Dispatch `doc-generator` agent with:
- File analysis results
- Documentation type selected
- Existing documentation (to update, not replace)
- Project context from memory files

### Documentation Standards

**API Reference format:**
```markdown
## `functionName(param1, param2)`

Description of what this function does.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| param1 | `string` | Yes | What it does |
| param2 | `Options` | No | Configuration options |

**Returns:** `Promise<Result>`

**Example:**
\`\`\`typescript
const result = await functionName('value', { option: true });
\`\`\`

**Throws:** `ValidationError` if param1 is empty
```

**Architecture Overview format:**
```markdown
## System Architecture

### Overview
[High-level description with diagram]

### Components
[Component descriptions and responsibilities]

### Data Flow
[How data moves through the system]

### Key Decisions
[Why the architecture is designed this way]
```

## Step 4: Review

Present documentation section by section:
- Ask after each section: "Does this accurately describe the code?"
- Cross-reference with actual code to verify accuracy
- Include real examples from the codebase, not generic ones

## Key Principles

- **Accuracy over completeness** — better to document less correctly than more incorrectly
- **Real examples** — always use actual code from the project, not made-up examples
- **Keep current** — documentation should match the current code state
- **DRY** — reference existing docs, don't duplicate
- **Audience-aware** — adjust detail level based on who will read it
