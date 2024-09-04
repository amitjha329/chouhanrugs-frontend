import clientPromise from "@/lib/mongodb/clientPromise";
import { stringNotEmptyOrNull } from "@/lib/utilities/stringEmptyOrNull";
import nodemailer from 'nodemailer'
import { NextRequest, NextResponse } from "next/server";
import Mail from "nodemailer/lib/mailer";

export async function POST(req: NextRequest) {
    const dbClient = await clientPromise
    const db = dbClient.db(process.env.MONGODB_DB)
    const emailData = await db.collection("site_data").findOne({ data_type: "emailData" })
    const siteData = await db.collection("site_data").findOne({ data_type: "siteData" })
    const body = await req.formData()
    console.log(body)
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
        mailer.sendMail({
            from: `"${siteData?.title}" ${emailData.smtpUser}`,
            to: "sales@chouhanrugs.com",
            bcc:body.get("to"),
            subject: body.get("subject"),
            html: await (body.get("msg") as File).text()
        } as Mail.Options, (err, info) => {
            err && console.log(err)
            console.log(info)
            return NextResponse.json(info)
        })
        return new NextResponse(await (body.get("msg") as File).text())
    } else {
        return NextResponse.error()
    }
}