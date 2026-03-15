# OWASP Top 10 (2021) -- Detailed Checklist

Reference document with vulnerability patterns, testing approaches, and secure code examples.

## 1. Broken Access Control (A01)

### How to Test
- Access resources belonging to other users by changing IDs in URLs/parameters
- Try accessing admin endpoints as a regular user
- Test CORS configuration for overly permissive origins
- Verify that API endpoints enforce authorization, not just authentication
- Test for IDOR (Insecure Direct Object Reference) by enumerating IDs

### Vulnerable Pattern
```javascript
// No authorization check -- any authenticated user can access any order
app.get('/api/orders/:id', authenticate, async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.json(order);
});
```

### Secure Pattern
```javascript
// Verify the order belongs to the requesting user
app.get('/api/orders/:id', authenticate, async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    userId: req.user.id  // scoped to authenticated user
  });
  if (!order) return res.status(404).json({ error: 'Not found' });
  res.json(order);
});
```

### Tools
- Burp Suite (manual testing)
- OWASP ZAP (automated scanning)
- Custom scripts to test authorization boundaries

---

## 2. Cryptographic Failures (A02)

### How to Test
- Check for data transmitted over HTTP (not HTTPS)
- Look for weak hashing algorithms (MD5, SHA1 for passwords)
- Check for hard-coded encryption keys
- Verify sensitive data is encrypted at rest
- Check TLS configuration (minimum TLS 1.2)

### Vulnerable Pattern
```python
# MD5 is not suitable for password hashing
import hashlib
password_hash = hashlib.md5(password.encode()).hexdigest()
```

### Secure Pattern
```python
# Use bcrypt with a cost factor
import bcrypt
password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12))

# Verify
bcrypt.checkpw(submitted_password.encode(), stored_hash)
```

### Tools
- testssl.sh (TLS configuration)
- SSLyze (SSL/TLS analysis)
- grep for weak algorithms (MD5, SHA1, DES, RC4)

---

## 3. Injection (A03)

### How to Test
- Submit SQL metacharacters in inputs (`' OR 1=1 --`)
- Test for NoSQL injection (`{"$gt": ""}`)
- Test command injection (`;ls`, `$(whoami)`)
- Test LDAP injection, XPath injection
- Test template injection (`{{7*7}}`)

### Vulnerable Pattern
```javascript
// SQL injection via string concatenation
const query = `SELECT * FROM users WHERE name = '${req.query.name}'`;
db.query(query);

// Command injection
const { exec } = require('child_process');
exec(`ping ${req.query.host}`);
```

### Secure Pattern
```javascript
// Parameterized query
const query = 'SELECT * FROM users WHERE name = $1';
db.query(query, [req.query.name]);

// Safe command execution with argument array (no shell)
const { execFile } = require('child_process');
execFile('ping', ['-c', '4', validatedHost]);
```

### Tools
- SQLMap (SQL injection)
- Commix (command injection)
- OWASP ZAP (general injection scanning)
- ESLint security plugins (static analysis)

---

## 4. Insecure Design (A04)

### How to Test
- Review for missing rate limiting on sensitive endpoints (login, registration, password reset)
- Check for missing account lockout after failed attempts
- Look for business logic flaws (negative quantities, price manipulation)
- Verify abuse cases are documented and mitigated

### Vulnerable Pattern
```javascript
// No rate limiting on login
app.post('/login', async (req, res) => {
  const user = await User.findByEmail(req.body.email);
  if (user && await bcrypt.compare(req.body.password, user.hash)) {
    return res.json({ token: createToken(user) });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});
```

### Secure Pattern
```javascript
// Rate limited login with account lockout
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });

app.post('/login', loginLimiter, async (req, res) => {
  const user = await User.findByEmail(req.body.email);
  if (!user || user.lockedUntil > Date.now()) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  if (await bcrypt.compare(req.body.password, user.hash)) {
    await user.resetFailedAttempts();
    return res.json({ token: createToken(user) });
  }
  await user.incrementFailedAttempts(); // locks after 5 failures
  res.status(401).json({ error: 'Invalid credentials' });
});
```

### Tools
- Threat modeling (STRIDE)
- Architecture review
- Abuse case analysis

---

## 5. Security Misconfiguration (A05)

### How to Test
- Check for default credentials on admin panels, databases, cloud services
- Verify error pages do not expose stack traces or internal details
- Check for unnecessary HTTP methods enabled (TRACE, PUT, DELETE)
- Verify directory listing is disabled
- Check cloud storage permissions (S3 buckets, GCS)

### Vulnerable Pattern
```javascript
// Stack trace exposed to users
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
    stack: err.stack  // leaks internal details
  });
});
```

### Secure Pattern
```javascript
// Generic error in production, detailed in development
app.use((err, req, res, next) => {
  console.error(err); // log full error server-side
  res.status(500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message
  });
});
```

### Tools
- ScoutSuite (cloud misconfiguration)
- Prowler (AWS security audit)
- nikto (web server misconfiguration)
- Security headers check (securityheaders.com)

---

