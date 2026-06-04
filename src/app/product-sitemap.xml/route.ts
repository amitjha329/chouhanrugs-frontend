import { locales, routing, type Locale } from "@/i18n/routing";
import { getAllProducts } from "@/lib/catalog";
import { getProductGalleryImages } from "@/lib/getProductFeaturedImage";
import {
    absoluteUrl,
    cleanBaseUrl,
    escapeXml,
    productCanonicalUrl,
} from "@/lib/seoCatalog";
import { connection } from "next/server";

export async function GET() {
    await connection();

    const [baseUrl, products] = await Promise.all([
        Promise.resolve(process.env.NEXT_PUBLIC_FRONTEND_URL || process.env.FRONTEND_URL || "https://chouhanrugs.com"),
        getAllProducts(),
    ]);
    const siteUrl = cleanBaseUrl(baseUrl);

    const defaultLocale = routing.defaultLocale;
    const urls = products.map((product) => {
        const alternates = locales
            .map((locale: Locale) => {
                const href = productCanonicalUrl(siteUrl, product, locale);
                return `<xhtml:link rel="alternate" hreflang="${locale}" href="${escapeXml(href)}" />`;
            })
            .join("");

        const loc = productCanonicalUrl(siteUrl, product, defaultLocale);
        const images = getProductGalleryImages(product)
            .map((image) => absoluteUrl(siteUrl, image))
            .filter(Boolean)
            .map((image) => `<image:image><image:loc>${escapeXml(image)}</image:loc></image:image>`)
            .join("");

        return `<url>
            <loc>${escapeXml(loc)}</loc>
            <lastmod>${new Date(product.updatedOn).toISOString()}</lastmod>
            ${images}
            ${alternates}
            <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(productCanonicalUrl(siteUrl, product, defaultLocale))}" />
        </url>`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join("\n")}
</urlset>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
    });
}
