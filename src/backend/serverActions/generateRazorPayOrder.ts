'use server'

import { connection } from 'next/server'
import clientPromise from '@/lib/clientPromise'
import PaymentGatewayDataModel from '@/types/PaymentGatewayDataModel'
import converter from '@/utils/mongoObjectConversionUtility'
import { Orders } from 'razorpay/dist/types/orders'
import RZP from './razorpay'
import { AckWithReturn } from '@/types/AckResponse'

export default async function generateRazorPayOrder(amount: number, currency: string): Promise<AckWithReturn<Orders.RazorpayOrder | undefined>> {
    await connection()
    const mongoClient = await clientPromise
    const db = mongoClient.db(process.env.MONGODB_DB)
    const paymentGeteway = await db.collection('paymentGateway').findOne({
        partner: "RZP"
    })
    if (paymentGeteway != null) {
        const parsedData = converter.fromWithNoFieldChange<PaymentGatewayDataModel>(paymentGeteway)
        const razorPay = new RZP(parsedData.key_id, parsedData.key_secret ?? "")
        razorPay.createInstance()
        const orderData = await razorPay.createOrder(amount, currency)
        if (orderData) {
            return {
                ack: true,
                result: {
                    code: "SUCCESS",
                    data: orderData
                }
            }
        } else {
            return {
                ack: false,
                result: {
                    code: "ERROR",
                    data: undefined
                }
            }
        }
    } else {
        return {
            ack: false,
            result: {
                code: "NO_DATA",
                data: undefined
            }
        }
    }
}