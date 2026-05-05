import { cacheLife, cacheTag } from "next/cache";
import converter from "@/utils/mongoObjectConversionUtility";
import clientPromise from "@/lib/clientPromise";
import AnalyticsAndVerificationDataModel from "@/types/AnalyticsAndVerificationDataModel";

async function fetchAnalyticsData(type: "GTM" | "GOOGLE_VER" | "BING"): Promise<AnalyticsAndVerificationDataModel> {
    "use cache";

    cacheLife("seconds");
    cacheTag("analytics");
    cacheTag(`analytics-${type}`);

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
    return fetchAnalyticsData(type)
}

export default getAnalyticsData
