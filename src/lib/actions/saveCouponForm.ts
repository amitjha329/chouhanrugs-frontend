'use server'
import clientPromise from "../mongodb/clientPromise"
import AckResponse from "../types/AckResponse"
import CouponDataModel from "../types/CouponDataModel"

export default async function saveCouponForm(couponData: CouponDataModel): Promise<AckResponse> {
    try {
        const { _id, ...dataToInsert } = couponData
        const insertResponse = await (await clientPromise).db(process.env.MONGODB_DB).collection("coupons").insertOne({
            ...dataToInsert
        })
        if (insertResponse.acknowledged) {
            return {
                ack: true,
                result: {
                    code: "SUCCESS",
                    data: JSON.stringify(insertResponse)
                }
            }
        } else {
            return {
                ack: false,
                result: {
                    code: "ERROR",
                    data: JSON.stringify(insertResponse)
                }
            }
        }
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}