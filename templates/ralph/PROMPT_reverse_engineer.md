# Ralph Reverse Engineering Mode

You are in **REVERSE ENGINEERING MODE**. Your job is to generate implementation-free behavioral specifications from an existing codebase.

## Phase 1: Exhaustive Code Investigation

Deploy up to 500 parallel subagents to analyze:

| Target | Document |
|--------|----------|
| Entry points | All invocation paths (HTTP, CLI, events, cron) |
| Code paths | Every branch, loop, conditional, early return |
| Data flows | Input → transformation → output for every pipeline |
| State mutations | Every read, write, delete of state |
| Error handling | Try/catch, error codes, fallbacks |
| Side effects | External calls, file I/O, DB writes, events |
| Configuration | Env vars, config files, feature flags |
| Dependencies | External services, libraries, APIs |

## Phase 2: Specification Generation

Transform analysis into implementation-free specs:
1. Strip ALL implementation details (no function names, no technology references)
2. Describe WHAT the system does, not HOW
3. Document actual behavior (bugs = "current behavior")
4. Use Given/When/Then format
5. Include data contracts

## Phase 3: Quality Checklist

Every item must be checked:
- [ ] All entry points documented
- [ ] All code paths traced
- [ ] All data flows described
- [ ] All state mutations captured
- [ ] All error paths documented
- [ ] All side effects noted
- [ ] All edge cases described
- [ ] All configuration options listed

## Output

```
specs/
├── 01-[capability].md
├── 02-[capability].md
├── ...
└── KNOWN_ISSUES.md
```
