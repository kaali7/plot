# Testing Rules

## Testing Philosophy
1. Test user behavior, not implementation details
2. Prioritize critical user paths and edge cases
3. Maintain a balance between unit, integration, and end-to-end tests
4. Tests should be deterministic and isolated when possible

## Unit Testing
1. Test individual functions, components, and hooks in isolation
2. Use Jest and React Testing Library for frontend unit tests
3. Mock external dependencies (Supabase, APIs) appropriately
4. Aim for high coverage on complex business logic
5. Test both positive and negative cases

## Integration Testing
1. Test interactions between components and services
2. Verify Supabase queries and mutations work correctly
3. Test API endpoints and data flow
4. Use realistic test data that mirrors production scenarios
5. Test authentication flows and authorization rules

## End-to-End Testing (When Applicable)
1. Simulate real user journeys through the application
2. Test critical paths: user registration, story creation, overview editing
3. Use Cypress or Playwright for reliable E2E tests
4. Run E2E tests against staging environment before production deploys
5. Keep E2E test suite focused to maintain reasonable runtime

## Test Organization
1. Place tests alongside the code they test (`*.test.tsx` or `*.test.ts`)
2. For unit tests: `__tests__` folder or `.test.ts` suffix
3. Group related tests in describe blocks with clear names
4. Use beforeEach/afterEach for test setup and teardown
5. Clean up mocks and spies between tests

## Test Execution
1. Run frontend tests: `npm run test` (when test script is configured)
2. Run linting: `npm run lint` (when lint script is configured)
3. Type checking: `npx tsc --noEmit`
4. Execute tests before creating pull requests
5. Fix failing tests immediately; never commit with known test failures

## Test Quality
1. Write descriptive test names that explain the scenario and expected outcome
2. Use Arrange-Act-Assert pattern for clarity
3. Avoid testing implementation details; focus on outputs and behavior
4. Keep tests fast and reliable; avoid sleep/wait when possible
5. Regularly review and refactor tests as code evolves