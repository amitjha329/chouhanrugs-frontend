'use server'
import { connection } from 'next/server'
import { ObjectId, WithId } from "mongodb"
import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import path from "path"
import Mail from "nodemailer/lib/mailer"
import clientPromise from "@/lib/clientPromise"
import ORDER_STAUTS from "@/lib/order_status"
import OrderDataModel from "@/types/OrderDataModel"
import SiteDataModel from "@/types/SiteDataModel"
import orderId from "@/utils/orderIdGenerator"

export default async function saveOrderAfterPay(orderDataParam: OrderDataModel) {
    await connection()
    const mongoClient = await clientPromise
    const db = mongoClient.db(process.env.MONGODB_DB)
    const collectionOrder = db.collection("orders")
    const collectionCarts = db.collection("carts")
    const collectionProducts = db.collection("products")
    const collectionAddress = db.collection("addresses")
    const collectionDataPoints = db.collection("data_points")
    const siteDataPoint = db.collection("site_data")
    const siteInfo = await siteDataPoint.findOne({ data_type: "siteData" }) as unknown as SiteDataModel
    const { _id, orderPlacedOn, orderStatus, ...orderData } = orderDataParam
    const user = await db.collection("users").findOne({ _id: new ObjectId(orderData.userId) })
    const mailer = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 0),
        secure: Number(process.env.SMTP_PORT ?? 0) == 465, // use TLS
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        }
    })
    mailer.use('compile', hbs({
        viewEngine: {
            partialsDir: path.resolve("./templates/partial/"),
        },
        viewPath: path.resolve('./templates/')
    }))
    try {
        let productItems: any[] = []
        const productPromises: Array<Promise<WithId<Document | null> | null>> = []
        orderData.products.forEach(element => {
            productPromises.push(collectionProducts.findOne({ _id: new ObjectId(element.productId) }))
        });
        const data = await Promise.all(productPromises)
        data.forEach((items, index) => {
            productItems.push({
                ...orderData.products[index],
                productPrice: (Number(orderData.products[index].productPrice) * Number(orderData.userCurrency.exchangeRates)).toFixed(2),
                ...items
            })
        })
        const orderNumber = orderId().generate()
        const orderDate = Date.now()
        const shippingAddress = await collectionAddress.findOne({ _id: new ObjectId(orderData.shippingAddress) })
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
        const mailOptions = {
            from: `"${siteInfo.title}" ${process.env.SMTP_USER}`,
            to: user?.email,
            subject: 'Order Confirmation',
            template: 'order_confirmation',
            context: {
                online_bill_url: "https://chouhanrugs.com/user/order/" + orderNumber,
                order_number: orderNumber,
                order_date: new Date(orderDate).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" }),
                product_items: productItems,
                subtotal_amount: orderData.subtotal,
                shipping_amount: 0,
                taxation_amount: Number(orderData.taxation).toFixed(2),
                total_amount: orderData.orderValue,
                customer_email: user?.email,
                payment_method: orderData.paymentMode,
                payment_currency: orderData.userCurrency.currency,
                shipping_address: JSON.parse(JSON.stringify(shippingAddress)),
                currency_symbol: orderData.userCurrency.currencySymbol
            }
        } as Mail.Options
        mailer.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            }
            console.log('Message sent: ' + info.response);
        })
        mailer.sendMail({
            ...mailOptions,
            to: "chouhanrugsjpr@gmail.com",
            subject: "New Order On Site"
        }, (error, info) => {
            if (error) {
                console.log(error);
            }
            console.log('Message sent to Admin: ' + info.response);
        })
        const addOrderResult = await collectionOrder.insertOne(processedOrderData)
        if (addOrderResult.acknowledged) {
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