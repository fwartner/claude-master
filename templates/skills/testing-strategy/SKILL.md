---
name: testing-strategy
description: "Use when choosing a testing approach for a project — selecting frameworks, defining coverage thresholds, setting up test infrastructure, and establishing testing patterns. Triggers: new project setup, CI/CD pipeline design, coverage audit, test framework migration, quality standard definition."
---

# Testing Strategy

## Overview

Analyze the project context and recommend a comprehensive testing strategy. This skill selects appropriate frameworks, defines the testing pyramid, establishes coverage thresholds, and generates test configuration files. The goal is a repeatable, measurable testing foundation that the team can maintain.

**Announce at start:** "I'm using the testing-strategy skill to define the testing approach."

---

## Phase 1: Analyze Project

**Goal:** Understand the current stack, existing tests, and CI setup before recommending anything.

### Actions

1. Identify the tech stack (language, framework, runtime)
2. Survey existing tests (what testing exists already?)
3. Review CI/CD pipeline (how do tests run?)
4. Measure current coverage levels
5. Map external dependencies (services, databases, APIs)

### Discovery Commands

```bash
# Identify test files
find . -name "*.test.*" -o -name "*.spec.*" | head -30

# Check for test config
ls vitest.config.* jest.config.* pytest.ini pyproject.toml .mocharc.* 2>/dev/null

# Check current coverage
cat coverage/coverage-summary.json 2>/dev/null || echo "No coverage report found"

# Check CI config
cat .github/workflows/*.yml 2>/dev/null | head -50
```

### STOP — Do NOT proceed to Phase 2 until:
- [ ] Tech stack is identified
- [ ] Existing test infrastructure is mapped
- [ ] CI pipeline status is known
- [ ] External dependencies are listed

---

## Phase 2: Recommend Testing Pyramid

**Goal:** Select frameworks and define the pyramid ratios.

### Framework Selection Table

| Stack | Unit | Integration | E2E |
|-------|------|-------------|-----|
| **Node.js/TS** | Vitest | Vitest + Supertest | Playwright |
| **React/Next.js** | Vitest + Testing Library | Vitest + MSW | Playwright/Cypress |
| **Python** | pytest | pytest + httpx | Playwright |
| **Go** | testing + testify | testing + testcontainers | Playwright |
| **Rust** | cargo test | cargo test + testcontainers | - |
| **PHP/Laravel** | Pest/PHPUnit | Pest + HTTP tests | Playwright/Dusk |

### Testing Pyramid Ratios

```
        /\
       /  \     E2E Tests (10%)
      /    \    Critical user journeys only
     /------\
    /        \   Integration Tests (30%)
   /          \  API endpoints, DB queries, service interactions
  /------------\
 /              \ Unit Tests (60%)
/                \ Pure functions, business logic, utilities
```

### What to Test at Each Level

| Level | Test These | Do NOT Test These |
|-------|-----------|------------------|
| **Unit (60%)** | Pure functions, business logic, data transformations, validations, state management | Framework internals, third-party libraries |
| **Integration (30%)** | API endpoints, database queries, service-to-service calls, auth flows | Individual functions in isolation |
| **E2E (10%)** | Critical user journeys (signup, purchase), cross-browser, accessibility | Edge cases (handle at unit level) |

### STOP — Do NOT proceed to Phase 3 until:
- [ ] Framework selection matches the tech stack
- [ ] Pyramid ratios are defined
- [ ] Testing scope at each level is documented

---

## Phase 3: Define Coverage Thresholds

**Goal:** Set realistic, enforceable coverage targets.

### Coverage Threshold Table

| Category | Minimum | Target | Notes |
|----------|---------|--------|-------|
| Overall | 70% | 85% | Lines covered |
| Critical paths | 90% | 95% | Auth, payments, data access |
| New code (PRs) | 80% | 90% | Enforced in CI |
| Utilities | 95% | 100% | Pure functions are easy to test |

### Threshold Selection Decision Table

