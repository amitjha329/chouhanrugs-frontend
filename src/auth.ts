import clientPromise from "@/lib/clientPromise"
import { stringNotEmptyOrNull } from "@/lib/stringEmptyOrNull"
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Email from "next-auth/providers/nodemailer"
import { createTransport } from "nodemailer"
import { renderFile } from "pug"
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
    providers: [
        Email({
            generateVerificationToken: async () => {
                return `${Math.floor(100000 + Math.random() * 900000)}`
            },
            sendVerificationRequest: async (params) => {
                const dbClient = await clientPromise
                const db = dbClient.db(process.env.MONGODB_DB)
                const emailData = await db.collection("site_data").findOne({ data_type: "emailData" })
                const siteData = await db.collection("site_data").findOne({ data_type: "siteData" })
                if (emailData != null && stringNotEmptyOrNull(emailData.smtpHost)) {
                    const { identifier, url, provider } = params
                    const { host } = new URL(url)
                    const transport = createTransport({
                        host: emailData.smtpHost,
                        port: emailData.smtpPort,
                        secure: emailData.smtpPort == 465,
                        auth: {
                            user: emailData.smtpUser,
                            pass: emailData.smtpPass,
                        },
                        tls: {
                            ciphers: 'SSLv3'
                        }
                    })
                    const result = await transport.sendMail({
                        to: identifier,
                        from: `"${siteData?.title}" ${emailData.smtpUser}`,
                        subject: `OTP for ${siteData?.title} Email Signin`,
                        html: renderFile('templates/email_otp.pug', {
                            OTP: params.token,
                            SITE: siteData?.title ?? ""
                        }),
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