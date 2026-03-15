---
name: senior-devops
description: Use for CI/CD pipeline design, containerization, infrastructure as code, monitoring setup, and zero-downtime deployment strategies.
---

# Senior DevOps Engineer

## Overview
Provides structured guidance for building and maintaining production infrastructure. Covers CI/CD pipeline design, Docker best practices, Kubernetes orchestration, Infrastructure as Code with Terraform, monitoring with Prometheus and Grafana, and zero-downtime deployment strategies.

## Process

### 1. CI/CD Pipeline Design
- [ ] Define pipeline stages in order:
  1. **Checkout** - Clone repository, restore caches
  2. **Install** - Install dependencies (`npm ci`, `pip install -r`)
  3. **Lint** - Static analysis, formatting checks
  4. **Type check** - TypeScript, mypy, etc.
  5. **Unit test** - Fast tests, high coverage
  6. **Build** - Compile, bundle, generate artifacts
  7. **Integration test** - Tests requiring external services
  8. **Security scan** - SAST (Semgrep, Snyk), dependency audit
  9. **Deploy to staging** - Automatic on main branch
  10. **E2E test** - Against staging environment
  11. **Deploy to production** - Manual approval gate or automatic
- [ ] Configure branch protection rules
- [ ] Set up caching for dependencies and build artifacts
- [ ] Configure parallel jobs where stages are independent
- [ ] Add status checks required for merge

### 2. Docker Best Practices
- [ ] Use multi-stage builds to minimize image size:
  ```dockerfile
  FROM node:20-alpine AS builder
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --production=false
  COPY . .
  RUN npm run build

  FROM node:20-alpine AS runner
  WORKDIR /app
  ENV NODE_ENV=production
  RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001
  COPY --from=builder /app/dist ./dist
  COPY --from=builder /app/node_modules ./node_modules
  USER appuser
  EXPOSE 3000
  HEALTHCHECK CMD wget -q --spider http://localhost:3000/health || exit 1
  CMD ["node", "dist/server.js"]
  ```
- [ ] Pin base image versions (use SHA digests for production)
- [ ] Run as non-root user
- [ ] Add `.dockerignore` (node_modules, .git, .env, tests)
- [ ] Add HEALTHCHECK instruction
- [ ] Order layers by change frequency (least changing first)
- [ ] Scan images for vulnerabilities (`docker scout`, `trivy`)

### 3. Kubernetes Patterns
- [ ] Define resource requests and limits for all containers
- [ ] Use liveness, readiness, and startup probes:
  ```yaml
  livenessProbe:
    httpGet:
      path: /health
      port: 3000
    initialDelaySeconds: 10
    periodSeconds: 15
  readinessProbe:
    httpGet:
      path: /ready
      port: 3000
    initialDelaySeconds: 5
    periodSeconds: 5
  startupProbe:
    httpGet:
      path: /health
      port: 3000
    failureThreshold: 30
    periodSeconds: 10
  ```
- [ ] Use Horizontal Pod Autoscaler (HPA) for scaling
- [ ] Configure Pod Disruption Budgets (PDB) for availability
- [ ] Use namespaces for environment isolation
- [ ] Store secrets in external secrets manager (Vault, AWS Secrets Manager)
- [ ] Use ConfigMaps for environment-specific configuration
- [ ] Implement network policies for pod-to-pod communication

### 4. Infrastructure as Code (Terraform)
- [ ] Organize by environment:
  ```
  terraform/
    modules/           # Reusable modules
      networking/
      compute/
      database/
    environments/
      dev/
      staging/
      production/
    backend.tf         # Remote state config
    variables.tf
  ```
- [ ] Use remote state (S3 + DynamoDB, Terraform Cloud)
- [ ] Lock state files to prevent concurrent modifications
- [ ] Use `terraform plan` in CI, `terraform apply` with approval
- [ ] Tag all resources with environment, team, project, cost-center
- [ ] Use data sources to reference existing infrastructure
- [ ] Never hardcode secrets in Terraform files
- [ ] Pin provider and module versions

### 5. Monitoring Stack (Prometheus + Grafana)
- [ ] Instrument applications with metrics:
  - **RED method** for services: Rate, Errors, Duration
  - **USE method** for resources: Utilization, Saturation, Errors
- [ ] Configure alert rules with appropriate thresholds:
  ```yaml
  groups:
    - name: app-alerts
      rules:
        - alert: HighErrorRate
          expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
          for: 5m
          labels:
            severity: critical
          annotations:
            summary: "High error rate detected"
        - alert: HighLatency
          expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.5
          for: 10m
          labels:
            severity: warning
  ```
- [ ] Build Grafana dashboards for:
  - Application health (request rate, error rate, latency percentiles)
  - Infrastructure (CPU, memory, disk, network)
  - Business metrics (signups, conversions, revenue)
- [ ] Set up PagerDuty/OpsGenie integration for critical alerts
- [ ] Configure log aggregation (Loki, ELK, Datadog)
- [ ] Implement distributed tracing (Jaeger, Tempo)

### 6. Zero-Downtime Deployment Strategies

| Strategy | Complexity | Rollback Speed | Resource Cost |
|----------|-----------|----------------|---------------|
| Rolling update | Low | Medium | Low |
| Blue-green | Medium | Instant | 2x resources |
| Canary | High | Fast | Low extra |
| Feature flags | Medium | Instant | None extra |

**Rolling Update** (default for Kubernetes):
- Gradually replace old pods with new ones
- Configure `maxUnavailable` and `maxSurge`
- Ensure readiness probes are properly configured

**Blue-Green:**
- Run two identical environments (blue=current, green=new)
- Switch traffic at load balancer level
- Keep blue running for instant rollback

**Canary:**
- Route small percentage of traffic to new version
- Monitor error rates and latency
- Gradually increase traffic if metrics are healthy
- Rollback if any degradation detected

### 7. Security Checklist
- [ ] Secrets managed externally (never in code or CI variables)
- [ ] Images scanned for CVEs before deployment
- [ ] Network segmentation between environments
- [ ] TLS everywhere (including internal services)
- [ ] Audit logging for infrastructure changes
- [ ] Least-privilege IAM policies
- [ ] Regular rotation of credentials and certificates
- [ ] Backup verification tests (actually restore, not just backup)

## Key Principles
1. **Infrastructure is code** - All infrastructure must be version controlled, reviewed, and reproducible.
2. **Automate everything** - If you do it twice, automate it. Manual processes are error-prone.
3. **Monitor before you need to** - Instrumentation is not optional. You cannot fix what you cannot see.
4. **Plan for failure** - Every component will fail. Design for graceful degradation.
5. **Immutable deployments** - Never modify running infrastructure. Replace it with new versions.
6. **Shift security left** - Security scanning in CI, not just in production.

## Skill Type
Flexible
