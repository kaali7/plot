# Git Commit Plan

This plan organizes the recent PRD remediation and security hardening changes into logical, cohesive commits.

---

## Commit 1: PRD Gap Remediation — Core Logic & UI
**Message:** `feat: close PRD gaps in resource management and writing flow`

**Files:**
- `src/lib/api.ts` (unlinking logic, RPC reordering)
- `src/components/writing-section/WritingSection.tsx` (auto-session creation)
- `src/components/dashboard/OverviewSection.tsx` (safe parsing, badges)
- `src/components/dashboard/UnifiedStoryDashboard.tsx` (prop passing)
- `src/components/dashboard/WorldSettingsPanel.tsx` (modal UX fix)
- `src/components/dashboard/ConflictCard.tsx` (badges)
- `src/components/resources-section/forms/ResourceForm.tsx` (enhanced upload UI)

**Description:**
- Implements diff-based resource unlinking for characters and scenes.
- Switches scene reordering to use the atomic server-side RPC.
- Adds auto-creation of writing sessions on first entry to Writing Mode.
- Enhances Overview dashboard with resource count badges and safe JSON parsing.
- Promotes file upload UI for image/document resources.

---

## Commit 2: Security — Frontend Hardening & Config
**Message:** `security: enable CSP and add protective headers`

**Files:**
- `index.html` (enabled CSP)
- `vercel.json` (security headers)
- `src/lib/logger.ts` (new production logger)
- `src/lib/api.ts` (integrated logger and file upload validation)

**Description:**
- Enables Content Security Policy (CSP) with directives for Supabase and Google Fonts.
- Adds HSTS, X-Frame-Options, and other security headers to Vercel config.
- Implements a production-aware logger to prevent sensitive data leakage in console.
- Adds client-side file type and size (10MB) validation for uploads.

---

## Commit 3: Security — Backend AI Hardening
**Message:** `security: implement server-side rate limiting and CORS allowlist for AI`

**Files:**
- `supabase/functions/_shared/cors.ts` (restricted origins)
- `supabase/functions/_shared/rate-limit.ts` (new utility)
- `supabase/functions/_shared/validate.ts` (new utility)
- `supabase/functions/ai-writing/index.ts` (integration)

**Description:**
- Replaces wildcard CORS with an explicit origin allowlist.
- Implements server-side rate limiting for AI features (per-hour/per-day).
- Adds input sanitization and prompt injection protection to Edge Functions.

---

## Commit 4: Security — Database & Seed Sanitization
**Message:** `security: revoke anon RPC access and sanitize seed data`

**Files:**
- `supabase/migrations/20260509_security_hardening.sql` (new migration)
- `supabase/seed.sql` (removed hardcoded email)
- `.env` (removed from git tracking)

**Description:**
- Revokes execution grants on sensitive SECURITY DEFINER functions from the `anon` role.
- Adds deduplication logic to the resource linking DB function.
- Sanitizes seed data by removing hardcoded production user emails.
- Removes leaked production credentials from git tracking.

---

## Execution Command Template
```bash
# Commit 1
git add src/lib/api.ts src/components/writing-section/WritingSection.tsx src/components/dashboard/OverviewSection.tsx src/components/dashboard/UnifiedStoryDashboard.tsx src/components/dashboard/WorldSettingsPanel.tsx src/components/dashboard/ConflictCard.tsx src/components/resources-section/forms/ResourceForm.tsx
git commit -m "feat: close PRD gaps in resource management and writing flow"

# Commit 2
git add index.html vercel.json src/lib/logger.ts src/lib/api.ts
git commit -m "security: enable CSP and add protective headers"

# Commit 3
git add supabase/functions/_shared/cors.ts supabase/functions/_shared/rate-limit.ts supabase/functions/_shared/validate.ts supabase/functions/ai-writing/index.ts
git commit -m "security: implement server-side rate limiting and CORS allowlist for AI"

# Commit 4
git add supabase/migrations/20260509_security_hardening.sql supabase/seed.sql .gitignore
git commit -m "security: revoke anon RPC access and sanitize seed data"
```
