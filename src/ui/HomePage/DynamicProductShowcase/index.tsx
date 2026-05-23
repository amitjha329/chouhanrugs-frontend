import Image from "next/image";
import React from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getHomePageProductShowcase } from "@/backend/serverActions/getHomePageProductShowcase";
import { getProductsByCategory } from "@/backend/serverActions/getProductsByCategory";
import { type Locale } from "@/i18n/routing";
import { resolveLocalizedString } from "@/lib/resolveLocalized";
import { getProductFeaturedImage } from "@/lib/getProductFeaturedImage";
import { type ProductDataModel } from "@/types/ProductDataModel";

function getProductPrices(product: ProductDataModel) {
    const variations = product.variations ?? [];

    if (variations.length === 0) {
        return {
            sellingPrice: Number(product.productSellingPrice),
            msrpPrice: Number(product.productMSRP),
        };
    }

    const sellingPrice = variations.reduce((min, variation) => {
        const price = Number(variation.variationPrice ?? "0");
        const discount = Number(variation.variationDiscount ?? "0");
        const discountedPrice = price - (discount / 100) * price;
        return Number.isFinite(discountedPrice) && discountedPrice >= 0 ? Math.min(min, discountedPrice) : min;
    }, Number.POSITIVE_INFINITY);

    const msrpPrice = variations.reduce((min, variation) => {
        const price = Number(variation.variationPrice ?? "0");
        return Number.isFinite(price) && price >= 0 ? Math.min(min, price) : min;
    }, Number.POSITIVE_INFINITY);

    return { sellingPrice, msrpPrice };
}

function MiniProductCard({ product, locale }: { product: ProductDataModel; locale: Locale }) {
    const name = resolveLocalizedString(product.productTitle, locale) || resolveLocalizedString(product.productName, locale);
    const url = resolveLocalizedString(product.productURL, locale);
    const { sellingPrice, msrpPrice } = getProductPrices(product);
    const hasDiscount = Number.isFinite(msrpPrice) && Number.isFinite(sellingPrice) && msrpPrice > sellingPrice;
    const primaryImage = getProductFeaturedImage(product);

    if (!name || !url || !primaryImage || !Number.isFinite(sellingPrice)) return null;

    return (
        <Link href={`/products/${url}`} prefetch={false} className="h-full">
            <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:-translate-y-1 h-full flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 flex-shrink-0">
                    <Image
                        src={primaryImage}
                        alt={name}
                        fill
                        className="object-fill transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 40vw, 15vw"
                    />
                    {hasDiscount && product.productDiscountPercentage && (
                        <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {product.productDiscountPercentage}
                        </span>
                    )}
                </div>
                <div className="p-3 flex flex-col flex-grow">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-800 min-h-[2rem] line-clamp-2 group-hover:text-primary transition-colors duration-200 mb-1">
                        {name}
                    </h3>
                    <div className="flex items-center flex-wrap gap-x-1.5 gap-y-0.5 mt-auto">
                        <span className="text-primary font-bold text-sm">${sellingPrice.toFixed(2)}</span>
                        {hasDiscount && <span className="text-gray-400 text-xs line-through">${msrpPrice.toFixed(2)}</span>}
                    </div>
                </div>
            </div>
        </Link>
    );
}

const DynamicProductShowcase = async () => {
    const [showcaseData, loc, t] = await Promise.all([
        getHomePageProductShowcase(),
        getLocale(),
        getTranslations("juteHandBags"),
    ]);
    const locale = loc as Locale;

    if (!showcaseData?.heroImage || !showcaseData.category) return null;

    const sectionHeading = resolveLocalizedString(showcaseData.sectionHeading, locale);
    if (!sectionHeading) return null;

    const heroImageAlt = resolveLocalizedString(showcaseData.heroImageAlt, locale) || sectionHeading;
    const productGridHeading = resolveLocalizedString(showcaseData.productGridHeading, locale) || sectionHeading;
    const description = resolveLocalizedString(showcaseData.description, locale);
    const limit = Number(showcaseData.limit) || 6;
    const products = await getProductsByCategory(showcaseData.category, limit);

    if (products.length === 0) return null;

    return (
        <section className="~py-10/20 ~px-5/0">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                    <Link
                        href={showcaseData.heroLinkHref || `/products/category/${showcaseData.category}`}
                        className="group relative block rounded-2xl overflow-hidden min-h-[400px] lg:min-h-[550px]"
                    >
                        <Image
                            src={showcaseData.heroImage}
                            alt={heroImageAlt}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-10">
                            <p className="text-xs uppercase tracking-[0.25em] text-amber-200 font-medium mb-2">
                                {t("handcraftedCollection")}
                            </p>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                                {sectionHeading}
                            </h2>
                            {description && (
                                <p className="text-white/80 text-sm sm:text-base max-w-md leading-relaxed">
                                    {description}
                                </p>
                            )}
                        </div>
                    </Link>

                    <div className="flex flex-col">
                        <div className="flex gap-3 flex-row items-center justify-between mb-6">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{productGridHeading}</h3>
                            <div className="flex items-center gap-3">
                                {showcaseData.knowMoreHref && (
                                    <Link
                                        href={showcaseData.knowMoreHref}
                                        className="~text-xs/sm font-medium text-primary border border-primary ~px-2/4 ~py-1/2 rounded-full hover:bg-primary hover:text-white transition-all duration-300"
                                    >
                                        {t("knowMore")}
                                    </Link>
                                )}
                                <Link
                                    href={showcaseData.browseHref || `/products/category/${showcaseData.category}`}
                                    className="~text-xs/sm font-medium bg-primary text-white ~px-2/4 ~py-1/2 rounded-full hover:bg-primary/90 transition-all duration-300"
                                >
                                    {t("browseCollection")}
                                </Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-grow">
                            {products.map((product) => (
                                <MiniProductCard
                                    key={(product._id ?? product.objectID).toString()}
                                    product={product}
                                    locale={locale}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DynamicProductShowcase;
