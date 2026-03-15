---
name: api-design
description: Use when designing API endpoints, defining request/response schemas, or generating OpenAPI specifications for REST, GraphQL, or tRPC APIs
---

# API Design

## Overview

Structured API endpoint design through guided discovery. Produces consistent, well-documented API designs with OpenAPI/Swagger specifications.

**Announce at start:** "I'm using the api-design skill to design the API."

## Checklist

1. **Discovery** — understand resources, consumers, constraints
2. **Design endpoints** — define routes, methods, schemas
3. **Review** — present endpoint by endpoint, get approval
4. **Generate spec** — produce OpenAPI/Swagger YAML
5. **Save** — write to `docs/api/YYYY-MM-DD-<api-name>.yaml`

## Phase 1: Discovery

Ask these questions ONE AT A TIME:

**Resources:**
- What entities/resources does this API manage?
- What are the relationships between them?
- What operations are needed for each? (CRUD, search, batch, etc.)

**Consumers:**
- Who will consume this API? (frontend, mobile, third-party, internal services)
- What authentication/authorization is needed?
- What rate limits or quotas apply?

**Constraints:**
- REST, GraphQL, or tRPC?
- Versioning strategy? (URL path, header, query param)
- Pagination approach? (cursor, offset, keyset)
- Existing API conventions in the codebase?

## Phase 2: Design Endpoints

For each endpoint, define:

```markdown
### [METHOD] /api/v1/[resource]

**Purpose:** [what this endpoint does]

**Request:**
- Headers: `Authorization: Bearer <token>`
- Query params: `?page=1&limit=20&sort=created_at:desc`
- Body:
  ```json
  {
    "field": "type — description"
  }
  ```

**Response (200):**
```json
{
  "data": [...],
  "meta": { "total": 100, "page": 1, "limit": 20 }
}
```

**Error Responses:**
| Status | Code | Description |
|--------|------|-------------|
| 400 | VALIDATION_ERROR | Invalid request body |
| 401 | UNAUTHORIZED | Missing or invalid token |
| 404 | NOT_FOUND | Resource doesn't exist |
| 409 | CONFLICT | Resource already exists |

**Authorization:** [who can access this]
```

## Design Principles

- **Consistent naming** — plural nouns for collections (`/users`, not `/user`)
- **Proper HTTP methods** — GET (read), POST (create), PUT (replace), PATCH (update), DELETE (remove)
- **Proper status codes** — 200 (OK), 201 (Created), 204 (No Content), 400, 401, 403, 404, 409, 422, 500
- **Consistent error format** — same error shape across all endpoints
- **Pagination by default** — all list endpoints paginated
- **Filtering and sorting** — query params for list endpoints
- **Idempotency** — PUT and DELETE are idempotent
- **HATEOAS** — include links for discoverability (when appropriate)

## Phase 3: Generate OpenAPI Spec

```yaml
openapi: 3.1.0
info:
  title: [API Name]
  version: 1.0.0
  description: [API description]

servers:
  - url: http://localhost:3000/api/v1
    description: Development
  - url: https://api.example.com/v1
    description: Production

paths:
  /resource:
    get:
      summary: List resources
      parameters: [...]
      responses: [...]
    post:
      summary: Create resource
      requestBody: [...]
      responses: [...]

components:
  schemas: [...]
  securitySchemes: [...]
```

## After Approval

- Save OpenAPI spec to `docs/api/YYYY-MM-DD-<api-name>.yaml`
- If implementation follows, invoke the planning skill
- Consider generating client SDK stubs

## Key Principles

- **Design first, implement second** — API design drives implementation
- **Consumer-centric** — design from the consumer's perspective
- **Consistent** — same patterns across all endpoints
- **Documented** — every endpoint, parameter, and error documented
- **Versioned** — plan for API evolution from the start

## Verification Gate

Before claiming the API design is complete:
1. VERIFY all endpoints have request/response schemas
2. VERIFY all error responses are documented
3. VERIFY authentication is specified for each endpoint
4. VERIFY the OpenAPI spec is valid YAML
5. VERIFY user has approved each endpoint
