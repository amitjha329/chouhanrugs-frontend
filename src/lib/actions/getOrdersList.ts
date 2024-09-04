'use server'
import clientPromise from "../mongodb/clientPromise";
import converter from "../utilities/mongoObjectConversionUtility";
import OrderDataModel from "../types/OrderDataModel";

export default async function getOrdersList(orderStatus?: "pending" | "placed" | "dispatched" | "out-for-delivery" | "delivered" | "returned" | "cancelled"): Promise<OrderDataModel[]> {
    try {
        const mongoClient = await clientPromise
        const db = mongoClient.db(process.env.MONGODB_DB)
        const collectionAddr = db.collection("orders")
        const orderItems = await collectionAddr.aggregate(
            [
                {
                    $match:
                    {
                        ...(orderStatus) && { orderStatus },
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                {
                    $unwind: {
                        path: "$user",
                    },
                },
                {
                    $lookup: {
                        from: "addresses",
                        localField: "shippingAddress",
                        foreignField: "_id",
                        as: "shipping",
                    },
                },
                {
                    $unwind: {
                        path: "$shipping",
                    },
                }
            ]
        ).toArray()
        const returnArray: OrderDataModel[] = orderItems.map(item => converter.fromWithNoFieldChange<OrderDataModel>(item, "shippingAddress", "userId")).sort((a, b) => b.orderPlacedOn - a.orderPlacedOn)
        return returnArray
    } catch (err: any) {
        throw new Error(err)
    }
}