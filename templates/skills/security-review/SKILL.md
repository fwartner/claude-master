---
name: security-review
description: "Use when reviewing code for security vulnerabilities, implementing authentication or authorization, handling user input, managing secrets, or auditing dependencies for known CVEs"
---

# Security Review

## Purpose

Systematically review code for security vulnerabilities, apply secure coding patterns, and ensure applications follow defense-in-depth principles.

## When to Use

- Reviewing code changes for security issues
- Implementing authentication or authorization
- Handling user-supplied input
- Managing secrets and credentials
- Auditing third-party dependencies
- Preparing for a security assessment

## OWASP Top 10 Checklist (2021)

| # | Category | Key Check |
|---|----------|-----------|
| 1 | **Broken Access Control** | Verify authorization on every endpoint, deny by default |
| 2 | **Cryptographic Failures** | No plaintext secrets, use strong algorithms (AES-256, bcrypt) |
| 3 | **Injection** | Parameterized queries, no string concatenation for SQL/commands |
| 4 | **Insecure Design** | Threat model exists, rate limiting, abuse cases considered |
| 5 | **Security Misconfiguration** | No defaults in production, minimal permissions, error messages leak nothing |
| 6 | **Vulnerable Components** | Dependencies audited, no known CVEs, update policy in place |
| 7 | **Auth Failures** | MFA available, passwords hashed, session management secure |
| 8 | **Data Integrity Failures** | Verify signatures, validate CI/CD pipeline integrity |
| 9 | **Logging Failures** | Log auth events, access control failures, input validation failures |
| 10 | **SSRF** | Validate/allowlist URLs, no internal network access from user input |

See [owasp-checklist.md](./owasp-checklist.md) for detailed vulnerability patterns and code examples.

## Auth Pattern Selection Guide

### JWT (JSON Web Tokens)

**Use when:** stateless APIs, microservices, mobile backends

| Aspect | Guidance |
|--------|----------|
| Signing | RS256 (asymmetric) for multi-service, HS256 for single service |
| Expiry | Access token: 15 minutes max. Refresh token: 7 days max |
| Storage | HttpOnly cookie (web) or secure storage (mobile). Never localStorage |
| Refresh | Rotate refresh tokens on use, invalidate on logout |
| Payload | Minimal claims (sub, exp, iat, roles). No sensitive data |

### Session-Based

**Use when:** traditional web apps, server-rendered pages

| Aspect | Guidance |
|--------|----------|
| Storage | Server-side (Redis, database). Cookie holds session ID only |
| Cookie flags | HttpOnly, Secure, SameSite=Lax (or Strict) |
| CSRF | SameSite cookie + CSRF token for state-changing requests |
| Expiry | Absolute timeout (24h) + idle timeout (30min) |
| Regeneration | New session ID after login (prevent fixation) |

### OAuth2 / OIDC

**Use when:** third-party login, SSO, delegated authorization

- Use Authorization Code flow with PKCE (not Implicit flow)
- Validate ID token signature and claims (iss, aud, exp)
- Store tokens server-side when possible
- Implement proper logout (revoke tokens, clear sessions)

### Passkeys / WebAuthn

**Use when:** passwordless authentication, high-security applications

- Phishing-resistant by design
- Store credential public keys, never private keys
- Support multiple passkeys per account
- Provide account recovery paths

## Input Validation Patterns

### Allow-List Validation

Validate against known-good values, not known-bad:

```python
# Good: allow-list
ALLOWED_SORT_FIELDS = {'name', 'created_at', 'price'}
if sort_field not in ALLOWED_SORT_FIELDS:
    raise ValidationError("Invalid sort field")

# Bad: block-list (always incomplete)
BLOCKED_CHARS = ['<', '>', '"']
```

### Parameterized Queries

Never concatenate user input into queries:

```python
# Good: parameterized
cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))

# Bad: string concatenation (SQL injection)
cursor.execute(f"SELECT * FROM users WHERE id = {user_id}")
```

This applies to all query languages: SQL, NoSQL, LDAP, GraphQL, ORM query builders.

### HTML Sanitization

For user-generated HTML content:

```javascript
// Use DOMPurify for client-side sanitization
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userHtml);

// Or sanitize-html for server-side
const sanitizeHtml = require('sanitize-html');
const clean = sanitizeHtml(userHtml, { allowedTags: ['b', 'i', 'em', 'strong', 'p'] });
```

### File Upload Validation

- Validate MIME type server-side (not just extension)
- Enforce file size limits
- Generate random filenames (never use user-supplied names for storage)
- Store uploads outside the web root
- Scan for malware if accepting from untrusted users

## Secrets Management

### Rules

| Environment | Method |
|-------------|--------|
| Development | `.env` files (git-ignored) |
| CI/CD | Pipeline secrets (GitHub Secrets, GitLab CI vars) |
| Production | Secrets manager (AWS Secrets Manager, Vault, GCP Secret Manager) |

### Never

- Hard-code secrets in source code
- Commit `.env` files to git
- Log secrets (even at debug level)
- Pass secrets as command-line arguments (visible in process lists)
- Use the same secrets across environments

### Rotation

- API keys: rotate every 90 days minimum
- Database passwords: rotate every 90 days
- Encryption keys: rotate annually, support key versioning
- After any suspected compromise: rotate immediately

## Dependency Auditing

### Automated Scanning

```bash
# Node.js
npm audit
npx socket-security audit  # supply-chain analysis

# Python
pip-audit
safety check

# Go
govulncheck ./...

# Rust
cargo audit
```

### Continuous Monitoring

- Enable Dependabot or Renovate for automatic update PRs
- Use Snyk or Socket.dev for deeper supply-chain analysis
- Pin dependency versions (lock files committed)
- Review changelogs before updating major versions

## Security Headers

| Header | Value | Purpose |
|--------|-------|---------|
| `Content-Security-Policy` | `default-src 'self'` (customize per app) | Prevents XSS, data injection |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` | Forces HTTPS |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME sniffing |
| `X-Frame-Options` | `DENY` or `SAMEORIGIN` | Prevents clickjacking |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controls referer leakage |
| `Permissions-Policy` | Disable unused APIs | Limits browser feature access |

### CORS

- Never use `Access-Control-Allow-Origin: *` with credentials
- Allowlist specific origins
- Restrict allowed methods and headers to what is needed
- Set `Access-Control-Max-Age` to cache preflight responses

## Threat Modeling (STRIDE)

For new features or significant changes, walk through each category:

| Threat | Question |
|--------|----------|
| **Spoofing** | Can an attacker pretend to be someone else? |
| **Tampering** | Can data be modified without detection? |
| **Repudiation** | Can a user deny performing an action? (Is it logged?) |
| **Information Disclosure** | Can sensitive data leak through errors, logs, or side channels? |
| **Denial of Service** | Can the system be overwhelmed? Rate limits in place? |
| **Elevation of Privilege** | Can a user gain permissions they should not have? |

For each identified threat:
1. Document the threat and attack vector
2. Assess likelihood and impact
3. Define mitigations
4. Verify mitigations are implemented and tested
