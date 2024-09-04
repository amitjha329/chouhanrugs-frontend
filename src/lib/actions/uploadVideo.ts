'use server';
import { ensureDir, writeFile } from "fs-extra";
import VideoUploadResponse from "../types/VideoUploadResponse";

const uploadVideo = async (data: FormData): Promise<Array<VideoUploadResponse>> => {
    const id = data.get("id")?.toString()
    const type = data.get("type")?.toString()
    const vidBlobArray = data.has('video') ? data.getAll('video') as File[] : []
    const host = process.env.NODE_ENV == "production" ? process.env.NEXTCDN : ""
    const responseArray: Array<VideoUploadResponse> = []
    for (const vidBlob of vidBlobArray) {
        const dataFileName = vidBlob?.name.split('.')
        const videoName = `${dataFileName?.at(0)}_${Date.now()}.mp4`
        if (vidBlob) {
            let imagePath: string = `./public/uploads/${type}/${id ? id + "/" : ""}`
            await ensureDir(imagePath)
            imagePath = imagePath + videoName
            const imgFileArray = await vidBlob.arrayBuffer()
            await writeFile(imagePath, Buffer.from(imgFileArray))
        }
        responseArray.push({
            vidName: videoName,
            url: `${host}/uploads/${type}/${id ? id + "/" : ""}${videoName}`
        })
    }
    return responseArray
}

export default uploadVideo