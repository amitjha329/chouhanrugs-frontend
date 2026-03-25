import 'server-only';

/**
 * Server-only product catalog data access layer.
 *
 * Native-Check: Uses the MongoDB driver already present in the project
 * (`mongodb` package). No ORM, query-builder, or additional data-access
 * library added. Raw `Collection` queries keep the dependency surface minimal.
 */

import clientPromise from '@/lib/clientPromise';
import type { ProductDataModel } from '@/types/ProductDataModel';
import type BlogDataModel from '@/types/BlogDataModel';

// ─── Helpers ────────────────────────────────────────────────────────────────

async function db() {
    const client = await clientPromise;
    return client.db(process.env.MONGODB_DB);
}

// ─── Products ───────────────────────────────────────────────────────────────

/** Fetch every active product (sorted newest-first). */
export async function getAllProducts(): Promise<ProductDataModel[]> {
    const database = await db();
    const docs = await database
        .collection('products')
        .find({ productActive: true })
        .sort({ updatedOn: -1 })
        .toArray();
    return docs as unknown as ProductDataModel[];
}

/** Fetch a single product by its URL slug. */
export async function getProductBySlug(
    slug: string,
): Promise<ProductDataModel | null> {
    const database = await db();
    const doc = await database
        .collection('products')
        .findOne({ productURL: slug });
    return doc as unknown as ProductDataModel | null;
}

// ─── Blogs ──────────────────────────────────────────────────────────────────

/** Fetch all published blog posts (newest-first). */
export async function getAllBlogPosts(): Promise<BlogDataModel[]> {
    const database = await db();
    const docs = await database
        .collection('blogs')
        .find({ draft: { $ne: true } })
        .sort({ updated: -1 })
        .toArray();
    return docs as unknown as BlogDataModel[];
}

// ─── Categories ─────────────────────────────────────────────────────────────

export interface CategorySlim {
    slug: string;
    name: string;
}

/** Fetch active categories (name + slug only). */
export async function getActiveCategories(): Promise<CategorySlim[]> {
    const database = await db();
    const docs = await database
        .collection('categories')
        .find({ active: true })
        .project({ name: 1, _id: 0 })
        .toArray();

    return docs.map((d) => ({
        slug: d.name
            .toLowerCase()
            .replace(/[\s&]+/g, '-')
            .replace(/[^a-z0-9-]/g, ''),
        name: String(d.name),
    }));
}
