# Security Audit Report — Plot App

**Auditor:** Automated Deep Code Audit  
**Date:** 2026-05-09  
**Scope:** Full codebase (`plot-app/`) — frontend, backend (Supabase Edge Functions), database migrations, configuration  
**Methodology:** Static analysis, manual code review, dependency inspection, architecture review

---

## Executive Summary

The Plot application is a React + Supabase web app with a **moderate security posture**. The architecture leverages Supabase's built-in Row Level Security (RLS) effectively, and the Edge Functions enforce auth and ownership checks. However, several **critical and high-severity issues** exist — most notably **hardcoded production credentials committed to the repository**, a **disabled Content Security Policy**, **overly permissive CORS**, and **missing input sanitization on server-side AI endpoints**.

**Overall Risk Score: 5.5 / 10** (Moderate-High Risk)

---

## Findings

### 1. Sensitive Data Handling

#### 🔴 CRITICAL — Hardcoded Supabase Credentials in `.env` (Committed to Repo)

| Field | Detail |
|---|---|
| **Severity** | **Critical** |
| **File** | `.env` (lines 1-2) |
| **Description** | The `.env` file contains the **production Supabase URL and anon key** and is present in the repository. While `.gitignore` lists `.env`, the file currently exists in the working tree and was apparently committed at some point. The anon key is a JWT that encodes the project reference (`irekjplahhlwiggsextq`), role (`anon`), and expiry (`2092`). |
| **Impact** | Anyone with repo access can authenticate against the production Supabase project. The anon key alone doesn't grant admin access (RLS protects data), but it allows: account creation, brute-force login attempts, and potential abuse of AI Edge Functions. |
| **Recommendation** | 1. **Immediately rotate the Supabase anon key** via the Supabase dashboard. 2. Verify `.env` is in `.gitignore` and run `git rm --cached .env` to remove it from tracking. 3. Use environment injection via Vercel/hosting platform instead of committing secrets. 4. Consider adding a pre-commit hook to prevent `.env` commits. |

#### 🟡 MEDIUM — Seed File Contains Hardcoded User Email

| Field | Detail |
|---|---|
| **Severity** | Medium |
| **File** | `supabase/seed.sql` (line 12) |
| **Description** | The seed SQL contains `sonikali1479@gmail.com` — a real user email address hardcoded in a file committed to the repo. |
| **Recommendation** | Replace with a placeholder email or environment-driven variable. |

#### 🟢 LOW — Gemini API Key Handled Correctly

| Field | Detail |
|---|---|
| **Severity** | Informational |
| **File** | `supabase/functions/_shared/provider.ts` (line 52) |
| **Description** | The Gemini API key is fetched from `Deno.env.get('GEMINI_API_KEY')` — a server-side environment variable, not exposed to the frontend. This is correct. |

---

### 2. Authentication & Authorization

#### 🟢 GOOD — Supabase Auth Implementation is Sound

| Field | Detail |
|---|---|
| **Severity** | Informational |
| **Files** | `src/context/AuthContext.tsx`, `src/routes/authRoutes.tsx`, `src/lib/auth-helpers.ts` |
| **Description** | Auth uses `supabase.auth.signInWithPassword()`, `signUp()`, `getUser()`, and `onAuthStateChange()` — the standard Supabase Auth flow. Sessions are managed by the Supabase client automatically (token refresh via `@supabase/supabase-js`). Protected routes check `user` state and redirect to `/login`. |

#### 🟢 GOOD — RLS Policies Enforce Data Isolation

| Field | Detail |
|---|---|
| **Severity** | Informational |
| **File** | `supabase/migrations/combined_migrations.sql` (lines 56-266) |
| **Description** | All tables (`stories`, `characters`, `scenes`, `conflicts`, `resources`, `writing_sessions`, `writing_versions`) have RLS enabled. Policies use `auth.uid()` to restrict access to the owning user's data. Child tables (characters, scenes, etc.) check ownership via a subquery to the `stories` table. This is a solid pattern. |

#### 🟡 MEDIUM — `SECURITY DEFINER` Functions Granted to `anon` Role

