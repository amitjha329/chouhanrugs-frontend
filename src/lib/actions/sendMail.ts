"use server"
import Mail from 'nodemailer/lib/mailer'
import clientPromise from '@/lib/mongodb/clientPromise'
import { stringNotEmptyOrNull } from '@/lib/utilities/stringEmptyOrNull'
import {createTransport} from 'nodemailer'

export interface MailFormType {
    mailsSent: boolean
    error: boolean
}

export default async function sendMail(_: MailFormType, data: FormData): Promise<MailFormType> {
    const dbClient = await clientPromise
    const db = dbClient.db(process.env.MONGODB_DB)
    const emailData = await db.collection("site_data").findOne({ data_type: "emailData" })
    const siteData = await db.collection("site_data").findOne({ data_type: "siteData" })
    if (emailData != null && stringNotEmptyOrNull(emailData.smtpHost)) {
        const mailer = createTransport({
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
            bcc: data.get("to"),
            subject: data.get("subject"),
            html: await (data.get("msg") as File).text()
        } as Mail.Options, (err, info) => {
            err && console.log(err)
            console.log(info)
            return {
                error: false,
                mailsSent: false
            }
        })
    } else {
        return {
            error: true,
            mailsSent: false
        }
    }
    return _;
}