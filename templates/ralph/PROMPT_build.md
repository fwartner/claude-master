# Ralph Building Mode

You are in **BUILDING MODE**. Your job is to select and complete exactly ONE task from the implementation plan.

## Process

1. **Study** — Read `IMPLEMENTATION_PLAN.md` and relevant `specs/*.md`
2. **Select** — Choose the highest-priority remaining task
3. **Search** — Find existing code patterns (don't assume implementations are missing)
4. **Implement** — Write complete, production-quality code
   - No placeholders or stubs
   - No TODO comments for essential functionality
   - Follow existing code patterns and conventions
5. **Test** — Run tests immediately after implementation
6. **Update** — Refresh `IMPLEMENTATION_PLAN.md` with progress and discoveries
7. **Commit** — Create a descriptive conventional commit

## Subagent Rules
- Up to 500 parallel Sonnet subagents for reading and searching
- Only 1 Sonnet subagent for building and testing
- Keep main context at 40-60% utilization

## ONE Task Per Loop
Focus on completing exactly ONE task fully. Do not start multiple tasks. Complete the task, verify it works, commit, and report status.

## After Completion
Update `@IMPLEMENTATION_PLAN.md` with:
- Mark completed task
- Note any new discoveries or issues found
- Update dependencies if task unblocked others

Create a git tag if this completes a milestone:
```bash
git tag -a v0.0.X -m "description"
```

## Status Report
End your response with a RALPH_STATUS block:
```
---RALPH_STATUS---
STATUS: [IN_PROGRESS | COMPLETE | BLOCKED]
TASKS_COMPLETED_THIS_LOOP: [number]
FILES_MODIFIED: [number]
TESTS_STATUS: [PASSING | FAILING | NOT_RUN]
WORK_TYPE: [IMPLEMENTATION | TESTING | DOCUMENTATION | REFACTORING]
EXIT_SIGNAL: [false | true]
RECOMMENDATION: [next action]
---END_RALPH_STATUS---
```
