import clientPromise from "@/lib/clientPromise";
import PopUpDataModel from "@/types/PopUpDataModel";
import { cache } from "react";

const getPopUpData = cache(async (): Promise<PopUpDataModel | null> => {
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
});

export default getPopUpData;
