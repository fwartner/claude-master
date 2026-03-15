---
name: ui-design-system
description: >
  Use when the user needs to build or maintain design tokens, component libraries, theme systems,
  or Tailwind CSS v4 configurations with responsive patterns. Triggers: user says "design system",
  "design tokens", "component library", "theme", "Tailwind config", "dark mode tokens",
  "color system", building reusable UI components.
---

# UI Design System

## Overview

Build and maintain scalable design systems with a token-first architecture. This skill covers the full pipeline from primitive design tokens through semantic mapping to themed component libraries, with deep expertise in Tailwind CSS v4, CSS custom properties, and responsive design patterns.

## Phase 1: Token Foundation

1. Audit existing design assets (colors, fonts, spacing, shadows)
2. Define primitive tokens (raw values with no semantic meaning)
3. Create semantic token layer (map primitives to intentions)
4. Build component token layer (map semantics to component parts)

**STOP — Present the token hierarchy to user for review before building components.**

### Token Layer Decision Table

| Layer | Purpose | Naming Convention | Example |
|---|---|---|---|
| Primitive | Raw values, single source of truth | `--color-blue-500`, `--space-4` | `oklch(0.55 0.18 250)` |
| Semantic | Map to purpose/intention | `--action-primary`, `--text-secondary` | `var(--color-blue-600)` |
| Component | Scoped to specific components | `--button-height-md`, `--card-radius` | `var(--space-4)` |

### When to Create Each Layer

| Situation | Layers Needed |
|---|---|
| Brand new project | All three (primitive + semantic + component) |
| Adding dark mode to existing | Semantic + component (remap primitives) |
| Updating brand colors | Primitive only (semantic/component auto-update) |
| Adding new component | Component only (reference existing semantic) |
| Tailwind project with `@theme` | Primitive via @theme, semantic via CSS vars |

## Phase 2: Token Implementation

### Level 1: Primitive Tokens

Raw values with systematic naming. Single source of truth for all values.

```css
/* Colors — using OKLCH for perceptual uniformity */
--color-blue-50: oklch(0.97 0.01 250);
--color-blue-100: oklch(0.93 0.03 250);
--color-blue-500: oklch(0.55 0.18 250);
--color-blue-900: oklch(0.25 0.10 250);

/* Spacing — 4px base unit */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */

/* Typography */
--font-sans: 'Inter', system-ui, sans-serif;
--font-mono: 'Geist Mono', monospace;
--font-size-xs: 0.75rem;
--font-size-sm: 0.875rem;
--font-size-base: 1rem;
--font-size-lg: 1.125rem;
--font-size-xl: 1.25rem;
--font-size-2xl: 1.5rem;
--font-size-3xl: 1.875rem;
--font-size-4xl: 2.25rem;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;

/* Border Radius */
--radius-sm: 0.25rem;
--radius-md: 0.375rem;
--radius-lg: 0.5rem;
--radius-xl: 0.75rem;
--radius-2xl: 1rem;
--radius-full: 9999px;

/* Shadows */
--shadow-sm: 0 1px 2px 0 oklch(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px oklch(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px oklch(0 0 0 / 0.1);
```

### Level 2: Semantic Tokens

Map primitives to purpose. These are what components reference.

```css
/* Surface */
--surface-primary: var(--color-white);
--surface-secondary: var(--color-gray-50);
--surface-elevated: var(--color-white);
--surface-overlay: oklch(0 0 0 / 0.5);

/* Text */
--text-primary: var(--color-gray-900);
--text-secondary: var(--color-gray-600);
--text-tertiary: var(--color-gray-400);
--text-inverse: var(--color-white);
--text-link: var(--color-blue-600);

/* Action */
--action-primary: var(--color-blue-600);
--action-primary-hover: var(--color-blue-700);
--action-secondary: var(--color-gray-100);
--action-danger: var(--color-red-600);

/* Border */
--border-default: var(--color-gray-200);
--border-strong: var(--color-gray-300);
--border-focus: var(--color-blue-500);

/* Status */
--status-success: var(--color-green-600);
--status-warning: var(--color-amber-500);
--status-error: var(--color-red-600);
--status-info: var(--color-blue-600);
```

### Level 3: Component Tokens

Scoped to specific components.

```css
/* Button */
--button-height-sm: 2rem;
--button-height-md: 2.5rem;
--button-height-lg: 3rem;
--button-padding-x: var(--space-4);
--button-radius: var(--radius-md);
--button-font-weight: 500;

/* Input */
--input-height: 2.5rem;
--input-padding-x: var(--space-3);
--input-border: var(--border-default);
--input-border-focus: var(--border-focus);
--input-radius: var(--radius-md);

/* Card */
--card-padding: var(--space-6);
--card-radius: var(--radius-xl);
--card-shadow: var(--shadow-sm);
--card-border: var(--border-default);
```

## Phase 3: Component Architecture

1. Identify atomic components (Button, Input, Badge, Avatar)
2. Define molecule components (FormField, SearchBar, Card)
3. Build organism components (Header, Sidebar, DataTable)
4. Establish composition patterns (layouts, page templates)

**STOP — Present component inventory for review before building variants.**

### Component Complexity Decision Table

