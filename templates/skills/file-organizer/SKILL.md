---
name: file-organizer
description: >
  Use when the user needs project structure organization — monorepo patterns, feature-based
  architecture, naming conventions, barrel exports, or configuration placement.
  Trigger conditions: restructure project directories, set up monorepo, define naming
  conventions, create barrel exports, organize configuration files, plan migration
  from flat to feature-based structure, establish import ordering rules.
---

# File Organizer

## Overview

Design and maintain well-organized project structures that scale with team and codebase growth. This skill covers monorepo patterns, feature-based vs layer-based architecture, naming conventions, index/barrel files, configuration file placement, and documentation structure.

Apply this skill whenever a project's file organization needs to be established, audited, or restructured for clarity and scalability.

## Multi-Phase Process

### Phase 1: Assessment

1. Audit current project structure and identify pain points
2. Measure project size (file count, team size, feature count)
3. Identify existing naming conventions and import patterns
4. Catalog configuration file locations
5. Check for circular dependencies or deep nesting

> **STOP — Do NOT propose a new structure without understanding the current state and its pain points.**

### Phase 2: Strategy Selection

1. Choose organization strategy using decision table below
2. Define naming conventions and file placement rules
3. Plan barrel export boundaries
4. Establish configuration file placement rules
5. Document import ordering convention

> **STOP — Do NOT begin migration without documenting the target structure and getting team alignment.**

### Phase 3: Migration Planning

1. Plan migration path for existing projects (incremental, not big-bang)
2. Identify files that move and their new locations
3. Map import changes required
4. Create automated codemods where possible
5. Define rollback plan if migration causes issues

> **STOP — Do NOT execute migration without verifying tests pass at each incremental step.**

### Phase 4: Execution and Validation

1. Move one feature or module at a time
2. Update imports using automated tools
3. Verify tests pass after each move
4. Remove old structure after complete migration
5. Document conventions for team reference

## Architecture Strategy Decision Table

| Project Size | Team Size | Recommendation | Why |
|---|---|---|---|
| < 20 files | 1-2 devs | Layer-based | Simple, low overhead |
| 20-100 files | 2-5 devs | Hybrid | Balance of simplicity and scalability |
| 100+ files | 5+ devs | Feature-based | Self-contained modules reduce conflicts |
| Multiple apps sharing code | Any | Monorepo | Shared packages with clear boundaries |
| Rapid prototype / MVP | 1-3 devs | Layer-based | Speed over structure, refactor later |
| Enterprise, multiple teams | 10+ devs | Feature-based + Monorepo | Team ownership per feature module |

## Architecture Patterns

### Feature-Based (Domain-Driven)
Organize by business domain. Each feature is self-contained.

```
src/
  features/
    auth/
      components/
        LoginForm.tsx
        SignupForm.tsx
      hooks/
        useAuth.ts
      api/
        auth.api.ts
      types/
        auth.types.ts
      utils/
        auth.utils.ts
      __tests__/
        auth.test.ts
      index.ts          # Public API (barrel export)
    dashboard/
      components/
      hooks/
      api/
      types/
      index.ts
    billing/
      ...
  shared/               # Cross-feature shared code
    components/
      Button.tsx
      Modal.tsx
    hooks/
      useDebounce.ts
    utils/
      format.ts
    types/
      common.types.ts
```

**Best for**: Teams > 5 developers, medium-large applications, clear domain boundaries.

### Layer-Based (Technical)
Organize by technical concern.

```
src/
  components/
    Button.tsx
    Modal.tsx
    LoginForm.tsx
    DashboardCard.tsx
  hooks/
    useAuth.ts
    useDebounce.ts
  services/
    auth.service.ts
    billing.service.ts
  utils/
    format.ts
    validation.ts
  types/
    auth.types.ts
    billing.types.ts
  pages/
    Home.tsx
    Dashboard.tsx
```

**Best for**: Small teams (1-3), simple applications, rapid prototyping.

### Hybrid (Recommended Default)
Combine both: shared layer + feature modules.

```
src/
  app/                  # App-level concerns
    layout.tsx
    providers.tsx
    routes.tsx
  features/             # Feature modules
    auth/
    dashboard/
    billing/
  components/           # Shared UI components
    ui/                 # Design system atoms
    layout/             # Layout components
  hooks/                # Shared hooks
  lib/                  # Shared utilities
  types/                # Shared types
  config/               # App configuration
  styles/               # Global styles
```

## Monorepo Patterns

### Turborepo / pnpm Workspaces
```
root/
  apps/
    web/                # Next.js web app
      package.json
    api/                # API server
      package.json
    mobile/             # React Native app
      package.json
  packages/
    ui/                 # Shared component library
      package.json
    config/             # Shared configs (ESLint, TypeScript)
      eslint/
      typescript/
      package.json
    utils/              # Shared utilities
      package.json
    types/              # Shared type definitions
      package.json
  package.json          # Root workspace config
  turbo.json            # Turborepo pipeline config
  pnpm-workspace.yaml
```

### Package Boundaries
- Apps depend on packages, never on other apps
- Packages can depend on other packages
- No circular dependencies
- Each package has a clear, single responsibility
- Shared packages export via `index.ts` barrel

### Configuration Sharing
```json
// packages/config/typescript/base.json
{
  "compilerOptions": {
    "strict": true,
    "moduleResolution": "bundler",
    "target": "ES2022"
  }
}

// apps/web/tsconfig.json
{
  "extends": "@repo/config/typescript/nextjs",
  "include": ["src"]
}
```

## Naming Conventions

### Files and Directories

