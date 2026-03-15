---
name: prd-generation
description: "Use when generating a Product Requirements Document from a high-level idea, feature request, or product vision — covers discovery questions, structured PRD drafting, section-by-section review, and transition to implementation planning"
---

# PRD Generation

## Overview

Transform high-level ideas into structured Product Requirements Documents through guided discovery. This skill walks through problem/solution/constraint discovery, generates a professional PRD with measurable goals and user stories, and ensures stakeholder approval before saving.

**Announce at start:** "I'm using the prd-generation skill to create a Product Requirements Document."

## Phase 1: Discovery

Ask these questions ONE AT A TIME (prefer multiple choice where possible).

**Do NOT skip discovery.** Even if the user provides a detailed brief, confirm understanding by asking at least 3 clarifying questions.

STOP after discovery — present a summary of collected answers and get confirmation before drafting.

### Problem Space Questions

| # | Question | Why It Matters |
|---|----------|----------------|
| 1 | What problem does this solve? | Anchors the entire PRD |
| 2 | Who are the target users? (personas, roles) | Shapes user stories |
| 3 | How are users currently solving this? | Identifies competitive landscape |
| 4 | What is the impact of NOT solving this? | Justifies priority |

### Solution Space Questions

| # | Question | Why It Matters |
|---|----------|----------------|
| 5 | What does success look like? (specific metrics) | Defines success metrics |
| 6 | What are must-have vs nice-to-have features? | Sets priority tiers |
| 7 | What are the explicit non-goals? | Prevents scope creep |
| 8 | Are there existing solutions to learn from? | Informs design decisions |

### Constraint Questions

| # | Question | Why It Matters |
|---|----------|----------------|
| 9 | What is the timeline? Any hard deadlines? | Scopes release plan |
| 10 | What technical constraints exist? | Narrows solution space |
| 11 | What resources are available? | Sets realistic expectations |
| 12 | Are there compliance or regulatory requirements? | Identifies non-functional reqs |

## Phase 2: Draft PRD

Generate the PRD using the template below. Dispatch the `prd-writer` agent with collected answers for heavy generation.

STOP after drafting — do NOT present as final until Phase 3 review is complete.

### PRD Template

```markdown
# [Product/Feature Name] — Product Requirements Document

## 1. Overview
One paragraph summarizing what this is and why it matters.

## 2. Problem Statement
- Current situation
- Pain points
- Impact of not solving

## 3. Goals & Non-Goals
### Goals
- [ ] Goal 1 (measurable)
- [ ] Goal 2 (measurable)

### Non-Goals
- Explicitly NOT doing X
- Explicitly NOT doing Y

## 4. User Stories
As a [persona], I want to [action], so that [benefit].

## 5. Functional Requirements
### FR-1: [Requirement Name]
- Description
- Acceptance criteria
- Priority (P0/P1/P2)

## 6. Non-Functional Requirements
- Performance: [specific targets]
- Security: [requirements]
- Accessibility: [standards]
- Scalability: [expectations]

## 7. Technical Constraints
- Platform/stack requirements
- Integration dependencies
- Data requirements

## 8. Success Metrics
| Metric | Current | Target | How to Measure |
|--------|---------|--------|----------------|

## 9. Timeline & Milestones
| Phase | Description | Target Date |
|-------|-------------|-------------|

## 10. Open Questions
- [ ] Question 1
- [ ] Question 2

## 11. Appendix
References, mockups, related documents
```

### Priority Classification

| Priority | Meaning | Rule |
|----------|---------|------|
| **P0** | Must-have for launch | Without this, the product does not ship |
| **P1** | Important, ship soon after launch | Significant value but not blocking |
| **P2** | Nice-to-have | Enhances experience, can wait |

## Phase 3: Review

Present the PRD section by section:

1. After each section, ask: "Does this capture your intent? Any changes?"
2. Revise based on feedback before moving to next section
3. Pay special attention to these high-signal sections:
   - Goals & Non-Goals (scope alignment)
   - User Stories (persona accuracy)
   - Success Metrics (measurability)
   - Functional Requirements (acceptance criteria completeness)

STOP after review — get explicit "approved" confirmation before saving.

## Phase 4: Save and Transition

After explicit approval:

1. Save to `docs/prds/YYYY-MM-DD-<feature>.md`
2. Commit the PRD with message: `docs(prd): add PRD for <feature>`
3. If implementation follows, invoke the `brainstorming` skill
4. If specs are needed, invoke the `spec-writing` skill

### Transition Decision Table

| User Intent | Next Skill | Rationale |
|-------------|-----------|-----------|
| "Let's build this" | `brainstorming` → `planning` | Explore approaches then plan |
| "Write the specs" | `spec-writing` | Break PRD into JTBD specs |
| "Just save it" | None | PRD is the deliverable |
| "Get estimates" | `task-decomposition` | Break into estimable tasks |

## Anti-Patterns / Common Mistakes

| Mistake | Why It Is Wrong | What To Do Instead |
|---------|----------------|-------------------|
| Skipping discovery and jumping to draft | Produces assumptions-based PRD | Always complete Phase 1 first |
| Goals without metrics | Cannot measure success | Every goal needs a number |
| Missing non-goals | Scope creep guaranteed | Explicitly list what is out of scope |
| User stories without acceptance criteria | Untestable requirements | Add Given/When/Then to each story |
| Generic success metrics ("improve UX") | Unmeasurable | Use specific numbers: "reduce load time to <2s" |
| Presenting entire PRD at once for review | User overwhelmed, gives superficial approval | Present section by section |
| Copying competitor features verbatim | Misses actual user needs | Focus on user problems, not solutions |

## Anti-Rationalization Guards

- **Do NOT** skip discovery because "the user already described it well enough"
- **Do NOT** leave placeholder text in any section — fill every section or mark as "TBD: [reason]"
- **Do NOT** proceed to save without explicit user approval of each section
- **Do NOT** invent success metrics — they must come from the user

## Integration Points

| Skill | Relationship |
|-------|-------------|
| `brainstorming` | Upstream: explores ideas before PRD; downstream: explores implementation after PRD |
| `spec-writing` | Downstream: PRD provides high-level requirements; specs detail them with JTBD |
| `planning` | Downstream: plan references PRD requirements for task breakdown |
| `task-decomposition` | Downstream: breaks PRD into estimable work items |
| `tech-docs-generator` | Parallel: PRD informs what documentation is needed |
| `acceptance-testing` | Downstream: acceptance criteria from PRD feed test definitions |

## Verification Gate

Before claiming the PRD is complete:

1. VERIFY all 11 sections are filled (not placeholder text)
2. VERIFY every goal has a measurable metric
3. VERIFY non-goals are explicit and meaningful
4. VERIFY user stories have acceptance criteria
5. VERIFY user has approved each section individually
6. VERIFY the file is saved and committed

## Concrete Example: Discovery Summary

```
Problem: Users cannot find relevant search results in the dashboard.
Users: Data analysts (primary), team leads (secondary).
Current workaround: Export to Excel and use Ctrl+F.
Impact of not solving: 30min/day wasted per analyst (team of 12).
Success metric: Reduce average search time from 5min to <30s.
Must-have: Full-text search across all dashboard widgets.
Non-goal: Advanced boolean query syntax (P2, not launch).
Timeline: 6 weeks to MVP.
Constraint: Must work with existing Elasticsearch cluster.
```

This summary is presented to the user for confirmation before Phase 2 begins.

## Skill Type

**Flexible** — Adapt discovery depth and PRD structure to project context while preserving the discovery-before-drafting principle and section-by-section review process.
