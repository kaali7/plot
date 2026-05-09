# Security Hardening Implementation Plan

**Source:** [Security Audit Report](file:///f:/_product/Plot/plot-app/doc/security_audit_report.md)  
**Goal:** Raise security score from **5.5/10 → 8.5/10**

---

## Task Summary

| # | Task | Priority | Effort | Files |
|---|---|---|---|---|
| S1 | Remove `.env` from git, rotate keys | **P0** | 15 min | `.env`, `.gitignore` |
| S2 | Enable Content Security Policy | **P0** | 30 min | `index.html` |
| S3 | Add security headers to Vercel | **P1** | 15 min | `vercel.json` |
| S4 | Restrict CORS in Edge Functions | **P1** | 15 min | `_shared/cors.ts` |
| S5 | Remove `anon` from RPC grants | **P1** | 10 min | New migration SQL |
| S6 | Server-side AI rate limiting | **P1** | 1 hr | `_shared/rate-limit.ts`, all 4 Edge Functions |
| S7 | Edge Function input validation | **P2** | 1 hr | All 4 Edge Functions |
| S8 | File upload validation | **P2** | 30 min | `api.ts`, `ResourceForm.tsx` |
| S9 | Fix resource linking deduplication | **P2** | 30 min | New migration SQL |
| S10 | Sanitize seed data | **P2** | 5 min | `seed.sql` |
| S11 | Production-aware logging | **P2** | 30 min | New `logger.ts`, `api.ts` |
| S12 | Self-host external resources | **P2** | 30 min | `index.html`, `WritingSection.tsx` |

**Total: ~5 hours**

---

## Phase 1 — Immediate (P0)

### S1 — Remove `.env` from Git & Rotate Keys

**Problem:** Production Supabase URL + anon key are committed to the repository.

**Steps (Manual — cannot be automated by code edits):**

1. Go to Supabase Dashboard → Settings → API → Rotate anon key
2. Update Vercel environment variables with the new key
3. Run locally:
```bash
git rm --cached .env
echo ".env" >> .gitignore   # already present, but verify
git commit -m "security: remove .env from tracking"
```
4. If repo is public or shared, consider using `git filter-branch` or `BFG Repo-Cleaner` to purge the key from history

**Post-change:** Create `.env.development` and `.env.production` templates:

```env
# .env.development
VITE_SUPABASE_URL="https://your-dev-project.supabase.co"
VITE_SUPABASE_ANON_KEY="dev-anon-key"
VITE_AI_ENABLED="true"
```

> [!CAUTION]
> This is a **manual task** — the key rotation must happen in the Supabase dashboard first, then Vercel env vars must be updated before the next deploy.

---

### S2 — Enable Content Security Policy

**Problem:** CSP meta tag in `index.html` is commented out.

**File:** [index.html](file:///f:/_product/Plot/plot-app/index.html)

**Change:**
```diff
-    <!-- <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co; img-src 'self' data: blob: https:;" /> -->
+    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://generativelanguage.googleapis.com; img-src 'self' data: blob: https:; object-src 'none'; base-uri 'self'; form-action 'self';" />
```

**Key additions vs the commented version:**
- `connect-src` now includes `generativelanguage.googleapis.com` (for Gemini API via Edge Functions — though this goes through Supabase, keeping it for safety)
- `object-src 'none'` — blocks Flash/Java plugins
- `base-uri 'self'` — prevents base tag injection
- `form-action 'self'` — prevents form hijacking

---

## Phase 2 — This Sprint (P1)

### S3 — Add Security Headers to Vercel

**File:** [vercel.json](file:///f:/_product/Plot/plot-app/vercel.json)

**Change:**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload"
        }
      ]
    }
  ],
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

### S4 — Restrict CORS in Edge Functions

**Problem:** `Access-Control-Allow-Origin: *` allows any domain.

