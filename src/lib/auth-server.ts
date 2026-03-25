import 'server-only'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

/**
 * Get the current session on the server side.
 * Drop-in replacement for the old NextAuth `auth()` call.
 */
export async function getSession() {
    return auth.api.getSession({
        headers: await headers(),
    })
}
