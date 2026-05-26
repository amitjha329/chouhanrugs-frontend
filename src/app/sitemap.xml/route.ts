import { getActiveCategories, getAllBlogPosts, getAllProducts } from '@/lib/catalog';
import { getConfig } from '@/lib/services/ConfigService';
import { resolveLocalizedString } from '@/lib/resolveLocalized';
import { locales, localizePathname, routing, type Locale } from '@/i18n/routing';
import { absoluteUrl } from '@/lib/seoCatalog';
import { getProductGalleryImages } from '@/lib/getProductFeaturedImage';

type LocalizedPathBuilder = (locale: Locale) => string;

function escapeXml(value: string) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function withLocale(path: string, locale: Locale) {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return localizePathname(cleanPath, locale);
}

function absolute(baseUrl: string, path: string, locale: Locale) {
    return `${baseUrl}${withLocale(path, locale)}`;
}

function localizedUrl(baseUrl: string, pathForLocale: LocalizedPathBuilder, lastModified?: Date, images: string[] = []) {
    const defaultPath = pathForLocale(routing.defaultLocale);
    const alternates = locales
        .map(locale => {
            const href = absolute(baseUrl, pathForLocale(locale), locale);
            return `<xhtml:link rel="alternate" hreflang="${locale}" href="${escapeXml(href)}" />`;
        })
        .join('');

    return `<url>
        <loc>${escapeXml(absolute(baseUrl, defaultPath, routing.defaultLocale))}</loc>
        ${lastModified ? `<lastmod>${lastModified.toISOString()}</lastmod>` : ''}
        ${images.map(image => `<image:image><image:loc>${escapeXml(absoluteUrl(baseUrl, image))}</image:loc></image:image>`).join('')}
        ${alternates}
        <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(absolute(baseUrl, defaultPath, routing.defaultLocale))}" />
    </url>`;
}

export async function GET() {
    const baseUrl = await getConfig('FRONTEND_URL', 'https://chouhanrugs.com');
    const [products, blogs, categories] = await Promise.all([
        getAllProducts(),
        getAllBlogPosts(),
        getActiveCategories(),
    ]);

    const staticPages = [
        '/',
        '/products',
        '/blog',
        '/about-us',
        '/contact-us',
        '/policies',
        '/terms',
        '/track-order',
        '/jute-rugs',
        '/cotton-rugs',
        '/jute-hand-bags',
        '/pillow-and-cushion-covers',
    ].map(path => localizedUrl(baseUrl, () => path));

    const categoryPages = categories.map(category =>
        localizedUrl(baseUrl, () => `/products/category/${encodeURIComponent(category.slug)}`),
    );

    const productPages = products.map(product =>
        localizedUrl(
            baseUrl,
            locale => `/products/${encodeURIComponent(resolveLocalizedString(product.productURL, locale))}`,
            new Date(product.updatedOn),
            getProductGalleryImages(product),
        ),
    );

    const blogPages = blogs.map(blog =>
        localizedUrl(
            baseUrl,
            locale => `/blog/${encodeURIComponent(resolveLocalizedString(blog.slug, locale))}`,
            new Date(blog.updated),
        ),
    );

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${[...staticPages, ...categoryPages, ...productPages, ...blogPages].join('\n')}
</urlset>`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
        },
    });
}
