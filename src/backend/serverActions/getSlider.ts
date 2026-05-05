import { cacheLife, cacheTag } from "next/cache"
import clientPromise from "@/lib/clientPromise"
import SliderDataModel from "@/types/SliderDataModel"

async function fetchSlider(slideId: number): Promise<SliderDataModel> {
    "use cache"

    cacheLife("seconds")
    cacheTag("sliders")
    cacheTag(`slider-${slideId}`)

    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("sliders").findOne({ slideId })
        return JSON.parse(JSON.stringify(data)) as SliderDataModel
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}

const getSlider = (slideId: number): Promise<SliderDataModel> => {
    return fetchSlider(slideId)
}

export default getSlider
