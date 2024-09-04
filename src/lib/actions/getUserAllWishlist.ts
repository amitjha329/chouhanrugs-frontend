'use server'
import { ObjectId } from "mongodb";
import clientPromise from "../mongodb/clientPromise";
import converter from "../utilities/mongoObjectConversionUtility";
import WishlistDataModel from "../types/WishlistDataModel";
import getProductWithId from "./getProductWithId";
import { ProductDataModel, ProductDataModelWithColorMap } from "../types/ProductDataModel";

export default async function getUserAllWishlist(userId: string, getProducts?: boolean): Promise<WishlistDataModel | undefined> {
    const mongoClient = await clientPromise
    const collectionPartnerIds = mongoClient.db(process.env.MONGODB_DB).collection("wishlists")
    try {
        const partnerIdsData = await collectionPartnerIds.findOne({ userId: new ObjectId(userId) })
        if (partnerIdsData) {
            const returnData = converter.fromWithNoFieldChange<{
                _id: string;
                userId: string;
                items: ObjectId[];
            }>(partnerIdsData, "userId")
            let productListFinal: (ProductDataModelWithColorMap | null)[] | undefined
            if (getProducts) {
                const productsPromise = returnData.items.map(item => getProductWithId(item.toHexString()))
                const productList = await Promise.all(productsPromise)
                productListFinal = productList.map(item => item && converter.fromWithNoFieldChange<ProductDataModel>(item))
            }
            return {
                _id: returnData._id,
                userId: returnData.userId,
                items: productListFinal,
                itemIds: returnData.items.map(item => item.toHexString())
            }
        } else {
            return undefined
        }
    } catch (err: any) {
        throw new Error(err)
    }
}