import { withAuth } from "next-auth/middleware"

export default withAuth({
    callbacks: {
        authorized: ({ token }) => {
            return token != null;
        }
    }
})

export const config = {
    matcher: [
        "/user/:path*",
        "/cart/:path*",
        "/order/:path*"
    ]
}