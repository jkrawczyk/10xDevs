# Testing Guidelines

This project uses Vitest for unit tests and Playwright for end-to-end (E2E) tests.

## Unit Testing with Vitest

Unit tests focus on testing individual components, functions, and modules in isolation.

### Running Unit Tests

```bash
# Run tests once
npm test

# Run tests in watch mode during development
npm run test:watch

# Open the Vitest UI for interactive testing
npm run test:ui

# Generate a coverage report
npm run test:coverage
```

### Writing Unit Tests

- Place test files next to the implementation files with a `.test.tsx` or `.test.ts` extension
- Use the testing utilities from `src/test/utils.tsx` for rendering components
- Leverage the `vi` object for mocks and spies
- Follow the Arrange-Act-Assert pattern for clear test structure

Example:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## End-to-End Testing with Playwright

E2E tests verify the application works correctly from a user's perspective by simulating real user interactions.

### Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Debug E2E tests
npm run test:e2e:debug

# Generate tests using Playwright's codegen
npm run test:e2e:codegen
```

### Writing E2E Tests

- Place test files in the `e2e` directory with a `.spec.ts` extension
- Use the Page Object Model pattern with objects in `e2e/page-objects`
- Focus on user flows and critical paths
- Use visual assertions where appropriate

Example:

```ts
import { test, expect } from '@playwright/test';
import { HomePage } from './page-objects/HomePage';

test('user can log in', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigateTo('/');
  await homePage.login('test@example.com', 'password');
  expect(await homePage.isLoggedIn()).toBeTruthy();
});
```

## Best Practices

1. **Write Tests First**: Consider writing tests before implementation (TDD) when possible
2. **Keep Tests Simple**: Each test should verify one specific behavior
3. **Use Appropriate Tools**: Unit test for logic, E2E for user flows
4. **Maintain Test Independence**: Tests should not depend on each other
5. **Clean Up**: Tests should clean up after themselves
6. **Use Realistic Data**: Tests should use data that resembles production
7. **Continuous Integration**: Tests should run on every pull request
8. **Coverage**: Aim for meaningful test coverage rather than arbitrary percentages

## Testing Structure

- `src/test/` - Unit test utilities and setup
- `src/**/*.test.ts` - Unit tests for specific components/functions
- `e2e/` - E2E test specs
- `e2e/page-objects/` - Page Object Model implementations 