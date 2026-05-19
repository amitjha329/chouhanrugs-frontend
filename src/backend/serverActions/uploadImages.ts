'use server';
import ImageUploadResponse from "@/types/ImageUploadResponse";
import { buildFirebaseStoragePath, uploadFileToFirebaseStorage } from "@/utils/firebaseStorage";

const ALLOWED_MIME_TYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/avif',
])

const uploadImages = async (data: FormData): Promise<Array<ImageUploadResponse>> => {
    const id = data.get("id")?.toString()
    const type = data.get("type")?.toString()
    const imgBlobArray = data.has('image') ? data.getAll('image') as File[] : []
    const results = await Promise.all(
        imgBlobArray.map(async (imgBlob): Promise<ImageUploadResponse | null> => {
            if (!imgBlob || imgBlob.size === 0) return null

            if (!ALLOWED_MIME_TYPES.has(imgBlob.type)) {
                throw new Error(`Invalid file type: ${imgBlob.type}`)
            }

            const { fileName, storagePath } = buildFirebaseStoragePath(imgBlob, type, id, 'jpg')
            const uploaded = await uploadFileToFirebaseStorage(imgBlob, storagePath)

            return {
                imgName: fileName,
                url: uploaded.url,
            }
        })
    )

    return results.filter((r): r is ImageUploadResponse => r !== null)
}

export default uploadImages
