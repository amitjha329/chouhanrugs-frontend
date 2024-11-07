import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)
export default auth((req) => {
    const token = req.auth
    console.log("==================================>FROM MIDDLEWARE",token)
    if (token) {
        return NextResponse.next()
    }
    return NextResponse.redirect(new URL('/signin', req.url))
})

export const config = {
    matcher: [
        "/user/:path*",
        "/cart/:path*",
        "/order/:path*"
    ]
}