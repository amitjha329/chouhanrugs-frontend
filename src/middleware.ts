import { auth } from "@/auth"

export default auth()

export const config = {
    matcher: [
        "/user/:path*",
        "/cart/:path*",
        "/order/:path*"
    ]
}