import clientPromise from "@/lib/clientPromise";
import ColorDataModel from "@/types/ColorDataModel";
import converter from "@/utils/mongoObjectConversionUtility";

export async function getColorsList(): Promise<ColorDataModel[]> {
    try {
        const client = await clientPromise;
        const db = client.db();
        const colors = await db.collection("colors").find({}).toArray();

        return colors.map(c=>converter.fromWithNoFieldChange<ColorDataModel>(c));
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}
