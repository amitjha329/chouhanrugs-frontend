'use server'
import clientPromise from "@/lib/clientPromise";
import stringEmptyOrNull from "@/lib/stringEmptyOrNull";
import { DHLShipment, DHLShipmentConvert } from "@/types/DHLShipment";
import { DTDCShipment, DTDCShipmentConvert } from "@/types/DTDCShipment";
import OrderDataModel from "@/types/OrderDataModel";
import { ObjectId } from "mongodb"

export default async function trackOrder(type: "DHL" | "DTDC" | "", trackingNo: string, isDel: boolean, orderId?: string): Promise<DHLShipment | DTDCShipment | undefined> {
    if (stringEmptyOrNull(type)) return undefined;
    const mongoClient = await clientPromise
    const db = mongoClient.db(process.env.MONGODB_DB)
    if (isDel) {
        const shipRaw = await db.collection("orders").findOne({ _id: orderId as unknown as ObjectId })
        return (shipRaw as unknown as OrderDataModel).tracking.data
    }
    switch (type) {
        case "DHL":
            const myHeaders = new Headers();
            myHeaders.append("DHL-API-Key", "uREjxIeGF1KHnsDTw0uh30FhuIfLw4AX");
            const dhlTrackedResponse = await fetch("https://api-eu.dhl.com/track/shipments?trackingNumber=" + trackingNo, {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow',
                cache: "no-cache"
            })
            const rawDHL = await dhlTrackedResponse.text()
            const shipmentData = DHLShipmentConvert.toDHLShipment(rawDHL)
            if (shipmentData.shipments[0].status.statusCode == "transit") {
                await db.collection("orders").findOneAndUpdate({ _id: orderId as unknown as ObjectId }, {
                    $set: {
                        orderStatus: "transit",
                        tracking: {
                            trackingNum: trackingNo,
                            type: type,
                            data: shipmentData
                        }
                    }
                })
            }
            if (shipmentData.shipments[0].status.statusCode == "delivered") {
                await db.collection("orders").findOneAndUpdate({ _id: orderId as unknown as ObjectId }, {
                    $set: {
                        orderStatus: "delivered",
                        tracking: {
                            trackingNum: trackingNo,
                            type: type,
                            data: shipmentData
                        }
                    }
                })
            }
            return shipmentData;
        case "DTDC":
            const dtdcTrackedResponse = await fetch("https://ebookingbackend.shipsy.in/trackConsignment?reference_number=" + trackingNo, {
                method: 'GET',
                redirect: 'follow',
                cache: "no-cache"
            })
            const rawDTDC = await dtdcTrackedResponse.text()
            const shippedData = DTDCShipmentConvert.toDTDCShipment(rawDTDC)
            if (shippedData.data.status_internal == "transit") {
                await db.collection("orders").findOneAndUpdate({ _id: orderId as unknown as ObjectId }, {
                    $set: {
                        orderStatus: "transit",
                        tracking: {
                            trackingNum: trackingNo,
                            type: type,
                            data: shippedData
                        }
                    }
                })
            }
            if (shippedData.data.status_internal == "delivered") {
                await db.collection("orders").findOneAndUpdate({ _id: orderId as unknown as ObjectId }, {
                    $set: {
                        orderStatus: "delivered",
                        tracking: {
                            trackingNum: trackingNo,
                            type: type,
                            data: shippedData
                        }
                    }
                })
            }
            return shippedData;
    }
}