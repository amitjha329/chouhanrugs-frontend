import clientPromise from "@/lib/clientPromise";
import { getSession } from "@/lib/auth-server";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

const stableStringify = (value: unknown): string => {
    if (!value || typeof value !== 'object') return ''
    if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`

    return `{${Object.keys(value as Record<string, unknown>).sort().map(key => {
        const childValue = (value as Record<string, unknown>)[key]
        return `${JSON.stringify(key)}:${typeof childValue === 'object' && childValue !== null ? stableStringify(childValue) : JSON.stringify(childValue ?? null)}`
    }).join(',')}}`
}

export async function POST(req: NextRequest) {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const cartColletion = db.collection("carts")
    const request = await req.json()
    const collectionUserProfile = db.collection("users")
    const { productId, variationCode, customSize, quantity } = request
    const session = await getSession()
    const targetUserId = session?.user?.id

    if (!targetUserId) {
        return NextResponse.json({ ack: false, result: { code: "ERROR", data: "Unauthorized" } }, { status: 401 })
    }

    const normalizedVariationCode = variationCode ?? ''
    const normalizedCustomSize = normalizedVariationCode === 'customSize' ? customSize ?? null : null
    const customSizeKey = normalizedCustomSize ? stableStringify(normalizedCustomSize) : ''
    const identityFilter = {
        prodId: ObjectId.createFromHexString(productId),
        userId: ObjectId.createFromHexString(targetUserId),
        variationCode: normalizedVariationCode,
        ...(customSizeKey
            ? { customSizeKey }
            : { $or: [{ customSizeKey: '' }, { customSizeKey: { $exists: false } }] }),
    }

    try {
        const cartAdditionAck = await cartColletion.updateOne(identityFilter, {
            $set: {
                customSize: normalizedCustomSize,
                customSizeKey,
            },
            $inc: {
                quantity: Number(quantity ?? 1)
            }
        }, { upsert: true })
        if (cartAdditionAck.acknowledged) {
            if (cartAdditionAck.upsertedCount > 0) {
                await collectionUserProfile.findOneAndUpdate({ _id: ObjectId.createFromHexString(targetUserId) }, { $inc: { cartCount: 1 } })
            }
            return NextResponse.json({
                ack: true,
                result: {
                    code: "SUCCESS",
                    data: JSON.stringify(cartAdditionAck)
                }
            })
        } else {
            return NextResponse.json({
                ack: false,
                result: {
                    code: "ERROR",
                    data: JSON.stringify(cartAdditionAck)
                }
            })
        }
    } catch (err: any) {
        throw new Error(err)
    }
}
