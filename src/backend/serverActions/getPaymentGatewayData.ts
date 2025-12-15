'use server'

import clientPromise from "@/lib/clientPromise"
import PaymentGatewayDataModel from "@/types/PaymentGatewayDataModel"
import converter from "@/utils/mongoObjectConversionUtility"

export default async function getPaymentGatewayData(partner: "RZP" | "STRIPE" | "PAYTM" | "PAYPAL"|"PAYPAL_DEV" | "PAYONEER"): Promise<PaymentGatewayDataModel> {
    const mongoClient = await clientPromise
    try {
        const collectionBranches = mongoClient.db(process.env.MONGODB_DB).collection("paymentGateway")
        const result = await collectionBranches.findOne({ partner })
        if (result != null)
            return converter.fromWithNoFieldChange<PaymentGatewayDataModel>(result)
        else {
            return { activation: false, _id: "", key_id: "", key_secret: "", updatedOn: 0, partner }
        }
    } catch (err) {
        console.log(err)
        throw err
    }
}