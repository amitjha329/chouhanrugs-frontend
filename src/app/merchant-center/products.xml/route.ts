import { routing, type Locale } from "@/i18n/routing";
import { getAllProducts } from "@/lib/catalog";
import { getConfigBulk } from "@/lib/services/ConfigService";
import {
    DEFAULT_GOOGLE_PRODUCT_CATEGORY,
    DEFAULT_MERCHANT_COUNTRY,
    DEFAULT_MERCHANT_CURRENCY,
    escapeXml,
    getProductImages,
    getVariationSellingPrice,
    isMerchantEligibleProduct,
    productCanonicalUrl,
    productPriceRange,
    resolveProductDescription,
    resolveProductMerchantTitle,
    validGtin,
} from "@/lib/seoCatalog";
import type { ProductDataModel, Variation } from "@/types/ProductDataModel";
import { resolveLocalizedString } from "@/lib/resolveLocalized";

type MerchantConfig = {
    baseUrl: string;
    locale: Locale;
    targetCountry: string;
    currency: string;
    shippingCountry: string;
    shippingService: string;
    shippingPrice: string;
    googleProductCategory: string;
};

const CONFIG_KEYS = [
    "FRONTEND_URL",
    "MERCHANT_TARGET_COUNTRY",
    "MERCHANT_CURRENCY",
    "MERCHANT_SHIPPING_COUNTRY",
    "MERCHANT_SHIPPING_SERVICE",
    "MERCHANT_SHIPPING_PRICE",
    "MERCHANT_GOOGLE_PRODUCT_CATEGORY",
];

function money(value: number, currency: string) {
    return `${Math.max(value, 0).toFixed(2)} ${currency}`;
}

function productId(product: ProductDataModel) {
    return product._id?.toString?.() || product.objectID || product.itemCode || product.sku || "";
}

function hasVariationSpecificCommerce(product: ProductDataModel) {
    const variations = product.variations ?? [];
    if (!variations.length) return false;

    const productPrice = Number(product.productSellingPrice ?? 0);
    return variations.some((variation) => {
        const price = Number(variation.variationPrice ?? 0);
        return Boolean(variation.variationSize || variation.variationColor) ||
            (Number.isFinite(price) && price > 0 && price !== productPrice);
    });
}

function availability(stock: number) {
    return stock > 0 ? "in_stock" : "out_of_stock";
}