| Field | Detail |
|---|---|
| **Severity** | Medium |
| **File** | `supabase/migrations/combined_migrations.sql` (lines 421-423) |
| **Description** | The `link_resource_to_entity`, `unlink_resource_from_entity`, and `reorder_scenes` RPC functions are `SECURITY DEFINER` (execute as the function owner, bypassing RLS) **and** are granted to the `anon` role: `GRANT EXECUTE ON FUNCTION ... TO anon, authenticated;`. While the functions themselves check `auth.uid()` internally, granting execute to `anon` is unnecessary and increases attack surface. |
| **Recommendation** | Remove `anon` from the GRANT statements. Only `authenticated` users should be able to call these functions: `GRANT EXECUTE ON FUNCTION ... TO authenticated;` |

#### 🟡 MEDIUM — Client-Side Rate Limiter is Trivially Bypassable

| Field | Detail |
|---|---|
| **Severity** | Medium |
| **File** | `src/lib/rate-limiter.ts` |
| **Description** | The rate limiter stores attempt counts in a plain JS object (`const attempts: Record<...> = {}`). This is client-side only — it resets on page refresh and can be bypassed by disabling JavaScript, using `curl`, or simply clearing the variable. |
| **Impact** | The login/signup rate limiting provides no actual protection against brute-force attacks. |
| **Recommendation** | Implement server-side rate limiting via Supabase Auth settings (configurable in the dashboard) or add rate-limiting middleware to the Edge Functions. The client-side limiter is fine as UX polish but should not be relied upon for security. |

#### 🟡 MEDIUM — No Password Strength Enforcement on Backend

| Field | Detail |
|---|---|
| **Severity** | Medium |
| **File** | `src/pages/auth/SignupPage.tsx` (lines 46-56) |
| **Description** | Password validation (minimum 8 chars, uppercase/lowercase/number) is only enforced client-side. The backend (Supabase Auth) has its own minimum length (default 6), but the complexity requirements are not enforced server-side. |
| **Recommendation** | Configure Supabase Auth password policies in the dashboard to match the client-side requirements. |

---

### 3. API Security

#### 🔴 HIGH — CORS is Set to Wildcard (`*`) in Edge Functions

| Field | Detail |
|---|---|
| **Severity** | High |
| **File** | `supabase/functions/_shared/cors.ts` (line 2) |
| **Description** | `'Access-Control-Allow-Origin': '*'` allows any domain to invoke the AI Edge Functions. While the functions require authentication, this still permits CSRF-style attacks where a malicious site could trigger AI requests using a victim's stored session tokens. |
| **Recommendation** | Restrict the origin to your production domain(s): `'Access-Control-Allow-Origin': 'https://your-domain.vercel.app'`. For local development, use a list of allowed origins. |

#### 🟡 MEDIUM — No Server-Side Rate Limiting on AI Edge Functions

| Field | Detail |
|---|---|
| **Severity** | Medium |
| **Files** | `supabase/functions/ai-writing/index.ts`, `ai-generate-character/index.ts`, `ai-generate-scene/index.ts`, `ai-image-prompt/index.ts` |
| **Description** | The Edge Functions have no rate limiting. While the client-side `ai-service.ts` enforces 10 requests per minute, this is trivially bypassable. A malicious user could send thousands of requests to the Gemini API, incurring significant costs. |
| **Recommendation** | 1. Query the `ai_usage` table at the start of each function to check recent request count. 2. Implement per-user daily/hourly limits based on `subscription_tier`. 3. Consider using Supabase's built-in function rate limiting if available. |

#### 🟡 MEDIUM — Missing Input Validation in Edge Functions

| Field | Detail |
|---|---|
| **Severity** | Medium |
| **Files** | All 4 Edge Functions in `supabase/functions/` |
| **Description** | The Edge Functions parse the request body with `await req.json()` and pass user-supplied data directly into prompt strings without sanitization. While this is prompt injection rather than SQL injection, a malicious user could craft inputs to manipulate the AI's behavior (e.g., "Ignore all previous instructions and..."). |
| **Impact** | Prompt injection could generate harmful content, bypass safety filters, or leak system prompt details. |
| **Recommendation** | 1. Validate and sanitize all input fields (title, description, instructions) with max-length and character-set restrictions. 2. Use structured prompt formats with clear delimiters. 3. Implement output filtering. |

