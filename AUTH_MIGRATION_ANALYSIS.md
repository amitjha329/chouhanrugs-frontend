# Auth.js → Better Auth Migration Analysis

## Current Implementation Summary

| Feature | Auth.js Implementation |
|---------|----------------------|
| Package | `next-auth@5.0.0-beta.25` |
| Adapter | Custom `@auth/mongodb-adapter@^3.9.1` wrapper |
| Session Strategy | JWT (30-day maxAge) |
| Providers | Google OAuth + Credential (OTP-based email) |
| Experimental | WebAuthn |
| Custom Fields | `roles: string[]`, `registered: Date` on user |
| Protected Routes | `/user`, `/order` (via proxy.ts with `getToken()`) |

### Files Using Auth (50+ total)

- **20 files** use `auth()` server-side
- **15 files** use `useSession()` client-side
- **2 files** use `signIn()`
- **2 files** use `signOut()`
- **2 files** use `SessionProvider`
- **1 file** uses `getToken()` (proxy.ts)

---

## Feature-by-Feature Compatibility

### ✅ Fully Compatible

| Auth.js Feature | Better Auth Equivalent | Notes |
|----------------|----------------------|-------|
| Google OAuth | `socialProviders.google` | Direct mapping. Supports `accessType: "offline"`, `prompt` |
| MongoDB Adapter | `@better-auth/mongo-adapter` | No schema migration needed for MongoDB |
| Route Handler | `toNextJsHandler(auth)` | Rename `[...nextauth]` → `[...all]` |
| `signIn("google")` client | `authClient.signIn.social({ provider: "google" })` | |
| `signOut()` client | `authClient.signOut()` | |
| `useSession()` client | `authClient.useSession()` | Returns `{ data, error, isPending }` instead of `{ data, status }` |
| `auth()` server | `auth.api.getSession({ headers: await headers() })` | Must pass headers explicitly |
| `signIn()` server | `auth.api.signInSocial({ body: { provider: "google" } })` | |
| `signOut()` server | `auth.api.signOut({ headers: await headers() })` | |
| WebAuthn | Passkey plugin (`better-auth/plugins`) | |
| Custom sign-in page | Custom UI with client methods | |
| Next.js 16 Proxy | `getSessionCookie()` or `auth.api.getSession()` | |

### ⚠️ Compatible With Changes

| Auth.js Feature | Better Auth Approach | Migration Effort |
|----------------|---------------------|-----------------|
| JWT Strategy | Database sessions (default) or stateless mode | **Medium** — Better Auth prefers DB sessions. Stateless mode available. |
| Custom user fields (`roles`, `registered`) | `user.additionalFields` in config | **Low** — Declare fields in betterAuth config |
| `session.update({name, image})` | `auth.api.updateUser()` or `authClient.updateUser()` | **Medium** — Different API, need to update all profile mutation sites |
| `SessionProvider` wrapper | Not needed — Better Auth uses nano-store | **Low** — Remove provider wrappers |
| `getToken()` in proxy | `getSessionCookie(request)` or `auth.api.getSession()` | **Medium** — Different session check pattern |
| JWT callbacks (token manipulation) | Database hooks / `databaseHooks` config | **Medium** — Logic moves from callbacks to hooks |
| `allowDangerousEmailAccountLinking` | `accountLinking.enabled: true` in config | **Low** |
| `redirect()` callback | Handle in client-side signIn callbacks | **Low** |

### 🔴 Critical Gap: OTP Credential Flow

**Current Architecture:**
1. Frontend's `SigninForm` sends email to backend (`AUTH_URL/api/mwHandler`) to generate OTP
2. Backend stores OTP token (MD5 hashed) in a token collection  
3. User enters OTP → frontend passes to NextAuth Credential provider
4. Credential `authorize()` callback:
   - Fetches stored token from backend (`action: "getTokenDB"`)
   - MD5 hashes user's input, compares with stored token
   - If match, fetches user from backend (`action: "getUserMiddleWare"`)
   - Returns user object with `roles`, `cartCount`, `number`

**Better Auth Email OTP Plugin:**
- Better Auth manages the **entire OTP lifecycle** internally:
  - Generates OTP → sends via `sendVerificationOTP` callback → stores in verification table → verifies
- The `signIn.emailOtp()` method handles everything

