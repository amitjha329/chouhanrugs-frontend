'use server';
import clientPromise from "../mongodb/clientPromise";
import { ObjectId } from "mongodb";
import converter from "../utilities/mongoObjectConversionUtility";
import { ProductDataModel } from "../types/ProductDataModel";
import AckResponse from "../types/AckResponse";

export default async function duplicateProduct(id?: string): Promise<AckResponse> {
    if (id == null || !id) {
        return {
            ack: false,
            result: {
                code: "NO_DATA",
                data: null
            }
        }
    }
    const client = await clientPromise
    const collection = client.db(process.env.MONGODB_DB).collection("products")
    const productToDuplicate = {
        _id: new ObjectId(id)
    }
    const document = await collection.findOne(productToDuplicate)
    if (document != null) {
        const dataModel = converter.fromWithNoFieldChange<ProductDataModel>(document)
        const newId = new ObjectId()
        dataModel._id = newId
        dataModel.productName = "Duplicate_" + dataModel.productName
        dataModel.addedOn = Date.now()
        dataModel.updatedOn = Date.now()
        dataModel.images = []
        dataModel.variations = []
        dataModel.productActive = false
        const duplicateResult = await collection.updateOne({ _id: newId }, { $set: dataModel }, { upsert: true })
        if (duplicateResult.acknowledged)
            return {
                ack: true,
                result: {
                    code: "SUCCESS",
                    data: newId.toString()
                }
            }
        else
            return {
                ack: false,
                result: {
                    code: "ERROR",
                    data: JSON.stringify(duplicateResult)
                }
            }
    } else {
        return {
            ack: false,
            result: {
                code: "NO_DATA",
                data: null
            }
        }
    }
}