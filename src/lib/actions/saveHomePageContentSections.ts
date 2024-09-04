'use server'
import { ObjectId } from "mongodb"
import clientPromise from "../mongodb/clientPromise"
import { Steps } from "../types/OrderProcessStepsDataModel"
import { ShopByRoomContent } from "../types/ShopByRoomContentDataModel"
import stringEmptyOrNull from "../utilities/stringEmptyOrNull"
import AckResponse from "../types/AckResponse"

export async function saveHomePageOrderProcessSteps(data: Steps, step: "stepOne" | "stepTwo" | "stepThree" | "stepFour"): Promise<AckResponse> {
    try {
        const insertResponse = await (await clientPromise).db(process.env.MONGODB_DB).collection("page_additional").findOneAndUpdate({ page: "home", dataType: "order_process_content" }, {
            $set: {
                [`steps.${step}`]: data
            }
        }, { upsert: true })
        if (insertResponse) {
            return {
                ack: true,
                result: {
                    code: "SUCCESS",
                    data: JSON.stringify(insertResponse)
                }
            }
        } else {
            return {
                ack: false,
                result: {
                    code: "ERROR",
                    data: JSON.stringify(insertResponse)
                }
            }
        }
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}

export async function saveHomePageOrderProcessTitle(title: string): Promise<AckResponse> {
    try {
        const insertResponse = await (await clientPromise).db(process.env.MONGODB_DB).collection("page_additional").findOneAndUpdate({ page: "home", dataType: "order_process_content" }, {
            $set: {
                title
            }
        }, { upsert: true })
        if (insertResponse) {
            return {
                ack: true,
                result: {
                    code: "SUCCESS",
                    data: JSON.stringify(insertResponse)
                }
            }
        } else {
            return {
                ack: false,
                result: {
                    code: "ERROR",
                    data: JSON.stringify(insertResponse)
                }
            }
        }
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}

export async function saveHomePageShopByRoomSection(bannerImage: string, content: ShopByRoomContent[]): Promise<AckResponse> {
    try {
        const insertResponse = await (await clientPromise).db(process.env.MONGODB_DB).collection("page_additional").findOneAndUpdate({ page: "home", dataType: "shop_by_room_content" }, {
            $set: {
                ...(bannerImage && !stringEmptyOrNull(bannerImage)) && { bannerImage },
                content
            }
        }, { upsert: true })
        if (insertResponse) {
            return {
                ack: true,
                result: {
                    code: "SUCCESS",
                    data: JSON.stringify(insertResponse)
                }
            }
        } else {
            return {
                ack: false,
                result: {
                    code: "ERROR",
                    data: JSON.stringify(insertResponse)
                }
            }
        }
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}