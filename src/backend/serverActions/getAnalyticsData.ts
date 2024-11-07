'use server'
import converter from "@/utils/mongoObjectConversionUtility";
import clientPromise from "@/lib/clientPromise";
import AnalyticsAndVerificationDataModel from "@/types/AnalyticsAndVerificationDataModel";

export default async function getAnalyticsData(type: "GTM" | "GOOGLE_VER" | "BING"): Promise<AnalyticsAndVerificationDataModel> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("seoAnalytics").findOne({ type })
        if (data != null)
            return converter.fromWithNoFieldChange<AnalyticsAndVerificationDataModel>(data)
        else
            return {
                _id: "",
                code: "",
                type
            }
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}