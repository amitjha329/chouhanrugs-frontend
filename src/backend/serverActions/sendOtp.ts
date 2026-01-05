"use server"
import { createTransport } from "nodemailer"
import html from "../../../templates/otp_email";
import clientPromise from "@/lib/clientPromise";
import { createHash } from 'crypto';

export default async function sendOtp(params: {
    to: string;
}): Promise<string | false> {
    try {
        const { to } = params;
        
        // Validate email
        if (!to || !to.includes('@')) {
            console.error('Invalid email address provided');
            return false;
        }
        
        const token = Math.floor(100000 + Math.random() * 900000);
        
        // Check if SMTP is configured
        if (!process.env.EMAIL_SERVER_HOST || !process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
            console.error('Email server not configured. Please check environment variables.');
            return false;
        }
        
        const transport = createTransport({
            host: process.env.EMAIL_SERVER_HOST,
            port: Number(process.env.EMAIL_SERVER_PORT),
            secure: Number(process.env.EMAIL_SERVER_PORT ?? 0) == 465,
            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
            },
            tls: {
                ciphers: 'SSLv3',
                rejectUnauthorized: false // Add this to handle self-signed certificates
            }
        });
        
        // Verify SMTP connection
        try {
            await transport.verify();
        } catch (verifyError) {
            console.error('SMTP connection verification failed:', verifyError);
            return false;
        }
        
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
        });
        
        const tokenId = await (await clientPromise).db('ecom').collection('verification_tokens').insertOne({
            identifier: to,
            token: hashedToken,
            expires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry
        });
        
        const rejected = result.rejected || [];
        const pending = result.pending || [];
        const failed = rejected.concat(pending).filter(Boolean);
        
        if (failed.length) {
            console.error('Failed to send email to:', failed);
            return false;
        } else {
            console.log('OTP sent successfully to:', to);
            return tokenId.insertedId.toHexString();
        }
    } catch (error) {
        console.error('Error in sendOtp:', error);
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        return false;
    }
}