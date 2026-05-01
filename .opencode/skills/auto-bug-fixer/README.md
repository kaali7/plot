# auto-bug-fixer Skill

This skill enables agents to automatically debug and fix code issues by analyzing test failures, identifying root causes, generating fixes, and validating solutions.

## Overview

The auto-bug-fixer skill provides capabilities for:
- Analyzing failed test outputs
- Identifying root causes of bugs
- Generating targeted fixes
- Validating fixes against existing test suites
- Ensuring no regressions are introduced

## Usage

When an agent with this skill encounters a failing test, it will:
1. Examine the test failure details
2. Analyze the relevant code sections
3. Identify the root cause of the failure
4. Generate a minimal fix that addresses the issue
5. Run tests to verify the fix works
6. Ensure no existing functionality is broken

## Configuration

No special configuration is required for this skill. It works out of the box with the standard tools provided.

## Example Workflow

1. Test suite runs and reports failures
2. Agent with auto-bug-fixer skill is invoked
3. Agent analyzes failure logs and stack traces
4. Agent locates the problematic code
5. Agent formulates a hypothesis about the root cause
6. Agent generates a fix based on the hypothesis
7. Agent applies the fix and re-runs tests
8. If tests pass, the fix is validated; otherwise, the process repeats with new insights

## Best Practices

- Always run a full test suite after applying fixes
- Keep changes minimal and focused
- Document the reasoning behind each fix
- Consider edge cases that might be affected by the fix