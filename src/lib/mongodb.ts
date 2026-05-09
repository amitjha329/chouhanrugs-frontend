import 'server-only'

import clientPromise from '@/lib/clientPromise'

export async function getStorefrontDb() {
    const dbName = process.env.MONGODB_DB

    if (!dbName) {
        throw new Error('MONGODB_DB is required for storefront database access')
    }

    const client = await clientPromise
    return client.db(dbName)
}
