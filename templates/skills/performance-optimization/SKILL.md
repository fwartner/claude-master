---
name: performance-optimization
description: "Use when optimizing application performance, reducing load times, improving database queries, meeting performance budgets, or diagnosing bottlenecks in web applications or APIs"
---

# Performance Optimization

## Purpose

Systematically identify and resolve performance bottlenecks using measurement-driven methodology, avoiding premature optimization and speculation.

## When to Use

- Application load times exceed acceptable thresholds
- Database queries are slow or causing timeouts
- Bundle size is too large
- Web Vitals scores are poor
- Users report sluggish interactions
- Preparing for increased traffic or scale

## Profiling Methodology

Follow this cycle for every optimization. Never skip a step.

### 1. MEASURE -- Establish Baseline

Capture real metrics before changing anything:

```bash
# Web: Lighthouse CI
npx lighthouse https://your-app.com --output=json --output-path=baseline.json

# API: load test with k6
k6 run --out json=baseline.json loadtest.js

# Database: slow query log
# PostgreSQL: SET log_min_duration_statement = 100;  -- log queries > 100ms
```

Record these numbers. They are the baseline against which improvement is measured.

### 2. IDENTIFY -- Find the Actual Bottleneck

Use profiling tools to find WHERE time is spent. Do not guess.

| Layer | Tool |
|-------|------|
| Frontend rendering | React DevTools Profiler, Chrome Performance tab |
| Network | Chrome Network tab, WebPageTest |
| JavaScript | Chrome Performance tab, `console.time()` |
| Node.js server | `--prof` flag, clinic.js, 0x |
| Database | `EXPLAIN ANALYZE`, pg_stat_statements, slow query log |
| Memory | Chrome Memory tab, heapdump |

The bottleneck is almost never where you assume it is. Measure first.

### 3. OPTIMIZE -- Fix the Identified Bottleneck

Apply the targeted fix. Change ONE thing at a time.

### 4. VERIFY -- Measure Again

Re-run the exact same measurement from step 1. Compare:

- Did the metric improve?
- By how much?
- Did any other metrics regress?

If improvement is not measurable, revert the change. Optimization that cannot be measured is not optimization.

## Caching Strategy

### Cache Selection Guide

| Cache Type | Use When | TTL Guidance |
|------------|----------|--------------|
| **In-memory** (LRU) | Single-instance app, hot data, computed values | Seconds to minutes |
| **Redis / Memcached** | Multi-instance, shared cache, sessions | Minutes to hours |
| **CDN** | Static assets, public pages, API responses | Hours to days |
| **Browser** | Repeat visits, static resources | Days to months (versioned) |

### Cache-Control Headers

```
# Immutable assets (hashed filenames)
Cache-Control: public, max-age=31536000, immutable

# API responses (cacheable but must revalidate)
Cache-Control: public, max-age=0, must-revalidate
ETag: "abc123"

# Private user data
Cache-Control: private, no-store
```

### Stale-While-Revalidate

Serve stale content immediately while refreshing in the background:

```
Cache-Control: public, max-age=60, stale-while-revalidate=300
```

- User gets a fast response (cached)
- Cache refreshes asynchronously
- Best for data that changes frequently but tolerates brief staleness

### Cache Invalidation

The two hard problems: cache invalidation and naming things.

- **Time-based**: set TTL and accept staleness within that window
- **Event-based**: invalidate on write (publish event on mutation)
- **Version-based**: include version in cache key (change key = new cache)
- Never cache without a defined invalidation strategy

## Bundle Optimization

### Tree Shaking

Ensure unused code is eliminated:

- Use ES modules (`import/export`), not CommonJS (`require`)
- Avoid side-effect-heavy imports
- Mark packages as `sideEffects: false` in package.json when safe
- Verify with bundle analyzer that dead code is removed

### Code Splitting

Split code so users download only what they need:

```javascript
// Route-based splitting (most impact)
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Settings = React.lazy(() => import('./pages/Settings'));

// Feature-based splitting
const ChartLibrary = React.lazy(() => import('./components/Chart'));
```

### Dynamic Imports

Load heavy libraries only when needed:

```javascript
// Load PDF library only when user clicks "Export PDF"
async function exportPDF(data) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  // ...
}
```

### Bundle Analysis

