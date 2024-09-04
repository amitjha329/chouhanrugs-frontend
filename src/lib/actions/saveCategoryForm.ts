'use server'
import { ObjectId } from "mongodb"
import clientPromise from "../mongodb/clientPromise"
import CategoriesDataModel from "../types/CategoriesDataModel"
import AckResponse from "../types/AckResponse"

export default async function saveCategoryForm(category: CategoriesDataModel): Promise<AckResponse> {
    try {
        const { _id, ...data } = category
        const insertResponse = await (await clientPromise).db(process.env.MONGODB_DB).collection("categories").findOneAndUpdate({ _id: new ObjectId(_id) }, {
            $set: { ...data }
        }, { returnDocument: "before" })
        if (insertResponse) {
            if (data.name != insertResponse?.value?.name) {
                await (await clientPromise).db(process.env.MONGODB_DB).collection("products").updateMany({ productCategory: { $regex: data.name } }, { $set: { productCategory: data.name } })
            }
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