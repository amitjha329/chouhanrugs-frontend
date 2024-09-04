import AuthOpts from "@/lib/adapters/AuthOptions"
import clientPromise from "@/lib/mongodb/clientPromise"
import { hashToken } from "@/lib/utilities/hashToken"
import { NextRequest, NextResponse } from "next/server"
import { encode } from 'next-auth/jwt'

export async function POST(req: NextRequest) {
    const params = await req.json()
    const dbClient = await clientPromise
    const db = dbClient.db(process.env.MONGODB_DB)
    if (!params.token || !params.email) {
        return NextResponse.error()
    }
    const verification = await AuthOpts.adapter!.useVerificationToken!({
        token: hashToken(params.token),
        identifier: params.email
    })

    if (!verification || verification.expires.valueOf() < Date.now()) {
        return NextResponse.error()
    }

    const userProfile = (await AuthOpts.adapter!.getUserByEmail!(params.email)) ?? { id: params.email, email: params.email, emailVerified: null }

    const sessiontoken = await encode({
        token: {
            user: {
                ...userProfile
            }
        },
        secret: process.env.NEXTAUTH_SECRET!
    });
    return NextResponse.json({
        session: sessiontoken
    })
}