**File:** [cors.ts](file:///f:/_product/Plot/plot-app/supabase/functions/_shared/cors.ts)

**Change:**
```diff
+const ALLOWED_ORIGINS = [
+  'https://plot-app.vercel.app',     // production
+  'http://localhost:5173',            // local dev
+  'http://localhost:4173',            // local preview
+];
+
+export const getCorsHeaders = (request: Request) => {
+  const origin = request.headers.get('Origin') || '';
+  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
+  return {
+    'Access-Control-Allow-Origin': allowedOrigin,
+    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
+    'Access-Control-Allow-Methods': 'POST, OPTIONS',
+    'Vary': 'Origin',
+  };
+};
+
+// Keep static export for backwards compat during migration
 export const corsHeaders = {
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
 };
```

Then update each Edge Function to use `getCorsHeaders(request)` instead of `corsHeaders`.

---

### S5 — Remove `anon` from SECURITY DEFINER Grants

**Problem:** RPC functions are callable by unauthenticated users.

**New migration file:** `supabase/migrations/20260509_security_hardening.sql`

```sql
-- Revoke anon access from SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION link_resource_to_entity FROM anon;
REVOKE EXECUTE ON FUNCTION unlink_resource_from_entity FROM anon;
REVOKE EXECUTE ON FUNCTION reorder_scenes FROM anon;

-- Add deduplication to link_resource_to_entity
CREATE OR REPLACE FUNCTION link_resource_to_entity(
  p_resource_id UUID,
  p_entity_type TEXT,
  p_entity_id UUID
)
RETURNS VOID AS $$
DECLARE
  v_story_id UUID;
  v_current_links JSONB;
BEGIN
  SELECT r.story_id, r.linked_entities INTO v_story_id, v_current_links
  FROM resources r
  JOIN stories s ON r.story_id = s.id
  WHERE r.id = p_resource_id AND s.user_id = auth.uid();

  IF v_story_id IS NULL THEN
    RAISE EXCEPTION 'Access denied: resource not found or not owned by current user';
  END IF;

  -- Skip if already linked (deduplication)
  IF COALESCE(v_current_links->p_entity_type, '[]'::jsonb) ? p_entity_id::text THEN
    RETURN;
  END IF;

  UPDATE resources
  SET linked_entities = jsonb_set(
    linked_entities,
    ARRAY[p_entity_type],
    COALESCE(linked_entities->p_entity_type, '[]'::jsonb) || to_jsonb(p_entity_id)
  )
  WHERE id = p_resource_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-grant only to authenticated
GRANT EXECUTE ON FUNCTION link_resource_to_entity TO authenticated;
GRANT EXECUTE ON FUNCTION unlink_resource_from_entity TO authenticated;
GRANT EXECUTE ON FUNCTION reorder_scenes TO authenticated;
```

---

### S6 — Server-Side AI Rate Limiting

**Problem:** No rate limiting on Edge Functions; client-side limiter is bypassable.

**New file:** `supabase/functions/_shared/rate-limit.ts`

```typescript
import { createClient } from 'jsr:@supabase/supabase-js@2';

const LIMITS = {
  writing: { maxPerHour: 30, maxPerDay: 100 },
  character: { maxPerHour: 20, maxPerDay: 50 },
  scene: { maxPerHour: 20, maxPerDay: 50 },
  'image-prompt': { maxPerHour: 15, maxPerDay: 40 },
};

export async function checkRateLimit(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  featureName: keyof typeof LIMITS
): Promise<{ allowed: boolean; error?: string }> {
  const limits = LIMITS[featureName];
  if (!limits) return { allowed: true };

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // Count hourly usage
  const { count: hourlyCount } = await supabase
    .from('ai_usage')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('feature_name', featureName)
    .gte('created_at', oneHourAgo);

  if ((hourlyCount ?? 0) >= limits.maxPerHour) {
    return { allowed: false, error: `Rate limit exceeded. Max ${limits.maxPerHour} requests per hour for ${featureName}.` };
  }

  // Count daily usage
  const { count: dailyCount } = await supabase
    .from('ai_usage')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('feature_name', featureName)
    .gte('created_at', oneDayAgo);

  if ((dailyCount ?? 0) >= limits.maxPerDay) {
    return { allowed: false, error: `Daily limit exceeded. Max ${limits.maxPerDay} requests per day for ${featureName}.` };
  }

  return { allowed: true };
}
```

**Integration:** Add to each Edge Function after auth check:

```typescript
import { checkRateLimit } from '../_shared/rate-limit.ts';

// After auth verification:
const rateCheck = await checkRateLimit(supabase, user.id, 'writing');
if (!rateCheck.allowed) {
  return json({ error: rateCheck.error }, 429);
}
```

---

## Phase 3 — Next Sprint (P2)

### S7 — Edge Function Input Validation

**Problem:** User input is injected directly into AI prompts without sanitization.

**New file:** `supabase/functions/_shared/validate.ts`

```typescript
export function sanitizePromptInput(input: string, maxLength = 2000): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .slice(0, maxLength)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '') // control chars
    .trim();
}

export function validateStoryId(storyId: unknown): storyId is string {
  return typeof storyId === 'string' && /^[0-9a-f-]{36}$/i.test(storyId);
}

export function validateAction(action: unknown, allowed: string[]): boolean {
  return typeof action === 'string' && allowed.includes(action);
}
```

**Integration in each Edge Function:** Wrap all user-supplied fields before prompt building:

```typescript
import { sanitizePromptInput, validateStoryId } from '../_shared/validate.ts';

// Validate storyId
if (!validateStoryId(payload.storyId)) {
  return json({ error: 'Invalid storyId format.' }, 400);
}

// Sanitize inputs before prompt construction
const safeTitle = sanitizePromptInput(story.name, 200);
const safeTheme = sanitizePromptInput(story.theme || '', 200);
const safeInstructions = sanitizePromptInput(payload.instructions || '', 1000);
```

---

### S8 — File Upload Validation

**Problem:** No file type or size validation on uploads.

**File:** [api.ts](file:///f:/_product/Plot/plot-app/src/lib/api.ts) — `storageAPI.uploadFile()`

**Change:**
```diff
+const ALLOWED_MIME_TYPES = [
+  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
+  'application/pdf', 'text/plain', 'text/markdown',
+  'application/msword',
+  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
+];
+const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
+
 export const storageAPI = {
   uploadFile: async (bucket: string, path: string, file: File) => {
+    // Validate file type
+    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
+      return { data: null, error: `File type "${file.type}" is not allowed. Accepted: images, PDFs, text documents.` };
+    }
+    // Validate file size
+    if (file.size > MAX_FILE_SIZE) {
+      return { data: null, error: `File exceeds maximum size of 10MB.` };
+    }
     return handleResponse(
       supabase.storage.from(bucket).upload(path, file, { upsert: true })
     );
   },
```

---

### S9 — Handled by S5

Resource linking deduplication is included in the S5 migration (see updated `link_resource_to_entity` function).

---

### S10 — Sanitize Seed Data

**File:** [seed.sql](file:///f:/_product/Plot/plot-app/supabase/seed.sql)

**Change:**
```diff
-    SELECT id INTO v_user_id FROM auth.users WHERE email = 'sonikali1479@gmail.com' LIMIT 1;
+    SELECT id INTO v_user_id FROM auth.users LIMIT 1;

-        RAISE NOTICE 'User sonikali1479@gmail.com not found. Please ensure you are signed up.';
+        RAISE NOTICE 'No users found. Please sign up first before running seed.';
```

---

### S11 — Production-Aware Logger

**Problem:** `console.error` leaks internal details in production.

**New file:** `src/lib/logger.ts`

```typescript
const isDev = import.meta.env.DEV;

export const logger = {
  error: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.error(`[Plot Error] ${message}`, ...args);
    }
    // In production, could send to Sentry/LogRocket here
  },
  warn: (message: string, ...args: unknown[]) => {
    if (isDev) console.warn(`[Plot Warn] ${message}`, ...args);
  },
  info: (message: string, ...args: unknown[]) => {
    if (isDev) console.info(`[Plot Info] ${message}`, ...args);
  },
};
```

Then replace `console.error('API Error:', error)` in `api.ts` line 22 with:
```typescript
import { logger } from './logger';
logger.error('API Error:', error);
```

---

### S12 — Self-Host External Resources

**Problem:** External CDN resources loaded without integrity verification.

**Steps:**
1. Download Google Fonts CSS + woff2 files → save to `public/fonts/`
2. Download texture from `transparenttextures.com` → save to `public/textures/`
3. Update `index.html` to use local font stylesheet
4. Update `WritingSection.tsx` texture URL to `/textures/paper.png`

---

## Execution Order

```
Phase 1 — Immediate (Day 1)
├── S1  Rotate keys, remove .env from git  [MANUAL — 15 min]
└── S2  Enable CSP                         [15 min]

Phase 2 — This Sprint (Day 2-3)
├── S3  Vercel security headers            [15 min]
├── S4  Restrict CORS                      [15 min]
├── S5  Revoke anon grants + dedup fix     [10 min]
└── S6  Server-side rate limiting          [1 hr]

Phase 3 — Next Sprint (Day 4-5)
├── S7  Edge Function input validation     [1 hr]
├── S8  File upload validation             [30 min]
├── S10 Sanitize seed data                 [5 min]
├── S11 Production logger                  [30 min]
└── S12 Self-host external resources       [30 min]
```

## Expected Impact

| Category | Before | After |
|---|---|---|
| Sensitive Data Handling | 3/10 | 8/10 |
| API Security | 4/10 | 8/10 |
| Frontend Security | 5/10 | 9/10 |
| Configuration | 5/10 | 8/10 |
| Storage Security | 6/10 | 8/10 |
| **Overall** | **5.5/10** | **~8.5/10** |
