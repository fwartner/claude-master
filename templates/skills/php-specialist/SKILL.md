---
name: php-specialist
description: Use when writing modern PHP 8.x code — enums, fibers, readonly properties, PSR standards, Composer, static analysis, SOLID patterns
---

# PHP Specialist

## Overview

Write modern, type-safe, and maintainable PHP 8.x code adhering to PSR standards and SOLID principles. This skill covers the full modern PHP toolchain: language features introduced in PHP 8.0 through 8.4, PSR interoperability standards, Composer dependency management, static analysis with PHPStan and Psalm, coding style enforcement with PHP CS Fixer and Pint, and architectural patterns that leverage the type system for correctness at compile time rather than runtime.

## Process

### Phase 1: Environment Assessment
1. Identify PHP version from `composer.json` → `require.php`
2. Review `composer.json` for autoloading strategy (PSR-4 namespaces)
3. Check for static analysis configuration (`phpstan.neon`, `psalm.xml`)
4. Identify coding standard tool (`pint.json`, `.php-cs-fixer.php`)
5. Catalog existing patterns: enums, DTOs, value objects, interfaces

### Phase 2: Design
1. Define interfaces and contracts before implementations
2. Design value objects and DTOs with readonly properties
3. Map domain concepts to backed enums where applicable
4. Plan exception hierarchy for the domain
5. Identify seams for dependency injection

### Phase 3: Implementation
1. Write interfaces first — contracts before concrete classes
2. Implement with constructor promotion, readonly properties, union/intersection types
3. Use match expressions over switch; named arguments for clarity
4. Leverage first-class callable syntax for functional composition
5. Apply SOLID principles at every class boundary

### Phase 4: Quality Assurance
1. Run PHPStan at maximum achievable level (target level 9)
2. Enforce coding style with PHP CS Fixer or Laravel Pint
3. Verify type coverage — no `mixed` without justification
4. Review for SOLID violations and code smells
5. Confirm Composer autoload is optimized (`--classmap-authoritative`)

## Modern PHP 8.x Features

### Enums (PHP 8.1+)

```php
// Backed enum with methods — replaces class constants and magic strings
enum OrderStatus: string
{
    case Draft     = 'draft';
    case Pending   = 'pending';
    case Confirmed = 'confirmed';
    case Shipped   = 'shipped';
    case Delivered = 'delivered';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::Draft     => 'Draft',
            self::Pending   => 'Pending Review',
            self::Confirmed => 'Confirmed',
            self::Shipped   => 'Shipped',
            self::Delivered => 'Delivered',
            self::Cancelled => 'Cancelled',
        };
    }

    public function isFinal(): bool
    {
        return in_array($this, [self::Delivered, self::Cancelled], true);
    }

    /** @return list<self> */
    public static function active(): array
    {
        return array_filter(self::cases(), fn (self $s) => ! $s->isFinal());
    }
}
```

### Readonly Properties and Classes (PHP 8.1 / 8.2)

```php
// Readonly class — all properties are implicitly readonly
readonly class Money
{
    public function __construct(
        public int    $amount,
        public string $currency,
    ) {}

    public function add(self $other): self
    {
        if ($this->currency !== $other->currency) {
            throw new CurrencyMismatchException($this->currency, $other->currency);
        }

        return new self($this->amount + $other->amount, $this->currency);
    }

    public function isPositive(): bool
    {
        return $this->amount > 0;
    }
}
```

### Constructor Promotion

```php
class CreateUserAction
{
    public function __construct(
        private readonly UserRepository $users,
        private readonly Hasher         $hasher,
        private readonly EventDispatcher $events,
    ) {}

    public function execute(CreateUserData $data): User
    {
        $user = $this->users->create([
            'name'     => $data->name,
            'email'    => $data->email,
            'password' => $this->hasher->make($data->password),
        ]);

        $this->events->dispatch(new UserCreated($user));

        return $user;
    }
}
```

### Named Arguments

