---
name: senior-backend
description: When the user needs API design, microservices architecture, event-driven systems, database integration, caching strategies, or backend observability.
---

# Senior Backend Engineer

## Overview

Design and implement robust, scalable backend systems with a focus on API design, service architecture, data management, and operational excellence. This skill covers RESTful and GraphQL API patterns, message-driven architecture, caching strategies, rate limiting, health checks, and full observability with OpenTelemetry.

## Process

### Phase 1: API Design
1. Define resource models and relationships
2. Design endpoint structure (REST) or schema (GraphQL)
3. Establish authentication and authorization strategy
4. Define rate limiting and throttling policies
5. Create API documentation (OpenAPI/GraphQL schema)

### Phase 2: Implementation
1. Set up project structure with clear layering
2. Implement data access layer (repositories/DAOs)
3. Build service layer with business logic
4. Create API controllers/resolvers
5. Add middleware (auth, logging, error handling, CORS)
6. Implement caching strategy

### Phase 3: Hardening
1. Add comprehensive error handling
2. Implement health checks and readiness probes
3. Set up observability (traces, metrics, logs)
4. Load test critical paths
5. Document runbooks for operational scenarios

## RESTful API Patterns

### URL Structure
```
GET    /api/v1/users              # List users (paginated)
GET    /api/v1/users/:id          # Get single user
POST   /api/v1/users              # Create user
PUT    /api/v1/users/:id          # Full update
PATCH  /api/v1/users/:id          # Partial update
DELETE /api/v1/users/:id          # Delete user

# Nested resources
GET    /api/v1/users/:id/orders   # List user's orders

# Actions (non-CRUD)
POST   /api/v1/users/:id/activate # State transition
POST   /api/v1/reports/generate   # Process trigger
```

### Response Format
```json
{
  "data": { "id": "123", "name": "Alice", "email": "alice@example.com" },
  "meta": { "requestId": "req_abc123" }
}

// Collection response
{
  "data": [{ "id": "123", "name": "Alice" }],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "totalCount": 150,
    "totalPages": 8
  }
}

// Error response
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "email", "message": "Must be a valid email address" }
    ]
  }
}
```

### HTTP Status Codes
| Code | Meaning | When |
|---|---|---|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST creating resource |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Missing or invalid auth |
| 403 | Forbidden | Auth valid but insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Duplicate or state conflict |
| 422 | Unprocessable Entity | Semantically invalid input |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server failure |

## GraphQL Design

### Schema Design Principles
```graphql
type Query {
  user(id: ID!): User
  users(filter: UserFilter, pagination: PaginationInput): UserConnection!
}

type Mutation {
  createUser(input: CreateUserInput!): CreateUserPayload!
  updateUser(id: ID!, input: UpdateUserInput!): UpdateUserPayload!
}

# Relay-style pagination
type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

# Input/Payload pattern for mutations
input CreateUserInput {
  name: String!
  email: String!
}

type CreateUserPayload {
  user: User
  errors: [UserError!]
}
```

### GraphQL Anti-Patterns
- N+1 queries: use DataLoader for batching
- Unbounded queries: enforce query depth and complexity limits
- Over-fetching in resolvers: select only requested fields

## Event-Driven Architecture

### Message Queue Patterns
| Pattern | Use Case | Example |
|---|---|---|
| Pub/Sub | Broadcast events to multiple consumers | User registered -> email, analytics, CRM |
| Work Queue | Distribute tasks across workers | Image processing, PDF generation |
| Request/Reply | Async request with response | Price calculation service |
| Dead Letter | Handle failed messages | Retry policy exceeded |

### Event Schema
```json
{
  "eventId": "evt_abc123",
  "eventType": "user.created",
  "timestamp": "2025-01-15T10:30:00Z",
  "version": "1.0",
  "source": "user-service",
  "data": {
    "userId": "usr_123",
    "email": "alice@example.com"
  },
  "metadata": {
    "correlationId": "corr_xyz789",
    "causationId": "cmd_def456"
  }
}
```

### CQRS (Command Query Responsibility Segregation)
- **Command side**: Write-optimized models, event sourcing optional
- **Query side**: Read-optimized projections, denormalized for performance
- **Sync**: Events from command side projected to query side
- Use when: read and write patterns differ significantly

## Caching Strategies

| Strategy | Description | Use Case |
|---|---|---|
| Cache-Aside | App checks cache, falls back to DB | General purpose |
| Write-Through | Write to cache and DB simultaneously | Strong consistency |
| Write-Behind | Write to cache, async write to DB | High write throughput |
| Read-Through | Cache loads from DB on miss | Transparent caching |

### Redis Caching Patterns
```
# Key naming convention
{service}:{entity}:{id}           → user-svc:user:123
{service}:{entity}:list:{hash}    → user-svc:user:list:abc123
{service}:{entity}:{id}:{field}   → user-svc:user:123:profile

# TTL guidelines
- User session: 24h
- API response cache: 5-15 min
- Configuration: 1h
- Static reference data: 24h
- Rate limit counters: window duration
```

### CDN Caching Headers
```
Cache-Control: public, max-age=3600, s-maxage=86400, stale-while-revalidate=60
ETag: "abc123"
Vary: Accept-Encoding, Authorization
```

## Rate Limiting

### Algorithms
- **Fixed Window**: Simple, but burst at window boundaries
- **Sliding Window**: Smooths burst, more memory
- **Token Bucket**: Allows controlled bursts, industry standard
- **Leaky Bucket**: Constant output rate, good for APIs

### Implementation
```
Rate limit headers:
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1673784000
Retry-After: 60
```

## Health Checks

```json
// GET /health — lightweight liveness check
{ "status": "healthy" }

// GET /health/ready — readiness with dependency checks
{
  "status": "healthy",
  "checks": {
    "database": { "status": "healthy", "latency": "5ms" },
    "redis": { "status": "healthy", "latency": "2ms" },
    "queue": { "status": "healthy", "latency": "8ms" }
  },
  "uptime": "72h15m",
  "version": "1.4.2"
}
```

## Observability (OpenTelemetry)

### Three Pillars
1. **Traces**: Distributed request tracing across services
2. **Metrics**: Counters, histograms, gauges (RED method)
3. **Logs**: Structured JSON logs with trace correlation

### RED Method Metrics
- **Rate**: requests per second
- **Errors**: error rate per second
- **Duration**: request latency distribution (p50, p95, p99)

### Structured Logging
```json
{
  "timestamp": "2025-01-15T10:30:00.123Z",
  "level": "info",
  "message": "User created",
  "service": "user-service",
  "traceId": "abc123",
  "spanId": "def456",
  "userId": "usr_123",
  "duration": 45
}
```

## Key Principles

- API versioning from day one (`/v1/`)
- Input validation at the edge (Zod, Joi, class-validator)
- Idempotency keys for non-GET endpoints
- Graceful shutdown (drain connections, finish in-flight requests)
- Circuit breaker for external service calls
- Database migrations versioned and reversible
- Secrets in environment variables, never in code

## Anti-Patterns

- Exposing database IDs directly (use UUIDs or prefixed IDs)
- Synchronous calls to external services in request path
- N+1 query patterns (use eager loading or DataLoader)
- Catching and swallowing errors silently
- Shared mutable state across request handlers
- Skipping input validation ("the frontend validates")
- Monolithic error handling (generic 500 for everything)

## Skill Type

**RIGID** — The three-phase process (design, implement, harden) is mandatory. All APIs must include health checks, structured logging, and error handling. Observability is not optional for production services.
