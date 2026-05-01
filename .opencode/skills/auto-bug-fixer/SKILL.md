# 🧠 Skill: Auto Bug Fixer Agent

## 🎯 Purpose

An autonomous debugging and resolution agent that **analyzes failed tests, identifies root causes, generates fixes, and validates them** without introducing regressions.

This skill closes the loop:
→ Detect (Testing Agent)
→ Fix (Auto Fixer)
→ Re-test → Stabilize

---

## 🧩 Scope

### ✅ Includes

* Bug root-cause analysis
* Code-level fixes (frontend + backend)
* API error resolution
* Supabase query/schema fixes
* RLS policy correction
* Form validation fixes
* State management bug fixes
* Performance issue mitigation (basic)
* Regression-safe patching
* Iterative fix + re-test loop

---

### ❌ Excludes

* Major architectural redesign
* Feature redesign (handled by Feature Builder)
* Manual UX/design decisions
* Infrastructure-level failures (Vercel infra, outages)

---

## 📥 Inputs

* Structured test output (from Testing Agent)
* Error logs / stack traces
* Affected files/modules
* API responses
* Database schema (if relevant)

---

## 📤 Outputs

* Fixed code (diff or updated files)
* Root cause explanation
* Patch summary
* Updated tests (if needed)
* Validation result (pass/fail)
* Regression check status

---

## 🧠 Decision Logic

### ✅ Use this skill when:

* Tests fail
* Bugs are detected
* API errors occur
* UI breaks due to logic issues
* Data inconsistency is found

---

### ❌ Ignore this skill when:

* New feature is required
* System redesign is needed
* No reproducible issue exists

---

## ⚙️ Execution Steps

### 1. Bug Intake & Classification

Parse input:

```json
{
  "layer": "api",
  "error": "401 Unauthorized",
  "endpoint": "POST /stories"
}
```

Classify:

* UI / API / DB / Auth / AI / Performance

---

### 2. Root Cause Analysis

Identify:

* Incorrect logic?
* Missing validation?
* RLS misconfiguration?
* Broken state update?
* Incorrect API usage?

---

### 3. Fix Strategy Selection

| Issue Type  | Fix Strategy                  |
| ----------- | ----------------------------- |
| UI bug      | Fix component logic / state   |
| API error   | Fix request/response handling |
| DB issue    | Update schema/query           |
| Auth issue  | Fix RLS or token handling     |
| Performance | Optimize query/render         |

---

### 4. Code Patch Generation

Apply **minimal, targeted fix**:

#### Example:

```diff
- const { data } = await supabase.from("stories").select("*")
+ const { data, error } = await supabase.from("stories").select("*")
+ if (error) throw error
```

---

### 5. Supabase Fixes (if needed)

* Update:

  * Queries
  * Relationships
  * RLS policies

Example:

```sql
-- Fix RLS policy
CREATE POLICY "Users can access own stories"
ON stories
FOR SELECT
USING (auth.uid() = user_id);
```

---

### 6. Frontend Fixes

* Handle:

  * Null/undefined data
  * Loading states
  * Error boundaries
  * Form validation

---

### 7. Re-Test Execution

* Re-run failing tests
* Validate:

  * Bug resolved
  * No new failures introduced

---

### 8. Regression Check

* Run related tests
* Ensure:

  * Existing features unaffected

---

### 9. Patch Summary Generation

```id="d6t3z9"
Bug: Unauthorized API access
Cause: Missing RLS policy
Fix: Added user-based SELECT policy
Status: Resolved
```

---

## 📏 Quality Standards

* Fix must be:

  * Minimal (no unnecessary changes)
  * Targeted (specific to issue)
  * Safe (no regression)
  * Clean (readable code)

* Never:

  * Break existing features
  * Introduce hardcoded values
  * Bypass security checks

---

## 🚨 Edge Cases

* Non-reproducible bug
* Multiple overlapping issues
* Partial fixes causing new failures
* Async race conditions
* Supabase latency issues
* Invalid test cases (false failures)

---

## 🔁 Iteration Strategy

1. Fix primary issue
2. Re-test
3. If fail:

   * Refine root cause
   * Apply improved fix
4. Repeat until:
   → All tests pass
   → System stable

---

## 🧪 Validation

* Original failing test passes
* No new test failures
* Feature behaves as expected
* Data integrity maintained
* Security rules enforced

---

## 🔗 Dependencies

* PyTest
* Supabase client
* React debugging tools
* Logging utilities

---

## 📚 References

* Debugging best practices
* Clean code patching principles
* Supabase RLS documentation
* Error handling patterns (frontend + backend)