```php
// Improves readability for functions with many parameters or boolean flags
$user = User::create(
    name: $request->name,
    email: $request->email,
    isAdmin: false,
    sendWelcomeEmail: true,
);

// Particularly valuable with optional parameters
$response = Http::timeout(seconds: 30)
    ->retry(times: 3, sleepMilliseconds: 500, throw: true)
    ->get($url);
```

### Match Expressions

```php
// match is strict (===), exhaustive, and returns a value
$discount = match (true) {
    $total >= 10000 => 0.15,
    $total >= 5000  => 0.10,
    $total >= 1000  => 0.05,
    default         => 0.00,
};

// Replaces switch with no fall-through risk
$handler = match ($event::class) {
    OrderPlaced::class   => new HandleOrderPlaced(),
    PaymentFailed::class => new HandlePaymentFailed(),
    default              => throw new UnhandledEventException($event),
};
```

### Union and Intersection Types

```php
// Union type — accepts either type
function findUser(int|string $identifier): User
{
    return is_int($identifier)
        ? User::findOrFail($identifier)
        : User::where('email', $identifier)->firstOrFail();
}

// Intersection type — must satisfy all interfaces
function processLoggableEntity(Loggable&Serializable $entity): void
{
    $entity->log();
    $data = $entity->serialize();
}

// DNF types (PHP 8.2) — combine union and intersection
function handle((Renderable&Countable)|string $content): string
{
    if (is_string($content)) {
        return $content;
    }

    return $content->render();
}
```

### First-Class Callable Syntax (PHP 8.1+)

```php
// Create closures from named functions
$slugify = Str::slug(...);
$titles  = array_map($slugify, $names);

// Method references
$validator = Validator::make(...);

// Useful for pipeline / collection patterns
$activeUsers = collect($users)
    ->filter(UserPolicy::isActive(...))
    ->map(UserTransformer::toArray(...))
    ->values();
```

### Fibers (PHP 8.1+)

```php
// Fibers enable cooperative multitasking — foundation for async frameworks
$fiber = new Fiber(function (): void {
    $value = Fiber::suspend('paused');
    echo "Resumed with: {$value}";
});

$result = $fiber->start();        // Returns 'paused'
$fiber->resume('hello world');    // Prints: "Resumed with: hello world"

// Practical use: async HTTP client internals, event loops (Revolt, ReactPHP)
// Application developers rarely use Fiber directly — frameworks abstract it
```

## PSR Standards

| PSR | Name | Relevance |
|---|---|---|
| PSR-1 | Basic Coding Standard | Baseline: `<?php` tag, UTF-8, namespace/class conventions |
| PSR-4 | Autoloading | Map namespaces to directories in `composer.json` — mandatory |
| PSR-7 | HTTP Message Interfaces | Immutable request/response objects for middleware pipelines |
| PSR-11 | Container Interface | Dependency injection container interoperability |
| PSR-12 | Extended Coding Style | Supersedes PSR-2: formatting, spacing, declarations |
| PSR-15 | HTTP Server Middleware | `MiddlewareInterface` and `RequestHandlerInterface` |
| PSR-17 | HTTP Factories | Create PSR-7 objects (RequestFactory, ResponseFactory) |
| PSR-18 | HTTP Client | `ClientInterface` for interoperable HTTP clients |

### PSR-4 Autoloading

```json
{
    "autoload": {
        "psr-4": {
            "App\\": "app/",
            "Domain\\": "src/Domain/"
        }
    },
    "autoload-dev": {
        "psr-4": {
            "Tests\\": "tests/"
        }
    }
}
```

Rule: namespace segment maps 1:1 to directory. `App\Http\Controllers\UserController` lives at `app/Http/Controllers/UserController.php`.

## Composer Dependency Management

### Essential Commands

