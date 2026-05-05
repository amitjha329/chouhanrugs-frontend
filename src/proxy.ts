import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSessionCookie } from "better-auth/cookies"
import createMiddleware from "next-intl/middleware"
import {
    getLocaleFromPathname,
    getLocalePrefix,
    localizePathname,
    routing,
    stripLocaleFromPathname,
} from "@/i18n/routing"

/**
 * Composed proxy: Auth guard → next-intl locale routing.
 *
 * Uses `getSessionCookie()` from better-auth/cookies for a fast optimistic
 * check. Full session validation happens in each page/route.
 *
 * Next.js 16 uses the `proxy` named export instead of `middleware`.
 */

const intlMiddleware = createMiddleware(routing)

// Protected routes that require authentication (without locale prefix)
const protectedRoutes = ['/user', '/order']

export async function proxy(req: NextRequest) {
    const pathname = req.nextUrl.pathname
    const detectedLocale = getLocaleFromPathname(pathname)

    // Canonicalize locale prefixes so locale URLs are case-insensitive
    // and always emitted in the configured format (e.g. /en/us, /en/in).
    if (detectedLocale) {
        const canonicalPathname = localizePathname(stripLocaleFromPathname(pathname), detectedLocale)
        if (canonicalPathname !== pathname) {
            const redirectUrl = req.nextUrl.clone()
            redirectUrl.pathname = canonicalPathname
            return NextResponse.redirect(redirectUrl)
        }
    }

    // Strip locale prefix to check against protected route list
    const pathWithoutLocale = stripLocaleFromPathname(pathname)

    // ── Auth guard ──────────────────────────────────────────────────────
    const isProtected = protectedRoutes.some((r) =>
        pathWithoutLocale.startsWith(r)
    )
    if (isProtected) {
        const sessionCookie = getSessionCookie(req)
        if (!sessionCookie) {
            const locale = detectedLocale ?? routing.defaultLocale
            const prefix = getLocalePrefix(locale)
            const signinUrl = new URL(`${prefix}/signin`, req.url)
            signinUrl.searchParams.set('cb', pathname)
            return NextResponse.redirect(signinUrl)
        }
    }

    // ── Locale routing (next-intl middleware) ───────────────────────────
    return intlMiddleware(req)
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|api|.*\\..*).*)',
    ],
}