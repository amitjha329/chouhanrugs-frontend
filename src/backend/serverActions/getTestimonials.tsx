import { getStorefrontDb } from "@/lib/mongodb";
import SizeDataModel from "@/types/SizeDataModel";
import converter from "@/utils/mongoObjectConversionUtility";

export async function getTestimonials(): Promise<TestimonialDataModel[]> {
    try {
        const db = await getStorefrontDb();
        const colors = await db.collection("testimonials").find({}).toArray();

        return colors.map(c => converter.fromWithNoFieldChange<TestimonialDataModel>(c));
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}