| Command | Purpose |
|---|---|
| `composer require package/name` | Add production dependency |
| `composer require package/name --dev` | Add development dependency |
| `composer update --dry-run` | Preview what would change |
| `composer why package/name` | Show why a package is installed |
| `composer audit` | Check for known security vulnerabilities |
| `composer bump` | Update version constraints to installed versions |
| `composer validate --strict` | Validate `composer.json` and `composer.lock` |

### Best Practices
- Always commit `composer.lock` — reproducible installs across environments
- Use `^` (caret) constraints: `"laravel/framework": "^12.0"` allows minor/patch updates
- Separate dev dependencies: testing, static analysis, and debug tools go in `require-dev`
- Run `composer audit` in CI to catch known vulnerabilities
- Use `composer dump-autoload --classmap-authoritative` in production for speed

## Static Analysis

### PHPStan Levels

| Level | What It Checks |
|---|---|
| 0 | Basic: undefined variables, unknown classes, wrong function calls |
| 1 | + possibly undefined variables, unknown methods on `$this` |
| 2 | + unknown methods on all expressions (not just `$this`) |
| 3 | + return types verified |
| 4 | + dead code, always-true/false conditions |
| 5 | + argument types of function calls |
| 6 | + missing typehints reported |
| 7 | + union types checked exhaustively |
| 8 | + nullable types checked strictly |
| 9 | + `mixed` type is forbidden without explicit handling |

### PHPStan Configuration

```neon
# phpstan.neon
parameters:
    level: 9
    paths:
        - app
        - src
    excludePaths:
        - app/Console/Kernel.php
    ignoreErrors: []
    checkMissingIterableValueType: true
    checkGenericClassInNonGenericObjectType: true

includes:
    - vendor/larastan/larastan/extension.neon  # Laravel-specific rules
```

### PHP CS Fixer / Pint

```php
// .php-cs-fixer.php — for non-Laravel projects
return (new PhpCsFixer\Config())
    ->setRules([
        '@PER-CS'            => true,
        'strict_types'       => true,
        'declare_strict_types' => true,
        'ordered_imports'    => ['sort_algorithm' => 'alpha'],
        'no_unused_imports'  => true,
        'trailing_comma_in_multiline' => true,
    ])
    ->setFinder(
        PhpCsFixer\Finder::create()->in([__DIR__ . '/src', __DIR__ . '/tests'])
    );
```

For Laravel projects, use Pint with a `pint.json` preset — it wraps PHP CS Fixer with Laravel-specific defaults.

## SOLID Principles in PHP

| Principle | Guideline | PHP Mechanism |
|---|---|---|
| **S** — Single Responsibility | One reason to change per class | Action classes, small services |
| **O** — Open/Closed | Extend behavior without modifying source | Interfaces, strategy pattern, enums |
| **L** — Liskov Substitution | Subtypes must be substitutable for base types | Covariant returns, contravariant params |
| **I** — Interface Segregation | Clients depend only on methods they use | Small, focused interfaces |
| **D** — Dependency Inversion | Depend on abstractions, not concretions | Constructor injection, interface bindings |

### Dependency Inversion Example

```php
// Contract (abstraction)
interface PaymentGateway
{
    public function charge(Money $amount, PaymentMethod $method): PaymentResult;
}

// Implementation (concretion) — can be swapped without changing consumers
final class StripeGateway implements PaymentGateway
{
    public function __construct(private readonly StripeClient $client) {}

    public function charge(Money $amount, PaymentMethod $method): PaymentResult
    {
        // Stripe-specific logic
    }
}

// Consumer depends on abstraction only
final class ProcessPaymentAction
{
    public function __construct(private readonly PaymentGateway $gateway) {}

    public function execute(Order $order): PaymentResult
    {
        return $this->gateway->charge($order->total, $order->paymentMethod);
    }
}
```

## Error Handling Patterns

### Custom Exception Hierarchy

