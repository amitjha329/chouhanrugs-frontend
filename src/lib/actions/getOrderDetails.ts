'use server'
import clientPromise from "../mongodb/clientPromise";
import converter from "../utilities/mongoObjectConversionUtility";
import { OrderDataModelWithProductsList } from "../types/OrderDataModel";

export default async function getOrdersList(orderId: string): Promise<OrderDataModelWithProductsList> {
    try {
        const mongoClient = await clientPromise
        const db = mongoClient.db(process.env.MONGODB_DB)
        const collectionAddr = db.collection("orders")
        const orderItems = await collectionAddr.aggregate(
            [
                {
                    $match: {
                        _id: orderId,
                    },
                },
                {
                    $lookup: {
                        from: "products",
                        let: {
                            vid: "$products.productId",
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: [
                                            "$_id",
                                            {
                                                $map: {
                                                    input: "$$vid",
                                                    in: {
                                                        $toObjectId: "$$this",
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "productList",
                    },
                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                {
                    $unwind:
                    {
                        path: "$user",
                    },
                },
                {
                    $lookup: {
                        from: "addresses",
                        localField: "shippingAddress",
                        foreignField: "_id",
                        as: "deliveryAddress",
                    },
                },
                {
                    $unwind: {
                        path: "$deliveryAddress",
                    },
                },
            ]
        ).toArray()
        const returnArray: OrderDataModelWithProductsList[] = orderItems.map(item => converter.fromWithNoFieldChange<OrderDataModelWithProductsList>(item, "shippingAddress", "userId")).sort((a, b) => b.orderPlacedOn - a.orderPlacedOn)
        return returnArray[0]
    } catch (err: any) {
        throw new Error(err)
    }
}