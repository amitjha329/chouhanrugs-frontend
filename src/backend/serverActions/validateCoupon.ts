'use server'
import { connection } from 'next/server'

import clientPromise from "@/lib/clientPromise"
import CouponDataModel from "@/types/CouponDataModel"


export default async function validateCoupon(couponCode: string, cartValue: number): Promise<{ couponApplicable: boolean, couponData: CouponDataModel }> {
    await connection()
    const mongoClient = await clientPromise
    const db = mongoClient.db(process.env.MONGODB_DB)
    const couponData = await db.collection('coupons').findOne({
        code: couponCode
    })
    return {
        couponApplicable: couponData?.minOrder <= cartValue,
        couponData: JSON.parse(JSON.stringify(couponData))
    }
}