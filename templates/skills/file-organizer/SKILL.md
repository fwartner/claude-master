---
name: file-organizer
description: When the user needs project structure organization — monorepo patterns, feature-based architecture, naming conventions, barrel exports, or configuration placement.
---

# File Organizer

## Overview

Design and maintain well-organized project structures that scale with team and codebase growth. This skill covers monorepo patterns, feature-based vs layer-based architecture, naming conventions, index/barrel files, configuration file placement, and documentation structure.

## Process

1. Assess current project structure and pain points
2. Determine organization strategy (feature-based, layer-based, hybrid)
3. Define naming conventions and file placement rules
4. Plan migration path for existing projects
5. Document conventions for team alignment

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

### When to Use Barrels
- Feature module public API (always)
- Shared component library (always)
- Utility libraries (always)

### When NOT to Use Barrels
- Inside a feature (import directly between files within a feature)
- When it causes circular dependencies
- When it hurts tree-shaking (test with bundle analyzer)

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

## Quality Checklist

- [ ] Clear top-level directory purpose (README or directory naming)
- [ ] Consistent naming convention across the project
- [ ] Feature modules are self-contained
- [ ] Shared code is in a dedicated shared/common location
- [ ] No circular dependencies between features
- [ ] Barrel exports for public APIs
- [ ] Configuration files at root level
- [ ] Tests co-located with source code
- [ ] Environment files follow .env.example pattern
- [ ] Import paths use aliases (@ or ~) not deep relative paths

## Anti-Patterns

- Deeply nested folder hierarchies (> 4 levels)
- `utils/` as a dumping ground (organize by domain instead)
- Circular dependencies between features
- Barrel exports that re-export everything (kills tree-shaking)
- Inconsistent naming (mix of camelCase and kebab-case)
- Configuration scattered across multiple locations
- Test files in a completely separate directory tree
- `components/` folder with 100+ unorganized files
- Index files that contain logic (should only re-export)

## Skill Type

**FLEXIBLE** — Choose the organization strategy that fits the project's size, team structure, and complexity. The naming conventions and barrel export patterns are recommendations that should be adapted to existing project conventions.
