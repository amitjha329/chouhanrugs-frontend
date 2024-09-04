import clientPromise from "@/lib/mongodb/clientPromise";
import UserAddressDataModel from "@/lib/types/UserAddressDataModel";
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
            const collectionAddr = db.collection("addresses")
            const addrItems = await collectionAddr.find({
                userId: new ObjectId((session?.user as { id: string }).id)
            }).toArray()
            const returnArray: UserAddressDataModel[] = []
            addrItems.forEach(item => returnArray.push(converter.fromWithNoFieldChange<UserAddressDataModel>(item)))
            return NextResponse.json(returnArray)
        }
    } catch (err: any) {
        throw new Error(err)
    }
}