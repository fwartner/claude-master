---
name: ui-ux-pro-max
description: When the user needs full UI/UX design intelligence — styles, palettes, fonts, UX guidelines, chart selection, and accessible, performant implementation across any supported stack.
---

# UI/UX Pro Max

## Overview

A comprehensive UI/UX design intelligence system that combines visual design expertise with engineering rigor. This skill provides opinionated, production-ready guidance covering style selection, color palettes, typography, UX heuristics, data visualization, and multi-stack implementation. Every recommendation is filtered through a strict priority hierarchy that ensures accessibility and performance are never sacrificed for aesthetics.

## Priority Hierarchy (Non-Negotiable Order)

1. **Accessibility** — WCAG 2.1 AA minimum, AAA preferred
   - Contrast ratio: 4.5:1 for normal text, 3:1 for large text
   - Keyboard navigation: all interactive elements focusable, visible focus ring
   - ARIA labels on all non-text controls
   - Screen reader announcements for dynamic content
   - Reduced motion: respect `prefers-reduced-motion`
2. **Touch Targets** — 44x44px minimum (Apple HIG / WCAG 2.5.5)
   - Spacing between targets: minimum 8px
   - Clickable area may exceed visual bounds via padding
3. **Performance**
   - Images: WebP with AVIF fallback, lazy loading below fold
   - CLS < 0.1, LCP < 2.5s, FID < 100ms
   - Font loading: `font-display: swap`, preload critical fonts
   - Bundle: code-split routes, tree-shake unused components
4. **Style** — Applied only after 1-3 are satisfied
5. **Layout** — Composition and spacing applied last

## Style Reference (67 Styles — Key Categories)

### Glass & Transparency
- Glassmorphism: `backdrop-filter: blur(10px)`, semi-transparent backgrounds, subtle border
- Frosted Glass: heavier blur (20px+), lower opacity, works on busy backgrounds
- Acrylic (Fluent Design): noise texture overlay + blur

### Minimal & Clean
- Minimalism: maximum whitespace, single accent color, limited element count
- Swiss Design: grid-based, Helvetica/Grotesk, asymmetric balance
- Japandi: warm neutrals, organic shapes, hidden complexity

### Bold & Expressive
- Brutalism: raw, exposed structure, system fonts, harsh borders, no border-radius
- Neo-Brutalism: brutalism + bright accent colors + drop shadows
- Maximalism: layered textures, mixed fonts, dense information

### Depth & Dimension
- Neumorphism: soft inner/outer shadows on same-color backgrounds
- Material Design 3: elevation tokens, tonal surfaces, dynamic color
- Claymorphism: inflated 3D look, pastel colors, inner shadows

