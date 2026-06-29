'use server'

import { ObjectId } from "mongodb"
import nodemailer from 'nodemailer'
import clientPromise from "@/lib/clientPromise"
import SiteDataModel from "@/types/SiteDataModel"
import { getConfigBulk } from '@/lib/services/ConfigService'

export async function sendOrderConfirmationEmail(orderIdString: string) {
    try {
        const mongoClient = await clientPromise
        const db = mongoClient.db(process.env.MONGODB_DB)
        
        // Find order
        const order = await db.collection("orders").findOne({
            $or: [
                { _id: orderIdString as any },
                { _id: new ObjectId(orderIdString) as any },
                { orderId: orderIdString }
            ]
        })
        
        if (!order) {
            console.error(`[EmailHelper] Order not found: ${orderIdString}`)
            return false
        }
        
        const orderNumber = order._id.toString()

        // Find user
        const user = await db.collection("users").findOne({ _id: new ObjectId(order.userId) })
        if (!user) {
            console.error(`[EmailHelper] User not found for order: ${orderNumber}`)
            return false
        }

        // Load configs
        const smtp = await getConfigBulk(['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'])
        const siteDataPoint = db.collection("site_data")
        const siteInfo = await siteDataPoint.findOne({ data_type: "siteData" }) as unknown as SiteDataModel
        const siteTitle = siteInfo?.title || "Chouhan Rugs"

        if (!smtp.SMTP_HOST || !smtp.SMTP_USER || !smtp.SMTP_PASS) {
            console.error('[EmailHelper] SMTP not configured. Cannot send order confirmation email.')
            return false
        }

        // Fetch products in order to get their titles
        const productItems: any[] = []
        const productPromises = order.products.map((item: any) => 
            db.collection("products").findOne({ _id: new ObjectId(item.productId) })
        )
        const productsFetched = await Promise.all(productPromises)
        
        order.products.forEach((item: any, index: number) => {
            const prodDetails = productsFetched[index]
            productItems.push({
                ...item,
                productName: prodDetails?.productName || prodDetails?.productTitle || 'Product Name Not Available',
                productTitle: prodDetails?.productTitle || prodDetails?.productName || ''
            })
        })

        // Fetch shipping address
        const shippingAddress = await db.collection("addresses").findOne({ _id: new ObjectId(order.shippingAddress) })

        // Build plain text products list
        let itemsText = ''
        const currencySymbol = order.userCurrency?.currencySymbol || '$'
        
        productItems.forEach((item) => {
            // Localized names if object
            let itemName = ''
            if (typeof item.productName === 'object' && item.productName !== null) {
                itemName = item.productName['en-US'] || item.productName['en'] || Object.values(item.productName)[0] || '';
            } else {
                itemName = item.productName || '';
            }

            if (!itemName && typeof item.productTitle === 'object' && item.productTitle !== null) {
                itemName = item.productTitle['en-US'] || item.productTitle['en'] || Object.values(item.productTitle)[0] || '';
            } else if (!itemName) {
                itemName = item.productTitle || '';
            }

            const varCode = item.variation ? ` (Variation: ${item.variation})` : ''
            const price = Number(item.productPrice).toFixed(2)
            itemsText += `- ${itemName}${varCode} x ${item.quantity}: ${currencySymbol}${price}\n`
        })

        // Build shipping address block
        let addrText = 'N/A'
        if (shippingAddress) {
            addrText = `${shippingAddress.fname} ${shippingAddress.lname}\n` +
                       `${shippingAddress.streetAddress}\n` +
                       `${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.postalCode}\n` +
                       `${shippingAddress.country}`
        }

        const orderDateStr = new Date(order.orderPlacedOn).toLocaleString("en-US", { 
            dateStyle: "full", 
            timeStyle: "short" 
        })

        const emailText = `Dear Customer,

Thank you for your order! Your order has been successfully placed and confirmed.

Order Details:
Order Number: ${orderNumber}
Order Date: ${orderDateStr}
Payment Method: ${order.paymentMode || 'Credit/Debit Card'}
Payment Currency: ${order.userCurrency?.currency || 'USD'}

Items Ordered:
${itemsText}
Subtotal: ${currencySymbol}${Number(order.subtotal || 0).toFixed(2)}
Tax: ${currencySymbol}${Number(order.taxation || 0).toFixed(2)}
Total Amount Paid: ${currencySymbol}${Number(order.orderValue || 0).toFixed(2)}

Shipping Address:
${addrText}

You can view your order bill online at: https://chouhanrugs.com/user/order/${orderNumber}

Thank you for shopping with us!
${siteTitle}`

        // Create transport
        const mailer = nodemailer.createTransport({
            host: smtp.SMTP_HOST,
            port: Number(smtp.SMTP_PORT),
            secure: Number(smtp.SMTP_PORT) === 465,
            auth: {
                user: smtp.SMTP_USER,
                pass: smtp.SMTP_PASS,
            }
        })

        // Send to Customer
        await mailer.sendMail({
            from: `"${siteTitle}" <${smtp.SMTP_FROM || smtp.SMTP_USER}>`,
            to: user.email,
            subject: `Order Confirmation - Order #${orderNumber}`,
            text: emailText
        })
        console.log(`[EmailHelper] Order confirmation email sent to customer: ${user.email}`)

        // Send to Admin
        await mailer.sendMail({
            from: `"${siteTitle}" <${smtp.SMTP_FROM || smtp.SMTP_USER}>`,
            to: "chouhanrugsjpr@gmail.com",
            subject: `New Order Received - Order #${orderNumber}`,
            text: `A new order has been received on Chouhan Rugs.\n\n${emailText}`
        })
        console.log(`[EmailHelper] New order email sent to admin.`)

        return true
    } catch (error) {
        console.error("[EmailHelper] Error in sendOrderConfirmationEmail:", error)
        return false
    }
}
