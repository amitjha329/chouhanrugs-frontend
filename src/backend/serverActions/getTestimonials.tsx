import { cacheLife, cacheTag } from "next/cache";
import { getStorefrontDb } from "@/lib/mongodb";
import converter from "@/utils/mongoObjectConversionUtility";

export async function getTestimonials(): Promise<TestimonialDataModel[]> {
    "use cache";

    cacheLife("hours");
    cacheTag("testimonials");

    try {
        const db = await getStorefrontDb();
        const colors = await db.collection("testimonials").find({}).toArray();

        return colors.map(c => converter.fromWithNoFieldChange<TestimonialDataModel>(c));
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}