**The Conflict:**
- The current OTP generation and email sending lives in the **backend** (`ecom-web-app`)
- We **cannot modify the backend** per constraints
- Better Auth's Email OTP plugin expects to control OTP generation/storage/verification itself
- The backend's `/api/mwHandler` API is the OTP source of truth

**Resolution Options:**

1. **Bridge approach (Recommended):** Configure Better Auth's Email OTP plugin's `sendVerificationOTP` to call the backend's existing `/api/mwHandler` to generate and send the OTP. Override or extend verification to use the backend's stored tokens. This keeps the backend as the OTP authority while Better Auth handles the auth session.

2. **Dual OTP system:** Let Better Auth manage its own OTP separately from the backend. The frontend Better Auth instance generates/stores OTPs in its verification table, sends emails via its own SMTP. This decouples from the backend entirely but means the OTP system runs on the frontend's Better Auth instance.

3. **Custom credential-like flow:** Better Auth doesn't have a direct Credential provider equivalent, but you can use the Email OTP plugin's `signIn.emailOtp()` to achieve similar behavior. The OTP is sent by Better Auth, verified by Better Auth, and a session is created.

---

## Database Schema Differences

### User Table
| Auth.js | Better Auth | Notes |
|---------|------------|-------|
| `name?` | `name` (required) | Must ensure all users have names |
| `email?` | `email` (required, unique) | Must ensure all users have emails |
| `emailVerified?` (Date) | `emailVerified` (boolean) | Type change needed |
| `image?` | `image?` | Same |
| — | `createdAt` (Date) | New required field |
| — | `updatedAt` (Date) | New required field |
| `roles` (custom) | Via `additionalFields` | Declare in config |
| `registered` (custom) | Map to `createdAt` | Can reuse existing field |

### Session Table
| Auth.js | Better Auth | Notes |
|---------|------------|-------|
| `sessionToken` | `token` | Rename |
| `expires` | `expiresAt` | Rename |
| — | `ipAddress?` | New field |
| — | `userAgent?` | New field |
| — | `createdAt` | New field |
| — | `updatedAt` | New field |

### Account Table
| Auth.js | Better Auth | Notes |
|---------|------------|-------|
| `provider` | `providerId` | Rename |
| `providerAccountId` | `accountId` | Rename |
| `access_token` | `accessToken` | camelCase |
| `refresh_token` | `refreshToken` | camelCase |
| `expires_at` | `accessTokenExpiresAt` | Rename + type change |
| `type` | — | Removed (determined by providerId) |
| `token_type` | — | Removed |
| `session_state` | — | Removed |
| — | `password?` | New for credential accounts |
| — | `createdAt` | New field |
| — | `updatedAt` | New field |

**Note:** For MongoDB, Better Auth states "we don't need to generate or migrate the schema." However, existing documents will have the old field names. A data migration script is needed.

---

## Migration Effort Estimate

| Area | Files Affected | Complexity |
|------|---------------|------------|
| Core auth config | 3 files (auth.ts, auth.config.ts, authAdapter.ts) | High |
| Route handler | 1 file ([...nextauth]/route.ts) | Low |
| Proxy/Middleware | 1 file (proxy.ts) | Medium |
| Auth client setup | 1 new file (auth-client.ts) | Low |
| Server components (auth()) | ~20 files | Medium (find-replace pattern) |
| Client components (useSession) | ~15 files | Medium (import + API changes) |
| SigninForm (OTP flow) | 1 file + logic rewrite | High |
| SessionProvider removal | 2 files (layouts) | Low |
| Profile update (session.update) | ~3 files | Medium |
| Package changes | package.json | Low |
| DB migration script | 1 new script | Medium |

**Total: ~48 files need changes**

---

## Recommendation

**Proceed with migration** — Better Auth is compatible with all current features. The main risk is the OTP credential flow, which can be resolved using **Option 2 (Dual OTP system)** — let Better Auth's Email OTP plugin fully manage OTP generation, storage, and verification on the frontend. This actually *simplifies* the architecture by removing the dependency on the backend's `/api/mwHandler` for auth.

### Prerequisites Before Starting:
1. ✅ MongoDB adapter available
2. ✅ Google OAuth supported  
3. ✅ Email OTP plugin available
4. ✅ Next.js 16 proxy supported
5. ✅ Passkey/WebAuthn plugin available
6. ⚠️ Need SMTP config for Better Auth to send OTP emails directly
7. ⚠️ Need DB migration for existing user/account/session documents
