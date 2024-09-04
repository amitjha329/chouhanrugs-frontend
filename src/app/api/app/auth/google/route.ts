import { NextRequest, NextResponse } from "next/server";
import { Issuer } from "openid-client";

export async function GET(req: NextRequest) {
    const params = await req.nextUrl.searchParams
    const googleIssuer = await Issuer.discover("https://accounts.google.com");
    const client = new googleIssuer.Client({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!
    })
    const user = await client.userinfo(params.get("access_token")!,{
        method:"POST",
    })
    return NextResponse.json(user)
}