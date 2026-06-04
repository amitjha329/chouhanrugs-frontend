import { cleanBaseUrl, escapeXml } from '@/lib/seoCatalog';

const SITEMAP_PATHS = [
    '/page-sitemap.xml',
    '/product-sitemap.xml',
    '/post-sitemap.xml',
];

function getBaseUrl() {
    return cleanBaseUrl(process.env.NEXT_PUBLIC_FRONTEND_URL || process.env.FRONTEND_URL || 'https://chouhanrugs.com');
}

export function GET() {
    const baseUrl = getBaseUrl();
    const lastModified = new Date().toISOString();
    const sitemapEntries = SITEMAP_PATHS.map(path => `<sitemap>
        <loc>${escapeXml(`${baseUrl}${path}`)}</loc>
        <lastmod>${lastModified}</lastmod>
    </sitemap>`).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
    });
}
