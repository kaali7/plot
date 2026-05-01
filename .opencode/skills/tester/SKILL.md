# 🧠 Skill: Full-Stack Testing Agent

## 🎯 Purpose

A unified, autonomous testing agent designed to validate **frontend (React), backend (Supabase/FastAPI), and system-level behaviors** across functionality, performance, security, and ML/AI workflows.

This skill ensures that the application remains **bug-free, scalable, and production-ready** by combining **test generation, execution, analysis, and reporting** into a single decision-driven pipeline.

---

## 🧩 Scope

### ✅ Includes

* Frontend testing (React + Tailwind UI)
* API testing (Supabase + optional FastAPI)
* Database validation (PostgreSQL via Supabase)
* ML/AI output validation (if AI features enabled)
* End-to-end system testing
* Security checks (auth, RLS, input validation)
* Performance testing (basic load & response validation)
* Automated test generation using PyTest
* Bug detection, logging, and reporting
* CI/CD validation (Vercel deployments)

---

### ❌ Excludes

* Manual UX feedback (subjective design opinions)
* Deep penetration testing (ethical hacking level)
* Infrastructure-level testing (Kubernetes, AWS infra)
* Visual pixel-perfect testing (unless explicitly defined)

---

## 📥 Inputs

* Project source code (frontend + backend)
* API endpoints / Supabase schema
* Environment variables (test-safe)
* Deployment URL (Vercel preview or prod)
* Test configuration (optional)
* AI/ML model endpoints (if applicable)

---

## 📤 Outputs

* Generated test cases (PyTest, API tests)
* Execution logs
* Bug reports (structured)
* Performance summaries
* Security issue flags
* Coverage insights (what is tested vs not)
* CI/CD readiness status

---

## 🧠 Decision Logic

### ✅ Use this skill when:

* New feature is implemented
* Code is modified or refactored
* Before deployment to production
* API contracts change
* AI/ML output needs validation
* Bugs are reported and need reproduction

---

### ❌ Ignore this skill when:

* Only documentation changes
* Pure UI styling tweaks (no logic impact)
* Non-functional static content updates

---

## ⚙️ Execution Steps

### 1. Project Understanding

* Parse project structure
* Identify:

  * React components
  * Supabase interactions
  * API endpoints
  * Data models
  * Auth flows (Supabase RLS)

---

### 2. Test Strategy Planning

* Classify testing layers:

| Layer  | Strategy                         |
| ------ | -------------------------------- |
| UI     | Component + interaction testing  |
| API    | Endpoint validation              |
| DB     | Schema + constraint checks       |
| System | End-to-End flows                 |
| AI/ML  | Output consistency + sanity test |

---

### 3. Test Case Generation

#### Frontend

* Validate:

  * Component rendering
  * Form inputs (React Hook Form)
  * State transitions
  * Error handling

#### Backend / API

* Generate PyTest cases:

  * GET/POST/PUT/DELETE validation
  * Edge cases (invalid payloads)
  * Auth checks

#### Supabase

* Validate:

  * RLS policies
  * Data integrity
  * Foreign key relationships

---

### 4. Test Execution

* Run:

  * Unit tests
  * API tests (PyTest)
  * Integration tests

* Hit:

  * Local environment
  * Vercel preview deployment

---

### 5. AI/ML Validation (if present)

* Validate:

  * Output format correctness
  * Response latency
  * Hallucination indicators (basic heuristics)

---

### 6. Performance Checks

* Measure:

  * API response time
  * Page load time
  * Query performance

---

### 7. Security Checks

* Validate:

  * Authentication flows (Supabase Auth)
  * Unauthorized access attempts
  * Input sanitization
  * RLS enforcement

---

### 8. Bug Detection & Reporting

Generate structured report:

```
Bug Title:
Severity: (Low / Medium / High / Critical)
Location:
Steps to Reproduce:
Expected:
Actual:
Suggested Fix:
```

---

### 9. CI/CD Validation (Vercel)

* Validate:

  * Build success
  * Deployment health
  * Environment variables presence
  * API connectivity post-deploy

---

## 📏 Quality Standards

* Tests must be:

  * Deterministic (no flaky tests)
  * Isolated (no shared state issues)
  * Fast (<2s per unit test ideally)

* Code quality:

  * Clean PyTest structure
  * Reusable test utilities
  * Clear naming conventions

* Security:

  * Never expose secrets
  * Use mock data for testing

---

## 🚨 Edge Cases

* API returns partial data
* Supabase RLS misconfiguration
* Network latency / timeouts
* Empty database state
* Invalid user inputs
* AI returning malformed outputs
* Vercel deployment succeeds but runtime fails

---

## 🔁 Iteration Strategy

If failures occur:

1. Reproduce consistently
2. Isolate failing layer (UI/API/DB)
3. Regenerate focused test cases
4. Suggest fix
5. Re-run tests after patch

Loop until:
→ All critical tests pass
→ No regression introduced

---

## 🧪 Validation

* All endpoints return expected status codes
* UI flows complete without errors
* Database constraints hold true
* Auth restrictions enforced correctly
* AI outputs meet defined structure
* Deployment is stable on Vercel

---

## 🔗 Dependencies

* PyTest
* Requests / HTTPX
* Supabase Client SDK
* Playwright (optional for UI E2E)
* Faker (test data generation)

---

## 📚 References

* Test Pyramid (Unit → Integration → E2E)
* REST API best practices
* Supabase RLS guidelines
* Clean Code testing principles