# code-review Skill

This skill enables agents to perform senior-level code reviews, ensuring code changes meet production-grade standards across multiple dimensions including quality, architecture, security, performance, and maintainability.

## Overview

The code-review skill provides capabilities for:
- Analyzing code changes for quality and consistency
- Identifying architectural issues
- Detecting security vulnerabilities
- Evaluating performance implications
- Assessing maintainability and readability
- Ensuring adherence to coding standards

## Usage

When an agent with this skill reviews code changes, it will:
1. Examine the diff of changes
2. Check for adherence to coding standards and best practices
3. Identify potential security issues
4. Evaluate performance impact
5. Assess architectural consistency
6. Provide actionable feedback for improvement
7. Determine if changes are ready for production

## Configuration

No special configuration is required for this skill. It works out of the box with the standard tools provided.

## Review Dimensions

### Code Quality
- Follows established coding conventions
- Proper error handling
- Clear and descriptive naming
- Appropriate commenting
- Consistent formatting

### Architecture
- Follows established patterns
- Proper separation of concerns
- Appropriate abstraction levels
- Minimal coupling
- High cohesion where appropriate

### Security
- No hardcoded secrets
- Proper input validation
- Safe API usage
- Authentication/authorization checks
- Data protection measures

### Performance
- Efficient algorithms and data structures
- Minimal unnecessary computations
- Proper caching strategies
- Database query optimization
- Memory usage considerations

### Maintainability
- Clear and logical structure
- Appropriate modularity
- Testability
- Documentation completeness
- Follows DRY principles

## Best Practices

- Review changes in small, manageable chunks
- Focus on both what is changed and what might be missing
- Consider the broader system impact
- Provide specific, actionable feedback
- Balance criticism with recognition of good practices
- Prioritize critical issues over stylistic preferences