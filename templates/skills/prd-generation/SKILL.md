---
name: prd-generation
description: Use when user wants to generate a Product Requirements Document from a high-level idea, feature request, or product vision
---

# PRD Generation

## Overview

Transform high-level ideas into structured Product Requirements Documents through guided discovery. Ask questions to understand the full scope, then generate a professional PRD.

**Announce at start:** "I'm using the prd-generation skill to create a Product Requirements Document."

## Checklist

You MUST create a task for each of these items and complete them in order:

1. **Discovery** — ask questions to understand the product/feature
2. **Draft PRD** — generate the structured document
3. **Review** — present section by section, get approval
4. **Save** — write to `docs/prds/YYYY-MM-DD-<feature>.md`
5. **Transition** — if implementation follows, invoke brainstorming skill

## Phase 1: Discovery

Ask these questions ONE AT A TIME (prefer multiple choice):

**Problem Space:**
- What problem does this solve?
- Who are the target users? (personas, roles)
- How are users currently solving this problem?
- What's the impact of NOT solving this?

**Solution Space:**
- What does success look like? (specific metrics)
- What are the must-have vs nice-to-have features?
- What are the explicit non-goals?
- Are there existing solutions to learn from?

**Constraints:**
- What's the timeline? Any hard deadlines?
- What technical constraints exist? (platform, stack, integrations)
- What resources are available?
- Are there compliance or regulatory requirements?

## Phase 2: Draft PRD

Dispatch the `prd-writer` agent with collected answers. The PRD follows this structure:

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

## 10. Open Questions
- [ ] Question 1
- [ ] Question 2

## 11. Appendix
References, mockups, related documents
```

## Phase 3: Review

Present the PRD section by section:
- After each section, ask: "Does this capture your intent? Any changes?"
- Revise based on feedback before moving to next section
- Pay special attention to: Goals/Non-Goals, User Stories, Success Metrics

## After Approval

- Save to `docs/prds/YYYY-MM-DD-<feature>.md`
- Commit the PRD
- If implementation follows, invoke the brainstorming skill

## Key Principles

- **Discovery before documentation** — understand fully before writing
- **Measurable goals** — every goal must have a metric
- **Explicit non-goals** — prevent scope creep by defining what's out of scope
- **User-centric** — frame everything from the user's perspective
- **Living document** — PRDs should be updated as understanding evolves
