import { betterAuth } from 'better-auth'
import { mongodbAdapter } from '@better-auth/mongo-adapter'
import { emailOTP } from 'better-auth/plugins'
import { nextCookies } from 'better-auth/next-js'
import { MongoClient } from 'mongodb'
import { createTransport } from 'nodemailer'
import html from '../../templates/otp_email'

const client = new MongoClient(process.env.MONGODB!)
const db = client.db(process.env.MONGODB_DB)

export const auth = betterAuth({
    baseURL: process.env.AUTH_URL,
    secret: process.env.NEXTAUTH_SECRET,
    database: mongodbAdapter(db),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            prompt: 'consent',
            accessType: 'offline',
        },
    },
    user: {
        additionalFields: {
            roles: {
                type: 'string[]',
                defaultValue: ['user'],
                input: false,
            },
            registered: {
                type: 'date',
                defaultValue: new Date(),
                input: false,
            },
            number: {
                type: 'string',
                required: false,
            },
            cartCount: {
                type: 'number',
                required: false,
                input: false,
            },
        },
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60 * 24 * 30, // 30 days
        },
    },
    account: {
        accountLinking: {
            enabled: true,
        },
    },
    plugins: [
        emailOTP({
            otpLength: 6,
            expiresIn: 600, // 10 minutes
            async sendVerificationOTP({ email, otp, type }) {
                if (type !== 'sign-in') return

                const transport = createTransport({
                    host: process.env.EMAIL_SERVER_HOST,
                    port: Number(process.env.EMAIL_SERVER_PORT),
                    secure: Number(process.env.EMAIL_SERVER_PORT ?? 0) === 465,
                    auth: {
                        user: process.env.EMAIL_SERVER_USER,
                        pass: process.env.EMAIL_SERVER_PASSWORD,
                    },
                    tls: {
                        ciphers: 'SSLv3',
                        rejectUnauthorized: false,
                    },
                })

                await transport.sendMail({
                    to: email,
                    from: `Chouhan Rugs <${process.env.EMAIL_SERVER_USER}>`,
                    replyTo: process.env.EMAIL_SERVER_USER,
                    subject: 'OTP for Chouhan Rugs Email Signin',
                    html: html({ OTP: otp, SITE: 'Chouhan Rugs' }),
                    text: `OTP for Chouhan Rugs Email Signin is: ${otp}`,
                })
            },
        }),
        nextCookies(),
    ],
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    return {
                        data: {
                            ...user,
                            registered: new Date(),
                            roles: ['user'],
                        },
                    }
                },
            },
        },
    },
})

export type Session = typeof auth.$Infer.Session
export type User = Session['user']
