import clientPromise from "@/lib/clientPromise"
import { stringNotEmptyOrNull } from "@/lib/stringEmptyOrNull"
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Email from "next-auth/providers/nodemailer"
import { createTransport } from "nodemailer"
import MongoDBAdapter from "./lib/authAdapter"

export const { auth, handlers, signIn, signOut } = NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login"
    },
    session: {
        strategy: "jwt"
    },
    adapter: MongoDBAdapter(clientPromise),
    jwt: {
        maxAge: 60 * 60 * 24 * 30
    },
    providers: [
        Email({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: Number(process.env.EMAIL_SERVER_PORT),
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM,
            generateVerificationToken: async () => {
                return `${Math.floor(100000 + Math.random() * 900000)}`
            },
            sendVerificationRequest: async (params) => {
                if (process.env.SMTP_HOST != null && stringNotEmptyOrNull(process.env.SMTP_HOST)) {
                    const { identifier, token } = params
                    const transport = createTransport({
                        host: process.env.SMTP_HOST,
                        port: Number(process.env.SMTP_PORT),
                        secure: Number(process.env.SMTP_PORT ?? 0) == 465,
                        auth: {
                            user: process.env.SMTP_USER,
                            pass: process.env.SMTP_PASS,
                        },
                        tls: {
                            ciphers: 'SSLv3'
                        }
                    })
                    const result = await transport.sendMail({
                        to: identifier,
                        from: `Chouhan Rugs <${process.env.SMTP_USER}>`,
                        replyTo: process.env.SMTP_USER,
                        subject: `OTP for Chouhan Rugs Email Signin`,
                        html: html({
                            OTP: token,
                            SITE: "Chouhan Rugs",
                        }),
                        text: `OTP for Chouhan Rugs Email Signin is : ${token}`,
                    })
                    const rejected = result.rejected || []
                    const pending = result.pending || []
                    const failed = rejected.concat(pending).filter(Boolean)
                    if (failed.length) {
                        throw new Error(`Email (${failed.join(", ")}) could not be sent`)
                    }
                } else {
                    throw new Error("SMTP Not Configured.")
                }
            }
        }),
        Google({
            allowDangerousEmailAccountLinking: true,
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: "https://accounts.google.com/o/oauth2/v2/auth?" + new URLSearchParams({
                prompt: "consent",
                access_type: "offline",
                response_type: "code",
            })
        })
    ],
})