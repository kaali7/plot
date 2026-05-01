# Authentication System Specification for Plot

## 1. Problem Statement

Plot currently lacks user authentication, preventing secure access to personalized storytelling features. Users cannot save their work, access their stories across devices, or protect their creative content. We need a complete authentication system integrated with Supabase that supports user registration, login, password recovery, and session management while maintaining the dark-purple design aesthetic.

**Target users:** Writers, content creators, and students who need secure, personalized access to their storytelling workspace.
**Expected outcome:** Seamless authentication experience that protects user data and enables persistent story saving across sessions and devices.

## 2. Functional Requirements

### Core Features
- User registration (email/password + optional OAuth providers)
- User login (email/password + OAuth)
- Password reset flow
- Session persistence and management
- Protected routes for authenticated users
- Logout functionality
- Auth state sync across browser tabs/windows

### User Flows
1. New user visits landing page → Clicks "Get Started" → Redirects to signup page → Completes registration → Auto-login → Redirects to Dashboard
2. Existing user visits landing page → Clicks "Login" → Enters credentials → Login → Redirects to Dashboard
3. User clicks "Forgot Password" → Enters email → Receives reset link → Sets new password → Login → Dashboard
4. Authenticated user navigates to any page → Protected route check → Access granted/denied
5. User clicks Logout → Session cleared → Redirects to landing page

### Input/Output Specifications
- **Signup Input**: Email, password, confirm password
- **Login Input**: Email, password
- **Password Reset Input**: Email (request), New password (reset)
- **Output**: JWT tokens (Supabase), user session data, auth state

### Future Enhancements
- OAuth provider integration (Google, GitHub)
- Email verification flow
- Two-factor authentication (2FA)
- Social profile linking
- Account settings page (update email/password/profile)
- Team/collaboration invites
- Session activity monitoring

## 3. API Contracts

### Supabase Auth Endpoints (via supabase-js client)
```javascript
// Registration
POST /auth/v1/signup
{
  email: string,
  password: string,
  options: {
    data: { full_name?: string }
  }
}

// Login
POST /auth/v1/token?grant_type=password
{
  email: string,
  password: string
}

// Password Reset Request
POST /auth/v1/recover
{
  email: string
}

// Password Reset (via link)
POST /auth/v1/user
{
  password: string
}

// Logout
POST /auth/v1/logout

// Get Current User
GET /auth/v1/user

// Refresh Session
POST /auth/v1/token?grant_type=refresh_token
```

### Frontend API Layer (plot-app/src/lib/auth.ts)
```typescript
// Auth context provider
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<AuthResponse>;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}

// Auth state change listener
onAuthStateChange((event, session) => void)
```