```bash
# Webpack
npx webpack-bundle-analyzer stats.json

# Vite
npx vite-bundle-visualizer

# Next.js
ANALYZE=true next build
```

Look for:
- Duplicated dependencies (same library in multiple chunks)
- Large libraries used for small features
- Moment.js locale data (replace with day.js or date-fns)
- Polyfills for APIs you do not need to support

See [performance-budgets.md](./performance-budgets.md) for specific size targets.

## Database Query Tuning

### Index Optimization

Add indexes based on actual query patterns (check slow query log):

```sql
-- Find missing indexes (PostgreSQL)
SELECT schemaname, tablename, seq_scan, idx_scan
FROM pg_stat_user_tables
WHERE seq_scan > idx_scan
ORDER BY seq_scan DESC;
```

Rules:
- Index columns used in WHERE, JOIN, and ORDER BY
- Composite indexes: equality columns first, range columns last
- Remove unused indexes (they slow writes)
- Partial indexes for filtered queries

### Query Plan Analysis

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM orders WHERE user_id = 123 AND status = 'active';
```

Red flags:
- **Seq Scan** on large tables (add index)
- **Nested Loop** with many iterations (restructure query or add index)
- **Sort** with high memory (add index matching ORDER BY)
- **Actual rows >> estimated rows** (run ANALYZE to update statistics)

### Connection Pooling

- Application should never open raw database connections
- Use PgBouncer, pgpool, or ORM-level pooling
- Pool size formula: `connections = (cores * 2) + effective_spindle_count`
- Monitor active vs idle connections

### Read Replicas

Offload read-heavy queries to replicas:
- Analytics and reporting queries
- Search and filtering
- Dashboard aggregations
- Be aware of replication lag for consistency-sensitive reads

### Materialized Views

Pre-compute expensive aggregations:

```sql
CREATE MATERIALIZED VIEW monthly_sales AS
SELECT date_trunc('month', created_at) AS month,
       SUM(total) AS revenue,
       COUNT(*) AS order_count
FROM orders
GROUP BY 1;

-- Refresh on schedule or after batch writes
REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_sales;
```

## Lazy Loading

### Components

```tsx
// Route-level lazy loading with suspense boundary
const Settings = React.lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

### Images

```html
<!-- Native lazy loading -->
<img src="photo.webp" loading="lazy" width="800" height="600" alt="..." />
```

For more control, use Intersection Observer to load images when they enter the viewport.

### Data

| Pattern | When |
|---------|------|
| Pagination | Finite lists, table data |
| Infinite scroll | Feeds, timelines |
| Virtual lists | 1000+ items (react-window, @tanstack/virtual) |

## Web Vitals Targets

| Metric | Good | Needs Work | Poor |
|--------|------|------------|------|
| **LCP** (Largest Contentful Paint) | < 2.5s | 2.5-4s | > 4s |
| **FID / INP** (Interaction to Next Paint) | < 200ms | 200-500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 0.1-0.25 | > 0.25 |

### LCP Optimization
- Preload the LCP image or resource
- Serve critical CSS inline
- Use `fetchpriority="high"` on the LCP element
- Optimize server response time (TTFB)

### INP Optimization
- Break long tasks into smaller chunks (yield to main thread)
- Use `requestIdleCallback` for non-urgent work
- Debounce expensive input handlers
- Move computation off the main thread (Web Workers)

### CLS Optimization
- Set explicit `width` and `height` on images and videos
- Reserve space for dynamic content (ads, embeds)
- Avoid inserting content above existing content
- Use `transform` animations instead of layout-triggering properties

## Load Testing

### Tools

| Tool | Best For |
|------|----------|
| k6 | Developer-friendly, scriptable, CI integration |
| Artillery | YAML config, quick setup |
| autocannon | HTTP benchmarking, simple |

### Load Test Structure

1. **Smoke test**: 1-2 users, verify the test works
2. **Load test**: expected traffic, verify performance under normal load
3. **Stress test**: 2-3x expected traffic, find breaking point
4. **Soak test**: sustained load over hours, find memory leaks

### What to Measure

- Response time percentiles (p50, p95, p99) -- not just averages
- Error rate under load
- Throughput (requests per second)
- Resource utilization (CPU, memory, connections)
