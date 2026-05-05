import { getActiveCategories, getAllBlogPosts, getAllProducts } from '@/lib/catalog';
import { resolveLocalizedString } from '@/lib/resolveLocalized';
import { locales, localizePathname, routing, type Locale } from '@/i18n/routing';

const BASE_URL = process.env.AUTH_URL ?? 'https://chouhanrugs.com';

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

function absolute(path: string, locale: Locale) {
    return `${BASE_URL}${withLocale(path, locale)}`;
}

function localizedUrl(pathForLocale: LocalizedPathBuilder, lastModified?: Date) {
    const defaultPath = pathForLocale(routing.defaultLocale);
    const alternates = locales
        .map(locale => {
            const href = absolute(pathForLocale(locale), locale);
            return `<xhtml:link rel="alternate" hreflang="${locale}" href="${escapeXml(href)}" />`;
        })
        .join('');

    return `<url>
        <loc>${escapeXml(absolute(defaultPath, routing.defaultLocale))}</loc>
        ${lastModified ? `<lastmod>${lastModified.toISOString()}</lastmod>` : ''}
        ${alternates}
        <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(absolute(defaultPath, routing.defaultLocale))}" />
    </url>`;
}

export async function GET() {
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
    ].map(path => localizedUrl(() => path));

    const categoryPages = categories.map(category =>
        localizedUrl(() => `/products/category/${encodeURIComponent(category.slug)}`),
    );

    const productPages = products.map(product =>
        localizedUrl(
            locale => `/products/${encodeURIComponent(resolveLocalizedString(product.productURL, locale))}`,
            new Date(product.updatedOn),
        ),
    );

    const blogPages = blogs.map(blog =>
        localizedUrl(
            locale => `/blog/${encodeURIComponent(resolveLocalizedString(blog.slug, locale))}`,
            new Date(blog.updated),
        ),
    );

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[...staticPages, ...categoryPages, ...productPages, ...blogPages].join('\n')}
</urlset>`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
        },
    });
}
