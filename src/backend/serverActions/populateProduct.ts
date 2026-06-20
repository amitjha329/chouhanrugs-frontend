import { ObjectId } from "mongodb";
import { getStorefrontDb } from "@/lib/mongodb";
import { ProductDataModel } from "@/types/ProductDataModel";

/**
 * Resolves reference ObjectIds to human-readable strings/objects for a single product.
 */
export async function populateProduct<T extends ProductDataModel>(product: T): Promise<T> {
    if (!product) return product;
    const db = await getStorefrontDb();

    // 1. Category
    if (product.productCategory && ObjectId.isValid(product.productCategory.toString())) {
        const cat = await db.collection("categories").findOne({ _id: new ObjectId(product.productCategory.toString()) });
        if (cat) {
            product.productCategory = cat.name;
        }
    }

    // 2. Brand
    if (product.productBrand && ObjectId.isValid(product.productBrand.toString())) {
        const brand = await db.collection("brands").findOne({ _id: new ObjectId(product.productBrand.toString()) });
        if (brand) {
            product.productBrand = brand.name;
        }
    }

    // 3. Base Color
    if (product.productBaseColor && ObjectId.isValid(product.productBaseColor.toString())) {
        const color = await db.collection("colors").findOne({ _id: new ObjectId(product.productBaseColor.toString()) });
        if (color) {
            product.productBaseColor = color.name;
        }
    }

    // 4. Shape
    if (product.productShape) {
        const shapeVal = product.productShape;
        if (typeof shapeVal === 'string' && ObjectId.isValid(shapeVal)) {
            const shape = await db.collection("shapes").findOne({ _id: new ObjectId(shapeVal) });
            if (shape) {
                product.productShape = { _id: shape._id.toString(), name: shape.name };
            }
        }
    }

    // 5. Pattern
    if (product.productPattern) {
        const patternVal = product.productPattern;
        if (typeof patternVal === 'string' && ObjectId.isValid(patternVal)) {
            const pattern = await db.collection("patterns").findOne({ _id: new ObjectId(patternVal) });
            if (pattern) {
                product.productPattern = { _id: pattern._id.toString(), name: pattern.name };
            }
        }
    }

    // Flat slug/productURL handling
    if (product.productURL && typeof product.productURL === 'object') {
        const enUrl = (product.productURL as any)['en-US'] || Object.values(product.productURL)[0];
        if (typeof enUrl === 'string') {
            product.productURL = enUrl;
        }
    }

    return product;
}

/**
 * Batches resolution of reference ObjectIds to human-readable strings/objects for a list of products.
 */
export async function populateProductsList<T extends ProductDataModel>(products: T[]): Promise<T[]> {
    if (!products || products.length === 0) return products;
    const db = await getStorefrontDb();

    // Collect all unique ObjectIds we need to fetch to batch them in single queries!
    const catIds = new Set<string>();
    const brandIds = new Set<string>();
    const colorIds = new Set<string>();
    const shapeIds = new Set<string>();
    const patternIds = new Set<string>();

    for (const p of products) {
        if (p.productCategory && ObjectId.isValid(p.productCategory.toString())) catIds.add(p.productCategory.toString());
        if (p.productBrand && ObjectId.isValid(p.productBrand.toString())) brandIds.add(p.productBrand.toString());
        if (p.productBaseColor && ObjectId.isValid(p.productBaseColor.toString())) colorIds.add(p.productBaseColor.toString());
        if (p.productShape && typeof p.productShape === 'string' && ObjectId.isValid(p.productShape)) shapeIds.add(p.productShape);
        if (p.productPattern && typeof p.productPattern === 'string' && ObjectId.isValid(p.productPattern)) patternIds.add(p.productPattern);
    }

    // Fetch in parallel
    const [categories, brands, colors, shapes, patterns] = await Promise.all([
        catIds.size > 0 ? db.collection("categories").find({ _id: { $in: Array.from(catIds).map(id => new ObjectId(id)) } }).toArray() : [],
        brandIds.size > 0 ? db.collection("brands").find({ _id: { $in: Array.from(brandIds).map(id => new ObjectId(id)) } }).toArray() : [],
        colorIds.size > 0 ? db.collection("colors").find({ _id: { $in: Array.from(colorIds).map(id => new ObjectId(id)) } }).toArray() : [],
        shapeIds.size > 0 ? db.collection("shapes").find({ _id: { $in: Array.from(shapeIds).map(id => new ObjectId(id)) } }).toArray() : [],
        patternIds.size > 0 ? db.collection("patterns").find({ _id: { $in: Array.from(patternIds).map(id => new ObjectId(id)) } }).toArray() : [],
    ]);

    const catMap = new Map(categories.map(c => [c._id.toString(), c.name]));
    const brandMap = new Map(brands.map(b => [b._id.toString(), b.name]));
    const colorMap = new Map(colors.map(c => [c._id.toString(), c.name]));
    const shapeMap = new Map(shapes.map(s => [s._id.toString(), { _id: s._id.toString(), name: s.name }]));
    const patternMap = new Map(patterns.map(p => [p._id.toString(), { _id: p._id.toString(), name: p.name }]));

    for (const p of products) {
        if (p.productCategory) {
            const val = p.productCategory.toString();
            if (catMap.has(val)) p.productCategory = catMap.get(val)!;
        }
        if (p.productBrand) {
            const val = p.productBrand.toString();
            if (brandMap.has(val)) p.productBrand = brandMap.get(val)!;
        }
        if (p.productBaseColor) {
            const val = p.productBaseColor.toString();
            if (colorMap.has(val)) p.productBaseColor = colorMap.get(val)!;
        }
        if (p.productShape && typeof p.productShape === 'string') {
            if (shapeMap.has(p.productShape)) p.productShape = shapeMap.get(p.productShape)!;
        }
        if (p.productPattern && typeof p.productPattern === 'string') {
            if (patternMap.has(p.productPattern)) p.productPattern = patternMap.get(p.productPattern)!;
        }
        if (p.productURL && typeof p.productURL === 'object') {
            const enUrl = (p.productURL as any)['en-US'] || Object.values(p.productURL)[0];
            if (typeof enUrl === 'string') {
                p.productURL = enUrl;
            }
        }
    }

    return products;
}
