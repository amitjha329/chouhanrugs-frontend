import { unstable_cache } from "next/cache";
import clientPromise from "@/lib/clientPromise";
import { ProductDataModelWithColorMap } from "@/types/ProductDataModel";
import converter from "@/utils/mongoObjectConversionUtility";

async function fetchHotTrendingProducts(limit: number): Promise<ProductDataModelWithColorMap[]> {
    try {
        const client = await clientPromise;
        const db = client.db();
        const products = await db.collection("products").aggregate([
            { $match: { tags: { $in: ["Hot", "Top Selling"] } } },
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
    return unstable_cache(
        () => fetchHotTrendingProducts(limit),
        [`hot-trending-products-${limit}`],
        {
            revalidate: 300, // 5 minutes
            tags: ['products', 'hot-trending-products']
        }
    )();
}
