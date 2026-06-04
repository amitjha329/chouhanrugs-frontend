import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSessionCookie } from "better-auth/cookies"
import createMiddleware from "next-intl/middleware"
import {
    type Locale,
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
const AUTO_LOCALE_COOKIE = 'cr_auto_locale'
const AUTO_LOCALE_MAX_AGE = 60 * 60 * 24 * 30
const COUNTRY_LOOKUP_TIMEOUT_MS = 750
const IPINFO_LITE_API_BASE = 'https://api.ipinfo.io/lite'

const arabicCountryCodes = new Set([
    'AE', 'BH', 'DZ', 'EG', 'IQ', 'JO', 'KW', 'LB', 'LY', 'MA',
    'OM', 'PS', 'QA', 'SA', 'SD', 'SY', 'TN', 'YE',
])

function isLocale(value: string | undefined): value is Locale {
    return !!value && routing.locales.includes(value as Locale)
}

function getClientIp(req: NextRequest): string | undefined {
    const forwardedFor = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    return (
        req.headers.get('cf-connecting-ip')?.trim() ||
        req.headers.get('x-real-ip')?.trim() ||
        forwardedFor ||
        undefined
    )
}

function isLookupableIp(ip: string | undefined): ip is string {
    if (!ip) return false
    if (ip === '::1' || ip === '127.0.0.1' || ip.startsWith('10.') || ip.startsWith('192.168.')) return false
    if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)) return false
    return true
}

function localeForCountry(countryCode: string | undefined, acceptLanguage: string | null): Locale {
    const code = countryCode?.toUpperCase()
    const language = acceptLanguage?.toLowerCase() ?? ''

    if (code === 'IN') {
        return language.includes('hi') ? 'hi-IN' : 'en-IN'
    }

    if (code === 'GB') {
        return 'en-GB'
    }

    if (code && arabicCountryCodes.has(code)) {
        return 'ar'
    }

    return 'en-US'
}

function getIpInfoApiToken(): string {
    return process.env.IPINFO_API_TOKEN ?? process.env.IP_LOOKUP_API_TOKEN ?? ''
}

async function detectLocaleFromCountry(req: NextRequest): Promise<Locale> {
    const cookieLocale = req.cookies.get(AUTO_LOCALE_COOKIE)?.value
    if (isLocale(cookieLocale)) {
        return cookieLocale
    }

    const ip = getClientIp(req)
    if (!isLookupableIp(ip)) {
        return routing.defaultLocale
    }

    const ipInfoApiToken = getIpInfoApiToken()
    if (!ipInfoApiToken) {
        return routing.defaultLocale
    }

    try {
        const response = await fetch(`${IPINFO_LITE_API_BASE}/${encodeURIComponent(ip)}`, {
            headers: {
                Authorization: `Bearer ${ipInfoApiToken}`,
                Accept: 'application/json',
            },
            signal: AbortSignal.timeout(COUNTRY_LOOKUP_TIMEOUT_MS),
            cache: 'no-store',
        })

        if (!response.ok) {
            return routing.defaultLocale
        }

        const data = await response.json() as { country_code?: string }
        return localeForCountry(data.country_code, req.headers.get('accept-language'))
    } catch {
        return routing.defaultLocale
    }
}

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

    if (!detectedLocale) {
        const locale = await detectLocaleFromCountry(req)
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = localizePathname(pathname, locale)
        const response = NextResponse.redirect(redirectUrl)
        response.cookies.set(AUTO_LOCALE_COOKIE, locale, {
            maxAge: AUTO_LOCALE_MAX_AGE,
            path: '/',
            sameSite: 'lax',
        })
        return response
    }

    // Strip locale prefix to check against protected route list
    const pathWithoutLocale = stripLocaleFromPathname(pathname)

    if (pathWithoutLocale.startsWith('/products')) {
        const rewriteUrl = req.nextUrl.clone()
        rewriteUrl.pathname = `/${detectedLocale}${pathWithoutLocale}`
        return NextResponse.rewrite(rewriteUrl)
    }

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
