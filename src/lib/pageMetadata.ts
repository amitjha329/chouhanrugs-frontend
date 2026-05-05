import getPageData from "@/backend/serverActions/getPageData";
import getSiteData from "@/backend/serverActions/getSiteData";
import { type Locale } from "@/i18n/routing";
import { resolveLocalizedString } from "@/lib/resolveLocalized";
import type { Metadata } from "next";

type StaticPageMetadataOptions = {
    pageKey: string;
    alternatePageKeys?: string[];
    locale: Locale;
    path: string;
    fallbackTitle: string;
    fallbackDescription: string;
    fallbackKeywords?: string;
    image?: string;
};

const stripHtml = (value?: string) =>
    value
        ?.replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim() ?? "";

const joinUrl = (baseUrl: string, path: string) => {
    const cleanBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    const cleanPath = path.replace(/^\/+/, "");
    return `${cleanBase}${cleanPath}`;
};

export async function getStaticPageMetadata({
    pageKey,
    alternatePageKeys = [],
    locale,
    path,
    fallbackTitle,
    fallbackDescription,
    fallbackKeywords = "",
    image,
}: StaticPageMetadataOptions): Promise<Metadata> {
    const [pageMeta, siteData] = await Promise.all([
        Promise.all([pageKey, ...alternatePageKeys].map(key => getPageData(key).catch(() => null)))
            .then(results => results.find(Boolean) ?? null),
        getSiteData(),
    ]);

    const title = resolveLocalizedString(pageMeta?.pageTitle, locale) || fallbackTitle;
    const description = stripHtml(resolveLocalizedString(pageMeta?.pageDescription, locale)) || fallbackDescription;
    const keywords = resolveLocalizedString(pageMeta?.pageKeywords, locale) || fallbackKeywords;
    const ogImage = image ?? siteData.logoSrc;

    return {
        title,
        description,
        keywords,
        robots: {
            index: true,
            follow: true,
        },
        alternates: {
            canonical: joinUrl(siteData.url, path),
        },
        openGraph: {
            title,
            description,
            type: "website",
            siteName: siteData.title ?? "Chouhan Rugs",
            phoneNumbers: siteData.contact_details.phone,
            emails: siteData.contact_details.email,
            images: ogImage,
        },
        twitter: {
            title,
            description,
            card: "summary",
            images: ogImage,
        },
    };
}
