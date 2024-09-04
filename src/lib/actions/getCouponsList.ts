'use server';
import clientPromise from "../mongodb/clientPromise"
import CouponDataModel from "../types/CouponDataModel";
import converter from "../utilities/mongoObjectConversionUtility"

export default async function getCouponsList(): Promise<CouponDataModel[]> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("coupons").find({}).toArray()
        const parsedData: Array<CouponDataModel> = []
        data.forEach(item => {
            parsedData.push(converter.fromWithNoFieldChange<CouponDataModel>(item))
        })
        return parsedData
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}