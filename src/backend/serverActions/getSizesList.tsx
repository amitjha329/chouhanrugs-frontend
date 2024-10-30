import clientPromise from "@/lib/clientPromise";
import SizeDataModel from "@/types/SizeDataModel";
import converter from "@/utils/mongoObjectConversionUtility";

export async function getSizesList(): Promise<SizeDataModel[]> {
    try {
        const client = await clientPromise;
        const db = client.db();
        const colors = await db.collection("sizes").find({}).toArray();

        return colors.map(c=>converter.fromWithNoFieldChange<SizeDataModel>(c));
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}
