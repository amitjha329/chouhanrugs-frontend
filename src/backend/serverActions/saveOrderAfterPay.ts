'use server'
import { connection } from 'next/server'
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/clientPromise"
import ORDER_STAUTS from "@/lib/order_status"
import OrderDataModel from "@/types/OrderDataModel"
import orderId from "@/utils/orderIdGenerator"
import { sendOrderConfirmationEmail } from './sendOrderEmailHelper'

export default async function saveOrderAfterPay(orderDataParam: OrderDataModel) {
    await connection()
    const mongoClient = await clientPromise
    const db = mongoClient.db(process.env.MONGODB_DB)
    const collectionOrder = db.collection("orders")
    const collectionCarts = db.collection("carts")
    const collectionAddress = db.collection("addresses")
    const collectionDataPoints = db.collection("data_points")
    const { _id, orderPlacedOn, orderStatus, ...orderData } = orderDataParam
    const user = await db.collection("users").findOne({ _id: new ObjectId(orderData.userId) })
    
    try {
        const orderNumber = orderId().generate()
        const orderDate = Date.now()
        const processedOrderData = {
            ...orderData,
            _id: orderNumber as unknown as ObjectId,
            products: orderData.products,
            shippingAddress: new ObjectId(orderData.shippingAddress),
            tracking: {
                type: "",
                trackingNum: ""
            },
            userId: new ObjectId(user?._id),
            orderPlacedOn: orderDate,
            orderStatus: orderStatus.length > 0 ? orderStatus : ORDER_STAUTS.PLACED
        }
        const cartDelete = await collectionCarts.deleteMany({ userId: user?._id })
        console.log(cartDelete)
        await collectionDataPoints.updateOne({ dataFor: "notification" }, {
            $addToSet: {
                notifications: {
                    date: Date.now(),
                    message: `There has been a new order from ${user?.email}`,
                    read: false
                }
            },
            $inc: {
                newNotifCount: 1,
                pendingOrders: 1
            },
            $set: { newOrder: true }
        }, { upsert: true })

        const addOrderResult = await collectionOrder.insertOne(processedOrderData)
        if (addOrderResult.acknowledged) {
            // Trigger plain-text order confirmation email asynchronously
            sendOrderConfirmationEmail(orderNumber).catch(err => {
                console.error("[saveOrderAfterPay] Failed to send order confirmation email:", err)
            })

            return {
                ack: true,
                result: {
                    code: "SUCCESS",
                    data: orderNumber
                }
            }
        } else {
            return {
                ack: false,
                result: {
                    code: "ERROR",
                    data: JSON.stringify(addOrderResult)
                }
            }
        }
    } catch (ex: any) {
        throw new Error(ex)
    }
}