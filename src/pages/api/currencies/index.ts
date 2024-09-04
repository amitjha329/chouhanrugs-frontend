import clientPromise from "@/lib/mongodb/clientPromise";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const mongoClient = await clientPromise
    const db = mongoClient.db(process.env.MONGODB_DB)
    const collectionCurrencies = db.collection("currencies")
    try {
        const currencies = await collectionCurrencies.find({}).toArray()
        res.json(currencies)
    } catch (err) {
        res.status(500).json(err)
    }
}