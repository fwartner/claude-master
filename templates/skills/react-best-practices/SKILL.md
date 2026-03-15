---
name: react-best-practices
description: When the user needs React-specific patterns — hooks, component composition, Server Components, error boundaries, rendering optimization, and testing strategies.
---

# React Best Practices

## Overview

Apply modern React patterns to build maintainable, performant, and testable applications. This skill covers React 18/19 features including Server Components, hooks best practices, component composition, error boundaries, Suspense, context optimization, and rendering performance.

## Process

1. Analyze the component's responsibility and data requirements
2. Choose Server Component (default) or Client Component
3. Apply appropriate patterns (composition, hooks, memoization)
4. Add error boundaries and loading states
5. Write tests that verify behavior, not implementation

## Hooks Best Practices

### useState
```typescript
// Prefer functional updates for state based on previous state
setCount(prev => prev + 1);

// Use lazy initialization for expensive initial values
const [data, setData] = useState(() => computeExpensiveInitialValue());

// Group related state or use useReducer for complex state
const [form, setForm] = useState({ name: '', email: '', role: 'user' });
```

### useEffect

#### Dependency Array Rules
- Include ALL values from component scope that change over time
- Functions used inside effect should be defined inside effect or wrapped in useCallback
- Never lie about dependencies (ESLint rule: `react-hooks/exhaustive-deps`)

#### Cleanup Pattern
```typescript
useEffect(() => {
  const controller = new AbortController();

  async function fetchData() {
    try {
      const res = await fetch(url, { signal: controller.signal });
      const data = await res.json();
      setData(data);
    } catch (e) {
      if (e.name !== 'AbortError') setError(e);
    }
  }

  fetchData();
  return () => controller.abort();
}, [url]);
```

#### When NOT to Use useEffect
- **Data fetching**: Use React Query, SWR, or Server Components
- **Transforming data**: Compute during render instead
- **User events**: Use event handlers
- **Syncing with external stores**: Use `useSyncExternalStore`

### Custom Hooks

#### Rules
- Name starts with `use`
- Encapsulate reusable stateful logic
- One hook per concern
- Return values or object (not array for > 2 values)

```typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const newValue = value instanceof Function ? value(prev) : value;
      window.localStorage.setItem(key, JSON.stringify(newValue));
      return newValue;
    });
  }, [key]);

  return [storedValue, setValue] as const;
}
```

## Component Composition

### Compound Components
```typescript
function Tabs({ children, defaultValue }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div role="tablist">{children}</div>
    </TabsContext.Provider>
  );
}

Tabs.Tab = function Tab({ value, children }: TabProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  return (
    <button role="tab" aria-selected={activeTab === value} onClick={() => setActiveTab(value)}>
      {children}
    </button>
  );
};

Tabs.Panel = function Panel({ value, children }: PanelProps) {
  const { activeTab } = useTabsContext();
  if (activeTab !== value) return null;
  return <div role="tabpanel">{children}</div>;
};
```

### Slots Pattern (Children Composition)
```typescript
// Prefer composition over props for complex content
// Bad
<Card title="Hello" subtitle="World" icon={<Star />} actions={<Button>Edit</Button>} />

// Good
<Card>
  <Card.Header>
    <Card.Icon><Star /></Card.Icon>
    <Card.Title>Hello</Card.Title>
    <Card.Subtitle>World</Card.Subtitle>
  </Card.Header>
  <Card.Actions>
    <Button>Edit</Button>
  </Card.Actions>
</Card>
```

### Render Props (When Needed)
```typescript
<DataFetcher url="/api/users">
  {({ data, isLoading, error }) => {
    if (isLoading) return <Skeleton />;
    if (error) return <ErrorDisplay error={error} />;
    return <UserList users={data} />;
  }}
</DataFetcher>
```

## React Server Components

