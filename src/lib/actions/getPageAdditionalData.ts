'use server';
import clientPromise from "../mongodb/clientPromise"
import OrderProcessStepsDataModel from "../types/OrderProcessStepsDataModel";
import ShopByRoomContentDataModel from "../types/ShopByRoomContentDataModel";
import { ShopByRoomMobileModel } from "../types/ShopByRoomMobileModel";
import WhyShopWithUsContent from "../types/WhyShopWithUsContent";
import converter from "../utilities/mongoObjectConversionUtility";

export async function getHomePageOrderProcessInformation(): Promise<OrderProcessStepsDataModel | undefined> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("page_additional").findOne({ page: "home", dataType: "order_process_content" })
        if (data != null)
            return converter.fromWithNoFieldChange<OrderProcessStepsDataModel>(data)
        else
            return
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}

export async function getHomePageShopByRoom(): Promise<ShopByRoomContentDataModel | undefined> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("page_additional").findOne({ page: "home", dataType: "shop_by_room_content" })
        if (data != null)
            return converter.fromWithNoFieldChange<ShopByRoomContentDataModel>(data)
        else
            return
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}

export async function getHomePageShopByRoomMobile(): Promise<ShopByRoomMobileModel | undefined> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("page_additional").findOne({ page: "home", dataType: "shop_by_room_mobile" })
        if (data != null)
            return converter.fromWithNoFieldChange<ShopByRoomMobileModel>(data)
        else
            return
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}

export async function getPageFooterContent(page: string): Promise<FooterContentDataModel | undefined> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("page_additional").findOne({ page, dataType: "footer_content" })
        if (data != null)
            return converter.fromWithNoFieldChange<FooterContentDataModel>(data)
        else
            return
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}

export async function getHomePageWhyUsSection(): Promise<WhyShopWithUsContent | undefined> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("page_additional").findOne({ page:"home", dataType: "why_us_section" })
        if (data != null)
            return converter.fromWithNoFieldChange<WhyShopWithUsContent>(data)
        else
            return
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}