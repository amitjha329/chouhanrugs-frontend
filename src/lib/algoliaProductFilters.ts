type ProductSearchParams = {
    color?: string;
    size?: string;
    brand?: string;
    shape?: string;
    pattern?: string;
    price?: string;
    customizable?: string;
    tags?: string;
    collection?: string;
    sort?: string;
    page?: string;
};

export type ProductAlgoliaSearchOptions = {
    searchQuery?: string;
    categoryParam?: string;
    categoryPath?: string;
    searchParams?: ProductSearchParams;
};

export const PRODUCT_SEARCH_ATTRIBUTES = [
    "objectID",
    "productName",
    "productTitle",
    "productURL",
    "productCategory",
    "categoryHierarchy",
    "hierarchicalCategories",
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
    const decodedCategoryPath = decodeValue(options.categoryPath);
    const filters: string[] = [];
    const facetFilters: string[][] = [];

    if (decodedCategory) {
        filters.push(decodedCategory === "Rugs & Runners"
            ? `(productCategory:${quote("Hemp Rugs")} OR productCategory:${quote("Wool Jute Kilim Rugs")} OR productCategory:${quote("Braided Jute Rug")})`
            : `categoryHierarchy:${quote(decodedCategory)}`);
    } else if (decodedCategoryPath) {
        const categoryLevel = decodedCategoryPath.split(" > ").filter(Boolean).length - 1;
        filters.push(`hierarchicalCategories.lvl${Math.max(categoryLevel, 0)}:${quote(decodedCategoryPath)}`);
    }

    const color = decodeValue(options.searchParams?.color);
    if (color) {
        const colorList = color.split(",").map(c => c.trim()).filter(Boolean);
        if (colorList.length > 0) {
            facetFilters.push(colorList.map(c => `variations.variationColor:${c}`));
        }
    }

    const size = decodeValue(options.searchParams?.size);
    if (size) {
        const sizeList = size.split(",").map(s => s.trim()).filter(Boolean);
        if (sizeList.length > 0) {
            facetFilters.push(sizeList.map(s => `variations.variationSize:${s}`));
        }
    }

    const brand = decodeValue(options.searchParams?.brand);
    if (brand) {
        const brandList = brand.split(",").map(b => b.trim()).filter(Boolean);
        if (brandList.length > 0) {
            facetFilters.push(brandList.map(b => `productBrand:${b}`));
        }
    }

    const shape = decodeValue(options.searchParams?.shape);
    if (shape) {
        const shapeList = shape.split(",").map(s => s.trim()).filter(Boolean);
        if (shapeList.length > 0) {
            facetFilters.push(shapeList.map(s => `productShape.name:${s}`));
        }
    }

    const pattern = decodeValue(options.searchParams?.pattern);
    if (pattern) {
        const patternList = pattern.split(",").map(p => p.trim()).filter(Boolean);
        if (patternList.length > 0) {
            facetFilters.push(patternList.map(p => `productPattern.name:${p}`));
        }
    }

    const customizable = decodeValue(options.searchParams?.customizable);
    if (customizable === "true") {
        filters.push(`productCustomizable:true`);
    } else if (customizable === "false") {
        filters.push(`productCustomizable:false`);
    }

    const price = decodeValue(options.searchParams?.price);
    if (price) {
        const [minPrice, maxPrice] = price.split("-").map(Number);
        if (!isNaN(minPrice)) {
            filters.push(`productSellingPrice >= ${minPrice}`);
        }
        if (!isNaN(maxPrice)) {
            filters.push(`productSellingPrice <= ${maxPrice}`);
        }
    }

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
