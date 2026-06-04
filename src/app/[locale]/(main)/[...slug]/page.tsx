import getDynamicPageBySlug from "@/backend/serverActions/getDynamicPageBySlug";
import getSiteData from "@/backend/serverActions/getSiteData";
import { getLocaleFromPathname, type Locale } from "@/i18n/routing";
import { resolveLocalizedString } from "@/lib/resolveLocalized";
import { absoluteUrl, localizedAbsoluteUrl, localizedLanguages, normalizedPath } from "@/lib/seoCatalog";
import DynamicPageRenderer from "@/ui/DynamicPages/DynamicPageRenderer";
import generateFaqJsonLd, { extractFaqItems } from "@/utils/generateFaqJsonLd";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type DynamicPageProps = {
    params: Promise<{
        locale: string;
        slug: string[];
    }>;
};

const RESERVED_ROUTE_PREFIXES = new Set([
    "blog",
    "cart",
    "invoice",
    "order",
    "payment",
    "products",
    "signin",
    "track-order",
    "unsubscribe",
    "user",
]);

function getNormalizedRoute(locale: string, slug: string[]) {
    const prefixedLocale = getLocaleFromPathname(`/${[locale, ...slug].join("/")}`);

    if (prefixedLocale && prefixedLocale !== locale && slug.length > 0) {
        return {
            locale: prefixedLocale,
            slug: slug.slice(1),
        };
    }

    return {
        locale: locale as Locale,
        slug,
    };
}

const isReservedRoute = (slug: string[]) => RESERVED_ROUTE_PREFIXES.has(slug[0] ?? "");

export async function generateMetadata(props: DynamicPageProps): Promise<Metadata> {
    const { slug, locale: loc } = await props.params;
    const normalized = getNormalizedRoute(loc, slug);

    if (isReservedRoute(normalized.slug)) {
        return {};
    }

    const locale = normalized.locale;
    const [page, siteData] = await Promise.all([
        getDynamicPageBySlug(normalized.slug.join("/")),
        getSiteData(),
    ]);

    if (!page) {
        return {};
    }

    const rootProps = page.data?.root?.props as Record<string, unknown> | undefined;
    const title = String(rootProps?.metatitle || rootProps?.title || "") || resolveLocalizedString(page.pageTitle, locale);
    const description = String(rootProps?.description || "") || resolveLocalizedString(page.pageDescription, locale);
    const rootKeywords = Array.isArray(rootProps?.keywords)
        ? rootProps.keywords.map((item: { keyword?: string }) => item.keyword).filter(Boolean).join(", ")
        : resolveLocalizedString(page.pageKeywords, locale);
    const keywords = rootKeywords || resolveLocalizedString(page.pageKeywords, locale);
    const robotsIndex = rootProps?.robotsIndex !== false;
    const robotsFollow = rootProps?.robotsFollow !== false;
    const canonicalPath = normalizedPath(String(rootProps?.canonicalOverride ?? "") || `/${page.slug ?? page.page}`);
    const socialImage = String(rootProps?.socialImage ?? "").trim();

    return {
        title,
        description,
        keywords,
        robots: {
            index: robotsIndex,
            follow: robotsFollow,
        },
        alternates: {
            canonical: localizedAbsoluteUrl(siteData.url, canonicalPath, locale),
            languages: localizedLanguages(siteData.url, () => canonicalPath),
        },
        openGraph: {
            title: String(rootProps?.socialTitle ?? title),
            description: String(rootProps?.socialDescription ?? description),
            images: socialImage ? [absoluteUrl(siteData.url, socialImage)] : undefined,
        },
    };
}

export default async function DynamicPage(props: DynamicPageProps) {
    const { slug, locale: loc } = await props.params;
    const normalized = getNormalizedRoute(loc, slug);

    if (isReservedRoute(normalized.slug)) {
        return null;
    }

    const page = await getDynamicPageBySlug(normalized.slug.join("/"));

    if (!page) {
        notFound();
    }

    if (!page.data) {
        notFound();
    }

    const faqItems = extractFaqItems(page.data);

    return (
        <>
            {faqItems.length ? (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={generateFaqJsonLd(faqItems)}
                    key="dynamic-page-faq-jsonld"
                />
            ) : null}
            <DynamicPageRenderer data={page.data} />
        </>
    );
}
