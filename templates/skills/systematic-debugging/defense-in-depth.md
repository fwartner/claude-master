# Defense in Depth

Reference document for the systematic-debugging skill. Describes layered validation patterns that prevent bugs from reaching production and limit blast radius when they do.

---

## The 4-Layer Validation Pattern

Every data flow through your system should pass through four layers of validation. Each layer is independent and assumes the previous layers might have failed. No layer trusts input from any source, including other layers.

```
┌─────────────────────────────────────────┐
│  Layer 1: INPUT VALIDATION (Boundary)   │
│  Reject malformed data at the gate      │
├─────────────────────────────────────────┤
│  Layer 2: BUSINESS LOGIC (Domain)       │
│  Enforce domain rules and invariants    │
├─────────────────────────────────────────┤
│  Layer 3: DATA ACCESS (Persistence)     │
│  Protect data integrity at storage      │
├─────────────────────────────────────────┤
│  Layer 4: OUTPUT VALIDATION (Response)  │
│  Verify outgoing data is correct/safe   │
└─────────────────────────────────────────┘
```

---

### Layer 1: Input Validation (Boundary)

**Purpose:** Reject obviously invalid data before it enters the system. This is the first line of defense.

**Where:** API endpoints, form handlers, CLI argument parsers, message consumers, file parsers.

**What to validate:**
- **Type:** Is the data the right type? (string, number, array, object)
- **Presence:** Are required fields present?
- **Format:** Does the data match the expected format? (email, UUID, date, URL)
- **Range:** Are numbers within acceptable bounds?
- **Length:** Are strings and arrays within size limits?
- **Character set:** Does text contain only allowed characters?
- **Structure:** Does the object have the expected shape?

**Principles:**
- Validate BEFORE any processing occurs
- Return clear, actionable error messages
- Log invalid input for monitoring (but redact sensitive data)
- Use allowlists over denylists (accept known-good, not reject known-bad)
- Parse, don't validate: convert raw input into typed domain objects

**Example pattern:**
```
def handle_request(raw_input):
    # Layer 1: Validate and parse
    validated = validate_and_parse(raw_input)  # Throws on invalid

    # Now 'validated' is a typed domain object, not raw data
    result = process(validated)
    return result
```

---

### Layer 2: Business Logic Validation (Domain)

**Purpose:** Enforce domain rules, business constraints, and invariants that go beyond format validation.

**Where:** Domain models, service layer, use case handlers.

