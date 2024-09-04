import clientPromise from "@/lib/mongodb/clientPromise";
import { ObjectId } from "mongodb";
import { decode } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const params = req.headers.get('Authorization');
    if (params) {
        const session = await decode({
            secret: process.env.NEXTAUTH_SECRET!,
            token: params?.split(' ')[1]
        })
        const mongoClient = await clientPromise
        const collectionWishlist = mongoClient.db(process.env.MONGODB_DB).collection("wishlists")
        try {
            const partnerIdsData = await collectionWishlist.aggregate([
                {
                    $match:
                    {
                        userId: new ObjectId((session?.user as { id: string }).id),
                    },
                },
                {
                    $lookup:
                    {
                        from: "products",
                        localField: "items",
                        foreignField: "_id",
                        as: "products",
                    },
                },
                {
                    $project:
                    {
                        "products._id": 1,
                        "products.productName": 1,
                        "products.images": 1,
                        "products.productSellingPrice": 1,
                    },
                },
            ]).toArray()
            return NextResponse.json(partnerIdsData[0])
        } catch (err: any) {
            throw new Error(err)
        }
    }
}