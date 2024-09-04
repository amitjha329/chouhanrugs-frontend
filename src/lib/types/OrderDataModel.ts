import { User } from "next-auth"
import CouponDataModel from "./CouponDataModel"
import UserAddressDataModel from "./UserAddressDataModel"
import { DHLShipment } from "./DHLShipment"
import { DTDCShipment } from "./DTDCShipment"
import { ProductDataModel } from "./ProductDataModel"
import { CustomSize } from "./CartDataModel"

interface OrderDataModel {
    _id: string
    products: OrderProduct[]
    shippingType: string
    shippingAddress: string
    tracking: {
        type: "DHL" | "DTDC" | ""
        trackingNum: string,
        data?: DHLShipment | DTDCShipment
    }
    paymentStatus: string
    paymentMode: string
    couponApplied?: CouponDataModel | null
    paymentCode: string
    subtotal: number
    taxation: number
    orderValue: number
    userCurrency: UserCurrency
    userId: string
    orderPlacedOn: number
    orderStatus: "pending" | "placed" | "dispatched" | "out-for-delivery" | "delivered" | "returned" | "cancelled" | "transit",
    user?: User,
    shipping?: UserAddressDataModel
}

export interface OrderDataModelWithProductsList extends OrderDataModel {
    productList: ProductDataModel[]
    deliveryAddress: UserAddressDataModel
}

export type OrderProduct = {
    productId: string
    productPrice: number
    productMSRP: number
    quantity: number
    variation?: string
    customSize?: CustomSize | null
}

type UserCurrency = {
    _id?: string
    country?: string
    ISO?: string
    currency?: string
    currencySymbol?: string
    exchangeRates?: number
    active?: boolean
    default?: boolean
}

export default OrderDataModel