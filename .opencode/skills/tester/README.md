# tester Skill

This skill enables agents to perform comprehensive testing across frontend (React), backend (Supabase/FastAPI), and system-level behaviors including functionality, performance, security, and ML/AI workflows.

## Overview

The tester skill provides capabilities for:
- Designing and executing test strategies
- Writing unit, integration, and end-to-end tests
- Testing frontend React components and applications
- Testing backend Supabase/FastAPI services
- Validating system-level behaviors and integrations
- Performance testing and benchmarking
- Security testing and vulnerability assessment
- Testing ML/AI workflows (if applicable)

## Usage

When an agent with this skill performs testing, it will:
1. Analyze the application or system to be tested
2. Identify test scenarios based on requirements and risks
3. Write appropriate tests at different levels (unit, integration, e2e)
4. Execute tests and analyze results
5. Identify and document bugs or issues
6. Suggest fixes or improvements
7. Retest to verify fixes
8. Generate test reports and metrics

## Testing Dimensions

### Frontend Testing (React)
- Component unit tests with React Testing Library or Jest
- Integration tests for component interactions
- End-to-end tests with Cypress, Playwright, or similar
- Accessibility testing (axe-core, etc.)
- Visual regression testing (if applicable)
- Performance testing (rendering, bundle size)

### Backend Testing (Supabase/FastAPI)
- Database query and function testing
- API endpoint testing (if using Supabase functions or FastAPI)
- Authentication and authorization testing
- Row Level Security policy validation
- Storage operations testing
- Edge function testing (if applicable)

### System-Level Testing
- Integration tests between frontend and backend
- Data flow validation
- Error handling and edge case testing
- Performance and load testing
- Security testing (OWASP, authentication, authorization)
- Deployment and environment testing
- Backup and recovery testing (if applicable)

### ML/AI Workflow Testing (if applicable)
- Model accuracy and validation testing
- Data pipeline testing
- Inference service testing
- Pre/post-processing validation
- Bias and fairness testing
- Model drift detection

## Configuration

No special configuration is required for this skill. It works out of the box with the standard tools provided.

## Testing Best Practices

### Test Organization
- Follow the testing pyramid (unit > integration > e2e)
- Name tests descriptively and consistently
- Group related tests logically
- Use appropriate test frameworks and libraries
- Keep tests independent and isolated
- Set up and tear down test data properly

### Test Quality
- Test one thing per test
- Use meaningful assertions
- Avoid brittle tests (don't test implementation details)
- Test both positive and negative cases
- Include edge cases and boundary conditions
- Mock external dependencies appropriately
- Keep tests fast and reliable

### Test Maintenance
- Update tests when requirements change
- Remove or update obsolete tests
- Fix flaky tests promptly
- Review test coverage regularly
- Treat test code with same respect as production code
- Document test strategy and approach

## Tools and Frameworks

While this skill doesn't mandate specific tools, common testing tools in this ecosystem include:
- Jest/Vitest for unit testing
- React Testing Library for React component testing
- Cypress/Playwright for end-to-end testing
- Supabase CLI for local testing
- Postman/Newman for API testing
- Lighthouse for performance audits
- OWASP ZAP for security testing
- Jest/Mocha for general JavaScript testing

## Reporting

When reporting test results, agents should include:
- Test summary (passed/failed/skipped)
- Failed test details with steps to reproduce
- Performance metrics and benchmarks
- Security findings with severity levels
- Recommendations for fixes and improvements
- Test coverage reports
- Trends compared to previous runs (if available)