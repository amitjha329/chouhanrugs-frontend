type ProductSearchParams = {
    color?: string;
    size?: string;
    tags?: string;
    collection?: string;
    sort?: string;
};

export type ProductAlgoliaSearchOptions = {
    searchQuery?: string;
    categoryParam?: string;
    searchParams?: ProductSearchParams;
};

export const PRODUCT_SEARCH_ATTRIBUTES = [
    "objectID",
    "productName",
    "productTitle",
    "productURL",
    "productCategory",
    "productBrand",
    "productBaseColor",
    "productSellingPrice",
    "productMSRP",
    "productDiscountPercentage",
    "productFeaturedImage",
    "images",
    "variations",
    "priceRange",
    "msrpRange",
    "productReviews",
    "productCustomizable",
    "productFreeDel",
    "productHandCrafted",
    "productReturns",
    "colorMap",
];

const decodeValue = (value?: string) => decodeURIComponent(value ?? "").trim();
const normalizeValue = (value?: string) => decodeValue(value).toLowerCase();
const quote = (value: string) => `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

export function buildProductAlgoliaParams(options: ProductAlgoliaSearchOptions) {
    const decodedCategory = decodeValue(options.categoryParam);
    const filters: string[] = [];
    const facetFilters: string[][] = [];

    if (decodedCategory) {
        filters.push(decodedCategory === "Rugs & Runners"
            ? `(productCategory:${quote("Hemp Rugs")} OR productCategory:${quote("Wool Jute Kilim Rugs")} OR productCategory:${quote("Braided Jute Rug")})`
            : `productCategory:${quote(decodedCategory)}`);
    }

    const color = decodeValue(options.searchParams?.color);
    if (color) facetFilters.push([`variations.variationColor:${color}`]);

    const size = decodeValue(options.searchParams?.size);
    if (size) facetFilters.push([`variations.variationSize:${size}`]);

    const normalizedTag = normalizeValue(options.searchParams?.tags);
    const normalizedCollection = normalizeValue(options.searchParams?.collection);
    const normalizedSort = normalizeValue(options.searchParams?.sort);

    if (normalizedSort === "new" || normalizedCollection === "new-arrivals" || normalizedTag === "new-arrivals") {
        filters.push(`tags:${quote("New Arrivals")}`);
    }

    if (
        normalizedCollection === "best-sellers" ||
        normalizedTag === "best-seller" ||
        normalizedTag === "best-sellers" ||
        normalizedTag === "top-selling" ||
        normalizedTag === "top selling"
    ) {
        filters.push(`tags:${quote("Top Selling")}`);
    }

    return {
        query: options.searchQuery ?? "",
        filters: filters.length ? filters.join(" AND ") : undefined,
        facetFilters: facetFilters.length ? facetFilters : undefined,
    };
}
