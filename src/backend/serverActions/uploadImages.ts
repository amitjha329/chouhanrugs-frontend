'use server';
import ImageUploadResponse from "@/types/ImageUploadResponse";
import { ensureDir, writeFile } from "fs-extra";
import sharp from "sharp";

const uploadImages = async (data: FormData): Promise<Array<ImageUploadResponse>> => {
    const id = data.get("id")?.toString()
    const type = data.get("type")?.toString()
    const imgBlobArray = data.has('image') ? data.getAll('image') as File[] : []
    const host = process.env.NODE_ENV == "production" ? process.env.NEXTCDN : ""
    const responseArray: Array<ImageUploadResponse> = []
    for (const imgBlob of imgBlobArray) {
        const dataFileName = imgBlob?.name.split('.')
        const imageName = `${dataFileName?.at(0)}_${Date.now()}.webp`
        if (imgBlob) {
            let imagePath: string = `./public/uploads/${type}/${id ? id+"/":""}`
            await ensureDir(imagePath)
            imagePath = imagePath + imageName
            const imgFileArray = await imgBlob.arrayBuffer()
            if (dataFileName?.at(-1) !== "webp") {
                const imgTemp = sharp(imgFileArray)
                const webPConverted = imgTemp.webp({ quality: 75 })
                await writeFile(imagePath, await webPConverted.toBuffer())
            } else {
                await writeFile(imagePath, Buffer.from(imgFileArray))
            }
        }
        responseArray.push({
            imgName: imageName,
            url: `${host}/uploads/${type}/${id ? id+"/":""}${imageName}`
        })
    }
    return responseArray
}

export default uploadImages