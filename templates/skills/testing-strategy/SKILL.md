---
name: testing-strategy
description: Use when choosing a testing approach for a project - selecting frameworks, defining coverage thresholds, setting up test infrastructure, and establishing testing patterns
---

# Testing Strategy

## Overview

Analyze the project context and recommend a comprehensive testing strategy. Select appropriate frameworks, define the testing pyramid, establish coverage thresholds, and generate test configuration.

**Announce at start:** "I'm using the testing-strategy skill to define the testing approach."

## Checklist

1. **Analyze project** — understand stack, existing tests, CI setup
2. **Recommend strategy** — testing pyramid, frameworks, patterns
3. **Review with user** — present recommendations, get approval
4. **Generate config** — test configuration, CI integration
5. **Create templates** — example test files for each category

## Step 1: Analyze Project

Examine:
- **Tech stack** — language, framework, runtime
- **Existing tests** — what testing exists already?
- **CI/CD** — how do tests run in CI?
- **Coverage** — current coverage levels
- **Dependencies** — external services, databases, APIs

## Step 2: Recommend Testing Pyramid

### Framework Selection Guide

| Stack | Unit | Integration | E2E |
|-------|------|-------------|-----|
| **Node.js/TS** | Vitest | Vitest + Supertest | Playwright |
| **React/Next.js** | Vitest + Testing Library | Vitest + MSW | Playwright/Cypress |
| **Python** | pytest | pytest + httpx | Playwright |
| **Go** | testing + testify | testing + testcontainers | Playwright |
| **Rust** | cargo test | cargo test + testcontainers | - |

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

**Unit Tests (60%):**
- Pure functions and business logic
- Data transformations and validations
- Utility functions
- State management logic
- NOT: framework internals, third-party libraries

**Integration Tests (30%):**
- API endpoint request/response
- Database queries and migrations
- Service-to-service communication
- Authentication/authorization flows
- NOT: individual functions in isolation

**E2E Tests (10%):**
- Critical user journeys (sign up, purchase, etc.)
- Cross-browser compatibility (if needed)
- Accessibility (automated checks)
- NOT: edge cases (handle at unit level)

## Step 3: Coverage Thresholds

| Category | Minimum | Target | Notes |
|----------|---------|--------|-------|
| Overall | 70% | 85% | Lines covered |
| Critical paths | 90% | 95% | Auth, payments, data access |
| New code | 80% | 90% | All new PRs |
| Utilities | 95% | 100% | Pure functions |

## Step 4: Generate Configuration

Generate appropriate config files:
- Test runner config (`vitest.config.ts`, `jest.config.js`, `pytest.ini`)
- Coverage config with thresholds
- CI integration (test commands in workflow)
- Test environment setup (`.env.test`, test databases)

## Step 5: Test Templates

Create example test files demonstrating:
- Unit test structure and conventions
- Integration test with setup/teardown
- Mock/stub patterns for external dependencies
- Test data factories/fixtures
- Snapshot testing (when appropriate)

## Testing Anti-Patterns to Avoid

- **Testing implementation details** — test behavior, not internal state
- **Excessive mocking** — if you're mocking everything, you're testing nothing
- **Brittle selectors** — use data-testid or accessible roles, not CSS classes
- **Test interdependence** — each test must run independently
- **Slow tests in CI** — parallelize, use test databases, mock external APIs
- **Snapshot overuse** — snapshots are for stable output, not evolving UI

## Key Principles

- **Test behavior, not implementation** — what it does, not how
- **Fast feedback** — unit tests should run in seconds
- **Deterministic** — no flaky tests, no time-dependent logic
- **Readable** — tests are documentation; make them clear
- **Maintainable** — tests should help refactoring, not block it
