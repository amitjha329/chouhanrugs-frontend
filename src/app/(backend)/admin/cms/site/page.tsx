import getThemeData from '@/lib/actions/getThemeData'
import clientPromise from '@/lib/mongodb/clientPromise'
import SiteDataModel from '@/lib/types/SiteDataModel'
import LogoForm from '@/ui/backend/Forms/LogoForm'
import SiteContactDetailsForm from '@/ui/backend/Forms/SiteContactDetailsForm'
import SiteGeneralOptionsForm from '@/ui/backend/Forms/SiteGeneralOptionsForm'
import SocialMediaProfiles from '@/ui/backend/Forms/SocialMediaProfiles'
import ThemeForm from '@/ui/backend/Forms/ThemeForm'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
    title: 'Site Settings',
}

async function getSiteData(): Promise<SiteDataModel> {
    try {
        const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("site_data").findOne({ data_type: "siteData" })
        return JSON.parse(JSON.stringify(data)) as SiteDataModel
    } catch (error) {
        console.error(error)
        throw new Error(error?.toString())
    }
}

const SiteSettings = async () => {
    const siteData = await getSiteData()
    const themeData = await getThemeData()
    return (
        <>
            <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white'>
                <LogoForm logoSrc={siteData.logoSrc} />
            </div>
            <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white mt-6'>
                <SiteGeneralOptionsForm description={siteData.description} tag_line={siteData.tag_line} title={siteData.title} url={siteData.url} />
            </div>
            <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white mt-6'>
                <SocialMediaProfiles profiles={siteData.profiles ?? []} />
            </div>
            <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white mt-6'>
                <ThemeForm themeData={themeData} />
            </div>
            <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white mt-6'>
                <SiteContactDetailsForm PIN={siteData.contact_details.PIN} address1={siteData.contact_details.address1} address2={siteData.contact_details.address2} country={siteData.contact_details.country} emailAddress={siteData.contact_details.email} flat_house={siteData.contact_details.flat_house} phoneNum={siteData.contact_details.phone} state={siteData.contact_details.state} whatsappNum={siteData.contact_details.whatsapp} />
            </div>
        </>
    )
}

export default SiteSettings