'use server'
import { ObjectId } from "mongodb"
import clientPromise from "../mongodb/clientPromise"
import { Variation } from "../types/ProductDataModel"
import AckResponse from "../types/AckResponse"
import algoliasearch from "algoliasearch"

export default async function saveProductVariations(id: string, variation: Variation): Promise<AckResponse> {
    try {
        const algoliaCLient = algoliasearch(process.env.ALGOLIA_APPID ?? "", process.env.ALGOLIA_KEY ?? "")
        const index = algoliaCLient.initIndex(process.env.ALGOLIA_INDEX??"")
        const collection = (await clientPromise).db(process.env.MONGODB_DB).collection("products")
        const toUpdate = { _id: new ObjectId(id) }
        const existing = await collection.findOne(toUpdate)
        const existingIndex = existing?.variations.findIndex((item: Variation) => item.variationCode == variation.variationCode)

        let insertResponse: any

        if (existingIndex !== -1) {
            // Update the existing object
            const updateQuery = {
                $set: { [`variations.${existingIndex}`]: variation }
            };
            insertResponse = await collection.findOneAndUpdate({ _id: new ObjectId(id) }, updateQuery);
        } else {
            // Insert the new object into the array
            const updateQuery = {
                $addToSet: { ["variations"]: variation }
            };
            //@ts-ignore
            insertResponse = await collection.findOneAndUpdate({ _id: new ObjectId(id) }, updateQuery);
        }
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