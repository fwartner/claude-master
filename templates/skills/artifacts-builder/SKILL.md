---
name: artifacts-builder
description: When the user needs standalone HTML/CSS/JS artifacts — interactive demos, prototypes, single-file applications, or visual tools that run independently in a browser.
---

# Artifacts Builder

## Overview

Generate self-contained, production-quality HTML/CSS/JS artifacts that run in any modern browser without a build step. Each artifact is a single file (or minimal file set) containing everything needed for an interactive demo, prototype, data visualization, or utility tool. Emphasis on progressive enhancement, responsive design, and clean code.

## Process

### Phase 1: Scope Definition
1. Clarify the artifact's purpose (demo, prototype, tool, visualization)
2. Determine interactivity level (static, interactive, data-driven)
3. Identify required dependencies (none, CDN-loaded, embedded)
4. Define responsive requirements (mobile, desktop, both)
5. Set constraints (file size, browser support, offline capability)

### Phase 2: Architecture
1. Choose single-file or multi-file approach
2. Select CDN dependencies (if any)
3. Plan component structure within the file
4. Define state management approach
5. Plan progressive enhancement layers

### Phase 3: Implementation
1. Build semantic HTML structure
2. Add CSS (inline `<style>` or embedded)
3. Implement JavaScript functionality
4. Add error handling and fallbacks
5. Test across viewports and browsers

## Single-File Architecture

### Template Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Artifact Title]</title>
  <style>
    /* Reset */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* Design Tokens */
    :root {
      --color-bg: #ffffff;
      --color-text: #1a1a2e;
      --color-primary: #3b82f6;
      --color-border: #e2e8f0;
      --radius: 0.5rem;
      --space: 1rem;
      --font: system-ui, -apple-system, sans-serif;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --color-bg: #0f172a;
        --color-text: #e2e8f0;
        --color-primary: #60a5fa;
        --color-border: #334155;
      }
    }

    /* Base Styles */
    body {
      font-family: var(--font);
      background: var(--color-bg);
      color: var(--color-text);
      line-height: 1.6;
    }

    /* Component Styles */
    /* ... */
  </style>
</head>
<body>
  <!-- Semantic HTML content -->

  <script>
    // Application logic
    (function() {
      'use strict';
      // ...
    })();
  </script>
</body>
</html>
```

## CDN Dependencies (Preferred Sources)

### Utility Libraries
```html
<!-- Alpine.js — lightweight reactivity -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js"></script>

<!-- Petite-Vue — minimal Vue-like reactivity -->
<script src="https://unpkg.com/petite-vue" defer init></script>
```

### Visualization
```html
<!-- D3.js -->
<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>

<!-- Chart.js -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>

<!-- Mermaid — diagrams -->
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
```

### Styling
```html
<!-- Tailwind CSS (Play CDN — prototyping only) -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Lucide Icons -->
<script src="https://unpkg.com/lucide@latest"></script>
```

### Rules for CDN Usage
1. Always pin to a major version (`@3`, `@7`, not `@latest` in production)
2. Maximum 3 CDN dependencies per artifact
3. Add `integrity` and `crossorigin` attributes for security
4. Provide graceful degradation if CDN fails
5. Prefer smaller alternatives (Alpine over React, Petite-Vue over Vue)

## Responsive Design Patterns

### Container-Based Layout
```css
.container {
  width: min(100% - 2rem, 1200px);
  margin-inline: auto;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: var(--space);
}
```

### Mobile-First Media Queries
```css
/* Base: mobile */
.layout { display: flex; flex-direction: column; }

/* Tablet and up */
@media (min-width: 768px) {
  .layout { flex-direction: row; }
  .sidebar { width: 280px; flex-shrink: 0; }
}
```

## Progressive Enhancement

### Layer 1: HTML
Content is accessible and meaningful without CSS or JS.

### Layer 2: CSS
Visual presentation, layout, and basic interactions (`:hover`, `:focus`).

### Layer 3: JavaScript
Enhanced interactivity, dynamic content, real-time updates.

### Feature Detection
```javascript
// Check before using modern APIs
if ('IntersectionObserver' in window) {
  // Use lazy loading
} else {
  // Load all images immediately
}

if (CSS.supports('backdrop-filter', 'blur(10px)')) {
  element.classList.add('glass-effect');
}
```

## State Management (No Framework)

### Simple State Pattern
```javascript
function createStore(initialState) {
  let state = { ...initialState };
  const listeners = new Set();

  return {
    getState: () => ({ ...state }),
    setState(updates) {
      state = { ...state, ...updates };
      listeners.forEach(fn => fn(state));
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}
```

### URL-Based State (for shareable artifacts)
```javascript
function syncStateWithURL(store) {
  const params = new URLSearchParams(location.search);
  // Read initial state from URL
  for (const [key, value] of params) {
    store.setState({ [key]: JSON.parse(value) });
  }
  // Update URL when state changes
  store.subscribe(state => {
    const params = new URLSearchParams();
    Object.entries(state).forEach(([k, v]) => params.set(k, JSON.stringify(v)));
    history.replaceState(null, '', `?${params}`);
  });
}
```

## Export Formats

| Format | Use Case | Method |
|---|---|---|
| Single HTML file | Sharing, embedding | Self-contained `<style>` and `<script>` |
| HTML + assets | Complex artifacts | Separate CSS/JS files |
| Data URL | Inline embedding | `data:text/html;base64,...` |
| Screenshot/PNG | Documentation | `html2canvas` or browser screenshot |
| PDF | Print/report | `window.print()` with print styles |

## Quality Checklist

- [ ] Valid HTML5 (`<!DOCTYPE html>`, `lang` attribute)
- [ ] Responsive viewport meta tag
- [ ] Works without JavaScript (content visible)
- [ ] Dark mode support (`prefers-color-scheme`)
- [ ] Keyboard navigable
- [ ] No console errors
- [ ] File size under 100KB (excluding images)
- [ ] Cross-browser tested (Chrome, Firefox, Safari)
- [ ] Print styles if applicable
- [ ] Semantic HTML elements used appropriately

## Anti-Patterns

- Using React/Vue/Angular in a single-file artifact (use Alpine.js or vanilla JS)
- Loading heavy frameworks from CDN for simple interactions
- Inline styles instead of CSS custom properties
- No error handling on user input or API calls
- Fixed pixel dimensions instead of responsive units
- Missing `<meta viewport>` tag
- Blocking script tags in `<head>` without `defer`

## Skill Type

**FLEXIBLE** — Adapt the architecture, dependencies, and complexity to the artifact's requirements. Simple demos should remain as minimal as possible; complex tools may use lightweight frameworks.
