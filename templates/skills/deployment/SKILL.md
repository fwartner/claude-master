---
name: deployment
description: Use when setting up CI/CD pipelines, creating deployment configurations, generating deploy checklists, or configuring infrastructure
---

# Deployment

## Overview

Set up CI/CD pipelines and deployment configurations. Detect the deployment target, generate pipeline config, create pre/post-deploy checklists, and configure monitoring.

**Announce at start:** "I'm using the deployment skill to set up the deployment pipeline."

## Checklist

1. **Detect target** — identify deployment platform and infrastructure
2. **Design pipeline** — define stages, jobs, triggers
3. **Generate config** — CI/CD configuration files
4. **Create checklists** — pre-deploy and post-deploy verification
5. **Review with user** — present pipeline, get approval
6. **Save config** — write to `.github/workflows/` or equivalent

## Step 1: Detect Deployment Target

Ask questions to identify:

**Platform:**
- Where does this deploy? (Vercel, AWS, GCP, Azure, DigitalOcean, self-hosted)
- Container-based? (Docker, Kubernetes)
- Serverless? (Lambda, Cloud Functions, Edge Functions)

**CI/CD:**
- What CI system? (GitHub Actions, GitLab CI, CircleCI, Jenkins)
- What triggers deployments? (push to main, tags, manual)
- Multi-environment? (dev, staging, production)

**Infrastructure:**
- Database migrations needed?
- Environment variables management? (secrets manager, .env)
- CDN/caching? Asset pipeline?
- Monitoring/alerting? (Datadog, Sentry, New Relic)

## Step 2: Design Pipeline

### Standard Pipeline Stages

```
┌─────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│  Build   │──▶│   Test   │──▶│  Lint/   │──▶│  Deploy  │──▶│  Verify  │
│          │   │          │   │  Check   │   │          │   │          │
└─────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
```

**Build:** Install dependencies, compile, bundle
**Test:** Unit tests, integration tests, coverage check
**Lint/Check:** Linting, type checking, security audit
**Deploy:** Push to target environment
**Verify:** Health checks, smoke tests, monitoring

### Branch Strategy

| Branch | Action | Environment |
|--------|--------|-------------|
| `feature/*` | Build + Test + Lint | - |
| `main` | Build + Test + Lint + Deploy | Staging |
| `release/*` or tags | Build + Test + Lint + Deploy | Production |

## Step 3: Generate Config

### GitHub Actions Example

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test -- --coverage
      - run: npm run build

  deploy-staging:
    needs: build-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      # [platform-specific deploy steps]

  deploy-production:
    needs: build-and-test
    if: startsWith(github.ref, 'refs/tags/v')
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      # [platform-specific deploy steps]
```

## Step 4: Deployment Checklists

### Pre-Deploy Checklist

```markdown
## Pre-Deploy Checklist

- [ ] All tests passing on CI
- [ ] Code reviewed and approved
- [ ] No Critical issues in code review
- [ ] Environment variables configured for target environment
- [ ] Database migrations tested (if applicable)
- [ ] Feature flags configured (if applicable)
- [ ] Rollback plan documented
- [ ] Monitoring/alerts configured
- [ ] Changelog updated
- [ ] Version bumped
```

### Post-Deploy Verification

```markdown
## Post-Deploy Verification

- [ ] Health check endpoint returns 200
- [ ] Smoke tests passing
- [ ] Error rate within normal range
- [ ] Response times within SLA
- [ ] Database migrations applied successfully
- [ ] Feature flags active/inactive as expected
- [ ] Monitoring dashboard showing expected metrics
- [ ] No new errors in error tracking (Sentry, etc.)
```

## Key Principles

- **Automate everything** — no manual steps in the critical path
- **Fast feedback** — fail early, fail fast
- **Environment parity** — staging matches production
- **Rollback-ready** — every deploy has a rollback plan
- **Observable** — monitoring before, during, and after deploy
- **Secure** — no secrets in code, use secrets management

## Verification Gate

Before claiming the deployment config is complete:
1. VERIFY CI/CD config file syntax is valid
2. VERIFY all environment variables are documented
3. VERIFY rollback plan exists
4. VERIFY pre/post-deploy checklists are complete
5. VERIFY the pipeline can be tested locally (act, etc.)