### Decision: Server vs Client
```
Default: Server Component (no directive needed)

Add 'use client' ONLY when you need:
- Event handlers (onClick, onChange, onSubmit)
- State (useState, useReducer)
- Effects (useEffect, useLayoutEffect)
- Browser-only APIs (window, localStorage)
- Custom hooks that use any of the above
- Third-party libraries that use client features
```

### Patterns
```typescript
// Server Component — fetches data directly
async function UserProfile({ userId }: { userId: string }) {
  const user = await db.user.findUnique({ where: { id: userId } });
  return (
    <div>
      <h1>{user.name}</h1>
      <UserActions userId={userId} /> {/* Client Component child */}
    </div>
  );
}

// Client Component — handles interactivity
'use client';
function UserActions({ userId }: { userId: string }) {
  const [isFollowing, setIsFollowing] = useState(false);
  return <Button onClick={() => toggleFollow(userId)}>Follow</Button>;
}
```

### Server Component Rules
- Cannot use hooks
- Cannot use browser APIs
- Cannot pass functions as props to Client Components
- CAN import and render Client Components
- CAN pass serializable data to Client Components

## Error Boundaries

```typescript
'use client';

class ErrorBoundary extends React.Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    reportError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
```

### Placement Strategy
- Route level: catch page-level crashes
- Feature level: isolate feature failures from rest of page
- Data level: wrap async data components
- Never at leaf component level (too granular)

## Suspense

```typescript
// Wrap async components
<Suspense fallback={<TableSkeleton />}>
  <UserTable />
</Suspense>

// Nested Suspense for granular loading
<Suspense fallback={<PageSkeleton />}>
  <Header />
  <Suspense fallback={<SidebarSkeleton />}>
    <Sidebar />
  </Suspense>
  <Suspense fallback={<ContentSkeleton />}>
    <MainContent />
  </Suspense>
</Suspense>
```

## Context Optimization

### Problem: Context causes unnecessary re-renders

### Solutions
1. **Split contexts by update frequency**
```typescript
const ThemeContext = createContext<Theme>(defaultTheme);     // Rare updates
const UIStateContext = createContext<UIState>(defaultState);  // Frequent updates
```

2. **Memoize context value**
```typescript
function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}
```

3. **Use selectors (Zustand, Jotai)**
```typescript
const userName = useStore(state => state.user.name);
```

## Rendering Optimization

### React.memo
```typescript
// Only use when:
// 1. Renders often with same props
// 2. Re-rendering is expensive
// 3. Props are referentially stable
const ExpensiveList = React.memo(function ExpensiveList({ items }: { items: Item[] }) {
  return items.map(item => <ExpensiveItem key={item.id} item={item} />);
});
```

### useMemo / useCallback
- `useMemo`: expensive computations, referential equality
- `useCallback`: stable function references for memoized children
- Profile BEFORE memoizing — premature optimization is common

### Virtualization
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';
// For lists > 100 items, use windowing
```

## Testing Strategies

### Query Priority (React Testing Library)
1. `getByRole` — accessible to everyone
2. `getByLabelText` — form fields
3. `getByPlaceholderText` — if no label
4. `getByText` — non-interactive elements
5. `getByTestId` — last resort

### What to Test
- User interactions produce expected outcomes
- Conditional rendering based on props/state
- Error states and edge cases
- Accessibility (role, label, state)
- Integration with data fetching (MSW)

## Anti-Patterns

- `useEffect` for data fetching in modern React
- Prop drilling more than 2 levels
- Storing derived state (compute instead)
- `useEffect` to sync state (`setState` inside `useEffect` based on props)
- Huge monolithic components (> 200 lines)
- Index as key for dynamic lists
- Direct DOM manipulation (use refs sparingly)
- Testing implementation details (state values, method calls)

## Skill Type

**FLEXIBLE** — Apply these patterns based on the specific React version, project structure, and team conventions. The principles are consistent, but implementation details may vary across projects.
