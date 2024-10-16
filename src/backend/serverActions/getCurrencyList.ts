'use server'

import clientPromise from "@/lib/clientPromise"
import Currency from "@/types/Currency"

export default async function getCurrencyList(): Promise<Currency[]> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("currencies").find({}).toArray()
        return JSON.parse(JSON.stringify(data)) as Currency[]
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}