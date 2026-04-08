import { unstable_cache } from "next/cache";
import clientPromise from "@/lib/clientPromise";
import PopUpDataModel from "@/types/PopUpDataModel";

const getPopUpData = async (): Promise<PopUpDataModel | null> => {
    return unstable_cache(
        async () => {
            try {
                const client = await clientPromise;
                const db = client.db(process.env.MONGODB_DB);
                const tempData = await db.collection("site_data").findOne({
                    data_type: "popupData"
                });
                const popupData = JSON.parse(JSON.stringify(tempData)) as PopUpDataModel | null;

                if (!popupData || !popupData.isActive) {
                    return null;
                }

                return popupData;
            } catch (error) {
                console.error("Error fetching popup data:", error);
                return null;
            }
        },
        ['popup-data'],
        { tags: ['site-data', 'popup-data'], revalidate: 3600 }
    )()
};

export default getPopUpData;
