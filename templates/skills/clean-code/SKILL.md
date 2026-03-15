---
name: clean-code
description: When the user needs code quality review, refactoring guidance, SOLID principles application, or help identifying and fixing code smells.
---

# Clean Code

## Overview

Apply clean code principles to produce readable, maintainable, and testable software. This skill covers SOLID principles, DRY application, code smell identification, refactoring patterns, naming conventions, error handling, and complexity management. Based on the works of Robert C. Martin, Martin Fowler, and Kent Beck.

## Process

1. Read and understand the existing code in full context
2. Identify code smells and anti-patterns
3. Assess cyclomatic complexity and coupling
4. Apply relevant refactoring patterns
5. Verify behavior preservation (tests must still pass)
6. Review naming, structure, and documentation

## SOLID Principles

### S — Single Responsibility Principle
A class/module should have one, and only one, reason to change.

**Smell**: A class that changes for multiple unrelated reasons.
**Fix**: Extract responsibilities into separate classes.

### O — Open/Closed Principle
Software entities should be open for extension but closed for modification.

**Smell**: Switch statements that grow with new types.
**Fix**: Use polymorphism, strategy pattern, or plugin architecture.

### L — Liskov Substitution Principle
Subtypes must be substitutable for their base types without altering correctness.

**Smell**: Subclass overrides method to throw "not supported" or changes behavior.
**Fix**: Restructure the hierarchy; prefer composition over inheritance.

### I — Interface Segregation Principle
No client should be forced to depend on methods it does not use.

**Smell**: Interfaces with many methods where implementors leave some as no-ops.
**Fix**: Split into smaller, focused interfaces.

### D — Dependency Inversion Principle
Depend on abstractions, not concretions.

**Smell**: High-level modules importing low-level modules directly.
**Fix**: Inject dependencies via interfaces/abstract classes.

## Naming Conventions

