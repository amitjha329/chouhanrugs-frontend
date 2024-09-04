'use server'
import clientPromise from "../mongodb/clientPromise";

export default async function getStripePublicKey(): Promise<string | undefined> {
    const mongoClient = await clientPromise
    try {
        const collectionBranches = mongoClient.db(process.env.MONGODB_DB).collection("paymentGateway")
        const result = await collectionBranches.findOne({ partner: "STRIPE" })
        if (result != null)
            return result.key_id
        else {
            return undefined
        }
    } catch (err) {
        console.log(err)
        throw err
    }
}