#### 🟡 MEDIUM — `getFullStory` Does Not Filter Related Data by `user_id`

| Field | Detail |
|---|---|
| **Severity** | Medium |
| **File** | `src/lib/api.ts` (lines 41-47) |
| **Description** | After verifying the story belongs to the user (line 35), the function fetches characters, scenes, conflicts, and resources by `story_id` alone — without re-checking `user_id`. This relies entirely on RLS. If RLS were ever misconfigured or disabled, this would be an IDOR vulnerability. |
| **Recommendation** | This is acceptable as long as RLS is guaranteed to be enabled. Add a CI check or startup verification to ensure RLS is active on all tables (the `health_check.sql` already does this manually). |

---

### 4. Data Validation & Sanitization

#### 🟢 GOOD — Zod Schemas for Frontend Validation

| Field | Detail |
|---|---|
| **Severity** | Informational |
| **File** | `src/lib/schemas.ts` |
| **Description** | The app uses `zod` schemas with max-length constraints on all text fields (e.g., title: 200 chars, description: 5000 chars). This prevents excessively large payloads from the UI. |

#### 🟡 MEDIUM — `escapeHtml` Utility Exists but is Unused

| Field | Detail |
|---|---|
| **Severity** | Medium |
| **File** | `src/lib/sanitize.ts` |
| **Description** | An `escapeHtml()` function is defined but a codebase-wide search reveals it is **never imported or used** anywhere. Since the app uses React (which auto-escapes JSX), this is not immediately exploitable. However, the `WritingEditor` uses `contentEditable` / `document.execCommand`, and user content is stored as HTML — this could be a vector for stored XSS if the HTML is rendered elsewhere without sanitization. |
| **Recommendation** | 1. Audit all uses of `dangerouslySetInnerHTML` in the codebase. 2. Sanitize HTML content from the writing editor before storing and before rendering. Consider using a library like `DOMPurify`. |

#### 🟡 MEDIUM — `document.execCommand` is Deprecated

| Field | Detail |
|---|---|
| **Severity** | Medium |
| **File** | `src/components/writing-section/WritingSection.tsx` (lines 33-34) |
| **Description** | The rich text editor uses `document.execCommand()` for formatting (bold, italic, underline). This API is deprecated and may behave inconsistently across browsers. More importantly, it operates on raw HTML which, if persisted and re-rendered, could inject malicious markup. |
| **Recommendation** | Migrate to a modern editor framework (e.g., TipTap, Lexical, or ProseMirror) that provides a safe, sandboxed editing experience. |

---

### 5. Frontend Security

#### 🔴 HIGH — Content Security Policy is Commented Out

| Field | Detail |
|---|---|
| **Severity** | High |
| **File** | `index.html` (line 7) |
| **Description** | A Content Security Policy meta tag exists but is entirely commented out: `<!-- <meta http-equiv="Content-Security-Policy" ... /> -->`. Without CSP, the application is vulnerable to XSS attacks from injected scripts, inline event handlers, and external resources. |
| **Recommendation** | Enable and refine the CSP. Start with the commented version and add `'unsafe-inline'` for styles (required by Tailwind) and the Google Fonts origin for fonts. Deploy with `Content-Security-Policy-Report-Only` first to catch violations without breaking functionality. |

#### 🟡 MEDIUM — External Resource Loaded Without SRI

| Field | Detail |
|---|---|
| **Severity** | Medium |
| **File** | `index.html` (line 11), `WritingSection.tsx` (line 562) |
| **Description** | Google Fonts is loaded without Subresource Integrity (SRI) hashes. Additionally, the writing editor loads a texture from `transparenttextures.com` — an external CDN with no integrity verification. If this CDN is compromised, it could serve malicious content. |
| **Recommendation** | 1. Self-host critical fonts or add SRI hashes. 2. Self-host the texture image in the `public/` directory. |

