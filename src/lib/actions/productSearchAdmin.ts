'use server';
import clientPromise from "../mongodb/clientPromise"
import { ProductDataModel } from "../types/ProductDataModel";
import converter from "../utilities/mongoObjectConversionUtility"

export default async function productSearchAdmin(query: string, limit: number): Promise<ProductDataModel[]> {
    const aggregationQuery = [
        {
            $search: {
                index: "productSearch",
                text: {
                    query,
                    path: ["productName", "productCategory"],
                },
            },
        },
        {
            $addFields: {
                score: {
                    $meta: "searchScore",
                },
            },
        },
        {
          $match:
            {
              score: {
                $gt: 3,
              },
            },
        },
    ]
    try {
        const collection = (await clientPromise).db(process.env.MONGODB_DB).collection("products")
        const data = limit > 0 ? await collection.aggregate(aggregationQuery).limit(limit).toArray() : await collection.aggregate(aggregationQuery).toArray()
        const parsedData: Array<ProductDataModel> = []
        data.forEach(item => {
            parsedData.push({
                ...converter.fromWithNoFieldChange<ProductDataModel>(item)
            })
        })
        console.log(parsedData)
        return parsedData
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}