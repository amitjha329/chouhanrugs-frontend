import clientPromise from "@/lib/mongodb/clientPromise";
import { stringNotEmptyOrNull } from "@/lib/utilities/stringEmptyOrNull";
import { NextRequest, NextResponse } from "next/server";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import nodemailer from 'nodemailer';
import Mail from "nodemailer/lib/mailer";
import { hashToken } from "@/lib/utilities/hashToken";
import AuthOpts from "@/lib/adapters/AuthOptions";

export async function POST(req: NextRequest) {
    const params = await req.json()
    const dbClient = await clientPromise
    const db = dbClient.db(process.env.MONGODB_DB)
    const emailData = await db.collection("site_data").findOne({ data_type: "emailData" })
    const siteData = await db.collection("site_data").findOne({ data_type: "siteData" })
    const ONE_DAY_IN_SECONDS = 86400
    const expires = new Date(
        Date.now() + (ONE_DAY_IN_SECONDS) * 1000
    )
    const token = `${Math.floor(100000 + Math.random() * 900000)}`;
    const hashedToken = hashToken(token)
    await AuthOpts.adapter!.createVerificationToken!({
        expires,
        identifier: params.email,
        token: hashedToken
    })
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
                defaultLayout: undefined,
            },
            viewPath: path.resolve('./templates/')
        }))
        mailer.sendMail({
            from: `"${siteData?.title}" ${emailData.smtpUser}`,
            to: params.email,
            subject: `OTP for ${siteData?.title} Email Signin`,
            template: "email_otp",
            context: {
                OTP: token,
                SITE: siteData?.title ?? "",
                LOGO: siteData?.logoSrc ?? ""
            }
        } as Mail.Options, (err, info) => {
            err && console.log(err)
            console.log(info)
        })
        return new NextResponse();
    } else {
        throw new Error("SMTP Not Configured.")
    }
}