#### 🟢 GOOD — No `dangerouslySetInnerHTML` Detected in Core Components

| Field | Detail |
|---|---|
| **Severity** | Informational |
| **Description** | A search for `dangerouslySetInnerHTML` across the codebase found no results. React's automatic escaping protects against reflected XSS in most rendering paths. |

---

### 6. Configuration & Environment Security

#### 🟡 MEDIUM — No Production/Development Environment Separation

| Field | Detail |
|---|---|
| **Severity** | Medium |
| **Files** | `.env`, `.env.example`, `vite.config.ts` |
| **Description** | There is a single `.env` file with production Supabase credentials. There is no `.env.development` or `.env.production` to separate environments. The `VITE_AI_ENABLED` flag in `.env.example` is not present in the actual `.env`, suggesting feature flags are inconsistently managed. |
| **Recommendation** | Use `.env.development` and `.env.production` files. Never commit production credentials. Use hosting platform environment injection for production. |

#### 🟢 GOOD — Vercel Configuration is Minimal and Safe

| Field | Detail |
|---|---|
| **Severity** | Informational |
| **File** | `vercel.json` |
| **Description** | The Vercel config only contains SPA rewrites — no security headers, but also no misconfigurations. |
| **Recommendation** | Add security headers via `vercel.json`: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Strict-Transport-Security`, `Referrer-Policy`. |

---

### 7. Dependency Vulnerabilities

#### 🟡 MEDIUM — Dependencies Should Be Audited

| Field | Detail |
|---|---|
| **Severity** | Medium |
| **File** | `package.json` |
| **Description** | Key dependencies and their versions: |

| Package | Version | Notes |
|---|---|---|
| `react` | `^18.3.1` | Current stable, no known CVEs |
| `@supabase/supabase-js` | `^2.105.1` | Recent, good |
| `zod` | `^4.4.1` | Very recent (v4), verify stability |
| `react-hook-form` | `^7.74.0` | Current, no known issues |
| `react-router-dom` | `^6.30.3` | Current, no known issues |
| `vite` | `^6.0.5` | Current, no known issues |
| `tailwindcss` | `^3.4.17` | Current, no known issues |

| **Recommendation** | Run `npm audit` regularly. Pin exact versions in production. Set up Dependabot or Renovate for automated dependency updates. |

---

### 8. File Upload / Storage Security

#### 🟢 GOOD — Storage Bucket Policies Enforce User Isolation

| Field | Detail |
|---|---|
| **Severity** | Informational |
| **File** | `supabase/bucket_policies.sql` |
| **Description** | Upload policy restricts users to their own folder (`(storage.foldername(name))[1] = auth.uid()::text`). Delete is similarly scoped. |

#### 🟡 MEDIUM — No File Type Validation on Upload

| Field | Detail |
|---|---|
| **Severity** | Medium |
| **File** | `src/lib/api.ts` (lines 394-399) |
| **Description** | `storageAPI.uploadFile()` accepts any `File` object and uploads with `upsert: true`. There is no validation of file type, file size, or content. |
| **Recommendation** | 1. Validate file MIME type against an allowlist (images, documents). 2. Enforce a maximum file size (e.g., 10MB). 3. Consider server-side virus scanning for uploaded files. |

#### 🟡 MEDIUM — Storage Read Policy is Fully Public

| Field | Detail |
|---|---|
| **Severity** | Medium |
| **File** | `supabase/bucket_policies.sql` (lines 1-3) |
| **Description** | `CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'resources');` — anyone can read any file in the `resources` bucket, regardless of authentication. |
| **Recommendation** | If files are meant to be private to the user, restrict the SELECT policy similarly to the upload policy. If public access is intentional (e.g., for shared image links), document this decision. |

---

### 9. Logging & Error Handling

#### 🟢 GOOD — Error Messages are Sanitized for Users

| Field | Detail |
|---|---|
| **Severity** | Informational |
| **File** | `src/lib/error-mapper.ts` |
| **Description** | Database error codes are mapped to generic user-friendly messages. Internal error details are logged to `console.error` but not exposed to the UI. |

#### 🟡 LOW — Console Logging in Production

| Field | Detail |
|---|---|
| **Severity** | Low |
| **Files** | Multiple (api.ts, AuthContext.tsx, Dashboard.tsx, etc.) |
| **Description** | `console.error('API Error:', error)` and similar statements will log potentially sensitive error details in the browser console in production. |
| **Recommendation** | Use a conditional logger that suppresses console output in production builds, or send errors to a monitoring service (Sentry, LogRocket). |

---

### 10. Business Logic Security

#### 🟡 MEDIUM — Scene Reorder Race Condition

| Field | Detail |
|---|---|
| **Severity** | Medium |
| **File** | `src/lib/api.ts` (lines 250-265) |
| **Description** | `reorderScenes` sends parallel `UPDATE` statements without a transaction. If two users (or tabs) reorder simultaneously, the final state could be inconsistent. The server-side RPC function (`reorder_scenes`) is sequential but the client-side implementation bypasses it. |
| **Recommendation** | Use the server-side `reorder_scenes` RPC function exclusively, which runs in a single transaction. |

#### 🟡 MEDIUM — Resource Linking Does Not Deduplicate

| Field | Detail |
|---|---|
| **Severity** | Medium |
| **File** | `supabase/migrations/combined_migrations.sql` (lines 299-352) |
| **Description** | The `link_resource_to_entity` function appends entity IDs to a JSONB array without checking for duplicates. Calling it multiple times with the same entity will create duplicate entries. |
| **Recommendation** | Add a duplicate check before appending, or use a JSONB set operation. |

---

## Overall Security Posture Summary

### Risk Score: 5.5 / 10

| Category | Score | Notes |
|---|---|---|
| Authentication & Authorization | 7/10 | Strong RLS, proper auth flow, but client-only rate limiting |
| Data Validation | 6/10 | Zod schemas on frontend, but no server-side validation in Edge Functions |
| Sensitive Data Handling | 3/10 | Production credentials in repo is critical |
| API Security | 4/10 | Wildcard CORS, no server-side rate limiting on AI functions |
| Frontend Security | 5/10 | React auto-escaping helps, but CSP disabled, external resources unverified |
| Configuration | 5/10 | Single environment, no security headers |
| Storage Security | 6/10 | Good upload isolation, but public read access and no file validation |
| Error Handling | 8/10 | Good error sanitization, minor console logging issue |

### Prioritized Action Items

| Priority | Action | Effort |
|---|---|---|
| **P0 — Immediate** | Rotate Supabase anon key, remove `.env` from git history | 30 min |
| **P0 — Immediate** | Enable Content Security Policy | 1-2 hrs |
| **P1 — This Sprint** | Restrict CORS to production domain(s) | 15 min |
| **P1 — This Sprint** | Remove `anon` from SECURITY DEFINER function grants | 15 min |
| **P1 — This Sprint** | Add server-side rate limiting to AI Edge Functions | 2-3 hrs |
| **P1 — This Sprint** | Self-host external resources (fonts, textures) | 1 hr |
| **P2 — Next Sprint** | Add input validation/sanitization to Edge Functions | 3-4 hrs |
| **P2 — Next Sprint** | Add file type/size validation to upload | 1 hr |
| **P2 — Next Sprint** | Add security headers to Vercel config | 30 min |
| **P2 — Next Sprint** | Configure server-side password policy | 15 min |
| **P3 — Backlog** | Migrate from `document.execCommand` to modern editor | 1-2 weeks |
| **P3 — Backlog** | Add HTML sanitization (DOMPurify) for stored writing content | 2-3 hrs |
| **P3 — Backlog** | Fix resource linking deduplication | 1 hr |
| **P3 — Backlog** | Set up `npm audit` in CI pipeline | 30 min |
| **P3 — Backlog** | Implement production-aware logging | 2 hrs |

---

*End of Security Audit Report*
