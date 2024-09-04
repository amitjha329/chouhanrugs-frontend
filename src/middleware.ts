import { withAuth } from "next-auth/middleware"

export default withAuth({
    callbacks: {
        authorized: ({ req, token }) => {
            const path = req.nextUrl.pathname;
            const mainAdminPath = path.startsWith("/admin")
            const editorPaths = path.startsWith("/admin/cms")
            const listerPaths = path.startsWith("/admin/products") || path.startsWith("/admin/categories") || path.startsWith("/admin/tags") || path.startsWith("/admin/brands")
            if (token != null) {
                const adminAccess = (token.user as { roles: string[] }).roles.includes("admin")
                const editorAccess = (token.user as { roles: string[] }).roles.includes("editor")
                const listerAccess = (token.user as { roles: string[] }).roles.includes("lister")
                if (Array.isArray((token.user as { roles: string[] }).roles)) {
                    if (editorPaths) {
                        return editorAccess || adminAccess
                    } else if (listerPaths) {
                        return listerAccess || adminAccess
                    } else if (mainAdminPath) {
                        return adminAccess
                    }
                }
            }
            return token != null;
        }
    }
})

export const config = {
    matcher: [
        "/user/:path*",
        "/admin/:path*",
        "/cart/:path*",
        "/order/:path*"
    ]
}