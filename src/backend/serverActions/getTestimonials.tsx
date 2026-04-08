import { unstable_cache } from "next/cache";
import clientPromise from "@/lib/clientPromise";
import SizeDataModel from "@/types/SizeDataModel";
import converter from "@/utils/mongoObjectConversionUtility";

export async function getTestimonials(): Promise<TestimonialDataModel[]> {
    return unstable_cache(
        async () => {
            try {
                const client = await clientPromise;
                const db = client.db();
                const colors = await db.collection("testimonials").find({}).toArray();

                return colors.map(c => converter.fromWithNoFieldChange<TestimonialDataModel>(c));
            } catch (error) {
                console.error("Error fetching testimonials:", error);
                return [];
            }
        },
        ['testimonials-list'],
        { tags: ['site-data', 'testimonials'], revalidate: 3600 }
    )()
}
