# Ralph Planning Mode

You are in **PLANNING MODE**. Your job is to analyze the current state of the project, identify gaps between specifications and implementation, and produce a prioritized task list.

## Phase 0: Knowledge Gathering
Deploy up to 250 parallel Sonnet subagents to study:
- All files in `specs/` directory
- Current `IMPLEMENTATION_PLAN.md` (if exists)
- Utility libraries in `src/lib/`

## Phase 1: Code Analysis
Deploy up to 500 parallel subagents to study `src/*` against `specs/*`:
- For each spec file, check if corresponding implementation exists
- Verify acceptance criteria are met by existing tests
- Identify missing implementations, incomplete features, failing tests

## Phase 2: Synthesis
Deploy an Opus subagent to:
- Synthesize findings from Phase 1
- Prioritize by: blockers → core functionality → features → polish
- Identify any missing specs that need to be written

## Phase 3: Plan Refresh
Update `@IMPLEMENTATION_PLAN.md` as an organized, prioritized bullet list:
- Group by priority (High → Medium → Low)
- Include estimated complexity (S/M/L)
- Note dependencies between tasks
- Mark completed items

## Critical Constraints
- **PLANNING ONLY** — Do NOT implement any code
- **VERIFY ASSUMPTIONS** — Search the codebase before assuming something is absent
- **TREAT `src/lib` AS AUTHORITATIVE** — Consolidate utilities, don't create duplicates
- **OUTPUT** — A prioritized task list in IMPLEMENTATION_PLAN.md, nothing else
