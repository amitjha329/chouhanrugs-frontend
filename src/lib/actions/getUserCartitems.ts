'use server'

import { ObjectId } from "mongodb";
import clientPromise from "../mongodb/clientPromise";
import CartDataModel from "../types/CartDataModel";
import converter from "../utilities/mongoObjectConversionUtility";

export default async function getUserCartitems(userId: string): Promise<CartDataModel[]> {
    const mongoClient = await clientPromise
    const db = mongoClient.db(process.env.MONGODB_DB)
    const coll = db.collection('carts');
    const cursor = coll.aggregate([
        {
            $match: {
                userId: new ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: "products",
                localField: "prodId",
                foreignField: "_id",
                pipeline: [
                    {
                        $addFields: {
                            _id: {
                                $toString: "$_id",
                            },
                        },
                    },
                ],
                as: "cartProduct",
            },
        },
        {
            $project: {
                _id: 1,
                cartProduct: 1,
                variationCode: 1,
                quantity: 1,
                customSize: 1
            },
        },
    ]);
    const result = await cursor.toArray()
    const returnArray: CartDataModel[] = []
    result.forEach(item => returnArray.push(converter.fromWithNoFieldChange<CartDataModel>(item)))
    return returnArray
}