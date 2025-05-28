"use server"
import { createTransport } from "nodemailer"
import html from "../../../templates/otp_email";
import clientPromise from "@/lib/clientPromise";
import { createHash } from 'crypto';

export default async function sendOtp(params: {
    to: string;
}) {
    try {
        const { to } = params
        const token = Math.floor(100000 + Math.random() * 900000)
        const transport = createTransport({
            host: process.env.EMAIL_SERVER_HOST,
            port: Number(process.env.EMAIL_SERVER_PORT),
            secure: Number(process.env.EMAIL_SERVER_PORT ?? 0) == 465,
            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
            },
            tls: {
                ciphers: 'SSLv3'
            }
        })
        const hashedToken = createHash('md5').update(`${token}`).digest('hex');
        const result = await transport.sendMail({
            to: to,
            from: `Chouhan Rugs <${process.env.EMAIL_SERVER_USER}>`,
            replyTo: process.env.EMAIL_SERVER_USER,
            subject: `OTP for Chouhan Rugs Email Signin`,
            html: html({
                OTP: token.toString(),
                SITE: "Chouhan Rugs",
            }),
            text: `OTP for Chouhan Rugs Email Signin is : ${token}`,
        })
        const tokenId = await (await clientPromise).db('ecom').collection('verification_tokens').insertOne({
            identifier: to,
            token: hashedToken,
            expires: new Date()
        })
        const rejected = result.rejected || []
        const pending = result.pending || []
        const failed = rejected.concat(pending).filter(Boolean)
        if (failed.length) {
            return false
        } else {
            return tokenId.insertedId.toHexString()
        }
    } catch (error) {
        console.error('Error in sendOtp:', error);
        return false;
    }
}