# 🧠 Skill: Code Reviewer Agent

## 🎯 Purpose

An autonomous senior-level review agent that analyzes code changes and ensures they meet **production-grade standards** across:

→ Code quality
→ Architecture consistency
→ Security
→ Performance
→ Maintainability

This skill acts as a **final gatekeeper before merge/deploy**.

---

## 🧩 Scope

### ✅ Includes

* Frontend code review (React + Tailwind)
* Backend/data review (Supabase queries, schema usage)
* Architecture validation (feature-based structure)
* Security review (auth, RLS, data exposure)
* Performance analysis (rendering, queries)
* Code smell detection
* Naming & structure consistency
* Dependency usage validation
* PR-level review (diff-based)

---

### ❌ Excludes

* Writing new features (Feature Builder handles that)
* Fixing bugs directly (Auto Fixer handles that)
* Running tests (Testing Agent handles that)
* Infra-level audits

---

## 📥 Inputs

* Code changes (diff / PR)
* Affected files/modules
* Project structure
* Coding standards (if defined)
* Related feature context (optional)

---

## 📤 Outputs

* Review report (structured)
* Severity-based issues
* Suggested improvements
* Refactoring recommendations
* Security warnings
* Performance flags
* Approval / Rejection decision

---

## 🧠 Decision Logic

### ✅ Use this skill when:

* Before merging PR
* Before deployment
* After major feature addition
* After bug fixes (to ensure quality)

---

### ❌ Ignore this skill when:

* No code changes
* Experimental/local drafts
* Non-functional content updates

---

## ⚙️ Execution Steps

### 1. Change Analysis

* Parse diff:

  * Added code
  * Modified code
  * Deleted code

* Identify:

  * Feature/module impacted
  * Critical vs minor changes

---

### 2. Code Quality Review

Check:

* Naming clarity
* Function size & complexity
* Readability
* DRY violations
* Dead code

---

### 3. Architecture Validation

Ensure:

* Feature-based structure maintained
* No tight coupling
* Proper separation:

  * UI
  * Logic
  * Data layer

---

### 4. React-Specific Review

* Check:

  * Proper hook usage
  * State management efficiency
  * Avoid unnecessary re-renders
  * Component reusability
  * Tailwind consistency

---

### 5. Supabase / Backend Review

* Validate:

  * Query efficiency
  * Correct table usage
  * Data integrity
  * No over-fetching

---

### 6. Security Review

* Check:

  * No exposed secrets
  * RLS respected
  * Auth checks present
  * Input validation

---

### 7. Performance Review

* Detect:

  * Heavy renders
  * Unoptimized queries
  * Missing memoization
  * Large payloads

---

### 8. Anti-Pattern Detection

Flag:

* Hardcoded values
* Inline complex logic in UI
* Repeated code blocks
* Direct DB calls inside components

---

### 9. Suggest Improvements

Provide:

* Cleaner alternatives
* Refactoring ideas
* Better patterns

---

### 10. Final Decision

Output:

```json id="qu3tgi"
{
  "status": "changes_requested",
  "severity": "medium",
  "issues": 5,
  "blocking": 2
}
```

---

## 📏 Quality Standards

* Code must be:

  * Clean
  * Modular
  * Scalable
  * Readable

* Must follow:

  * Single Responsibility Principle
  * DRY principle
  * Separation of concerns

---

## 🚨 Edge Cases

* Large PR (split recommendation)
* Mixed concerns in one file
* Hidden side effects
* Async bugs not obvious
* Over-engineered solutions
* Under-engineered quick hacks

---

## 🔁 Iteration Strategy

1. Review code
2. Flag issues
3. Suggest fixes
4. Re-review after updates
5. Approve only when:
   → No critical issues
   → Acceptable quality level

---

## 🧪 Validation

* Code passes:

  * Linting
  * Tests
* Structure aligns with architecture
* No security risks
* Performance acceptable

---

## 🔗 Dependencies

* ESLint
* Prettier
* TypeScript (if used)
* Project coding standards

---

## 📚 References

* Clean Code – Robert C. Martin
* React best practices
* Supabase security guidelines
* SOLID principles
