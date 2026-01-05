import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const { auth } = NextAuth(authConfig)

// Protected routes that require authentication
const protectedRoutes = ['/user', '/order']

// Proxy to add pathname header for all requests
function addPathnameHeader(response: NextResponse, pathname: string) {
    response.headers.set('x-pathname', pathname)
    return response
}

// Auth proxy wrapper - checks authentication for protected routes
const authProxy = auth((req) => {
    const { auth: session, nextUrl } = req
    const isProtectedRoute = protectedRoutes.some(route => nextUrl.pathname.startsWith(route))
    
    // Redirect to signin if accessing protected route without authentication
    if (isProtectedRoute && !session) {
        const signinUrl = new URL('/signin', req.url)
        signinUrl.searchParams.set('cb', nextUrl.pathname)
        return NextResponse.redirect(signinUrl)
    }
    
    // Add pathname to headers for use in layout
    const response = NextResponse.next()
    return addPathnameHeader(response, nextUrl.pathname)
})

// Export the auth proxy as the default proxy handler
export default authProxy

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|public).*)',
    ]
}