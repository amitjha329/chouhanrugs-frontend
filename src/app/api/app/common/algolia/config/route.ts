import clientPromise from "@/lib/mongodb/clientPromise";
import { decode } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const params = req.headers.get('Authorization');
        const session = await decode({
            secret: process.env.NEXTAUTH_SECRET!,
            token: params?.split(' ')[1]
        })
        if (params && session) {
            const mongoClient = await clientPromise
            const db = mongoClient.db(process.env.MONGODB_DB)
            const collectionAddr = db.collection("site_data")
            const addrItems = await collectionAddr.findOne({
                data_type: "algolia"
            })
            return NextResponse.json({
                KEY: addrItems?.algoliaKey,
                APPID: addrItems?.algoliaAppID
            })
        }
    } catch (err: any) {
        throw new Error(err)
    }
}