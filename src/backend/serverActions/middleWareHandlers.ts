'use server'
import { connection } from 'next/server'
import clientPromise from "@/lib/clientPromise"
import { ObjectId } from "mongodb"

export async function getTokenDB(credentials: Partial<Record<string, any>>) {
    await connection()
    const clientMongo = await clientPromise
    const db = clientMongo.db(process.env.MONGODB_DB)
    const collection = db.collection("verification_tokens")
    return await collection.findOne({ _id: ObjectId.createFromHexString(credentials.tkId.toString()) })
}

export async function getUserMiddleWare(credentials: Partial<Record<string, any>>) {
    await connection()
    const clientMongo = await clientPromise
    const db = clientMongo.db(process.env.MONGODB_DB)
    const collectionUsers = db.collection("users")
    const user = await collectionUsers.findOne({ email: credentials.email })
    if (!user) {
        const userNew = await collectionUsers.insertOne({
            email: credentials.email,
            emailVerified: new Date(),
            roles: [
                "user"
            ],
            cartCount: 0,
            image: "",
            name: "",
            number: ""
        })
        return {
            email: credentials.email,
            _id: userNew.insertedId,
            name: "",
            image: "",
            roles: [
                "user"
            ],
            cartCount: 0,
            number: ""
        }
    }
    return user
}