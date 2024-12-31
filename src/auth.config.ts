import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import Credential from "next-auth/providers/credentials"

export default {
    // trustHost:true,
    providers: [
        Credential({
            authorize: async (credentials) => {
                try {
                    if (!credentials.email || !credentials.tkId || !credentials.code) {
                        console.log("error in check is data is present")
                        return null
                    } else {
                        const tokenDbREs = await fetch(process.env.AUTH_URL + '/api/mwHandler', {
                            method: "POST",
                            body: JSON.stringify({
                                action: "getTokenDB",
                                credentials
                            })
                        })
                        const tokenDb = await tokenDbREs.json()
                        if (!tokenDb) {
                            console.log("error in check db token is present")
                            return null
                        }
                        const crypto = await require('crypto');
                        const hashedCode = crypto.createHash('md5').update(`${credentials.code}`).digest('hex');
                        console.log(hashedCode, tokenDb)
                        if (hashedCode !== tokenDb.token) {
                            console.log("error in check if token matches")
                            return null
                        }
                        const userres = await fetch(process.env.AUTH_URL + '/api/mwHandler', {
                            method: "POST",
                            body: JSON.stringify({
                                action: "getUserMiddleWare",
                                credentials
                            })
                        })
                        const user = await userres.json()
                        console.log(user,"===============================")
                        return {
                            email: user.email,
                            id: user._id,
                            name: user.name,
                            image: user.image,
                            roles: user.roles,
                            cartCount: user.cartCount,
                            number: user.number
                        }
                    }
                } catch (error) {
                    console.log(error)
                    return null
                }
            },
            type: "credentials"
        }),
        // Nodemailer({
        //     server: {
        //         host: process.env.EMAIL_SERVER_HOST,
        //         port: Number(process.env.EMAIL_SERVER_PORT),
        //         auth: {
        //             user: process.env.EMAIL_SERVER_USER,
        //             pass: process.env.EMAIL_SERVER_PASSWORD,
        //         },
        //     },
        //     from: process.env.EMAIL_FROM,
        //     generateVerificationToken: async () => {
        //         return `${Math.floor(100000 + Math.random() * 900000)}`
        //     },
        //     sendVerificationRequest: async (params) => {
        //         if (process.env.SMTP_HOST != null && stringNotEmptyOrNull(process.env.SMTP_HOST)) {
        //             const { identifier, token } = params
        //             const transport = createTransport({
        //                 host: process.env.SMTP_HOST,
        //                 port: Number(process.env.SMTP_PORT),
        //                 secure: Number(process.env.SMTP_PORT ?? 0) == 465,
        //                 auth: {
        //                     user: process.env.SMTP_USER,
        //                     pass: process.env.SMTP_PASS,
        //                 },
        //                 tls: {
        //                     ciphers: 'SSLv3'
        //                 }
        //             })
        //             const result = await transport.sendMail({
        //                 to: identifier,
        //                 from: `Chouhan Rugs <${process.env.SMTP_USER}>`,
        //                 replyTo: process.env.SMTP_USER,
        //                 subject: `OTP for Chouhan Rugs Email Signin`,
        //                 html: html({
        //                     OTP: token,
        //                     SITE: "Chouhan Rugs",
        //                 }),
        //                 text: `OTP for Chouhan Rugs Email Signin is : ${token}`,
        //             })
        //             const rejected = result.rejected || []
        //             const pending = result.pending || []
        //             const failed = rejected.concat(pending).filter(Boolean)
        //             if (failed.length) {
        //                 throw new Error(`Email (${failed.join(", ")}) could not be sent`)
        //             }
        //         } else {
        //             throw new Error("SMTP Not Configured.")
        //         }
        //     }
        // }),
        Google({
            allowDangerousEmailAccountLinking: true,
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        })]
} satisfies NextAuthConfig