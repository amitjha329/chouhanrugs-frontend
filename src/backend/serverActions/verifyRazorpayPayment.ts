'use server'
import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils';
import RZP from "./razorpay";
import clientPromise from '@/lib/clientPromise';
import PaymentGatewayDataModel from '@/types/PaymentGatewayDataModel';
import converter from '@/utils/mongoObjectConversionUtility';

export default async function verifyRazorpayPayment(razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string): Promise<boolean> {
    const mongoClient = await clientPromise
    const db = mongoClient.db(process.env.MONGODB_DB)
    const paymentGeteway = await db.collection('paymentGateway').findOne({
        partner: "RZP"
    })
    if (paymentGeteway != null) {
        const parsedData = converter.fromWithNoFieldChange<PaymentGatewayDataModel>(paymentGeteway)
        const razorPay = new RZP(parsedData.key_id, parsedData.key_secret ?? "")
        razorPay.createInstance()
        const result = validatePaymentVerification({
            order_id: razorpay_order_id,
            payment_id: razorpay_payment_id
        }, razorpay_signature, paymentGeteway.key_secret)
        return result
    } else {
        return false
    }
}