```php
// Base domain exception
abstract class DomainException extends \RuntimeException {}

// Specific exceptions with factory methods
final class InsufficientFundsException extends DomainException
{
    public static function forAccount(Account $account, Money $required): self
    {
        return new self(sprintf(
            'Account %s has %d %s but %d %s is required.',
            $account->id,
            $account->balance->amount,
            $account->balance->currency,
            $required->amount,
            $required->currency,
        ));
    }
}
```

### Result Pattern (Error as Value)

```php
/** @template T */
readonly class Result
{
    /** @param T|null $value */
    private function __construct(
        public bool    $ok,
        public mixed   $value = null,
        public ?string $error = null,
    ) {}

    /** @param T $value */
    public static function success(mixed $value): self
    {
        return new self(ok: true, value: $value);
    }

    public static function failure(string $error): self
    {
        return new self(ok: false, error: $error);
    }
}

// Usage — caller must handle both paths
$result = $action->execute($data);
if (! $result->ok) {
    return response()->json(['error' => $result->error], 422);
}
```

## Type Safety Patterns

### Branded / Opaque Types via Readonly Classes

```php
// Prevent accidental mixing of IDs from different entities
readonly class UserId
{
    public function __construct(public int $value) {}

    public function equals(self $other): bool
    {
        return $this->value === $other->value;
    }
}

readonly class OrderId
{
    public function __construct(public int $value) {}
}

// Compiler prevents: processOrder(new UserId(1)) when OrderId is expected
function processOrder(OrderId $orderId): void { /* ... */ }
```

### Generic Collections via PHPStan Annotations

```php
/**
 * @template T
 * @implements \IteratorAggregate<int, T>
 */
final class TypedCollection implements \IteratorAggregate, \Countable
{
    /** @param list<T> $items */
    public function __construct(private array $items = []) {}

    /** @param T $item */
    public function add(mixed $item): void
    {
        $this->items[] = $item;
    }

    /** @return \ArrayIterator<int, T> */
    public function getIterator(): \ArrayIterator
    {
        return new \ArrayIterator($this->items);
    }

    public function count(): int
    {
        return count($this->items);
    }
}
```

## Anti-Patterns

- **Using `mixed` as an escape hatch** — Every `mixed` type is a hole in the safety net; narrow with union types or generics
- **Stringly-typed code** — Replace status strings, type indicators, and config keys with backed enums
- **God classes** — If a class has more than one reason to change, split it; use Action classes for single operations
- **Suppressing static analysis** — `@phpstan-ignore-line` should be rare and always accompanied by a comment explaining why
- **Not declaring strict types** — Every PHP file should begin with `declare(strict_types=1);`
- **Array-shaped data** — Replace associative arrays with readonly DTOs or value objects for domain data
- **Service locator pattern** — Never call `app()` or `resolve()` inside business logic; inject dependencies through the constructor
- **Catching `\Exception` broadly** — Catch specific exception types; re-throw or wrap unknown exceptions
- **Mutable value objects** — Value objects must be immutable; use `readonly` classes or return new instances
- **Ignoring Composer audit** — Run `composer audit` in CI; treat vulnerabilities as build failures
- **Deep inheritance hierarchies** — Prefer composition and interfaces over more than two levels of inheritance
- **Not using `final`** — Default to `final` on classes unless explicitly designed for extension

## Integration Points

| Skill | Integration |
|---|---|
| `laravel-specialist` | PHP 8.x features power Eloquent casts, enums, readonly DTOs, and typed collections |
| `senior-backend` | SOLID architecture, interface-driven design, error handling patterns |
| `test-driven-development` | PHPUnit/Pest testing with strong type assertions |
| `clean-code` | SOLID, DRY, code smell detection at the PHP level |
| `security-review` | Input validation, type coercion risks, dependency vulnerabilities |

## Skill Type

**FLEXIBLE** — Adapt the process phases to the scope of work. A single function may need only Phase 3 and 4. A new module or package should follow all four phases. Non-negotiable regardless of scope: `declare(strict_types=1)`, PHPStan compliance at the project's configured level, and PSR-4 autoloading.
