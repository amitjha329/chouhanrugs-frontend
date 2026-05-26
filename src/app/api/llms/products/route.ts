import getProductListForLLMS from "@/backend/serverActions/getProductList";
import { LocalizedField, resolveLocalizedString } from "@/lib/resolveLocalized";
import { type Locale } from "@/i18n/routing";
import { getProductFeaturedImage } from "@/lib/getProductFeaturedImage";

// export const runtime = 'edge';

/**
 * GET /api/llms/products
 *
 * Returns a plain-text catalog of all active products, suitable for LLM
 * ingestion. HTML in product descriptions is stripped using native RegExp.
 *
 * Native-Check: HTML stripping uses `String.replace(/<[^>]*>/g, '')` — a
 * native RegExp pattern. No `striptags`, `sanitize-html`, or any other
 * external HTML-cleaning library is used.
 *
 * NOTE: Edge Runtime is set per the architectural constraint. Product data
 * is fetched via `fetch()` to the same origin's product-sitemap endpoint
 * to remain edge-compatible (MongoDB driver needs Node.js APIs).
 */

/** Strip HTML tags from a string using native RegExp. */
function stripHtml(html: string): string {
    return html
        .replace(/<br\s*\/?>/gi, '\n')       // <br> → newline
        .replace(/<\/p>/gi, '\n')            // </p> → newline
        .replace(/<[^>]*>/g, '')             // strip remaining tags
        .replace(/&nbsp;/gi, ' ')            // common HTML entities
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/\n{3,}/g, '\n\n')          // collapse excessive newlines
        .trim();
}

interface ProductEntry {
    productName: LocalizedField<string>;
    productTitle?: LocalizedField<string>;
    metaTitle?: LocalizedField<string>;
    metaDescription?: LocalizedField<string>;
    productURL: LocalizedField<string>;
    productDescriptionShort: LocalizedField<string>;
    productDescriptionLong: LocalizedField<string>;
    productSellingPrice: number;
    productMSRP: number;
    productCategory: string;
    tags: string[];
    productBaseColor: string;
    highlights: LocalizedField<string[]>;
    productStockQuantity: number;
    productFeaturedImage?: string;
    images?: string[];
    productBrand?: string;
    sku?: string;
    gtin?: string;
    itemCode?: string;
    productStatus?: string;
    visibility?: string;
    updatedOn: number;
}

export async function GET(request: Request): Promise<Response> {
    const origin = new URL(request.url).origin;

    // let products: ProductEntry[] = [];
    const products:ProductEntry[] = (await getProductListForLLMS());


    // try {
    //     // Fetch raw product data from the existing product-sitemap route
    //     // which already queries MongoDB on the Node.js runtime.
    //     const res = await fetch(`${origin}/product-sitemap.xml`, {
    //         headers: { Accept: 'application/json' },
    //     });

    //     if (res.ok) {
    //         // The product-sitemap returns XML; try JSON first in case a
    //         // JSON endpoint is available, otherwise fall back to parsing.
    //         const contentType = res.headers.get('content-type') ?? '';
    //         if (contentType.includes('json')) {
    //             products = await res.json();
    //         }
    //     }
    // } catch {
    //     // Non-fatal; we return what we have
    // }

    // If we couldn't get products from the sitemap, return a stub
    if (products.length === 0) {
        return new Response(
            '# Chouhan Rugs — Product Catalog\n\nNo product data currently available. Visit https://chouhanrugs.com/products to browse.',
            {
                status: 200,
                headers: {
                    'Content-Type': 'text/plain; charset=utf-8',
                    'Cache-Control': 'public, max-age=3600',
                },
            },
        );
    }

    const lines: string[] = [
        '# Chouhan Rugs — Product Catalog',
        '',
        `> ${products.length} products available`,
        '',
    ];

    for (const p of products) {
        const locale: Locale = 'en-US'
        const shortDesc = stripHtml(resolveLocalizedString(p.productDescriptionShort, locale));
        const longDesc = stripHtml(resolveLocalizedString(p.productDescriptionLong, locale));
        const metaDesc = stripHtml(resolveLocalizedString(p.metaDescription, locale));
        const description = metaDesc || longDesc || shortDesc || 'No description available.';
        const title =
            resolveLocalizedString(p.metaTitle, locale) ||
            resolveLocalizedString(p.productTitle, locale) ||
            resolveLocalizedString(p.productName, locale);
        const slug = resolveLocalizedString(p.productURL, locale);
        const price =
            p.productSellingPrice != null
                ? `$${Number(p.productSellingPrice).toLocaleString('en-US')}`
                : '';
        const msrp =
            p.productMSRP != null
                ? ` (MSRP $${Number(p.productMSRP).toLocaleString('en-US')})`
                : '';

        lines.push(
            `## ${title}`,
            '',
            `- URL: /products/${encodeURIComponent(slug)}`,
            `- Featured Image: ${getProductFeaturedImage(p) || '—'}`,
            `- Category: ${p.productCategory ?? 'Uncategorized'}`,
            `- Brand: ${p.productBrand || 'Chouhan Rugs'}`,
            `- Price: ${price}${msrp}`,
            `- SKU: ${p.sku || p.itemCode || '—'}`,
            `- GTIN: ${p.gtin || '—'}`,
            `- Color: ${p.productBaseColor ?? '—'}`,
            `- Tags: ${(p.tags ?? []).join(', ') || '—'}`,
            `- In Stock: ${(p.productStockQuantity ?? 0) > 0 ? 'Yes' : 'No'}`,
            `- Status: ${p.productStatus || 'Published'}`,
            `- Visibility: ${p.visibility || 'visible'}`,
            `- Updated: ${p.updatedOn ? new Date(p.updatedOn).toISOString() : '—'}`,
            '',
            description,
            '',
            '---',
            '',
        );
    }

    return new Response(lines.join('\n'), {
        status: 200,
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
    });
}
