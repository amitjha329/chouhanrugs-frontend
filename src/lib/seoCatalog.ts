import { locales, localizePathname, routing, type Locale } from "@/i18n/routing";
import { resolveLocalizedString, type LocalizedField } from "@/lib/resolveLocalized";
import { getProductGalleryImages, getProductFeaturedImage } from "@/lib/getProductFeaturedImage";
import type { ProductDataModel, Variation } from "@/types/ProductDataModel";

export const DEFAULT_MERCHANT_CURRENCY = "USD";
export const DEFAULT_MERCHANT_COUNTRY = "US";
export const DEFAULT_GOOGLE_PRODUCT_CATEGORY = "Home & Garden > Decor > Rugs";

export function stripHtml(value?: string): string {
    return String(value ?? "")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n")
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/\s+/g, " ")
        .trim();
}

export function escapeXml(value: unknown): string {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

export function safeJsonLd(value: unknown) {
    return {
        __html: JSON.stringify(value).replace(/</g, "\\u003c"),
    };
}

export function isLocalhostUrl(value?: string): boolean {
    try {
        const url = new URL(String(value ?? ""));
        return ["localhost", "127.0.0.1", "0.0.0.0"].includes(url.hostname);
    } catch {
        return false;
    }
}

export function cleanBaseUrl(baseUrl: string): string {
    return String(baseUrl || "https://chouhanrugs.com").replace(/\/+$/, "");
}

export function absoluteUrl(baseUrl: string, url: string): string {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;
    return `${cleanBaseUrl(baseUrl)}/${url.replace(/^\/+/, "")}`;
}

export function normalizedPath(path: string): string {
    const cleanPath = String(path || "/").trim();
    if (/^https?:\/\//i.test(cleanPath)) {
        try {
            const url = new URL(cleanPath);
            return `${url.pathname}${url.search}${url.hash}` || "/";
        } catch {
            return "/";
        }
    }
    const withoutQuery = cleanPath.split(/[?#]/)[0] || "/";
    return withoutQuery.startsWith("/") ? withoutQuery : `/${withoutQuery}`;
}

export function localizedAbsoluteUrl(baseUrl: string, path: string, locale: Locale): string {
    return absoluteUrl(baseUrl, localizePathname(normalizedPath(path), locale));
}

export function localizedLanguages(
    baseUrl: string,
    pathForLocale: (locale: Locale) => string,
): Record<string, string> {
    const languages = Object.fromEntries(
        locales.map((locale) => [
            locale,
            localizedAbsoluteUrl(baseUrl, pathForLocale(locale), locale),
        ]),
    ) as Record<string, string>;

    languages["x-default"] = localizedAbsoluteUrl(
        baseUrl,
        pathForLocale(routing.defaultLocale),
        routing.defaultLocale,
    );

    return languages;
}

export function resolveProductSeoTitle(product: ProductDataModel, locale: Locale): string {
    return (
        resolveLocalizedString(product.metaTitle, locale) ||
        resolveLocalizedString(product.productTitle, locale) ||
        resolveLocalizedString(product.productName, locale)
    );
}

export function resolveProductMerchantTitle(product: ProductDataModel, locale: Locale): string {
    return (
        resolveLocalizedString(product.productTitle, locale) ||
        resolveLocalizedString(product.productName, locale)
    );
}

export function resolveProductDisplayName(product: ProductDataModel, locale: Locale): string {
    return (
        resolveLocalizedString(product.productName, locale) ||
        resolveLocalizedString(product.productTitle, locale)
    );
}

export function resolveProductDescription(product: ProductDataModel, locale: Locale): string {
    return stripHtml(
        resolveLocalizedString(product.metaDescription, locale) ||
        resolveLocalizedString(product.productDescriptionShort, locale) ||
        resolveLocalizedString(product.productDescriptionLong, locale),
    );
}

export function resolveProductSlug(product: Pick<ProductDataModel, "productURL">, locale: Locale): string {
    return resolveLocalizedString(product.productURL as LocalizedField<string>, locale);
}

export function productPath(product: Pick<ProductDataModel, "productURL">, locale: Locale): string {
    return `/products/${encodeURIComponent(resolveProductSlug(product, locale))}`;
}

export function productCanonicalUrl(baseUrl: string, product: ProductDataModel, locale: Locale): string {
    return localizedAbsoluteUrl(baseUrl, productPath(product, locale), locale);
}

export function productAlternates(baseUrl: string, product: ProductDataModel) {
    return localizedLanguages(baseUrl, (locale) => productPath(product, locale));
}

export function isPublicProduct(product: Partial<ProductDataModel>): boolean {
    const status = String(product.productStatus ?? "Published").toLowerCase();
    const visibility = String(product.visibility ?? "visible").toLowerCase();

    return Boolean(product.productActive) &&
        status !== "draft" &&
        status !== "archived" &&
        visibility !== "hidden";
}

export function isMerchantEligibleProduct(product: ProductDataModel): boolean {
    return isPublicProduct(product) &&
        !product.merchantExcluded &&
        Number(product.productStockQuantity ?? 0) > 0 &&
        Boolean(getProductFeaturedImage(product)) &&
        Number(product.productSellingPrice ?? 0) > 0;
}

export function getProductImages(product: ProductDataModel, baseUrl: string): string[] {
    return getProductGalleryImages(product)
        .map((image) => absoluteUrl(baseUrl, image))
        .filter(Boolean);
}

export function getVariationSellingPrice(variation: Variation): number {
    const price = Number(variation.variationPrice ?? 0);
    const discount = Number(variation.variationDiscount ?? 0);
    if (!Number.isFinite(price) || price <= 0) return 0;
    const sellingPrice = price - (discount / 100) * price;
    return Math.round(Math.max(sellingPrice, 0) * 100) / 100;
}

export function productPriceRange(product: ProductDataModel) {
    const variationPrices = (product.variations ?? [])
        .map(getVariationSellingPrice)
        .filter((price) => price > 0);

    if (variationPrices.length) {
        return {
            min: Math.min(...variationPrices),
            max: Math.max(...variationPrices),
        };
    }

    const price = Number(product.productSellingPrice ?? 0);
    return { min: price, max: price };
}

export function validGtin(value?: string): string | undefined {
    const gtin = String(value ?? "").replace(/\D/g, "");
    return [8, 12, 13, 14].includes(gtin.length) ? gtin : undefined;
}
