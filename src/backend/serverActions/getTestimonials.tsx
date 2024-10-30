import clientPromise from "@/lib/clientPromise";
import SizeDataModel from "@/types/SizeDataModel";
import converter from "@/utils/mongoObjectConversionUtility";

export async function getTestimonials(): Promise<TestimonialDataModel[]> {
    try {
        const client = await clientPromise;
        const db = client.db();
        const colors = await db.collection("testimonials").find({}).toArray();

        return colors.map(c => converter.fromWithNoFieldChange<TestimonialDataModel>(c));
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}
