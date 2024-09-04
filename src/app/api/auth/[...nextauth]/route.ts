import AuthOpts from "@/lib/adapters/AuthOptions";
import NextAuth from "next-auth/next";

const handler = NextAuth(AuthOpts)

export { handler as GET, handler as POST }