| Type | Convention | Example |
|---|---|---|
| Components | PascalCase | `UserProfile.tsx` |
| Hooks | camelCase with `use` prefix | `useAuth.ts` |
| Utilities | camelCase | `formatDate.ts` |
| Types | camelCase with `.types` suffix | `auth.types.ts` |
| Tests | same name with `.test` suffix | `UserProfile.test.tsx` |
| Styles | same name with `.module.css` suffix | `UserProfile.module.css` |
| Constants | camelCase or UPPER_SNAKE in file | `config.ts` |
| API/Services | camelCase with `.api` or `.service` | `auth.api.ts` |
| Directories | kebab-case | `user-profile/` |

### Component File Naming
```
# Single-file component
Button.tsx

# Component with co-located files
Button/
  Button.tsx
  Button.test.tsx
  Button.stories.tsx
  Button.module.css
  index.ts            # Re-exports Button
```

### Import Ordering Convention
```typescript
// 1. External packages
import React from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Internal packages (monorepo)
import { Button } from '@repo/ui';

// 3. Feature-level imports
import { useAuth } from '@/features/auth';

// 4. Relative imports (same feature)
import { LoginForm } from './LoginForm';
import { authSchema } from './auth.types';

// 5. Styles
import styles from './Auth.module.css';
```

## Index Files and Barrel Exports

### Barrel Export Pattern
```typescript
// features/auth/index.ts — Public API
export { LoginForm } from './components/LoginForm';
export { useAuth } from './hooks/useAuth';
export type { User, AuthState } from './types/auth.types';

// Do NOT export internal implementation details
// Do NOT export utility functions used only within the feature
```

### Barrel Export Decision Table

| Context | Use Barrel? | Why |
|---|---|---|
| Feature module public API | Yes, always | Clean boundary, controlled surface area |
| Shared component library | Yes, always | Single import point for consumers |
| Utility libraries | Yes, always | Discoverability for shared functions |
| Inside a feature (internal) | No | Import directly, avoid indirection |
| Would cause circular dependencies | No | Break the cycle, import directly |
| Hurts tree-shaking (verified) | No | Use direct imports for bundle size |

## Configuration File Placement

### Root-Level Configuration
```
root/
  .editorconfig         # Editor settings
  .eslintrc.js          # ESLint config (or eslint.config.js)
  .gitignore            # Git ignore rules
  .prettierrc           # Prettier config
  .env.example          # Environment variable template
  docker-compose.yml    # Docker composition
  Dockerfile            # Container build
  package.json          # Dependencies and scripts
  tsconfig.json         # TypeScript config
  next.config.js        # Framework config
  tailwind.config.ts    # Tailwind config
  vitest.config.ts      # Test config
```

### Environment Files
```
.env                    # Local defaults (gitignored)
.env.example            # Template with dummy values (committed)
.env.local              # Local overrides (gitignored)
.env.development        # Development-specific (committed or not)
.env.production         # Production-specific (committed or not)
.env.test               # Test-specific (committed or not)
```

### Documentation Structure
```
docs/
  architecture/
    adr/                # Architecture Decision Records
      001-framework.md
      002-database.md
    diagrams/
  api/                  # API documentation
  guides/
    getting-started.md
    deployment.md
  contributing.md
```

## Migration Strategy

### Incremental Migration (Recommended)
1. Create the target structure alongside existing code
2. Move one feature/module at a time
3. Update imports using automated codemods
4. Verify with tests after each move
5. Remove old structure after complete migration

### Automated Tools
- `ts-morph`: programmatic TypeScript refactoring
- `jscodeshift`: JavaScript codemods
- IDE refactoring: rename/move with automatic import updates
- ESLint `import/order`: enforce import ordering

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Fails | What To Do Instead |
|---|---|---|
| Deeply nested folders (> 4 levels) | Hard to navigate, long import paths | Flatten structure, use path aliases |
| `utils/` as a dumping ground | Becomes unmaintainable junk drawer | Organize utils by domain or purpose |
| Circular dependencies between features | Build failures, unclear ownership | Features import only from shared or own modules |
| Barrel exports re-exporting everything | Kills tree-shaking, bloats bundles | Export only the public API |
| Inconsistent naming (mixed conventions) | Cognitive load, merge conflicts | Pick one convention, enforce with linter |
| Config scattered across multiple locations | Hard to find and maintain | All config at project root |
| Tests in separate directory tree | Hard to find tests for a file | Co-locate tests with source code |
| 100+ files in one flat folder | Impossible to navigate | Group into sub-modules or features |
| Index files containing logic | Unexpected side effects on import | Index files only re-export |
| Big-bang migration (move everything at once) | High risk, hard to rollback | Incremental moves with tests after each |

## Anti-Rationalization Guards

- Do NOT restructure without understanding current pain points -- assess first.
- Do NOT skip the team alignment step -- structure changes affect everyone.
- Do NOT migrate everything at once -- move one module at a time with test verification.
- Do NOT create deeply nested structures "for future scalability" -- flatten until complexity demands it.
- Do NOT ignore barrel export impact on bundle size -- verify with bundle analyzer.

## Integration Points

| Skill | How It Connects |
|---|---|
| `senior-frontend` | Frontend project structure follows feature-based or hybrid patterns |
| `senior-architect` | Architecture decisions inform module boundaries and package structure |
| `senior-fullstack` | Full-stack projects need coordinated frontend/backend organization |
| `clean-code` | Naming conventions and module boundaries support clean code principles |
| `deployment` | Monorepo structure affects CI/CD pipeline configuration |
| `laravel-specialist` | Laravel projects follow framework-specific directory conventions |

## Skill Type

**FLEXIBLE** — Choose the organization strategy that fits the project's size, team structure, and complexity. The naming conventions and barrel export patterns are recommendations that should be adapted to existing project conventions.
