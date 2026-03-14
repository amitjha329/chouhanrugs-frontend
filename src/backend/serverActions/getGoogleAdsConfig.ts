import { unstable_cache } from "next/cache";
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
    return unstable_cache(
        () => fetchGoogleAdsConfig(),
        ['analytics-GOOGLE_ADS'],
        {
            revalidate: 86400,
            tags: ['analytics', 'analytics-GOOGLE_ADS']
        }
    )()
}

export default getGoogleAdsConfig
