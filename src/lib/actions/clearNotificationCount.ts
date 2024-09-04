'use server'

import clientPromise from "../mongodb/clientPromise"

export default async function clearNotificationCount() {
    try {
        const mongoClient = await clientPromise
        const db = mongoClient.db(process.env.MONGODB_DB)
        const collectionDataPoints = db.collection("data_points")
        await collectionDataPoints.findOneAndUpdate({ dataFor: "notification" }, {
            $set: {
                newNotifCount: 0
            }
        }, { upsert: true, returnDocument: "after" })
        return
    } catch (ex: any) {
        console.log(ex)
        return
    }
}