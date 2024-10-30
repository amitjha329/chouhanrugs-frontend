import clientPromise from "@/lib/clientPromise"
import NextAuth from "next-auth"
import MongoDBAdapter from "./lib/authAdapter"
import authConfig from "./auth.config"

export const { auth, handlers, signIn, signOut } = NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login"
    },
    session: {
        strategy: "jwt"
    },
    experimental: {
        enableWebAuthn: true
    },
    adapter: MongoDBAdapter(clientPromise),
    jwt: {
        maxAge: 60 * 60 * 24 * 30
    },
    ...authConfig,
    callbacks: {
        async jwt({ token, user, account, profile, trigger, session }) {
            if (account && user) {
                return {
                    accessToken: account.access_token,
                    accessTokenExpires: Date.now() + (account.expires_at ?? 0) * 1000,
                    refreshToken: account.refresh_token,
                    user,
                }
            }
            if (trigger === "update") {
                session.name && ((token.user as { name: string }).name = session.name)
                session.image && ((token.user as { image: string }).image = session.image)
            }
            return token
        },
        async session({ session, token }) {
            session.user = token.user as any
            return session
        },
        redirect({ baseUrl, url }) {
            return url
        },
    }
})