## 6. Vulnerable and Outdated Components (A06)

### How to Test
- Run `npm audit` / `pip-audit` / `cargo audit` / `govulncheck`
- Check for components with known CVEs
- Verify lock files are committed
- Review for abandoned/unmaintained dependencies

### Vulnerable Pattern
```json
// package.json with loose versioning and known vulnerable package
{
  "dependencies": {
    "lodash": "*",
    "minimist": "^0.0.8"
  }
}
```

### Secure Pattern
```json
// Pinned versions, maintained packages
{
  "dependencies": {
    "lodash": "4.17.21",
    "minimist": "1.2.8"
  }
}
```

### Tools
- npm audit / yarn audit / pnpm audit
- Snyk (multi-language)
- Socket.dev (supply-chain)
- Dependabot / Renovate (automated updates)
- OWASP Dependency-Check

---

## 7. Identification and Authentication Failures (A07)

### How to Test
- Test for weak password policies (min length, complexity)
- Check for credential stuffing protection
- Verify session tokens are invalidated on logout
- Test for session fixation
- Check password reset flow for information leakage

### Vulnerable Pattern
```python
# Weak password requirements, no brute-force protection
def register(username, password):
    if len(password) < 4:  # too short
        raise ValueError("Password too short")
    user = User(username=username, password=md5(password))  # weak hash
    user.save()
```

### Secure Pattern
```python
# Strong requirements, proper hashing
import bcrypt
from zxcvbn import zxcvbn

def register(username, password):
    result = zxcvbn(password)
    if result['score'] < 3:
        raise ValueError("Password is too weak: " + result['feedback']['warning'])
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12))
    user = User(username=username, password_hash=hashed)
    user.save()
```

### Tools
- Hydra (brute-force testing)
- Burp Suite (session analysis)
- zxcvbn (password strength estimation)

---

## 8. Software and Data Integrity Failures (A08)

### How to Test
- Verify CI/CD pipelines are protected (signed commits, protected branches)
- Check for unsigned or unverified software updates
- Review deserialization of untrusted data
- Verify integrity of CDN-loaded resources (SRI hashes)

### Vulnerable Pattern
```html
<!-- Loading script from CDN without integrity check -->
<script src="https://cdn.example.com/lib.js"></script>
```

### Secure Pattern
```html
<!-- Subresource Integrity (SRI) hash verification -->
<script src="https://cdn.example.com/lib.js"
  integrity="sha384-abc123..."
  crossorigin="anonymous"></script>
```

### Tools
- npm audit signatures
- Sigstore / cosign (container signing)
- git commit signing (GPG/SSH)

---

## 9. Security Logging and Monitoring Failures (A09)

### How to Test
- Verify that login attempts (success and failure) are logged
- Check that access control failures are logged
- Verify that input validation failures are logged
- Confirm logs do not contain sensitive data (passwords, tokens, PII)
- Check for alerting on suspicious patterns

### Vulnerable Pattern
```javascript
// No logging of security events
app.post('/login', async (req, res) => {
  const user = await authenticate(req.body);
  if (!user) return res.status(401).send();
  res.json({ token: createToken(user) });
});
```

### Secure Pattern
```javascript
// Log security-relevant events
app.post('/login', async (req, res) => {
  const user = await authenticate(req.body);
  if (!user) {
    logger.warn('login_failed', {
      email: req.body.email,  // log identifier, NOT the password
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
    return res.status(401).send();
  }
  logger.info('login_success', { userId: user.id, ip: req.ip });
  res.json({ token: createToken(user) });
});
```

### Tools
- ELK Stack / Grafana Loki (log aggregation)
- SIEM solutions (alerting)
- Custom audit log review

---

## 10. Server-Side Request Forgery -- SSRF (A10)

### How to Test
- Submit internal URLs (http://127.0.0.1, http://169.254.169.254)
- Test with DNS rebinding
- Test URL schemes (file://, gopher://)
- Check for open redirects that chain into SSRF

### Vulnerable Pattern
```python
# User-controlled URL fetched server-side without validation
import requests

@app.route('/proxy')
def proxy():
    url = request.args.get('url')
    response = requests.get(url)  # fetches any URL including internal
    return response.text
```

### Secure Pattern
```python
# Validate URL against allowlist, block internal addresses
from urllib.parse import urlparse
import ipaddress

ALLOWED_HOSTS = {'api.example.com', 'cdn.example.com'}

@app.route('/proxy')
def proxy():
    url = request.args.get('url')
    parsed = urlparse(url)

    if parsed.hostname not in ALLOWED_HOSTS:
        abort(400, 'Host not allowed')

    if parsed.scheme not in ('http', 'https'):
        abort(400, 'Scheme not allowed')

    # Resolve and check for internal IPs
    ip = socket.gethostbyname(parsed.hostname)
    if ipaddress.ip_address(ip).is_private:
        abort(400, 'Internal addresses not allowed')

    response = requests.get(url, timeout=5)
    return response.text
```

### Tools
- SSRFmap
- Burp Suite Collaborator
- Custom payloads targeting cloud metadata endpoints
