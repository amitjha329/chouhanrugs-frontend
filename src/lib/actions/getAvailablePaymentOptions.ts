'use server'
import clientPromise from "../mongodb/clientPromise";
import PaymentGatewayDataModel from "../types/PaymentGatewayDataModel";
import converter from "../utilities/mongoObjectConversionUtility";

export default async function getAvailablePaymentOptions(): Promise<PaymentGatewayDataModel[]> {
    const mongoClient = await clientPromise
    try {
        const collectionBranches = mongoClient.db(process.env.MONGODB_DB).collection("paymentGateway")
        const result = await collectionBranches.find({
            activation: true
        }).toArray()
        const returnArr: PaymentGatewayDataModel[] = []
        result.forEach(item => {
            const tempdata = converter.fromWithNoFieldChange<PaymentGatewayDataModel>(item)
            const { key_secret, webhook_secret, updatedOn, ...data } = tempdata
            returnArr.push({
                ...data,
                key_secret: "",
                webhook_secret: "",
                updatedOn: 0
            })
        })
        return returnArr
    } catch (err: any) {
        console.log(err)
        throw new Error(err)
    }
}