import { withAuth } from "next-auth/middleware"

export default withAuth({
    callbacks: {
        authorized: ({ req, token }) => {
            const path = req.nextUrl.pathname;
            if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
                if (token && Array.isArray((token.user as { roles: string[] }).roles)) {
                    return (token.user as { roles: Array<string> }).roles.includes("admin")
                }
            }
            return token !== null;
        }
    }
})

export const config = {
    matcher: [
        "/user/:path*",
        "/admin/:path*",
        "/api/admin/:path*",
    ]
}