### Dark & Moody
- Dark Mode: OLED-safe (#000 backgrounds), muted primaries, reduced brightness
- Cyberpunk: neon on dark, glitch effects, monospace accents
- Noir: high contrast, grayscale with single accent

### When to Use What
| Context | Recommended Styles |
|---|---|
| SaaS Dashboard | Minimalism, Swiss, Material 3 |
| Portfolio | Brutalism, Maximalism, Glassmorphism |
| E-commerce | Clean, Material 3, Swiss |
| Mobile App | Material 3, Neumorphism, Minimalism |
| Landing Page | Glassmorphism, Neo-Brutalism, Japandi |

## Color Palettes (161 Palettes — Organized by Product Type)

### Selection Rules
- Primary: brand identity color, used for CTAs and key actions
- Secondary: complementary, used for secondary actions and accents
- Neutral: gray scale for text, borders, backgrounds (minimum 9 shades)
- Semantic: success (#22C55E), warning (#F59E0B), error (#EF4444), info (#3B82F6)
- Always define as semantic tokens: `--color-action-primary`, not `--color-blue-500`

### Palette Categories
- **SaaS/B2B**: Professional blues, teals, slates (24 palettes)
- **E-commerce**: Warm, trust-building — ambers, greens, navy (20 palettes)
- **Health/Wellness**: Calming greens, soft blues, lavender (18 palettes)
- **Finance**: Deep blues, golds, conservative neutrals (15 palettes)
- **Creative/Portfolio**: Bold, saturated, unexpected combinations (22 palettes)
- **Social/Community**: Vibrant, energetic, gradient-friendly (16 palettes)
- **Education**: Friendly, approachable, moderate saturation (14 palettes)
- **Enterprise**: Muted, authoritative, high-contrast (12 palettes)
- **Kids/Family**: Bright primaries, rounded, playful (10 palettes)
- **Luxury**: Black, gold, minimal palette, high whitespace (10 palettes)

### Dark Mode Palette Rules
- Do NOT invert colors; remap to dark-appropriate equivalents
- Reduce saturation by 10-20% for dark backgrounds
- Elevation = lighter surface, not shadow
- Text: #E2E8F0 (primary), #94A3B8 (secondary), #64748B (tertiary)

## Font Pairings (57 Pairings — Top 10)

1. **Inter + Source Serif 4** — SaaS, dashboards
2. **Geist + Geist Mono** — Developer tools, technical
3. **DM Sans + DM Serif Display** — Marketing, editorial
4. **Plus Jakarta Sans + Lora** — Modern professional
5. **Outfit + Newsreader** — Creative agencies
6. **Manrope + Bitter** — Enterprise applications
7. **Space Grotesk + Space Mono** — Tech startups
8. **Satoshi + Erode** — Premium/luxury
9. **General Sans + Gambetta** — Editorial/publishing
10. **Cabinet Grotesk + Zodiak** — Bold branding

### Typography Scale (Default)
```
--text-xs: 0.75rem / 1rem
--text-sm: 0.875rem / 1.25rem
--text-base: 1rem / 1.5rem
--text-lg: 1.125rem / 1.75rem
--text-xl: 1.25rem / 1.75rem
--text-2xl: 1.5rem / 2rem
--text-3xl: 1.875rem / 2.25rem
--text-4xl: 2.25rem / 2.5rem
```

## UX Guidelines (99 Rules — Critical Subset)

### Navigation
1. Primary navigation: maximum 7 items (Miller's Law)
2. Current location always indicated (breadcrumb or active state)
3. Back button must always work as expected
4. Search available on every page for content-heavy apps

### Forms
5. Labels above inputs, never placeholder-only
6. Inline validation on blur, not on keystroke
7. Error messages: specific, actionable, adjacent to field
8. Auto-focus first field on page load
9. Submit button disabled until form valid (with explanation)
10. Progress indicator for multi-step forms

### Feedback
11. Loading states for any action > 300ms
12. Skeleton screens over spinners for content loading
13. Toast notifications: auto-dismiss success (3s), persist errors
14. Tap feedback: 80-150ms response time
15. Optimistic UI for low-risk actions

### Content
16. F-pattern for text-heavy pages
17. Z-pattern for landing pages
18. Above-the-fold: value proposition + primary CTA
19. One primary CTA per viewport

### Mobile
20. Bottom navigation for primary actions (thumb zone)
21. Pull-to-refresh for feed content
22. Swipe gestures with visual affordance

## Chart Type Selection (25 Types)

| Data Relationship | Chart Types |
|---|---|
| Comparison | Bar, Grouped Bar, Lollipop, Dot Plot |
| Trend over Time | Line, Area, Sparkline, Step |
| Part-to-Whole | Pie (max 5 slices), Donut, Treemap, Stacked Bar |
| Distribution | Histogram, Box Plot, Violin, Density |
| Correlation | Scatter, Bubble, Heatmap |
| Flow/Process | Sankey, Funnel, Waterfall |
| Geographic | Choropleth, Dot Map, Cartogram |
| Hierarchical | Sunburst, Icicle |

## Quick Wins Checklist

- [ ] No emoji as icons — use Lucide React or Heroicons
- [ ] Tap feedback delay: 80-150ms
- [ ] Semantic color tokens (not raw hex values)
- [ ] 8dp spacing rhythm (4, 8, 12, 16, 24, 32, 48, 64)
- [ ] `prefers-color-scheme` media query for dark mode
- [ ] `prefers-reduced-motion` for animations
- [ ] `:focus-visible` instead of `:focus` for keyboard-only focus
- [ ] Image aspect ratios set to prevent CLS
- [ ] Font preloading for above-the-fold text
- [ ] `loading="lazy"` on below-fold images

## Supported Stacks (10)

| Stack | Key Patterns |
|---|---|
| React | JSX components, hooks, CSS Modules / Tailwind |
| Next.js | App Router, Server Components, Image optimization |
| Vue | Composition API, `<script setup>`, Pinia |
| Svelte | Reactive declarations, transitions, SvelteKit |
| SwiftUI | Declarative views, ViewModifiers, @State/@Binding |
| React Native | Flexbox, Platform.select, SafeAreaView |
| Flutter | Widgets, Material/Cupertino, MediaQuery |
| Tailwind CSS | Utility-first, @apply sparingly, design tokens via config |
| shadcn/ui | Radix primitives, Tailwind variants, cn() utility |
| HTML/CSS | Semantic HTML5, CSS Grid/Flexbox, custom properties |

## Master + Overrides Persistence Pattern

```
Design System Token Architecture:
master.tokens.json    → Primitive values (colors, spacing, fonts)
semantic.tokens.json  → Mapped meanings (action-primary, surface-elevated)
component.tokens.json → Component-specific (button-padding, card-radius)
overrides/
  brand-a.tokens.json → Brand-specific overrides
  dark.tokens.json    → Dark mode overrides
```

- Master tokens are read-only defaults
- Overrides are shallow-merged at runtime
- Component tokens reference semantic tokens only
- Never reference primitive tokens in components

## Anti-Patterns

- Using `opacity` for disabled states on text (kills readability)
- Fixed pixel breakpoints without container queries
- Hamburger menus on desktop
- Carousel for critical content
- Infinite scroll without "back to top" and URL persistence
- Modal on modal
- Auto-playing media
- Color as the only differentiator (red/green for status)

## Skill Type

**RIGID** — Follow the priority hierarchy exactly. Accessibility and performance rules are non-negotiable. Style recommendations may be adapted to context but never at the expense of higher-priority concerns.
