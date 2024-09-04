'use server';
import clientPromise from "../mongodb/clientPromise";

async function getTotalProductsCount(brand: string[], category: string[]): Promise<number> {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const result = await db.collection("products").countDocuments({
        ...(brand.length > 0) && { brand: { $in: brand } },
        ...(category.length > 0) && { category: { $in: category } }
    })
    return result
}

export default getTotalProductsCount