### Database Schema (Supabase PostgreSQL)
```sql
-- Users table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_tier TEXT DEFAULT 'free',
  last_login TIMESTAMP WITH TIME ZONE
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Enable authenticated users to read their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Enable users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Enable authenticated users to insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

## 4. Constraints

### Tech Stack Alignment
- **MUST** use Supabase Authentication (per tech_stack.md specifications)
- **MUST** follow React Hooks + Context API pattern (existing state management)
- **MUST** implement dark-purple gradient theme from frontend-designer skill
- **MUST** use rounded UI components (16px default, 20px cards, 999px pills)
- **MUST** align with existing Vite + React + Tailwind CSS stack
- **MUST** integrate with existing landing page CTA buttons

### Performance Expectations
- Auth state hydration: < 100ms
- Login/signup API calls: < 1.5s total
- Redirect after auth: < 2s
- Session persistence across browser restarts
- Minimal bundle size impact (< 30kb additional)

### Security Considerations
- Use Supabase built-in security (RLS, JWT tokens)
- Implement CSRF protection via Supabase
- Password minimum requirements: 8 chars, 1 uppercase, 1 number
- Rate limiting on auth endpoints (Supabase handles this)
- Secure session storage (localStorage with httpOnly cookie fallback)
- No password logging or exposure in client logs
- HTTPS enforcement (Vercel handles this)

### Scalability Strategy
- Supabase handles auth scaling automatically
- Implement optimistic UI updates for auth state
- Lazy load auth components on landing page
- Use React.lazy() for auth pages to reduce initial bundle
- Implement efficient re-rendering with React.memo on auth-dependent components

### Cost Optimization
- Use Supabase free tier limits (50k active users/month)
- Implement aggressive client-side caching of auth state
- Minimize auth API calls via efficient session management
- Disable automatic session refresh (configure manual refresh)
- Use static pages for unauthenticated users

## 5. Edge Cases

### Validation Issues
- Empty email/password fields → Form validation errors
- Malformed email addresses → Real-time email format validation
- Weak passwords → Password strength indicator with requirements
- Mismatched password confirmation → Immediate feedback
- Already registered email → Clear error messaging
- Invalid login credentials → Generic "Invalid credentials" message

### API Failures
- Supabase network timeout → Retry logic (3 attempts, exponential backoff)
- Rate limit exceeded → Display "Too many attempts" message with cooldown timer
- Server error (500) → Friendly error message + contact support link
- CORS issues → Ensure proper Vercel/Supabase configuration

### User Misuse
- Multiple rapid signup attempts → Rate limiting
- Spam account creation → Email verification (future), honeypot fields
- Brute force attacks → Supabase built-in protection + captcha (future)

### Fallback Strategies
- Auth service unavailable → Display offline message, store form data locally, retry on reconnect
- Session expired → Silent refresh, redirect to login if refresh fails
- LocalStorage unavailable → Fallback to sessionStorage or memory storage
- Third-party cookie blocking → Implement alternative session storage
- OAuth provider downtime → Hide OAuth buttons, show email/password only

### Session Edge Cases
- User opens multiple tabs → Sync auth state across tabs using storage events
- Browser crash during auth → Graceful recovery, check session on next load
- Password reset link expired → Clear error + resend link option
- User changes email in another tab → State sync conflict resolution

## 6. Acceptance Criteria

### Measurable Success Conditions
- Account creation success rate > 90%
- Login success rate > 95%
- Password reset completion rate > 80%
- Average auth flow completion time < 30 seconds
- Zero security vulnerabilities (SQL injection, XSS, CSRF)
- Session persistence across browser restarts confirmed working
- Auth state sync across tabs functional

### UX Expectations
- Intuitive form layouts with clear labels
- Real-time validation feedback
- Loading states for all async operations
- Clear success/error messaging
- Smooth transitions between auth states
- Mobile-responsive design (< 375px to > 1440px)
- Keyboard navigation support
- Screen reader compatibility (ARIA labels)
- Consistent dark-purple gradient theme throughout

### Performance Benchmarks
- Form validation feedback: < 100ms
- Login API response to UI update: < 500ms
- Redirect after successful auth: < 2s total
- Auth state initialization: < 200ms
- Bundle size impact: < 30kb gzipped

## 7. System Design

### Authentication Flow
```
[User Action] → [Form Validation] → [API Call] → [DB/Auth Service]
     ↓              ↓                    ↓              ↓
[UI Feedback] ← [Error Handling] ← [Token Mgmt] ← [Session Creation]
     ↓
[State Update] → [Local Storage] → [Protected Route Access]
     ↓
[Redirect] → [Dashboard]
```

### Component Architecture
```
App
├── AuthProvider (Context)
├── PublicRoute (Component)
├── ProtectedRoute (Component)
├── LoginPage
├── SignupPage
├── ForgotPasswordPage
├── ResetPasswordPage
└── Dashboard (Protected)
```

### Auth Context Lifecycle
```typescript
// 1. App mount
APP_START → checkSession() → GET /auth/v1/user

// 2. Login flow
LOGIN_CLICK → validate() → POST /auth/v1/token → saveSession() → setUser() → redirect()

// 3. Session refresh
TOKEN_EXPIRE → onAuthStateChange → refreshSession() → POST /auth/v1/token?grant_type=refresh_token → updateSession()

// 4. Logout
LOGOUT_CLICK → signOut() → POST /auth/v1/logout → clearSession() → setUser(null) → redirect('/')
```

### Data Flow Diagram
```
Landing Page (/)
  → CTA Click → /login or /signup
    → Form Submit → Auth Context
      → Supabase Client → Supabase Auth API
        → JWT Token ← Storage (localStorage)
          → Profile Fetch ← profiles table (RLS)
            → Redirect → /dashboard
