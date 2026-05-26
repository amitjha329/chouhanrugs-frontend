import type { ProductDataModel } from "../types/ProductDataModel";
import type SiteDataModel from "../types/SiteDataModel";
import { type Locale } from "@/i18n/routing";
import {
    localizedAbsoluteUrl,
    productCanonicalUrl,
    resolveProductSeoTitle,
    safeJsonLd,
} from "@/lib/seoCatalog";

export default function generateProductBreadCrumbs(
    productData: ProductDataModel,
    siteData: SiteDataModel,
    locale: Locale = "en-US",
) {
    const baseUrl = siteData.url || "https://chouhanrugs.com";
    const categorySlug = encodeURIComponent(productData.productCategory || "products");

    return safeJsonLd({
        "@context": "https://schema.org/",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: localizedAbsoluteUrl(baseUrl, "/", locale),
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Products",
                item: localizedAbsoluteUrl(baseUrl, "/products", locale),
            },
            {
                "@type": "ListItem",
                position: 3,
                name: productData.productCategory || "Category",
                item: localizedAbsoluteUrl(baseUrl, `/products/category/${categorySlug}`, locale),
            },
            {
                "@type": "ListItem",
                position: 4,
                name: resolveProductSeoTitle(productData, locale),
                item: productCanonicalUrl(baseUrl, productData, locale),
            },
        ],
    });
}
