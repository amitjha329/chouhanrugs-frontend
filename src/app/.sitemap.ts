import type { MetadataRoute } from 'next';
import { getAllProducts, getAllBlogPosts, getActiveCategories } from '@/lib/catalog';
import { locales, type Locale } from '@/i18n/routing';
import { resolveLocalizedString } from '@/lib/resolveLocalized';

/**
 * Next.js Metadata-API sitemap.
 *
 * Generates URLs for every locale / slug combination so search engines
 * discover all localised variants and honour hreflang alternates.
 *
 * Native-Check: Uses the native `URL` constructor and `Intl.DateTimeFormat`
 * (implicitly via `Date.toISOString()`). No sitemap-generation package added.
 */

const BASE_URL = process.env.AUTH_URL ?? 'https://chouhanrugs.com';
const DEFAULT_LOCALE: Locale = 'en-IN';

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Build an `alternates.languages` map for a given path.
 * The default locale uses no prefix (`localePrefix: 'as-needed'`).
 */
function buildAlternates(path: string): Record<string, string> {
    const map: Record<string, string> = {};
    for (const locale of locales) {
        const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
        map[locale] = `${BASE_URL}${prefix}${path}`;
    }
    // x-default points to the unprefixed (default locale) URL
    map['x-default'] = `${BASE_URL}${path}`;
    return map;
}

function entry(
    path: string,
    lastModified?: Date,
    opts?: { changeFrequency?: MetadataRoute.Sitemap[number]['changeFrequency']; priority?: number },
): MetadataRoute.Sitemap[number] {
    return {
        url: `${BASE_URL}${path}`,
        lastModified: lastModified ?? new Date(),
        changeFrequency: opts?.changeFrequency ?? 'weekly',
        priority: opts?.priority ?? 0.7,
        alternates: { languages: buildAlternates(path) },
    };
}

// ─── Sitemap generator ─────────────────────────────────────────────────────

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Parallel data fetches — all server-only, no useEffect
    const [products, blogs, categories] = await Promise.all([
        getAllProducts(),
        getAllBlogPosts(),
        getActiveCategories(),
    ]);

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        entry('/', new Date(), { changeFrequency: 'daily', priority: 1.0 }),
        entry('/contact-us', new Date(), { changeFrequency: 'monthly', priority: 0.5 }),
        entry('/about-us', new Date(), { changeFrequency: 'monthly', priority: 0.5 }),
        entry('/products', new Date(), { changeFrequency: 'daily', priority: 0.9 }),
        entry('/blog', new Date(), { changeFrequency: 'daily', priority: 0.8 }),
    ];

    // Category pages
    const categoryPages: MetadataRoute.Sitemap = categories.map((cat) =>
        entry(`/${cat.slug}`, new Date(), { changeFrequency: 'weekly', priority: 0.8 }),
    );

    // Product pages
    const productPages: MetadataRoute.Sitemap = products.map((p) =>
        entry(
            `/products/${encodeURIComponent(resolveLocalizedString(p.productURL, DEFAULT_LOCALE))}`,
            new Date(p.updatedOn),
            { changeFrequency: 'weekly', priority: 0.7 },
        ),
    );

    // Blog post pages
    const blogPages: MetadataRoute.Sitemap = blogs.map((b) =>
        entry(
            `/blog/${encodeURIComponent(resolveLocalizedString(b.slug, DEFAULT_LOCALE))}`,
            new Date(b.updated),
            { changeFrequency: 'monthly', priority: 0.6 },
        ),
    );

    return [...staticPages, ...categoryPages, ...productPages, ...blogPages];
}
