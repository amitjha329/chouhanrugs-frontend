export type CookieConsentPreferences = {
    necessary: true
    analytics: boolean
    marketing: boolean
}

export type CookieConsentRecord = {
    version: 1
    savedAt: string
    preferences: CookieConsentPreferences
}

export const COOKIE_CONSENT_STORAGE_KEY = 'chouhanrugs_cookie_consent_v1'

export const DEFAULT_COOKIE_CONSENT: CookieConsentPreferences = {
    necessary: true,
    analytics: false,
    marketing: false,
}

export const ACCEPT_ALL_COOKIE_CONSENT: CookieConsentPreferences = {
    necessary: true,
    analytics: true,
    marketing: true,
}

export function readCookieConsent(): CookieConsentRecord | null {
    if (typeof window === 'undefined') return null

    try {
        const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
        if (!raw) return null

        const parsed = JSON.parse(raw) as CookieConsentRecord
        if (parsed?.version !== 1 || !parsed.preferences) return null

        return {
            version: 1,
            savedAt: parsed.savedAt,
            preferences: {
                necessary: true,
                analytics: parsed.preferences.analytics === true,
                marketing: parsed.preferences.marketing === true,
            },
        }
    } catch {
        return null
    }
}

export function writeCookieConsent(preferences: CookieConsentPreferences) {
    if (typeof window === 'undefined') return

    const record: CookieConsentRecord = {
        version: 1,
        savedAt: new Date().toISOString(),
        preferences: {
            necessary: true,
            analytics: preferences.analytics === true,
            marketing: preferences.marketing === true,
        },
    }

    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(record))
}

export function hasCookieConsent(category: 'analytics' | 'marketing') {
    return readCookieConsent()?.preferences[category] === true
}