### Rules
- **Variables**: nouns describing what they hold (`userCount`, not `n`)
- **Booleans**: prefixed with `is`, `has`, `can`, `should` (`isActive`, `hasPermission`)
- **Functions**: verbs describing what they do (`calculateTotal`, `fetchUsers`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
- **Classes**: PascalCase nouns (`UserRepository`, `PaymentService`)
- **Interfaces**: describe capability (`Serializable`, `Cacheable`) or use `I` prefix if convention requires

### Name Length Guidelines
- Loop counters: 1-2 chars (`i`, `j`) — only in tiny loops
- Lambda params: 1-3 chars when context is clear (`users.filter(u => u.active)`)
- Local variables: short but descriptive (`total`, `result`)
- Function names: medium length, descriptive (`calculateMonthlyRevenue`)
- Class names: as long as needed (`AuthenticationTokenValidator`)

## Function Guidelines

### Size
- Functions should do one thing
- Ideal: 5-15 lines (excluding boilerplate)
- Maximum: 30 lines (beyond this, extract)
- Maximum parameters: 3 (beyond this, use an options object)

### Structure
```
function doSomething(input) {
  // 1. Validate input (guard clauses)
  // 2. Core logic (one level of abstraction)
  // 3. Return result
}
```

### Guard Clauses (Early Return)
```typescript
// Bad: nested conditions
function getDiscount(user) {
  if (user) {
    if (user.isPremium) {
      if (user.orderCount > 10) {
        return 0.2;
      }
    }
  }
  return 0;
}

// Good: guard clauses
function getDiscount(user) {
  if (!user) return 0;
  if (!user.isPremium) return 0;
  if (user.orderCount <= 10) return 0;
  return 0.2;
}
```

## Code Smells Catalog

### Bloaters
| Smell | Detection | Refactoring |
|---|---|---|
| Long Method | > 30 lines | Extract Method |
| Large Class | > 300 lines or > 5 responsibilities | Extract Class |
| Long Parameter List | > 3 parameters | Introduce Parameter Object |
| Data Clumps | Same group of params appear together | Extract Class |
| Primitive Obsession | Using primitives instead of small objects | Replace with Value Object |

### Object-Orientation Abusers
| Smell | Detection | Refactoring |
|---|---|---|
| Switch Statements | Switch on type | Replace with Polymorphism |
| Parallel Inheritance | Every subclass requires parallel subclass | Merge hierarchies |
| Refused Bequest | Subclass doesn't use inherited methods | Replace Inheritance with Delegation |

### Change Preventers
| Smell | Detection | Refactoring |
|---|---|---|
| Divergent Change | One class changed for multiple reasons | Extract Class (SRP) |
| Shotgun Surgery | One change requires touching many classes | Move Method, Inline Class |

### Dispensables
| Smell | Detection | Refactoring |
|---|---|---|
| Dead Code | Unreachable or unused code | Remove |
| Speculative Generality | Unused abstractions "just in case" | Collapse Hierarchy, Remove |
| Comments explaining bad code | Comments compensating for unclear code | Rename, Extract Method |

## Error Handling Patterns

### Prefer
- Specific error types over generic errors
- Error results over thrown exceptions (in functional style)
- Fail fast at system boundaries
- Meaningful error messages with context

### Pattern: Result Type
```typescript
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

function parseConfig(raw: string): Result<Config, ParseError> {
  try {
    const config = JSON.parse(raw);
    if (!isValidConfig(config)) {
      return { success: false, error: new ParseError('Invalid config structure') };
    }
    return { success: true, data: config };
  } catch {
    return { success: false, error: new ParseError('Invalid JSON') };
  }
}
```

### Never Do
- Catch and swallow errors silently
- Use exceptions for control flow
- Return null to indicate an error
- Log and rethrow without adding context

## Comment Philosophy

### Good Comments
- **Why**: explains the reasoning behind a non-obvious decision
- **Legal**: copyright, license headers
- **TODO**: with ticket reference (`// TODO(PROJ-123): ...`)
- **Warning**: explains consequences (`// WARNING: This is not thread-safe`)
- **API docs**: public interface documentation (JSDoc/TSDoc)

### Bad Comments (Remove and Fix the Code Instead)
- Restating what the code does (`// increment counter` before `counter++`)
- Commented-out code (use version control)
- Journal comments (use git log)
- Closing brace comments (`} // end if`)
- Mandated comments on obvious code

## Complexity Metrics

### Cyclomatic Complexity
- 1-5: Simple, low risk
- 6-10: Moderate, consider refactoring
- 11-20: Complex, should refactor
- 21+: Very high risk, must refactor

### Cognitive Complexity (Sonar)
Measures how hard code is to understand. Penalizes nesting more than branching.

### Reducing Complexity
1. Extract complex conditions into named booleans
2. Replace nested conditionals with guard clauses
3. Use polymorphism instead of type checking
4. Decompose into smaller functions
5. Use lookup tables instead of switch/if chains

## Immutability Preferences

- Default to `const` (JavaScript/TypeScript)
- Use readonly properties and ReadonlyArray
- Prefer spread/destructuring over mutation
- Use immutable update patterns for state
- Only mutate when performance profiling demands it

## DRY Application

### When to DRY
- Exact duplication of logic (not just similar structure)
- Three or more occurrences (Rule of Three)
- When the duplicated code would change together

### When NOT to DRY
- Superficially similar code that serves different purposes
- Two occurrences only (wait for a third)
- When abstracting adds more complexity than the duplication

## Anti-Patterns

- Premature abstraction (DRYing code that shouldn't be)
- God classes that know everything
- Feature envy (method uses another class's data more than its own)
- Stringly typed data (using strings where enums/types belong)
- Magic numbers without named constants
- Boolean trap (function with boolean params that change behavior)

## Skill Type

**FLEXIBLE** — Apply principles based on context. Not every function needs to be 5 lines; not every pattern needs to be SOLID. Use judgment and optimize for team readability over theoretical purity.
