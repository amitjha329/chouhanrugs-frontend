import clientPromise from "@/lib/clientPromise";
import { ProductDataModelWithColorMap } from "@/types/ProductDataModel";
import converter from "@/utils/mongoObjectConversionUtility";

export async function getFeaturedProducts({ limit }: { limit: number }): Promise<ProductDataModelWithColorMap[]> {
    try {
        const client = await clientPromise;
        const db = client.db();
        const products = await db.collection("products").aggregate([
            { $match: { tags: { $in: ["Featured"] } } },
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
                    localField: "allColors",
                    foreignField: "name",
                    as: "colorMap"
                }
            },
            { $sort: { _id: -1 } }
        ]).toArray();
        return products.map(p => converter.fromWithNoFieldChange<ProductDataModelWithColorMap>(p));
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}
