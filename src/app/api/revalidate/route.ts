import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

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
        if (secret !== process.env.REVALIDATION_SECRET) {
            return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
        }

        if (!tags || !Array.isArray(tags) || tags.length === 0) {
            return NextResponse.json({ error: 'No tags provided' }, { status: 400 })
        }

        // Revalidate each tag with immediate expiration
        // { expire: 0 } forces immediate cache invalidation instead of stale-while-revalidate
        for (const tag of tags) {
            revalidateTag(tag, { expire: 0 })
        }

        return NextResponse.json({ revalidated: true, tags }, { status: 200 })
    } catch (error) {
        console.error('Revalidation error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