```

### Async Processing
- Session initialization: Async on app mount
- Auth state sync: Real-time via Supabase listeners
- Profile loading: Fetch after successful auth
- Redirect handling: Router guards wait for auth state

### Queue System
- Not needed for MVP (auth operations are lightweight)
- Future: Queue email notifications for verification

### Caching Layer
- Browser localStorage: Session tokens
- React Context: User profile data
- Cache invalidation: On logout or session expiry
- Cache duration: Until explicit logout or 24h refresh required

### DB Interactions
- **Initial auth**: Write to auth.users (Supabase managed)
- **Profile creation**: TRIGGER after signup → insert into profiles
- **Profile fetch**: SELECT * FROM profiles WHERE id = auth.uid()
- **Last login update**: TRIGGER on login → update profiles.last_login

### Security Flow
```
Client Input → Validation → Sanitization → Supabase SDK → RLS Policies → Database
   ↓
HTTPS → Vercel → Supabase API → JWT Verification → Row Level Security
```

## 8. Optimization Strategy

### Token Optimization
- Store JWT access token in memory (React state)
- Store refresh token in localStorage (httpOnly cookies not accessible via JS)
- Minimize token size → use Supabase default compact tokens
- Avoid custom token claims → use profiles table for additional data
- Silent refresh before expiry (5 min buffer)

### Parallel Processing
- Post-auth operations parallelized:
  - Fetch user profile
  - Fetch user stories (empty initially)
  - Initialize workspace settings
- React concurrent features (startTransition) for non-urgent updates

### Caching Strategy
- **Persistent**: Session tokens in localStorage
- **Client**: User profile in React Context
- **Memoization**: Use React.memo for auth-dependent components
- **Lazy loading**: Auth pages loaded via React.lazy()
- **CDN**: Static assets served from Vercel edge cache

### Performance vs Cost
- **Client-heavy**: Maximize client-side validation to reduce API calls
- **Static first**: Use static landing page (already implemented)
- **Edge functions**: Handle password reset redirects via Vercel edge
- **Supabase free tier**: Optimize within 50k active users/month
- **Bundle splitting**: Separate auth chunk (~30kb) loaded on demand

### Bundle Optimization
```javascript
// Route-based code splitting
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = React.lazy(() => import('./pages/auth/SignupPage'));

// Preload on CTA hover
const preloadAuth = () => {
  import('./lib/auth');
  import('./pages/auth/LoginPage');
};
```

### Network Optimization
- HTTP/2 multiplexing for auth + profile fetch
- Connection pooling via Supabase client
- Request deduplication for concurrent auth checks
- Service worker for offline session recovery (future)

## 9. Future Enhancements

### Priority 1 (Next Sprint)
1. **OAuth Providers**: Google and GitHub social login
2. **Email Verification**: Require verification before story creation
3. **Account Settings Page**: Update email, password, profile picture
4. **Remember Me**: Extend session duration option

### Priority 2 (Next Quarter)
5. **Two-Factor Authentication**: TOTP (Google Authenticator) support
6. **Team Invites**: Multi-user collaboration on stories
7. **Session Management UI**: View and revoke active sessions
8. **Social Profile Linking**: Connect multiple OAuth providers

### Priority 3 (Future)
9. **Organization/Workspace**: Multi-user teams with roles
10. **Audit Logging**: Track auth events for security compliance
11. **SAML/SSO**: Enterprise authentication support
12. **Passwordless Login**: Magic links and WebAuthn (biometrics)

### ROI Analysis
- OAuth providers: +30% signup conversion (reduce friction)
- Email verification: -50% spam accounts, better data quality
- 2FA: Enterprise-ready security, +$10/user/month potential
- Team features: Unlock collaboration, +300% revenue potential

---

## Implementation Notes

This specification is designed for immediate implementation using the existing tech stack. All components align with:

- **React + Vite architecture** (existing infrastructure)
- **Supabase BaaS** (per tech_stack.md)
- **Dark-purple design system** (frontend-designer skill)
- **Vercel deployment** (existing setup)
- **PostgreSQL RLS** (security best practices)

The authentication system serves as the gateway to the protected storytelling features outlined in the PRD, enabling secure, personalized access to Character Management, Scene Builder, and Writing Mode.