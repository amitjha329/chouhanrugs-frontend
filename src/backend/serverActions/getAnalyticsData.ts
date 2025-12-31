import { unstable_cache } from "next/cache";
import converter from "@/utils/mongoObjectConversionUtility";
import clientPromise from "@/lib/clientPromise";
import AnalyticsAndVerificationDataModel from "@/types/AnalyticsAndVerificationDataModel";

async function fetchAnalyticsData(type: "GTM" | "GOOGLE_VER" | "BING"): Promise<AnalyticsAndVerificationDataModel> {
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

const getAnalyticsData = (type: "GTM" | "GOOGLE_VER" | "BING"): Promise<AnalyticsAndVerificationDataModel> => {
    return unstable_cache(
        () => fetchAnalyticsData(type),
        [`analytics-${type}`],
        {
            revalidate: 86400, // 24 hours - analytics codes rarely change
            tags: ['analytics', `analytics-${type}`]
        }
    )()
}

export default getAnalyticsData