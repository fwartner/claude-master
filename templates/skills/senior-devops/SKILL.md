---
name: senior-devops
description: When the user needs CI/CD pipelines, Docker configuration, Kubernetes deployment, infrastructure-as-code, monitoring, or zero-downtime deployment strategies.
---

# Senior DevOps Engineer

## Overview

Design, build, and maintain production infrastructure and deployment pipelines. This skill covers Docker containerization, Kubernetes orchestration, CI/CD with GitHub Actions, infrastructure-as-code with Terraform/Pulumi, monitoring with Prometheus/Grafana, alerting strategies, zero-downtime deployments, and rollback procedures.

## Process

### Phase 1: Infrastructure Design
1. Define deployment topology (single server, cluster, multi-region)
2. Choose containerization strategy (Docker, Buildpacks)
3. Select orchestration platform (Kubernetes, ECS, Cloud Run)
4. Plan networking (load balancers, DNS, TLS)
5. Design secret management approach

### Phase 2: Pipeline Implementation
1. Build CI pipeline (lint, test, build, security scan)
2. Build CD pipeline (deploy to staging, production)
3. Configure environment-specific settings
4. Set up artifact registry (container images, packages)
5. Implement deployment strategy (blue-green, canary, rolling)

### Phase 3: Observability
1. Deploy monitoring stack (Prometheus, Grafana)
2. Configure alerting rules and escalation
3. Set up log aggregation
4. Implement distributed tracing
5. Create runbooks for common incidents

## Dockerfile Best Practices

```dockerfile
# 1. Use specific version tags (not :latest)
FROM node:20-alpine AS base

# 2. Set working directory
WORKDIR /app

# 3. Install dependencies in separate layer (cache optimization)
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile --prod

FROM base AS build-deps
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

# 4. Build in separate stage
FROM build-deps AS builder
COPY . .
RUN pnpm build

# 5. Production image — minimal size
FROM base AS runner
ENV NODE_ENV=production

# 6. Don't run as root
RUN addgroup --system --gid 1001 app && \
    adduser --system --uid 1001 app
USER app

# 7. Copy only what's needed
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# 8. Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://localhost:3000/health || exit 1

# 9. Expose port and set entrypoint
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### Key Dockerfile Rules
- Multi-stage builds to minimize image size
- `.dockerignore` file (exclude node_modules, .git, tests)
- Non-root user for security
- Specific base image versions
- Layer ordering for cache efficiency (dependencies before source)
- HEALTHCHECK instruction
- No secrets in build args or layers

## Docker Compose Patterns

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: runner
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/app
      - REDIS_URL=redis://cache:6379
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/health"]
      interval: 10s
      timeout: 5s
      retries: 3

  db:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 5

  cache:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

## GitHub Actions Workflow

```yaml
name: CI/CD
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test -- --coverage

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx audit-ci --moderate
      - uses: aquasecurity/trivy-action@master
        with:
          scan-type: fs
          severity: HIGH,CRITICAL

  build-and-push:
    needs: [lint-and-test, security-scan]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v5
        with:
          push: true
          tags: ghcr.io/${{ github.repository }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to production
        run: echo "Deploying ${{ github.sha }}"
```

## Terraform / Pulumi Patterns

### Terraform Structure
```
modules/
  vpc/
    main.tf, variables.tf, outputs.tf
  ecs/
    main.tf, variables.tf, outputs.tf
environments/
  staging/
    main.tf, terraform.tfvars
  production/
    main.tf, terraform.tfvars
```

### Key IaC Rules
- Remote state backend (S3 + DynamoDB, GCS, Terraform Cloud)
- State locking to prevent concurrent modifications
- Environment-specific variable files
- Module versioning for shared infrastructure
- `terraform plan` in CI, `terraform apply` with manual approval
- Drift detection on schedule
- Tag all resources with owner, environment, project

## Monitoring (Prometheus + Grafana)

### USE Method (Resources)
| Resource | Utilization | Saturation | Errors |
|---|---|---|---|
| CPU | cpu_usage_percent | cpu_throttled | — |
| Memory | memory_usage_bytes | oom_kills | — |
| Disk | disk_usage_percent | io_wait | disk_errors |
| Network | bytes_total | queue_length | errors_total |

### RED Method (Services)
- **Rate**: requests per second
- **Errors**: error rate per second
- **Duration**: latency distribution (p50, p95, p99)

### Alerting Rules
```yaml
groups:
  - name: app-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
```

### Alerting Best Practices
- Alert on symptoms, not causes
- Every alert must have a runbook link
- Tiered severity: critical (page), warning (ticket), info (log)
- Aggregate before alerting (avoid flapping)
- Review and prune alerts quarterly

## Zero-Downtime Deployment Strategies

| Strategy | How It Works | Risk | Rollback Speed |
|---|---|---|---|
| Rolling | Replace instances one at a time | Low | Medium |
| Blue-Green | Switch traffic between two environments | Low | Instant |
| Canary | Route small % to new version, gradually increase | Very Low | Instant |
| Feature Flags | Deploy code dark, enable via flag | Very Low | Instant |

### Rollback Procedures
1. **Automated**: health check fails -> automatic rollback
2. **Manual**: `kubectl rollout undo deployment/app`
3. **Database**: forward-only migrations with backward compatibility
4. **Config**: revert via secret manager version

### Database Migration Safety
- Migrations must be backward compatible (old code + new schema)
- Never rename/drop columns in same deploy as code change
- Two-phase: add new column -> deploy code using new column -> remove old column
- Always test rollback of each migration

## Key Principles

- Infrastructure as code — no manual changes to production
- Immutable infrastructure — replace, don't patch
- Cattle, not pets — servers are disposable
- Shift left security — scan early in pipeline
- Least privilege — minimal permissions everywhere
- Automate everything that runs more than twice
- Test the disaster recovery plan regularly

## Anti-Patterns

- Manual production deployments
- Shared or hardcoded secrets
- No rollback plan before deploying
- `latest` tag for production images
- Running containers as root
- Alert fatigue from non-actionable alerts
- Skipping staging environment
- Snowflake servers with manual configuration
- Monitoring without alerting (or vice versa)

## Skill Type

**FLEXIBLE** — Adapt tooling and patterns to the project's cloud provider, team size, and operational maturity. The principles (IaC, immutability, observability) are constant; the specific tools are interchangeable.
