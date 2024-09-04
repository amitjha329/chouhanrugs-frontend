import GoogleProvider from "next-auth/providers/google"
import { AuthenticationAdapter } from "@/lib/adapters/AuthenticationAdapter";
import clientPromise from "@/lib/mongodb/clientPromise";
import { AuthOptions } from "next-auth";
import Email from "next-auth/providers/email";
import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import Mail from "nodemailer/lib/mailer"
import path from "path"
import { stringNotEmptyOrNull } from "../utilities/stringEmptyOrNull";


const AuthOpts: AuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt"
    },
    adapter: AuthenticationAdapter(clientPromise),
    providers: [
        Email({
            type: "email",
            server: "",
            from: "",
            generateVerificationToken: async () => {
                return `${Math.floor(100000 + Math.random() * 900000)}`
            },
            sendVerificationRequest: async (params) => {
                const dbClient = await clientPromise
                const db = dbClient.db(process.env.MONGODB_DB)
                const emailData = await db.collection("site_data").findOne({ data_type: "emailData" })
                const siteData = await db.collection("site_data").findOne({ data_type: "siteData" })
                if (emailData != null && stringNotEmptyOrNull(emailData.smtpHost)) {
                    const mailer = nodemailer.createTransport({
                        host: emailData.smtpHost,
                        port: emailData.smtpPort,
                        secure: emailData.smtpPort == 465, // use TLS
                        auth: {
                            user: emailData.smtpUser,
                            pass: emailData.smtpPass,
                        },
                        tls: {
                            ciphers: 'SSLv3'
                        }
                    })
                    mailer.use('compile', hbs({
                        viewEngine: {
                            partialsDir: path.resolve("./templates/partial/"),
                            defaultLayout: undefined
                        },
                        viewPath: path.resolve('./templates/')
                    }))
                    mailer.sendMail({
                        from: `"${siteData?.title}" ${emailData.smtpUser}`,
                        to: params.identifier,
                        subject: `OTP for ${siteData?.title} Email Signin`,
                        template: "email_otp",
                        context: {
                            OTP: params.token,
                            SITE: siteData?.title ?? "",
                            LOGO: siteData?.logoSrc ?? ""
                        }
                    } as Mail.Options, (err, info) => {
                        err && console.log(err)
                        console.log(info)
                    })
                } else {
                    throw new Error("SMTP Not Configured.")
                }
            }
        }),
        GoogleProvider({
            allowDangerousEmailAccountLinking: true,
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
            authorization: "https://accounts.google.com/o/oauth2/v2/auth?" + new URLSearchParams({
                prompt: "consent",
                access_type: "offline",
                response_type: "code",
            }),
        })
    ],
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
            session.user = token.user as object
            return session
        },
        redirect({ baseUrl, url }) {
            return url
        }
    },
    pages: {
        signIn: "/signin",
        signOut: "/signup",

    },
}

export default AuthOpts