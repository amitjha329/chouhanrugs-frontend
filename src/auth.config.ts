import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import Credential from "next-auth/providers/credentials"
import clientPromise from "./lib/clientPromise"
import { ObjectId } from "mongodb"
import { createHash } from "crypto"

export default {
    providers: [
        Credential({
            authorize: async (credentials) => {
                try {
                    if (!credentials.email || !credentials.tkId || !credentials.code) {
                        console.log("error in check is data is present")
                        return null
                    } else {
                        // const clientMongo = await clientPromise
                        // const db = clientMongo.db(process.env.MONGODB_DB)
                        // const collection = db.collection("verification_tokens")
                        // const collectionUsers = db.collection("users")
                        // const tokenDb = await collection.findOne({ _id: ObjectId.createFromHexString(credentials.tkId.toString()) })
                        // if (!tokenDb) {
                        //     console.log("error in check db token is present")
                        //     return null
                        // }
                        // const hashedCode = createHash('md5').update(`${credentials.code}`).digest('hex');
                        // if (hashedCode !== tokenDb.token) {
                        //     console.log("error in check if token matches")
                        //     return null
                        // }
                        // const user = await collectionUsers.findOne({ email: credentials.email })
                        // if (!user) {
                        //     const userNew = await collectionUsers.insertOne({
                        //         email: credentials.email,
                        //         emailVerified: new Date(),
                        //         roles: [
                        //             "user"
                        //         ],
                        //         cartCount: 0,
                        //         image: "",
                        //         name: "",
                        //         number: ""
                        //     })
                        //     return {
                        //         email: credentials.email,
                        //         id: userNew.insertedId.toHexString(),
                        //         name: "",
                        //         image: "",
                        //         roles: [
                        //             "user"
                        //         ],
                        //         cartCount: 0,
                        //         number: ""
                        //     }
                        // }
                        // return {
                        //     email: user.email,
                        //     id: user._id.toHexString(),
                        //     name: user.name,
                        //     image: user.image,
                        //     roles: user.roles,
                        //     cartCount: user.cartCount,
                        //     number: user.number
                        // }
                        return null
                    }
                } catch (error) {
                    console.log(error)
                    return null
                }
            },
            type: "credentials"
        })
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
        // })
        ,
        Google({
            allowDangerousEmailAccountLinking: true,
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: "https://accounts.google.com/o/oauth2/v2/auth?" + new URLSearchParams({
                prompt: "consent",
                access_type: "offline",
                response_type: "code",
            })
        })]
} satisfies NextAuthConfig