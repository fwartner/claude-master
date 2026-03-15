---
name: frontend-ui-design
description: "Use when designing UI components, creating component architectures, implementing responsive layouts, setting up design systems, or selecting state management solutions for frontend applications"
---

# Frontend UI Design

## Purpose

Guide the design and implementation of frontend user interfaces with consistent architecture, accessibility, responsive behavior, and performance.

## When to Use

- Designing new UI components or component libraries
- Creating or extending a design system
- Implementing responsive layouts
- Choosing state management solutions
- Setting up component architecture for a new project

## Component Architecture Patterns

### Atomic Design

Organize components in five levels of increasing complexity:

| Level | Description | Examples |
|-------|-------------|----------|
| **Atoms** | Smallest building blocks, single purpose | Button, Input, Label, Icon |
| **Molecules** | Groups of atoms functioning together | SearchBar (Input + Button), FormField (Label + Input + Error) |
| **Organisms** | Complex sections composed of molecules | Header (Logo + Nav + SearchBar), ProductCard |
| **Templates** | Page layouts with placeholder content | DashboardLayout, AuthLayout |
| **Pages** | Templates populated with real data | HomePage, SettingsPage |

### Compound Components

Components that share implicit state through a parent:

```tsx
<Select value={selected} onChange={setSelected}>
  <Select.Trigger />
  <Select.Options>
    <Select.Option value="a">Option A</Select.Option>
    <Select.Option value="b">Option B</Select.Option>
  </Select.Options>
</Select>
```

Use when: a component has multiple sub-parts that must coordinate but consumers need layout flexibility.

### Hooks Pattern

Extract component logic into reusable hooks:

```tsx
function useDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
}
```

Use when: the same logic is needed across multiple components with different UI.

### Container / Presenter Pattern

Separate data fetching and business logic (container) from rendering (presenter):

- **Container**: fetches data, manages state, passes props down
- **Presenter**: pure rendering, receives all data via props, no side effects

Use when: components need to be testable in isolation or reused with different data sources.

## Responsive Design

### Mobile-First Breakpoints

Define breakpoints from small to large. Start with mobile styles, add complexity for larger screens:

| Breakpoint | Target | Min-Width |
|------------|--------|-----------|
| sm | Mobile landscape | 640px |
| md | Tablet | 768px |
| lg | Desktop | 1024px |
| xl | Large desktop | 1280px |
| 2xl | Wide desktop | 1536px |

### Fluid Typography

Scale text smoothly between breakpoints using `clamp()`:

```css
font-size: clamp(1rem, 0.5rem + 1.5vw, 1.5rem);
```

### Container Queries vs Media Queries

| Use | When |
|-----|------|
| Media queries | Layout changes based on viewport size |
| Container queries | Component adapts to its parent container size |

Prefer container queries for reusable components that appear in different layout contexts.

## Accessibility (WCAG 2.1 AA)

### Semantic HTML

Use the correct HTML element before reaching for ARIA:

| Need | Use | Not |
|------|-----|-----|
| Navigation | `<nav>` | `<div class="nav">` |
| Button action | `<button>` | `<div onClick>` |
| Page sections | `<main>`, `<section>`, `<aside>` | `<div>` |
| Headings | `<h1>`-`<h6>` in order | `<div class="heading">` |

### ARIA Attributes

Use ARIA only when semantic HTML is insufficient:

- `aria-label`: labels for elements without visible text
- `aria-describedby`: associates descriptive text
- `aria-live`: announces dynamic content changes
- `aria-expanded`: toggleable sections
- `role`: only when no semantic element exists

### Keyboard Navigation

All interactive elements must be:
- Focusable (naturally or via `tabindex="0"`)
- Operable via keyboard (Enter, Space, Escape, Arrow keys)
- Visually focused (never `outline: none` without a replacement)
- In logical tab order

Implement focus traps for modals and dialogs.

### Color Contrast

- **Normal text**: minimum 4.5:1 contrast ratio
- **Large text** (18px+ or 14px+ bold): minimum 3:1
- **UI components**: minimum 3:1 against adjacent colors
- Never convey information by color alone (add icons, patterns, or text)

### Screen Reader Testing

Test with at least one screen reader:
- macOS: VoiceOver (built-in)
- Windows: NVDA (free) or JAWS
- Verify all content is announced in logical order
- Verify form errors are associated with inputs
- Verify dynamic content updates are announced

## Design System Integration

### Design Tokens

Define foundational values as tokens, not hard-coded values:

```ts
const tokens = {
  color: {
    primary: '#2563eb',
    secondary: '#64748b',
    error: '#dc2626',
    success: '#16a34a',
  },
  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
  },
  typography: {
    fontFamily: { sans: 'Inter, system-ui, sans-serif' },
    fontSize: { sm: '0.875rem', base: '1rem', lg: '1.125rem' },
  },
};
```

### Component Variants

Define variant APIs using a consistent pattern:

```tsx
<Button variant="primary" size="md">Save</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="ghost" size="lg">Learn More</Button>
```

Use a variant mapping system (e.g., cva, class-variance-authority) for scalable variant management.

### Theme Support

- Use CSS custom properties for runtime theme switching
- Support light and dark themes at minimum
- Respect `prefers-color-scheme` as the default
- Allow user override stored in localStorage
- Apply theme at the root element to cascade naturally

## State Management Selection Guide

| State Type | Solution | When |
|------------|----------|------|
| **Local** | `useState`, `useReducer` | State used by one component or its direct children |
| **Shared** | Context, Zustand, Jotai | State shared across multiple unrelated components |
| **Server** | TanStack Query, SWR | Data fetched from an API, needs caching and revalidation |
| **Form** | React Hook Form, Formik | Complex forms with validation, errors, and submission |
| **URL** | Search params, router state | State that should be bookmarkable or shareable |

### Selection Heuristic

1. Start with `useState` -- only move to a more complex solution when you hit a real limitation
2. If prop drilling exceeds 2 levels, consider Context or a state library
3. If caching API responses, use a server state library (not Redux)
4. For forms with more than 3 fields and validation, use a form library

## Performance

### Lazy Loading

- **Components**: `React.lazy()` with `Suspense` boundaries for route-level splitting
- **Images**: `loading="lazy"` attribute, or Intersection Observer for custom behavior
- **Data**: paginate or virtualize lists with more than 50 items

### Code Splitting

- Split by route (each page is a separate chunk)
- Split heavy libraries used in specific features (e.g., chart library only on dashboard)
- Use dynamic `import()` for conditionally loaded features

### Image Optimization

- Use modern formats: WebP (universal support), AVIF (better compression)
- Serve responsive sizes via `srcset` and `sizes` attributes
- Set explicit `width` and `height` to prevent layout shift
- Use a CDN with automatic format negotiation when possible

### Rendering Performance

- Memoize expensive computations with `useMemo`
- Memoize callback references with `useCallback` only when passed to memoized children
- Avoid creating objects/arrays in render -- move them outside or memoize
- Use React DevTools Profiler to identify unnecessary re-renders
