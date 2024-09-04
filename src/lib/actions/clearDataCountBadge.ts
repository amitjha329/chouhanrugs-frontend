'use server'
import clientPromise from "../mongodb/clientPromise"

export default async function clearDataCountBadge(key?: string) {
    try {
        const mongoClient = await clientPromise
        const db = mongoClient.db(process.env.MONGODB_DB)
        const collectionDataPoints = db.collection("data_points")
        let data: Map<string, any> = new Map()
        if (key) {
            data.set(key, 0)
        }

        await collectionDataPoints.findOneAndUpdate({ dataFor: "notification" }, {
            $set: {
                newNotifCount: 0,
                ...data
            }
        }, { upsert: true, returnDocument: "after" })
        return
    } catch (ex: any) {
        console.log(ex)
        return
    }
}