| Project Maturity | Overall Minimum | New Code Minimum | Rationale |
|-----------------|----------------|-------------------|-----------|
| Greenfield | 80% | 90% | Start high, maintain standard |
| Active (good coverage) | 70% | 85% | Maintain and improve |
| Legacy (low coverage) | 50% | 80% | Raise floor gradually |
| Prototype/MVP | 60% | 70% | Cover critical paths, accept gaps |

### STOP — Do NOT proceed to Phase 4 until:
- [ ] Coverage thresholds are realistic for the project maturity
- [ ] Critical path coverage targets are defined
- [ ] CI enforcement strategy is decided

---

## Phase 4: Generate Configuration

**Goal:** Produce working test configuration files and CI integration.

### Actions

1. Generate test runner config (`vitest.config.ts`, `jest.config.js`, `pytest.ini`)
2. Configure coverage with thresholds
3. Add test commands to CI workflow
4. Set up test environment (`.env.test`, test databases)

### Example: Vitest Config

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
```

### STOP — Do NOT proceed to Phase 5 until:
- [ ] Config files are syntactically valid
- [ ] Coverage thresholds match Phase 3 decisions
- [ ] CI integration commands are defined

---

## Phase 5: Create Test Templates

**Goal:** Provide example test files demonstrating project conventions.

### Actions

1. Create a unit test example with Arrange-Act-Assert
2. Create an integration test with setup/teardown
3. Create mock/stub patterns for external dependencies
4. Create test data factories/fixtures
5. Create a snapshot test example (when appropriate)

### STOP — Verification Gate before claiming complete:
- [ ] Framework selection matches tech stack
- [ ] Coverage thresholds are realistic
- [ ] Test configuration files are valid
- [ ] Example tests actually run
- [ ] CI integration is configured

---

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Is Wrong | Correct Approach |
|-------------|----------------|-----------------|
| Testing implementation details | Breaks on every refactor, provides false confidence | Test behavior and outcomes |
| Excessive mocking | Tests nothing real, mocks mask real failures | Mock at boundaries only |
| Brittle CSS selectors in E2E | Break with styling changes | Use data-testid or accessible roles |
| Test interdependence | Ordering failures, flaky in CI | Each test must run independently |
| Slow tests blocking CI | Developers skip running tests | Parallelize, use test databases, mock external APIs |
| Snapshot overuse | Snapshots approved without reading, stale baselines | Use for stable output only |
| No coverage enforcement in CI | Coverage degrades over time | Enforce thresholds in CI pipeline |
| Same coverage target everywhere | Utilities and critical paths differ | Use per-category thresholds |

---

## Decision Table: Mock Strategy

| Dependency Type | Mock Strategy | Example |
|----------------|--------------|---------|
| External API | MSW / nock / responses | Third-party payment API |
| Database | Test database or in-memory | PostgreSQL test container |
| File system | Virtual FS or temp directory | File upload processing |
| Time/Date | Fake timers | Expiration logic |
| Environment vars | Override in test setup | Feature flags |
| Random/UUID | Seed or stub | ID generation |

---

## Integration Points

| Skill | Relationship |
|-------|-------------|
| `test-driven-development` | Strategy defines frameworks; TDD defines the cycle |
| `acceptance-testing` | Strategy includes acceptance test infrastructure |
| `code-review` | Review checks that tests follow the defined strategy |
| `senior-frontend` | Frontend testing uses strategy-selected frameworks |
| `senior-backend` | Backend testing uses strategy-selected frameworks |
| `performance-optimization` | Load tests are part of the overall testing strategy |
| `webapp-testing` | Playwright E2E tests follow strategy pyramid |

---

## Key Principles

- **Test behavior, not implementation** — what it does, not how
- **Fast feedback** — unit tests should run in seconds
- **Deterministic** — no flaky tests, no time-dependent logic
- **Readable** — tests are documentation; make them clear
- **Maintainable** — tests should help refactoring, not block it

---

## Skill Type

**FLEXIBLE** — Adapt framework selection and coverage thresholds to the project context. The five-phase process and testing pyramid structure are strongly recommended but can be scaled to project size.
