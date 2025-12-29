import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const { auth } = NextAuth(authConfig)

// Proxy to add pathname header for all requests
export function proxy(req: NextRequest) {
    const response = NextResponse.next()
    response.headers.set('x-pathname', req.nextUrl.pathname)
    return response
}

// Auth proxy wrapper
const authProxy = auth((req) => {
    const token = req.auth
    const response = token ? NextResponse.next() : NextResponse.redirect(new URL(`/signin?cb=${req.nextUrl.pathname}`, req.url))
    
    // Add pathname to headers for use in layout
    response.headers.set('x-pathname', req.nextUrl.pathname)
    
    return response
})

// Export the appropriate proxy based on the route
export default function combinedProxy(req: NextRequest) {
    // Check if the route matches auth-protected routes
    const authRoutes = ['/user', '/order']
    const isAuthRoute = authRoutes.some(route => req.nextUrl.pathname.startsWith(route))
    
    if (isAuthRoute) {
        return authProxy(req, {} as any)
    }
    
    // For all other routes, just add the pathname header
    return proxy(req)
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|public).*)',
    ]
}