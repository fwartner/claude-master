---
name: tech-docs-generator
description: "Use when generating or updating technical documentation from code — API references, architecture docs, README files, component documentation, getting started guides, or configuration references"
---

# Technical Documentation Generator

## Overview

Generate comprehensive technical documentation by analyzing the actual codebase. Produces API references, architecture overviews, getting started guides, and component documentation with real examples extracted from project code, not invented ones.

**Announce at start:** "I'm using the tech-docs-generator skill to create documentation."

## Phase 1: Codebase Analysis

Scan the codebase to identify what needs documenting. Deploy parallel subagents (up to 500) to analyze:

| Analysis Target | What to Capture |
|----------------|-----------------|
| Exported functions/classes | Public API surface, signatures, return types |
| API routes/endpoints | REST, GraphQL, tRPC definitions with methods |
| Configuration | Env vars, config files, feature flags |
| Database schemas | Models, migrations, relationships |
| Component hierarchy | UI components and their props/interfaces |
| Type definitions | Interfaces, types, Zod schemas, enums |
| Entry points | CLI commands, main files, server bootstrap |
| Dependencies | External packages and their roles |

STOP after analysis — present a summary of what was found and ask which documentation types are needed.

## Phase 2: Documentation Type Selection

| Type | When to Use | Output Path | Typical Size |
|------|-------------|-------------|-------------|
| **API Reference** | Documenting endpoints or public functions | `docs/api-reference.md` | 200-1000 lines |
| **Architecture Overview** | Explaining system design and data flow | `docs/architecture.md` | 100-300 lines |
| **Getting Started** | Onboarding new developers | `docs/getting-started.md` | 50-150 lines |
| **Component Docs** | Documenting UI components | `docs/components/[name].md` | 50-200 lines |
| **Contributing Guide** | Explaining how to contribute | `docs/contributing.md` | 50-100 lines |
| **Configuration Guide** | Documenting config options | `docs/configuration.md` | 50-200 lines |
| **Migration Guide** | Documenting version upgrades | `docs/migration/v[X]-to-v[Y].md` | 50-150 lines |

Ask the user which type(s) they need if not specified. If multiple types are requested, dispatch parallel subagents — one per doc type.

## Phase 3: Generate Documentation

Dispatch `doc-generator` agent with:
- File analysis results from Phase 1
- Documentation type selected in Phase 2
- Existing documentation (to update, not replace)
- Project context from memory files

STOP after generation — present each section for review before saving.

### Documentation Format Standards

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
```typescript
const result = await functionName('value', { option: true });
```

**Throws:** `ValidationError` if param1 is empty
```

**Architecture Overview format:**

```markdown
## System Architecture

### Overview
[High-level description with ASCII diagram]

### Components
| Component | Responsibility | Key Files |
|-----------|---------------|-----------|

### Data Flow
[How data moves through the system — request lifecycle]

### Key Decisions
| Decision | Rationale | Alternatives Considered |
|----------|-----------|------------------------|
```

**Getting Started format:**

```markdown
## Prerequisites
[Required tools, versions, accounts]

## Installation
[Step-by-step with copy-pasteable commands]

## Configuration
[Required env vars and config]

## First Run
[How to start the app and verify it works]

## Next Steps
[Links to deeper documentation]
```

## Phase 4: Review and Save

Present documentation section by section:

1. Ask after each section: "Does this accurately describe the code?"
2. Cross-reference with actual code to verify accuracy
3. Include real examples from the codebase — never invented ones
4. After approval, save to `docs/` directory
5. Commit with message: `docs(<scope>): add/update <doc-type>`

### Accuracy Verification Checklist

| Check | How to Verify |
|-------|--------------|
| Function signatures match code | Read the source file |
| Examples actually work | Trace the code path |
| Config options are current | Check actual config files |
| Dependencies listed are installed | Check package.json / requirements |
| File paths referenced exist | Glob for the files |

## Anti-Patterns / Common Mistakes

| Mistake | Why It Is Wrong | What To Do Instead |
|---------|----------------|-------------------|
| Inventing code examples | Readers copy-paste and get errors | Extract real examples from the codebase |
| Documenting internal/private APIs | Creates coupling to implementation | Only document public/exported surface |
| Writing docs that duplicate source code | Goes stale immediately | Reference behavior, not implementation |
| Giant monolithic doc file | Hard to navigate and maintain | Split by concern (API, architecture, config) |
| Documenting aspirational behavior | Misleads users about current capabilities | Document what actually works today |
| Skipping the analysis phase | Miss important APIs or get signatures wrong | Always analyze code first |
| Not verifying examples compile/run | Broken docs worse than no docs | Test every code example |

## Anti-Rationalization Guards

- **Do NOT** generate documentation without first analyzing the actual code
- **Do NOT** invent examples — every code snippet must come from or be verified against the codebase
- **Do NOT** document private/internal APIs unless explicitly requested
- **Do NOT** skip the review phase — present each section for user verification
- **Do NOT** duplicate information already covered in other docs — reference instead

## Integration Points

| Skill | Relationship |
|-------|-------------|
| `prd-generation` | Upstream: PRD defines what needs documenting |
| `self-learning` | Parallel: both analyze codebase; self-learning populates memory files used here |
| `api-design` | Upstream: API design specs inform API reference docs |
| `spec-writing` | Parallel: specs define behavior; docs explain usage |
| `reverse-engineering-specs` | Upstream: reverse-engineered specs provide behavioral understanding |
| `code-review` | Downstream: reviewer checks if docs were updated alongside code changes |

## Verification Gate

Before claiming documentation is complete:

1. VERIFY all public APIs are documented with correct signatures
2. VERIFY code examples actually work (not invented)
3. VERIFY cross-references link to existing content
4. VERIFY documentation matches current code state
5. VERIFY the user has approved each section
6. RUN any documented commands to confirm they work

## Concrete Example: API Reference Entry

Given this source code:
```typescript
export async function createUser(data: CreateUserInput): Promise<User> {
  // validates, hashes password, inserts into DB
}
```

Generate this documentation:
```markdown
## `createUser(data)`

Create a new user account with the provided details.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| data | `CreateUserInput` | Yes | User registration data |

**`CreateUserInput` shape:**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| email | `string` | Yes | Valid email format |
| password | `string` | Yes | Minimum 8 characters |
| name | `string` | Yes | 1-100 characters |

**Returns:** `Promise<User>` — the created user object (password excluded)

**Throws:**
- `ValidationError` — if input fails validation
- `ConflictError` — if email already exists
```

## Skill Type

**Flexible** — Adapt documentation depth and format to project needs while preserving the analyze-first principle and accuracy verification.
