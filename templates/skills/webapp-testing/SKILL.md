---
name: webapp-testing
description: When the user needs Playwright-based web application testing — screenshots, browser log analysis, interaction verification, visual regression, accessibility, and network mocking.
---

# Web App Testing

## Overview

Comprehensive web application testing using Playwright as the primary tool. This skill covers end-to-end testing workflows including screenshot capture for visual verification, browser console log analysis, user interaction simulation, visual regression testing, accessibility auditing with axe-core, network request mocking, and mobile viewport testing.

## Process

### Phase 1: Test Planning
1. Identify critical user flows to test
2. Define test environments and viewports
3. Set up test fixtures and data
4. Configure Playwright project settings
5. Establish visual baseline screenshots

### Phase 2: Test Implementation
1. Write page object models for key pages
2. Implement end-to-end test scenarios
3. Add visual regression snapshots
4. Integrate accessibility checks
5. Configure network mocking for isolated tests

### Phase 3: CI Integration
1. Configure headless browser execution
2. Set up screenshot artifact collection
3. Configure retry and flake detection
4. Add reporting (HTML report, JUnit XML)
5. Set up visual diff review process

## Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Screenshot Capture Patterns

### Full Page Screenshots
```typescript
test('homepage renders correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.01,
  });
});
```

### Element Screenshots
```typescript
test('navigation bar matches design', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation');
  await expect(nav).toHaveScreenshot('navbar.png');
});
```

### Screenshot on Assertion Failure
```typescript
test('checkout flow', async ({ page }) => {
  await page.goto('/checkout');
  // Screenshot is auto-captured on failure via config
  await expect(page.getByText('Order confirmed')).toBeVisible();
});
```

### Comparison Options
```typescript
await expect(page).toHaveScreenshot('name.png', {
  maxDiffPixels: 100,          // Allow up to 100 different pixels
  maxDiffPixelRatio: 0.02,     // Or 2% pixel difference
  threshold: 0.2,              // Per-pixel color threshold (0-1)
  animations: 'disabled',      // Freeze CSS animations
  mask: [page.locator('.dynamic-content')], // Mask volatile areas
});
```

## Browser Log Analysis

```typescript
test('no console errors on page load', async ({ page }) => {
  const consoleMessages: string[] = [];
  const consoleErrors: string[] = [];

  page.on('console', msg => {
    consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', error => {
    consoleErrors.push(error.message);
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  expect(consoleErrors).toEqual([]);
});
```

## Interaction Verification

### Page Object Model
```typescript
class LoginPage {
  constructor(private page: Page) {}

  readonly emailInput = this.page.getByLabel('Email');
  readonly passwordInput = this.page.getByLabel('Password');
  readonly submitButton = this.page.getByRole('button', { name: 'Sign in' });
  readonly errorMessage = this.page.getByRole('alert');

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectError(message: string) {
    await expect(this.errorMessage).toContainText(message);
  }
}
```

### User Flow Testing
```typescript
test('user can complete purchase', async ({ page }) => {
  // Arrange
  const loginPage = new LoginPage(page);
  await page.goto('/login');
  await loginPage.login('user@test.com', 'password');

  // Act
  await page.getByRole('link', { name: 'Products' }).click();
  await page.getByRole('button', { name: 'Add to cart' }).first().click();
  await page.getByRole('link', { name: 'Cart (1)' }).click();
  await page.getByRole('button', { name: 'Checkout' }).click();

  // Assert
  await expect(page.getByText('Order confirmed')).toBeVisible({ timeout: 10000 });
  await expect(page.getByText('Order #')).toBeVisible();
});
```

## Visual Regression Testing

### Baseline Management
```bash
# Generate initial baselines
npx playwright test --update-snapshots

# Review changes
npx playwright show-report
```

### Dynamic Content Masking
```typescript
test('dashboard layout', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveScreenshot('dashboard.png', {
    mask: [
      page.locator('[data-testid="timestamp"]'),
      page.locator('[data-testid="user-avatar"]'),
      page.locator('.chart-container'),
    ],
    animations: 'disabled',
  });
});
```

## Accessibility Testing with axe-core

```typescript
import AxeBuilder from '@axe-core/playwright';

test('page has no accessibility violations', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .exclude('.third-party-widget')
    .analyze();

  expect(results.violations).toEqual([]);
});

test('form is accessible', async ({ page }) => {
  await page.goto('/contact');

  const results = await new AxeBuilder({ page })
    .include('form')
    .analyze();

  expect(results.violations).toEqual([]);
});
```

## Network Request Mocking

```typescript
test('displays users from API', async ({ page }) => {
  await page.route('**/api/users', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ]),
    });
  });

  await page.goto('/users');
  await expect(page.getByText('Alice')).toBeVisible();
  await expect(page.getByText('Bob')).toBeVisible();
});

test('handles API errors gracefully', async ({ page }) => {
  await page.route('**/api/users', route =>
    route.fulfill({ status: 500, body: 'Internal Server Error' })
  );

  await page.goto('/users');
  await expect(page.getByText('Something went wrong')).toBeVisible();
});
```

## Mobile Viewport Testing

```typescript
test.describe('mobile responsive', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('hamburger menu works', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('navigation')).not.toBeVisible();
    await page.getByRole('button', { name: 'Menu' }).click();
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('touch interactions work', async ({ page }) => {
    await page.goto('/gallery');
    const gallery = page.locator('.gallery');
    await gallery.evaluate(el => {
      el.dispatchEvent(new TouchEvent('touchstart', {
        touches: [new Touch({ identifier: 0, target: el, clientX: 200, clientY: 200 })],
      }));
    });
  });
});
```

## Test Organization

```
tests/
  e2e/
    auth/
      login.spec.ts
      register.spec.ts
    checkout/
      cart.spec.ts
      payment.spec.ts
    fixtures/
      test-data.ts
      auth.setup.ts
    pages/
      login.page.ts
      dashboard.page.ts
    utils/
      helpers.ts
```

## Quality Checklist

- [ ] All critical user flows covered
- [ ] Tests use accessible locators (role, label, text — not CSS selectors)
- [ ] Network mocking for isolated tests
- [ ] Visual regression baselines reviewed and approved
- [ ] Accessibility scans on all pages
- [ ] Mobile viewport tests for responsive features
- [ ] No `waitForTimeout` (use proper assertions instead)
- [ ] CI pipeline configured with retries
- [ ] Screenshot artifacts collected on failure
- [ ] Flaky tests identified and fixed (not skipped)

## Anti-Patterns

- Using CSS selectors or XPath (use accessible locators)
- `page.waitForTimeout()` (use `expect().toBeVisible()` or similar)
- Testing third-party components in detail
- Hardcoded test data that breaks across environments
- Tests that depend on execution order
- Ignoring flaky tests instead of fixing root cause
- Screenshot assertions without masking dynamic content

## Skill Type

**RIGID** — Follow the page object model pattern. All tests must use accessible locators. Accessibility checks are mandatory on every page. Screenshot baselines must be reviewed before merge.
