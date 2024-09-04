import { decode } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const params = await req.json()
    const user = await decode({
        secret: process.env.NEXTAUTH_SECRET!,
        token: params.session
    })
    console.log(user);
    return NextResponse.json(user)
}