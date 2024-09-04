'use server';
import { unlink } from "fs-extra"

export default async function deleteImage(image: string): Promise<void> {
    const filename = process.env.NODE_ENV == "production" ? `./public${(new URL(image)).pathname}` : `./public${image}`
    console.log(filename)
    await unlink(filename)
}