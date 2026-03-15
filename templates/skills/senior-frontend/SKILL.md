---
name: senior-frontend
description: When the user needs production-grade React/Next.js/TypeScript development with rigorous component architecture, state management, performance optimization, and >85% test coverage.
---

# Senior Frontend Engineer

## Overview

Deliver production-grade frontend code following a structured three-phase workflow: context discovery, development, and handoff. This skill enforces strict quality standards including atomic design component architecture, comprehensive state management patterns, SSR/SSG/ISR optimization, and mandatory >85% test coverage with Jest, React Testing Library, and Playwright.

## Process (Three Phases — Mandatory)

### Phase 1: Context Discovery
1. Analyze existing codebase structure and conventions
2. Identify the tech stack version (React 18/19, Next.js 14/15, TypeScript version)
3. Review existing component library and design system
4. Check state management approach already in use
5. Understand build tooling and CI pipeline
6. Map existing test infrastructure and coverage

### Phase 2: Development
1. Design component architecture following atomic design
2. Implement with TypeScript strict mode
3. Write tests alongside implementation (TDD when appropriate)
4. Optimize for performance (bundle size, rendering, loading)
5. Ensure accessibility compliance

### Phase 3: Handoff
1. Verify test coverage meets >85% threshold
2. Run full lint and type check
3. Document complex components with JSDoc/TSDoc
4. Create Storybook stories for UI components
5. Performance audit (Lighthouse, bundle analysis)

## Component Architecture (Atomic Design)

### Atoms
Smallest building blocks. No business logic.
```typescript
// Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({ variant = 'primary', size = 'md', isLoading, children, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }))} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? <Spinner size={size} /> : children}
    </button>
  );
}
```

### Molecules
Composed of atoms. Minimal business logic.
- FormField (Label + Input + Error)
- SearchBar (Input + Button + Icon)
- Card (CardHeader + CardBody + CardFooter)

### Organisms
Complex components with business logic.
- DataTable (sorting, filtering, pagination)
- NavigationBar (routing, auth state)
- CommentThread (CRUD, real-time updates)

### Templates / Layouts
Page structure without data.

### Pages
Templates connected to data sources.

## State Management Decision Matrix

| State Type | Solution | When to Use |
|---|---|---|
| Server state | React Query / TanStack Query | API data, caching, sync |
| Form state | React Hook Form + Zod | Form validation, submission |
| Global UI state | Zustand | Theme, sidebar open, modals |
| Local UI state | useState / useReducer | Component-specific state |
| URL state | nuqs / useSearchParams | Filters, pagination, tabs |
| Complex local | useReducer | Multiple related state transitions |
| Shared context | React Context | Theme, locale, auth (infrequent updates) |

### React Query Patterns
```typescript
// Custom hook for data fetching
function useUsers(filters: UserFilters) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => fetchUsers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
  });
}

// Mutation with optimistic update
function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    onMutate: async (newUser) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previous = queryClient.getQueryData(['users']);
      queryClient.setQueryData(['users'], (old) =>
        old.map(u => u.id === newUser.id ? { ...u, ...newUser } : u)
      );
      return { previous };
    },
    onError: (err, newUser, context) => {
      queryClient.setQueryData(['users'], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
```

## SSR / SSG / ISR Patterns (Next.js App Router)

### When to Use What
| Pattern | Use When | Cache |
|---|---|---|
| Static (SSG) | Content rarely changes | Build time |
| ISR | Content changes periodically | Revalidate interval |
| SSR | Content changes per request | No cache |
| Client | User-specific, interactive | Browser |

### Server Components (Default in App Router)
```typescript
// app/users/page.tsx — Server Component (default)
export default async function UsersPage() {
  const users = await getUsers(); // Direct database/API call
  return <UserList users={users} />;
}

// Revalidation
export const revalidate = 3600; // ISR: revalidate every hour
```

### Client Components
```typescript
'use client';

// Only use when needed: event handlers, hooks, browser APIs
export function UserSearch() {
  const [query, setQuery] = useState('');
  // ...
}
```

## Performance Optimization

### Code Splitting
```typescript
// Route-level splitting (automatic in Next.js)
// Component-level splitting
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});
```

### Memoization Rules
- `useMemo`: expensive computations, referential equality for deps
- `useCallback`: functions passed to optimized children
- `React.memo`: components that re-render with same props
- Do NOT memoize everything — profile first, optimize second

### Performance Checklist
- [ ] Bundle size < 200KB gzipped (initial load)
- [ ] Largest Contentful Paint < 2.5s
- [ ] First Input Delay < 100ms
- [ ] Cumulative Layout Shift < 0.1
- [ ] Images: next/image with proper sizing and formats
- [ ] Fonts: next/font with display swap
- [ ] No layout thrashing (batch DOM reads/writes)
- [ ] Virtualization for lists > 100 items (react-window/tanstack-virtual)

## Testing Requirements (>85% Coverage)

### Unit Tests (Jest + React Testing Library)
```typescript
describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<Button isLoading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
```

### Integration Tests
- Test component compositions (form submission flow)
- Test data fetching with MSW (Mock Service Worker)
- Test routing and navigation
- Test error boundaries and fallbacks

### E2E Tests (Playwright)
```typescript
test('user can complete checkout', async ({ page }) => {
  await page.goto('/products');
  await page.getByRole('button', { name: 'Add to cart' }).first().click();
  await page.getByRole('link', { name: 'Cart' }).click();
  await expect(page.getByText('1 item')).toBeVisible();
  await page.getByRole('button', { name: 'Checkout' }).click();
  // ...
});
```

### Coverage Thresholds
```json
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 85,
        "functions": 85,
        "lines": 85,
        "statements": 85
      }
    }
  }
}
```

## Key Principles

- TypeScript strict mode, no `any` (use `unknown` + type guards)
- Prefer composition over inheritance
- Colocate tests, styles, and stories with components
- Server Components by default; Client Components only when required
- Error boundaries at route and feature boundaries
- Accessibility is not optional (test with axe-core)

## Anti-Patterns

- `useEffect` for data fetching (use React Query or Server Components)
- Prop drilling more than 2 levels (use composition or context)
- Business logic in components (extract to hooks or utilities)
- Barrel exports that break tree-shaking
- Testing implementation details (test behavior, not internals)
- `any` type anywhere in the codebase
- Inline styles for anything beyond truly dynamic values

## Skill Type

**RIGID** — The three-phase workflow is mandatory. Test coverage must exceed 85%. TypeScript strict mode is non-negotiable. Component architecture must follow atomic design principles.
