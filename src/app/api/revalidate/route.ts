import { NextRequest, NextResponse } from 'next/server'
import { getConfig } from '@/lib/services/ConfigService'
import { revalidateStorefrontTags } from '@/backend/serverActions/revalidateCache'

/**
 * API route for on-demand cache revalidation.
 * Called by the backend (ecom-web-app) when data changes in the CMS.
 *
 * Usage:  POST /api/revalidate
 *         Body: { "tags": ["sliders", "slider-1"], "secret": "<REVALIDATION_SECRET>" }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { tags, secret } = body as { tags?: string[]; secret?: string }

        // Validate secret to prevent unauthorized revalidation
        const revalidationSecret = await getConfig('REVALIDATION_SECRET')
        if (secret !== revalidationSecret) {
            return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
        }

        if (!tags || !Array.isArray(tags) || tags.length === 0) {
            return NextResponse.json({ error: 'No tags provided' }, { status: 400 })
        }

        await revalidateStorefrontTags(tags)

        return NextResponse.json({ revalidated: true, tags }, { status: 200 })
    } catch (error) {
        console.error('Revalidation error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
