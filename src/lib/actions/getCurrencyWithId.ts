'use server'

import { ObjectId } from "mongodb"
import clientPromise from "../mongodb/clientPromise"
import Currency from "../types/Currency"

export default async function getCurrencyWithId(id: string): Promise<Currency> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("currencies").findOne({ _id: new ObjectId(id) })
        return JSON.parse(JSON.stringify(data)) as Currency
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}