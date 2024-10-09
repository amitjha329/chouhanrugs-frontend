import { auth } from "@/auth"
 
export default auth((req) => {
})

export const config = {
    matcher: [
        "/user/:path*",
        "/cart/:path*",
        "/order/:path*"
    ]
}