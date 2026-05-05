import { cacheLife, cacheTag } from "next/cache";
import converter from "@/utils/mongoObjectConversionUtility";
import clientPromise from "@/lib/clientPromise";
import GoogleAdsConfigDataModel from "@/types/GoogleAdsConfigDataModel";

const DEFAULT_CONFIG: GoogleAdsConfigDataModel = {
    _id: "",
    type: "GOOGLE_ADS",
    code: "",
    gtagId: "",
    conversionLabels: {
        signup: "",
        addToCart: "",
        emailLead: "",
        purchase: "",
        whatsappLead: "",
    }
}

async function fetchGoogleAdsConfig(): Promise<GoogleAdsConfigDataModel> {
    "use cache";

    cacheLife("seconds");
    cacheTag("analytics");
    cacheTag("analytics-GOOGLE_ADS");

    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("seoAnalytics").findOne({ type: "GOOGLE_ADS" })
        if (data != null)
            return converter.fromWithNoFieldChange<GoogleAdsConfigDataModel>(data)
        else
            return DEFAULT_CONFIG
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}

const getGoogleAdsConfig = (): Promise<GoogleAdsConfigDataModel> => {
    return fetchGoogleAdsConfig()
}

export default getGoogleAdsConfig
