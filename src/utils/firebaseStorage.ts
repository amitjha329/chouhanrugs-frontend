import { randomUUID } from "crypto"

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY ?? "AIzaSyCz4O44uzr_LUmyy0t5VEirEWpR_38W9Os"
const FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET ?? "chouhanrugs-76c6a.firebasestorage.app"

const cleanSegment = (value: string | undefined | null, fallback: string) => {
    const cleaned = value
        ?.trim()
        .replace(/[^a-zA-Z0-9._-]+/g, "-")
        .replace(/^-+|-+$/g, "")

    return cleaned || fallback
}

const getExtension = (file: File, fallback: string) => {
    const fromName = file.name.split(".").pop()
    if (fromName && fromName !== file.name) return cleanSegment(fromName.toLowerCase(), fallback)

    const fromMime = file.type.split("/").pop()
    return cleanSegment(fromMime, fallback)
}

export const buildFirebaseStoragePath = (file: File, type: string | undefined, id: string | undefined, fallbackExtension: string) => {
    const folder = cleanSegment(type, "misc")
    const ownerId = cleanSegment(id, "")
    const baseName = cleanSegment(file.name.split(".").slice(0, -1).join("."), "media")
    const extension = getExtension(file, fallbackExtension)
    const fileName = `${baseName}_${Date.now()}_${randomUUID()}.${extension}`

    return {
        fileName,
        storagePath: ["uploads", folder, ownerId, fileName].filter(Boolean).join("/"),
    }
}

export async function uploadFileToFirebaseStorage(file: File, storagePath: string) {
    const metadata = {
        name: storagePath,
        contentType: file.type || "application/octet-stream",
        cacheControl: "public,max-age=31536000,immutable",
    }
    const fileBuffer = Buffer.from(await file.arrayBuffer())

    const uploadUrl = new URL(`https://firebasestorage.googleapis.com/v0/b/${FIREBASE_STORAGE_BUCKET}/o`)
    uploadUrl.searchParams.set("name", storagePath)
    uploadUrl.searchParams.set("key", FIREBASE_API_KEY)

    const startResponse = await fetch(uploadUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "X-Goog-Upload-Protocol": "resumable",
            "X-Goog-Upload-Command": "start",
            "X-Goog-Upload-Header-Content-Length": String(fileBuffer.byteLength),
            "X-Goog-Upload-Header-Content-Type": metadata.contentType,
        },
        body: JSON.stringify(metadata),
    })

    if (!startResponse.ok) {
        const errorText = await startResponse.text().catch(() => startResponse.statusText)
        throw new Error(`Firebase upload start failed: ${startResponse.status} ${errorText}`)
    }

    const resumableUploadUrl = startResponse.headers.get("x-goog-upload-url")
    if (!resumableUploadUrl) {
        throw new Error("Firebase upload failed: missing resumable upload URL")
    }

    const finalizeResponse = await fetch(resumableUploadUrl, {
        method: "PUT",
        headers: {
            "Content-Type": metadata.contentType,
            "X-Goog-Upload-Command": "upload, finalize",
            "X-Goog-Upload-Offset": "0",
        },
        body: fileBuffer,
    })

    if (!finalizeResponse.ok) {
        const errorText = await finalizeResponse.text().catch(() => finalizeResponse.statusText)
        throw new Error(`Firebase upload finalize failed: ${finalizeResponse.status} ${errorText}`)
    }

    const uploadResult = await finalizeResponse.json()
    const uploadedPath = uploadResult.name ?? storagePath
    const uploadedToken = uploadResult.downloadTokens ?? uploadResult.metadata?.firebaseStorageDownloadTokens
    const downloadUrl = new URL(`https://firebasestorage.googleapis.com/v0/b/${FIREBASE_STORAGE_BUCKET}/o/${encodeURIComponent(uploadedPath)}`)
    downloadUrl.searchParams.set("alt", "media")
    if (uploadedToken) downloadUrl.searchParams.set("token", uploadedToken)

    return {
        name: uploadedPath.split("/").pop() ?? uploadedPath,
        path: uploadedPath,
        url: downloadUrl.toString(),
    }
}
