import React from 'react'
import CDNConfigurationForm from '@/ui/backend/Forms/CDNConfigurationForm'
import EmailConfigForm from '@/ui/backend/Forms/EmailConfigForm'
import clientPromise from '@/lib/mongodb/clientPromise'
import { Metadata } from 'next'
import EmailConfigDataModel from '@/lib/types/EmailConfigDataModel'

export const metadata: Metadata = {
    title: 'Core Configuration',
}

async function getCDNConfiguration(): Promise<{ _id: string, data_type: string, url: string }> {
    const mongoClient = await clientPromise
    const collectionBranches = mongoClient.db(process.env.MONGODB_DB).collection("site_data")
    const result = await collectionBranches.findOne({ data_type: "cdnData" })
    return result?._id ? result as unknown as { _id: string, data_type: string, url: string } : { _id: "", data_type: "", url: "" }
}

async function getEmailConfiguration(): Promise<EmailConfigDataModel> {
    const mongoClient = await clientPromise
    const collectionBranches = mongoClient.db(process.env.MONGODB_DB).collection("site_data")
    const result = await collectionBranches.findOne({ data_type: "emailData" })
    return result?._id ? result as unknown as EmailConfigDataModel : { smtpHost: "", smtpPass: "", smtpPort: 0, smtpUser: "", data_type: "", _id: "" }
}

const CoreSettignsPage = async () => {
    const cdnData = await getCDNConfiguration()
    const emailData = await getEmailConfiguration()
    return (
        <>
            <div className='text-error border border-error mb-4 text-center font-semibold text-2xl'>Warning: Only Change These Configuration if you are sure and know what you are doing. Any bad configuration may render site unresponsive or problems may arise.</div>
            <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white'>
                <CDNConfigurationForm CDN_URL={cdnData.url} />
            </div>

            <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white mt-6'>
                <EmailConfigForm HOST={emailData.smtpHost} PASS="" PORT={emailData.smtpPort} USER={emailData.smtpUser} />
            </div>
        </>
    )
}

export default CoreSettignsPage