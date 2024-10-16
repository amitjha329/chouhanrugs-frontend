import { ObjectId } from "mongodb"

type CouponDataModel = {
    _id?: string
    name: string
    code: string
    value: number
    description: string
    type: number
    expiration: number
    minOrder: number
    maxValue: number
}

export default CouponDataModel