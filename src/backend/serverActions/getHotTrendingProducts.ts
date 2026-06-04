import { cacheLife, cacheTag } from "next/cache";
import { getStorefrontDb } from "@/lib/mongodb";
import { ProductDataModelWithColorMap } from "@/types/ProductDataModel";
import converter from "@/utils/mongoObjectConversionUtility";

async function fetchHotTrendingProducts(limit: number): Promise<ProductDataModelWithColorMap[]> {
    "use cache";

    cacheLife("hours");
    cacheTag("products");
    cacheTag("hot-trending-products");

    try {
        const db = await getStorefrontDb();
        const products = await db.collection("products").aggregate([
            { $match: { tags: { $in: ["Hot", "Top Selling"] }, productActive: true } },
            { $sample: { size: limit } },
            {
                $group: {
                    _id: "$_id",
                    result: {
                        $push: "$$ROOT"
                    }
                }
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $first: "$result"
                    }
                }
            },
            {
                $addFields: {
                    allColors: {
                        $map: {
                            input: "$variations",
                            as: "variation",
                            in: { $trim: { input: "$$variation.variationColor" } }
                        }
                    }
                }
            },
            {
                $addFields: {
                    allColors: { $setUnion: ["$allColors"] }
                }
            },
            {
                $lookup: {
                    from: "colors",
                    let: { colorNames: "$allColors" },
                    pipeline: [
                        { $match: { $expr: { $in: ["$name", "$$colorNames"] } } },
                        { $addFields: { _id: { $toString: "$_id" } } }
                    ],
                    as: "colorMap"
                }
            },
            { $sort: { _id: -1 } }
        ]).toArray();
        return products.map(p => converter.fromWithNoFieldChange<ProductDataModelWithColorMap>(p));
    } catch (error) {
        console.error("Error fetching hot trending products:", error);
        return [];
    }
}

export const getHotTrendingProducts = ({ limit }: { limit: number }): Promise<ProductDataModelWithColorMap[]> => {
    return fetchHotTrendingProducts(limit);
}
