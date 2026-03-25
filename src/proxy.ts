import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSessionCookie } from "better-auth/cookies"
import createMiddleware from "next-intl/middleware"
import { routing } from "@/i18n/routing"

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

// Regex to match and strip locale prefix from pathname
const localePattern = new RegExp(
    `^/(${routing.locales.join('|')})(/|$)`
)

export async function proxy(req: NextRequest) {
    const pathname = req.nextUrl.pathname

    // Strip locale prefix to check against protected route list
    const match = pathname.match(localePattern)
    const pathWithoutLocale = match
        ? pathname.replace(localePattern, '/')
        : pathname

    // ── Auth guard ──────────────────────────────────────────────────────
    const isProtected = protectedRoutes.some((r) =>
        pathWithoutLocale.startsWith(r)
    )
    if (isProtected) {
        const sessionCookie = getSessionCookie(req)
        if (!sessionCookie) {
            const locale = match?.[1]
            const prefix =
                locale && locale !== routing.defaultLocale ? `/${locale}` : ''
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