'use server'
import { ObjectId } from "mongodb"
import clientPromise from "../mongodb/clientPromise"
import AckResponse from "../types/AckResponse"
import algoliasearch from "algoliasearch"

export default async function saveProductStockForm(id: string, productStockQuantity: number, productMSRP: number, productDiscountPercentage: string, productSellingPrice: number, productPriceSqFt: number): Promise<AckResponse> {
    try {
        const algoliaCLient = algoliasearch(process.env.ALGOLIA_APPID ?? "", process.env.ALGOLIA_KEY ?? "")
        const index = algoliaCLient.initIndex(process.env.ALGOLIA_INDEX ?? "")
        const insertResponse = await (await clientPromise).db(process.env.MONGODB_DB).collection("products").findOneAndUpdate({ _id: new ObjectId(id) }, {
            $set: { productStockQuantity, productSellingPrice, productPriceSqFt, productMSRP, productDiscountPercentage, updatedOn: Date.now() }
        })
        if (insertResponse) {
            const { _id, ...algEntry } = insertResponse
            index.saveObject({
                objectID: _id.toHexString(),
                ...algEntry
            })
            return {
                ack: true,
                result: {
                    code: "SUCCESS",
                    data: JSON.stringify(insertResponse)
                }
            }
        } else {
            return {
                ack: false,
                result: {
                    code: "ERROR",
                    data: JSON.stringify(insertResponse)
                }
            }
        }
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}