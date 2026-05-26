import type { ProductDataModel } from "../types/ProductDataModel";
import { resolveLocalizedString } from "@/lib/resolveLocalized";
import { type Locale } from "@/i18n/routing";
import {
    getProductImages,
    productCanonicalUrl,
    productPriceRange,
    resolveProductDescription,
    resolveProductSeoTitle,
    safeJsonLd,
    validGtin,
} from "@/lib/seoCatalog";

export default function generateProductJsonLd(
    productData: ProductDataModel,
    locale: Locale = "en-US",
    baseUrl = "https://chouhanrugs.com",
) {
    const priceRange = productPriceRange(productData);
    const price = priceRange.min > 0 ? priceRange.min : Number(productData.productSellingPrice ?? 0);
    const images = getProductImages(productData, baseUrl);
    const gtin = validGtin(productData.merchantGtin || productData.gtin);
    const reviewSummary = productData.productReviews;

    const jsonLd: Record<string, unknown> = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: resolveProductSeoTitle(productData, locale),
        image: images,
        description: resolveProductDescription(productData, locale),
        url: productCanonicalUrl(baseUrl, productData, locale),
        sku: productData.sku || productData.itemCode || productData._id?.toString?.(),
        mpn: productData.merchantMpn || productData.itemCode || productData.sku,
        brand: {
            "@type": "Brand",
            name: productData.productBrand || "Chouhan Rugs",
        },
        category: productData.productCategory,
        material: productData.merchantMaterial || resolveLocalizedString(productData.material, locale) || undefined,
        countryOfOrigin: productData.countryOfOrigin || undefined,
        offers: {
            "@type": "Offer",
            url: productCanonicalUrl(baseUrl, productData, locale),
            priceCurrency: "USD",
            price,
            availability: Number(productData.productStockQuantity ?? 0) > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
        },
    };

    if (gtin) jsonLd.gtin = gtin;

    if (priceRange.max > priceRange.min) {
        jsonLd.offers = {
            "@type": "AggregateOffer",
            url: productCanonicalUrl(baseUrl, productData, locale),
            priceCurrency: "USD",
            lowPrice: priceRange.min,
            highPrice: priceRange.max,
            offerCount: productData.variations?.length || 1,
            availability: Number(productData.productStockQuantity ?? 0) > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
        };
    }

    if (reviewSummary?.totalReviews > 0 && reviewSummary.average > 0) {
        jsonLd.aggregateRating = {
            "@type": "AggregateRating",
            ratingValue: reviewSummary.average,
            reviewCount: reviewSummary.totalReviews,
        };
    }

    return safeJsonLd(jsonLd);
}