| Level | Components | Composition |
|---|---|---|
| Atom | Button, Input, Badge, Avatar, Icon | Single element, no children |
| Molecule | FormField, SearchBar, Card, Tooltip | 2-3 atoms combined |
| Organism | Header, Sidebar, DataTable, Modal | Multiple molecules |
| Template | DashboardLayout, AuthLayout | Page-level composition |

### Variant Pattern (using CVA or Tailwind Variants)

```typescript
const buttonVariants = cva("inline-flex items-center justify-center rounded-md font-medium", {
  variants: {
    variant: {
      primary: "bg-action-primary text-white hover:bg-action-primary-hover",
      secondary: "bg-action-secondary text-text-primary hover:bg-gray-200",
      ghost: "hover:bg-action-secondary",
      danger: "bg-action-danger text-white hover:bg-red-700",
    },
    size: {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});
```

### Composition Patterns

- Compound components for complex UI (Tabs, Accordion, Combobox)
- Slot-based composition for flexible layouts
- Render props for maximum customization
- Forward refs for DOM access

## Phase 4: Theming and Responsiveness

1. Implement light/dark themes via token swapping
2. Define breakpoint system with container queries
3. Build responsive component variants
4. Test across viewports and color schemes

**STOP — Verify theme switching works correctly before declaring complete.**

### Tailwind CSS v4 Configuration

```css
/* app.css — Tailwind v4 uses CSS-based config */
@import "tailwindcss";

@theme {
  --color-primary-50: oklch(0.97 0.01 250);
  --color-primary-500: oklch(0.55 0.18 250);
  --color-primary-600: oklch(0.48 0.18 250);
  --color-primary-700: oklch(0.40 0.18 250);

  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'Geist Mono', monospace;

  --breakpoint-sm: 40rem;
  --breakpoint-md: 48rem;
  --breakpoint-lg: 64rem;
  --breakpoint-xl: 80rem;
}
```

### Dark / Light Theming

```css
:root {
  color-scheme: light dark;
  --surface-primary: var(--color-white);
  --text-primary: var(--color-gray-900);
}

@media (prefers-color-scheme: dark) {
  :root {
    --surface-primary: var(--color-gray-950);
    --text-primary: var(--color-gray-50);
    --surface-elevated: var(--color-gray-900);
  }
}

/* Class-based override for manual toggle */
[data-theme="dark"] {
  --surface-primary: var(--color-gray-950);
  --text-primary: var(--color-gray-50);
}
```

### Responsive Design Patterns

#### Breakpoint System

```
Mobile-first approach:
Default    -> 0px+     (mobile)
sm         -> 640px+   (large phone / small tablet)
md         -> 768px+   (tablet)
lg         -> 1024px+  (laptop)
xl         -> 1280px+  (desktop)
2xl        -> 1536px+  (large desktop)
```

#### Container Queries (Preferred for Components)

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card-content {
    flex-direction: row;
  }
}
```

#### Responsive Patterns Decision Table

| Pattern | Mobile Behavior | Desktop Behavior |
|---|---|---|
| Stack to Row | Vertical column | Horizontal row |
| Sidebar Collapse | Drawer overlay | Persistent sidebar |
| Table to Cards | Card list | Full data table |
| Hide/Show | Secondary content hidden | All content visible |
| Reorder | Priority content first | Standard order |

## Verification Checklist

- [ ] Primitive tokens defined for all raw values
- [ ] Semantic tokens map primitives to intentions
- [ ] Component tokens reference only semantic tokens
- [ ] Dark mode theme with proper token remapping
- [ ] Breakpoint system defined (mobile-first)
- [ ] Container queries used for component-level responsiveness
- [ ] Typography scale follows consistent ratio
- [ ] Spacing scale uses 4px/8px base unit
- [ ] Focus states visible and accessible
- [ ] Color contrast ratios meet WCAG AA (4.5:1)

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Is Wrong | What to Do Instead |
|---|---|---|
| Hard-coding hex values in components | Cannot theme, cannot dark-mode | Use semantic tokens |
| Creating dark mode by inverting colors | Looks terrible, wrong contrast | Remap tokens to dark-appropriate values |
| Using `!important` to override system | Specificity wars, unmaintainable | Fix the cascade or use data attributes |
| Mixing spacing units (px, rem, em) | Inconsistent layout, scaling issues | Use rem everywhere, reference tokens |
| One-off components instead of extending | Design system fragmentation | Extend existing components with variants |
| Skipping the semantic layer | Tight coupling to primitives | Always map primitives -> semantics -> components |
| Primitive tokens directly in components | Cannot retheme without rewriting | Components reference semantic tokens only |
| No container queries for components | Components break in different contexts | Use container queries for adaptive components |

## Integration Points

| Skill | Integration |
|---|---|
| `ui-ux-pro-max` | Provides style, palette, and UX guidelines |
| `senior-frontend` | Implements design system in React/Next.js |
| `canvas-design` | Data visualization tokens and chart theming |
| `mobile-design` | Mobile-specific token adaptations |
| `artifacts-builder` | Design system preview artifacts |
| `planning` | Design system is planned like any feature |

## Skill Type

**FLEXIBLE** — Adapt token naming, component structure, and theming approach to the project's existing conventions and tooling. The three-layer token hierarchy (primitive -> semantic -> component) is strongly recommended but can be simplified for small projects.