function itemXml(product: ProductDataModel, config: MerchantConfig, variation?: Variation) {
    const baseProductId = productId(product);
    const variationCode = variation?.variationCode?.trim();
    const itemId = variationCode ? `${baseProductId}-${variationCode}` : baseProductId;
    const images = getProductImages(product, config.baseUrl);
    const priceRange = productPriceRange(product);
    const variationPrice = variation ? getVariationSellingPrice(variation) : 0;
    const price = variationPrice || priceRange.min || Number(product.productSellingPrice ?? 0);
    const msrp = variation ? Number(variation.variationPrice ?? 0) : Number(product.productMSRP ?? 0);
    const stock = variation ? Number(variation.variationStock ?? 0) : Number(product.productStockQuantity ?? 0);
    const title = resolveProductMerchantTitle(product, config.locale);
    const description = resolveProductDescription(product, config.locale);
    const gtin = validGtin(product.merchantGtin || product.gtin);
    const mpn = product.merchantMpn || product.itemCode || product.sku || baseProductId;
    const color = product.merchantColor || variation?.variationColor || product.productBaseColor;
    const size = product.merchantSize || variation?.variationSize || "";
    const material = product.merchantMaterial || resolveLocalizedString(product.material, config.locale);
    const productType = product.productCategory || "Rugs";
    const link = productCanonicalUrl(config.baseUrl, product, config.locale);
    const googleProductCategory = product.merchantGoogleProductCategory || config.googleProductCategory;

    const optional = [
        gtin ? `<g:gtin>${escapeXml(gtin)}</g:gtin>` : "",
        mpn ? `<g:mpn>${escapeXml(mpn)}</g:mpn>` : "",
        material ? `<g:material>${escapeXml(material)}</g:material>` : "",
        color ? `<g:color>${escapeXml(color)}</g:color>` : "",
        size ? `<g:size>${escapeXml(size)}</g:size>` : "",
        msrp > price && price > 0 ? `<g:sale_price>${escapeXml(money(price, config.currency))}</g:sale_price>` : "",
        variation ? `<g:item_group_id>${escapeXml(baseProductId)}</g:item_group_id>` : "",
        ...images.slice(1, 11).map((image) => `<g:additional_image_link>${escapeXml(image)}</g:additional_image_link>`),
    ].filter(Boolean).join("");

    return `<item>
        <g:id>${escapeXml(itemId)}</g:id>
        <g:title>${escapeXml(title)}</g:title>
        <g:description>${escapeXml(description)}</g:description>
        <g:link>${escapeXml(link)}</g:link>
        <g:image_link>${escapeXml(images[0] ?? "")}</g:image_link>
        ${optional}
        <g:availability>${availability(stock)}</g:availability>
        <g:price>${escapeXml(money(msrp > 0 ? msrp : price, config.currency))}</g:price>
        <g:brand>${escapeXml(product.productBrand || "Chouhan Rugs")}</g:brand>
        <g:condition>new</g:condition>
        <g:google_product_category>${escapeXml(googleProductCategory)}</g:google_product_category>
        <g:product_type>${escapeXml(productType)}</g:product_type>
        <g:identifier_exists>${gtin || mpn ? "yes" : "no"}</g:identifier_exists>
        <g:shipping>
            <g:country>${escapeXml(config.shippingCountry)}</g:country>
            <g:service>${escapeXml(config.shippingService)}</g:service>
            <g:price>${escapeXml(config.shippingPrice)}</g:price>
        </g:shipping>
        ${product.weight ? `<g:shipping_weight>${escapeXml(`${product.weight} ${product.weightUnit || "lb"}`)}</g:shipping_weight>` : ""}
    </item>`;
}

export async function GET() {
    const [configValues, products] = await Promise.all([
        getConfigBulk(CONFIG_KEYS),
        getAllProducts(),
    ]);

    const config: MerchantConfig = {
        baseUrl: configValues.FRONTEND_URL || "https://chouhanrugs.com",
        locale: routing.defaultLocale,
    targetCountry: configValues.MERCHANT_TARGET_COUNTRY || DEFAULT_MERCHANT_COUNTRY,
        currency: configValues.MERCHANT_CURRENCY || DEFAULT_MERCHANT_CURRENCY,
        shippingCountry: configValues.MERCHANT_SHIPPING_COUNTRY || configValues.MERCHANT_TARGET_COUNTRY || DEFAULT_MERCHANT_COUNTRY,
        shippingService: configValues.MERCHANT_SHIPPING_SERVICE || "Standard",
        shippingPrice: configValues.MERCHANT_SHIPPING_PRICE || `0.00 ${configValues.MERCHANT_CURRENCY || DEFAULT_MERCHANT_CURRENCY}`,
        googleProductCategory: configValues.MERCHANT_GOOGLE_PRODUCT_CATEGORY || DEFAULT_GOOGLE_PRODUCT_CATEGORY,
    };

    const items = products
        .filter(isMerchantEligibleProduct)
        .flatMap((product) => {
            if (!hasVariationSpecificCommerce(product)) {
                return [itemXml(product, config)];
            }

            return (product.variations ?? [])
                .filter((variation) => Number(variation.variationStock ?? 0) > 0)
                .map((variation) => itemXml(product, config, variation));
        });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
    <channel>
        <title>Chouhan Rugs Product Feed</title>
        <link>${escapeXml(config.baseUrl)}</link>
        <description>Active Chouhan Rugs products for Google Merchant Center</description>
        ${items.join("\n")}
    </channel>
</rss>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=21600",
        },
    });
}
