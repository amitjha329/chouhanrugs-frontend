import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const { auth } = NextAuth(authConfig)

// Middleware to add pathname header for all requests
export function middleware(req: NextRequest) {
    const response = NextResponse.next()
    response.headers.set('x-pathname', req.nextUrl.pathname)
    return response
}

// Auth middleware wrapper
const authMiddleware = auth((req) => {
    const token = req.auth
    const response = token ? NextResponse.next() : NextResponse.redirect(new URL(`/signin?cb=${req.nextUrl.pathname}`, req.url))
    
    // Add pathname to headers for use in layout
    response.headers.set('x-pathname', req.nextUrl.pathname)
    
    return response
})

// Export the appropriate middleware based on the route
export default function combinedMiddleware(req: NextRequest) {
    // Check if the route matches auth-protected routes
    const authRoutes = ['/user', '/order']
    const isAuthRoute = authRoutes.some(route => req.nextUrl.pathname.startsWith(route))
    
    if (isAuthRoute) {
        return authMiddleware(req, {} as any)
    }
    
    // For all other routes, just add the pathname header
    return middleware(req)
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|public).*)',
    ]
}