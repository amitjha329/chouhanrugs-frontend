import clientPromise from "@/lib/mongodb/clientPromise";
import OrderDataModel, { OrderDataModelWithProductsList } from "@/lib/types/OrderDataModel";
import converter from "@/lib/utilities/mongoObjectConversionUtility";
import { ObjectId } from "mongodb";
import { decode } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const params = req.headers.get('Authorization');
        if (params) {
            const session = await decode({
                secret: process.env.NEXTAUTH_SECRET!,
                token: params?.split(' ')[1]
            })
            const mongoClient = await clientPromise
            const db = mongoClient.db(process.env.MONGODB_DB)
            const collectionAddr = db.collection("orders")
            const orderItems = await collectionAddr.aggregate(
                [
                    {
                        $match: {
                            userId: new ObjectId((session?.user as { id: string }).id)
                        }
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
            const returnArray: OrderDataModel[] = orderItems.map(item => converter.fromWithNoFieldChange<OrderDataModelWithProductsList>(item, "shippingAddress", "userId"))
            return NextResponse.json(returnArray)
        }
    } catch (err: any) {
        throw new Error(err)
    }
}