**What to validate:**
- **Business rules:** Can this user perform this action? Is this transition allowed?
- **Invariants:** Are domain object invariants maintained? (e.g., order total matches line items)
- **State transitions:** Is this state change valid? (e.g., can't ship an unpaid order)
- **Cross-field validation:** Do fields have consistent values? (e.g., end date after start date)
- **Authorization:** Does the user have permission for this specific resource?
- **Idempotency:** Has this operation already been performed?

**Principles:**
- Domain validation belongs in domain objects, not controllers or utilities
- Enforce invariants in constructors and mutation methods
- Make illegal states unrepresentable through types where possible
- Use the type system to prevent invalid combinations

**Example pattern:**
```
class Order:
    def ship(self):
        if self.status != "paid":
            raise DomainError("Cannot ship unpaid order")
        if not self.items:
            raise DomainError("Cannot ship empty order")
        if not self.shipping_address:
            raise DomainError("Cannot ship without address")

        self.status = "shipped"
        self.shipped_at = now()
```

---

### Layer 3: Data Access Validation (Persistence)

**Purpose:** Protect data integrity at the storage layer. This is the last line of defense before data is persisted.

**Where:** Database schemas, ORM models, repository implementations.

**What to validate:**
- **Constraints:** NOT NULL, UNIQUE, FOREIGN KEY, CHECK constraints
- **Types:** Column types match expected data types
- **Referential integrity:** Foreign keys point to existing records
- **Uniqueness:** Business-unique fields are enforced at DB level
- **Concurrency:** Optimistic locking, version columns, serializable transactions
- **Data size:** Column length limits, row size limits

**Principles:**
- Database constraints are the safety net, not the primary validation
- Always use foreign keys - they catch bugs that application code misses
- Use database transactions for operations that must be atomic
- Implement optimistic locking for concurrent updates
- Schema migrations should be backward compatible

**Example pattern:**
```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'paid', 'shipped', 'delivered')),
    total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    version INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT order_must_have_items CHECK (
        status = 'draft' OR EXISTS (
            SELECT 1 FROM order_items WHERE order_id = orders.id
        )
    )
);
```

---

### Layer 4: Output Validation (Response)

**Purpose:** Verify that outgoing data is correct, complete, and safe before sending it to the client or downstream system.

**Where:** Response serializers, API response builders, template renderers, event publishers.

**What to validate:**
- **Completeness:** Are all required response fields present?
- **Sanitization:** Is user-generated content escaped/sanitized?
- **Sensitive data removal:** Are internal fields, passwords, tokens stripped?
- **Contract compliance:** Does the response match the API schema?
- **Encoding:** Is the response properly encoded (UTF-8, JSON)?
- **Size:** Is the response within acceptable size limits?

**Principles:**
- Never expose internal error details to external clients
- Strip sensitive fields from responses (use allowlist serialization)
- Validate against API schema before sending
- Log the response (redacted) for debugging

**Example pattern:**
```
class UserSerializer:
    ALLOWED_FIELDS = ["id", "name", "email", "created_at"]

    def serialize(self, user):
        result = {}
        for field in self.ALLOWED_FIELDS:
            value = getattr(user, field)
            result[field] = self.sanitize(field, value)

        # Verify completeness
        assert all(f in result for f in self.ALLOWED_FIELDS)
        return result
```

---

## Fail-Safe Defaults

When in doubt, the system should fail into a secure, safe state. Never fail into an open or permissive state.

### Principles

| Situation | Fail-Safe Default | Dangerous Default |
|-----------|-------------------|-------------------|
| Authorization check fails | Deny access | Grant access |
| Config value missing | Use restrictive default | Use permissive default |
| Feature flag unknown | Feature disabled | Feature enabled |
| Rate limit check errors | Reject request | Allow request |
| Input validation uncertain | Reject input | Accept input |
| SSL certificate invalid | Refuse connection | Connect anyway |
| Session lookup fails | Treat as unauthenticated | Treat as authenticated |
| Timeout exceeded | Abort and return error | Continue and hope |

### Implementation Pattern

```
# BAD: Fail-open
def is_authorized(user, resource):
    try:
        return check_permissions(user, resource)
    except PermissionServiceError:
        return True  # "Let them through, service is down"

# GOOD: Fail-closed
def is_authorized(user, resource):
    try:
        return check_permissions(user, resource)
    except PermissionServiceError:
        log.error("Permission service unavailable, denying access")
        return False
```

---

## Principle of Least Privilege

Every component should have exactly the permissions it needs and no more. This limits the blast radius when something goes wrong.

### Application

| Component | Least Privilege | Over-Privileged |
|-----------|----------------|-----------------|
| Database user | SELECT/INSERT on specific tables | Full admin on all databases |
| API key | Scoped to specific endpoints | Full API access |
| Service account | Access to its own resources | Access to all services |
| File permissions | Read-only where possible | Read-write-execute |
| Environment variables | Only what the service needs | All secrets from vault |
| Network access | Specific ports and hosts | All outbound traffic |

### Implementation Checklist

- [ ] Database connections use least-privilege credentials
- [ ] API keys are scoped to minimum required permissions
- [ ] File system access is limited to required directories
- [ ] Network access is restricted to known endpoints
- [ ] Secrets are accessible only to services that need them
- [ ] Admin interfaces require separate authentication
- [ ] Temporary elevated permissions expire automatically

---

## Defense Against Cascading Failures

When one component fails, prevent the failure from propagating through the system.

### Patterns

#### 1. Circuit Breaker

Monitor calls to an external dependency. When failures exceed a threshold, stop calling and fail fast instead of waiting for timeouts.

```
States:
  CLOSED  → Normal operation, calls pass through
  OPEN    → Dependency is down, fail immediately (don't even try)
  HALF-OPEN → After cooldown, allow one test call to check recovery

Transitions:
  CLOSED → OPEN:     When failure count exceeds threshold (e.g., 5 failures in 60 seconds)
  OPEN → HALF-OPEN:  After cooldown period (e.g., 30 seconds)
  HALF-OPEN → CLOSED: If test call succeeds
  HALF-OPEN → OPEN:   If test call fails
```

#### 2. Bulkhead

Isolate components so that a failure in one doesn't exhaust resources for others.

- Separate thread pools for different dependencies
- Separate connection pools for different databases
- Separate rate limits for different API consumers
- Separate deployment units for different services

#### 3. Timeout + Retry with Backoff

Never wait indefinitely. Always set timeouts. Retry with exponential backoff.

```
Attempt 1: immediate
Attempt 2: wait 1 second
Attempt 3: wait 2 seconds
Attempt 4: wait 4 seconds
Attempt 5: give up, return error

Add jitter: multiply wait by random(0.5, 1.5) to prevent thundering herd
```

#### 4. Graceful Degradation

When a non-critical dependency fails, continue with reduced functionality rather than total failure.

| Failing Component | Graceful Degradation |
|-------------------|---------------------|
| Recommendation engine | Show popular items instead |
| Search service | Show browse/category navigation |
| Analytics service | Skip tracking, serve the page |
| Cache | Fall back to database (slower but works) |
| Email service | Queue for later delivery |
| Image CDN | Show placeholder images |

#### 5. Health Checks and Readiness Probes

Components should report their health status so that the system can route around failures.

- **Liveness:** "Am I running?" (restart if no)
- **Readiness:** "Can I serve traffic?" (remove from load balancer if no)
- **Dependency health:** "Are my dependencies available?" (degrade if no)

---

## Putting It All Together

Defense in depth is not about any single technique. It's about layering multiple defenses so that when one fails (and it will), the next layer catches the problem.

```
Request arrives
    │
    ▼
[Layer 1: Input Validation] → Reject malformed data
    │
    ▼
[Layer 2: Business Rules] → Enforce domain constraints
    │
    ▼
[Layer 3: Data Integrity] → Database constraints catch remaining issues
    │
    ▼
[Layer 4: Output Validation] → Strip sensitive data, verify response
    │
    ▼
[Circuit Breaker] → Protect against dependency failures
    │
    ▼
[Fail-Safe Defaults] → When uncertain, fail safely
    │
    ▼
Response sent
```

Each layer assumes the previous layers might have failed. Each layer validates independently. No layer trusts its input, regardless of source.
