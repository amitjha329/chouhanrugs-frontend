import clientPromise from "@/lib/clientPromise"
import SliderDataModel from "@/types/SliderDataModel"

async function getSlider(slideId: number): Promise<SliderDataModel> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("sliders").findOne({ slideId })
        return JSON.parse(JSON.stringify(data)) as SliderDataModel
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}

export default getSlider