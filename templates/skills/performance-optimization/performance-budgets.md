# Performance Budgets

Reference document defining size and time budgets for web applications.

## Size Budgets

### JavaScript

| Metric | Budget | Notes |
|--------|--------|-------|
| Total JS (compressed) | < 300 KB | All bundles combined, gzipped |
| Main bundle | < 150 KB | Entry point, loaded on every page |
| Per-route chunk | < 50 KB | Lazy-loaded per route |
| Third-party JS | < 100 KB | Analytics, widgets, SDKs |

### CSS

| Metric | Budget |
|--------|--------|
| Total CSS (compressed) | < 100 KB |
| Critical CSS (inlined) | < 14 KB |
| Per-component CSS | < 5 KB |

### Images

| Metric | Budget |
|--------|--------|
| Total images per page | < 1 MB |
| Hero/LCP image | < 200 KB |
| Thumbnail images | < 30 KB each |
| Icons (SVG) | < 5 KB each |

### Fonts

| Metric | Budget |
|--------|--------|
| Total fonts | < 100 KB |
| Per font file (WOFF2) | < 50 KB |
| Number of font files | <= 4 |

Use `font-display: swap` or `optional` to prevent render blocking.
Subset fonts to include only characters needed for the target language.

## Time Budgets

| Metric | Budget | Measurement |
|--------|--------|-------------|
| Time to Interactive (TTI) | < 3s | Lighthouse (mobile 4G) |
| Largest Contentful Paint (LCP) | < 2.5s | Web Vitals |
| First Contentful Paint (FCP) | < 1.8s | Lighthouse |
| Total Blocking Time (TBT) | < 200ms | Lighthouse |
| Cumulative Layout Shift (CLS) | < 0.1 | Web Vitals |
| Interaction to Next Paint (INP) | < 200ms | Web Vitals |
| Server response (TTFB) | < 600ms | Web Vitals |

### API Response Times

| Endpoint Type | Budget |
|---------------|--------|
| Simple read (by ID) | < 50ms |
| List / search | < 200ms |
| Write (create/update) | < 500ms |
| Complex aggregation | < 1s |
| Report generation | < 5s (or async) |

## Enforcing Budgets in CI

### Lighthouse CI

```yaml
# lighthouserc.js
module.exports = {
  ci: {
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'total-byte-weight': ['error', { maxNumericValue: 500000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'interactive': ['error', { maxNumericValue: 3000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
      },
    },
  },
};
```

```yaml
# GitHub Actions
- name: Lighthouse CI
  run: |
    npm install -g @lhci/cli
    lhci autorun
```

### bundlesize

```json
// package.json
{
  "bundlesize": [
    { "path": "dist/main.*.js", "maxSize": "150 kB" },
    { "path": "dist/vendor.*.js", "maxSize": "100 kB" },
    { "path": "dist/*.css", "maxSize": "50 kB" }
  ]
}
```

```yaml
# CI step
- name: Check bundle size
  run: npx bundlesize
```

### size-limit

```json
// package.json
{
  "size-limit": [
    { "path": "dist/index.js", "limit": "150 KB" },
    { "path": "dist/index.css", "limit": "50 KB" }
  ]
}
```

```yaml
# CI step
- name: Check size limit
  run: npx size-limit
```

### Webpack Performance Hints

```javascript
// webpack.config.js
module.exports = {
  performance: {
    maxAssetSize: 250000,      // 250 KB per asset
    maxEntrypointSize: 300000,  // 300 KB per entry point
    hints: 'error',            // fail the build if exceeded
  },
};
```

## Tools Summary

| Tool | What It Measures | Integration |
|------|-----------------|-------------|
| **Lighthouse CI** | Performance score, Web Vitals, size | GitHub Actions, GitLab CI |
| **bundlesize** | Individual bundle sizes | GitHub status check |
| **size-limit** | Total package size, time to execute | GitHub Actions, PR comments |
| **Webpack performance** | Asset and entry point sizes | Build step (fails build) |
| **Import Cost** (VS Code) | Per-import size | Editor feedback |
| **Bundle Analyzer** | Visual treemap of bundle | Manual analysis |

## Monitoring in Production

CI budgets catch regressions before deploy. Production monitoring catches real-user issues.

### Real User Monitoring (RUM)

```javascript
// Report Web Vitals to analytics
import { onLCP, onINP, onCLS } from 'web-vitals';

onLCP(sendToAnalytics);
onINP(sendToAnalytics);
onCLS(sendToAnalytics);
```

### Alerting Thresholds

Set alerts when p75 metrics exceed budgets:

| Metric | Alert Threshold |
|--------|----------------|
| LCP p75 | > 3s |
| INP p75 | > 300ms |
| CLS p75 | > 0.15 |
| Error rate | > 1% |
| API p95 response time | > 2x budget |

Track trends over time. A slow drift upward is harder to catch than a sudden spike but equally damaging.
