'use server'
import { connection } from 'next/server'
import clientPromise from "@/lib/clientPromise";
import OrderDataModel from "@/types/OrderDataModel";
import converter from "@/utils/mongoObjectConversionUtility";
import { ObjectId } from "mongodb";
import getUserAddressWithId from "./getUserAddressWithId";
import getProductWithId from "./getProductWithId";
import { ProductDataModelWithColorMap } from "@/types/ProductDataModel";
import UserAddressDataModel from "@/types/UserAddressDataModel";

interface returnType extends OrderDataModel {
    productsList: ProductDataModelWithColorMap[],
    shipping: UserAddressDataModel,

}

export default async function getUserOrderWithId(id: string): Promise<returnType | undefined> {
    await connection()
    try {
        const mongoClient = await clientPromise
        const db = mongoClient.db(process.env.MONGODB_DB)
        const collectionAddr = db.collection("orders")
        const orderItem = await collectionAddr.findOne({
            _id: id as unknown as ObjectId
        })
        if (orderItem != null) {
            const productPromiseList = orderItem?.products.map((item: { productId: string }) => getProductWithId(item.productId))
            const [productsList, shipping] = await Promise.all([Promise.all(productPromiseList), getUserAddressWithId(orderItem?.shippingAddress)])
            return { ...converter.fromWithNoFieldChange<OrderDataModel>(orderItem, "shippingAddress", "userId"), shipping, productsList }
        } else {
            return undefined
        }
    } catch (err: any) {
        throw new Error(err)
    }
}