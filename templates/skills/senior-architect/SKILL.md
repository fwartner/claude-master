---
name: senior-architect
description: When the user needs system design, architecture decision records, scalability analysis, trade-off evaluation, or non-functional requirements planning.
---

# Senior Architect

## Overview

Provide architecture-level guidance for system design decisions. This skill produces Architecture Decision Records (ADRs), trade-off analyses, scalability blueprints, and non-functional requirements specifications. Every recommendation includes explicit trade-offs and is grounded in proven patterns.

## Process

### Phase 1: Requirements Analysis
1. Identify functional requirements (capabilities)
2. Define non-functional requirements (quality attributes)
3. Identify constraints (budget, team, timeline, compliance)
4. Map integration points with existing systems
5. Establish success criteria and SLOs

### Phase 2: Architecture Design
1. Evaluate architectural styles (monolith, microservices, event-driven)
2. Design component boundaries and interfaces
3. Define data architecture (storage, flow, consistency)
4. Plan infrastructure and deployment topology
5. Address cross-cutting concerns (auth, logging, monitoring)

### Phase 3: Documentation and Validation
1. Write Architecture Decision Records for key decisions
2. Create system context and container diagrams (C4 model)
3. Validate against non-functional requirements
4. Identify risks and mitigation strategies
5. Define evolutionary architecture guardrails

## ADR Format (Architecture Decision Records)

```markdown
# ADR-{number}: {Title}

## Status
Proposed | Accepted | Deprecated | Superseded by ADR-{number}

## Context
What is the issue that we're seeing that is motivating this decision?

## Decision
What is the change that we're proposing and/or doing?

## Consequences

### Positive
- [Benefit 1]
- [Benefit 2]

### Negative
- [Trade-off 1]
- [Trade-off 2]

### Risks
- [Risk and mitigation]

## Alternatives Considered
| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| Option A | ... | ... | Chosen |
| Option B | ... | ... | Rejected because... |
| Option C | ... | ... | Rejected because... |
```

## Trade-Off Analysis Framework

### ATAM (Architecture Tradeoff Analysis Method)
1. **Present architecture**: explain the approach
2. **Identify quality attribute scenarios**: concrete, measurable
3. **Analyze against scenarios**: how does the architecture respond?
4. **Identify sensitivity points**: where small changes have big impact
5. **Identify trade-offs**: where improving one quality hurts another

### Common Trade-Off Pairs
| Improving | May Degrade |
|---|---|
| Consistency | Availability, Latency |
| Performance | Maintainability, Cost |
| Security | Usability, Performance |
| Scalability | Simplicity, Cost |
| Flexibility | Performance, Complexity |
| Time to Market | Quality, Scalability |

### Decision Matrix Template
```
Weight each quality attribute (1-5), score each option (1-5), multiply and sum.

| Quality Attribute  | Weight | Option A | Option B | Option C |
|--------------------|--------|----------|----------|----------|
| Performance        |   4    |  4 (16)  |  3 (12)  |  5 (20)  |
| Maintainability    |   5    |  5 (25)  |  4 (20)  |  2 (10)  |
| Scalability        |   3    |  3 (9)   |  5 (15)  |  4 (12)  |
| Cost               |   4    |  4 (16)  |  2 (8)   |  3 (12)  |
| Total              |        |    66    |    55    |    54    |
```

## Scalability Patterns

### Horizontal Scaling
- **Load Balancing**: Round-robin, least connections, IP hash
- **Stateless Services**: No server-side session; use JWT/external session store
- **Auto-scaling**: CPU/memory-based, request-rate-based, schedule-based
- **Database Read Replicas**: Route reads to replicas, writes to primary

### Vertical Scaling
- CPU/memory upgrades (quick but limited)
- Connection pooling (PgBouncer, ProxySQL)
- Query optimization before hardware scaling

### Sharding Strategies
| Strategy | How | Good For |
|---|---|---|
| Hash-based | Consistent hash of key | Even distribution |
| Range-based | Date range, ID range | Time-series data |
| Geographic | By region/country | Data locality |
| Tenant-based | Per customer | Multi-tenant SaaS |

### Caching Layers
```
Client Cache (browser) → CDN Cache → API Gateway Cache →
Application Cache (Redis) → Database Query Cache → Database
```

## Architecture Style Decision Matrix

### Monolith vs Microservices
| Factor | Monolith | Microservices |
|---|---|---|
| Team size < 10 | Preferred | Overkill |
| Team size > 30 | Challenging | Preferred |
| Domain well-understood | Good fit | Not needed yet |
| Domain evolving rapidly | Fine to start | Too early |
| Need independent deployment | Not possible | Key benefit |
| Operational maturity low | Good fit | High risk |

### When to Choose What
- **Modular Monolith**: Default starting point. Clear module boundaries, single deployment.
- **Microservices**: When you need independent scaling, deployment, and team autonomy.
- **Event-Driven**: When you need loose coupling, async processing, and event sourcing.
- **Serverless**: When you have variable/bursty load and want zero operational overhead.
- **CQRS + Event Sourcing**: When audit trail is critical and read/write patterns differ.

## Non-Functional Requirements Analysis

### Template
```markdown
## Performance
- Response time: p95 < 200ms, p99 < 500ms for API calls
- Throughput: 1000 RPS sustained, 5000 RPS peak
- Batch processing: 1M records/hour

## Availability
- Target: 99.9% (8.76h downtime/year)
- RTO (Recovery Time Objective): < 15 minutes
- RPO (Recovery Point Objective): < 5 minutes

## Scalability
- Current: 10K DAU
- 12-month target: 100K DAU
- Scale dimension: users, data volume, request rate

## Security
- Authentication: OAuth 2.0 / OIDC
- Authorization: RBAC with resource-level permissions
- Data encryption: at rest (AES-256) and in transit (TLS 1.3)
- Compliance: SOC 2, GDPR

## Observability
- Logging: structured JSON, 30-day retention
- Metrics: RED method, custom business metrics
- Tracing: distributed tracing across all services
- Alerting: PagerDuty integration, tiered severity
```

### SLO/SLA/SLI Framework
- **SLI** (Service Level Indicator): measurable metric (latency, error rate)
- **SLO** (Service Level Objective): target value (99.9% availability)
- **SLA** (Service Level Agreement): contractual commitment with consequences
- Error Budget = 1 - SLO (e.g., 99.9% = 0.1% error budget = 8.76h/year)

## C4 Model Diagrams

### Level 1: System Context
Who uses the system and what external systems does it interact with?

### Level 2: Container
What are the major technical building blocks (apps, databases, queues)?

### Level 3: Component
What are the major components within each container?

### Level 4: Code
Class-level detail (only for critical or complex areas).

## Key Principles

- Start with the simplest architecture that could work
- Make decisions reversible when possible
- Design for failure (everything will fail eventually)
- Optimize for team cognitive load, not technical elegance
- Document decisions, not just outcomes
- Prefer boring technology for critical paths
- Every architectural decision has a cost — make it explicit

## Anti-Patterns

- Resume-driven architecture (microservices because they look impressive)
- Distributed monolith (microservices that must be deployed together)
- Premature optimization (scaling for 1M users when you have 100)
- Golden hammer (using one technology for everything)
- Architecture without validation (no load testing, no failure testing)
- Big upfront design without iteration

## Skill Type

**RIGID** — All architectural decisions must be documented in ADRs. Trade-off analysis is mandatory for significant decisions. Non-functional requirements must be quantified, not described vaguely.
