'use client'
import AckResponse from '@/lib/types/AckResponse'
import axiosInstance from '@/lib/utilities/axiosInastances'
import onPageNotifications from '@/ui/common/onPageNotifications'
import React, { FormEventHandler, useState } from 'react'

type propsTypes = {
    title: string,
    description: string,
    tag_line: string,
    url: string
}

const SiteGeneralOptionsForm = ({ description, tag_line, title, url }: propsTypes) => {
    const [siteName, setSiteName] = useState(title)
    const [siteDesc, setSiteDesc] = useState(description)
    const [siteTagline, setSiteTagline] = useState(tag_line)
    const [siteUrl, setSiteUrl] = useState(url)
    const saveSiteGeneral: FormEventHandler = (event) => {
        event.preventDefault()
        axiosInstance().post('/admin/cms/site/generaloptionsupdate', {
            sitedata: {
                ...(siteName != title) && { name: siteName },
                ...(siteDesc != description) && { description: siteDesc },
                ...(siteTagline != tag_line) && { tag_line: siteTagline },
                ...(siteUrl != url) && { url: siteUrl }
            }
        }).then(({ data }: { data: AckResponse }) => {
            if (data.ack) {
                onPageNotifications("success", "Site Details Updated")
            } else {
                if (data.result.code == "NO_DATA") {
                    onPageNotifications("error", "Site Details Update Failed, No Data Passed.")
                }
                onPageNotifications("error", "Check Log For Details.")
                console.error(data.result)
            }
        }).catch(err => {
            console.error(err)
            onPageNotifications("error", `Error: ${err.code}, Message: ${err.message}`)
        })
    }
    return (
        <form id='site_general' onSubmit={saveSiteGeneral}>
            <div className='card-body'>
                <div className='card-title'>General</div>
                <label className='join join-vertical'>
                    <span className='p-3 bg-gray-200 join-item'>Site Name</span>
                    <input type="text" className='join-item input input-bordered' required onChange={e => setSiteName(e.currentTarget.value)} value={siteName} />
                </label>
                <label className='join join-vertical'>
                    <span className='p-3 bg-gray-200 join-item'>Site Description</span>
                    <input type="text" className='join-item input input-bordered' required onChange={e => setSiteDesc(e.currentTarget.value)} value={siteDesc} />
                </label>
                <label className='join join-vertical'>
                    <span className='p-3 bg-gray-200 join-item'>Site Tagline</span>
                    <input type="text" className='join-item input input-bordered' required onChange={e => setSiteTagline(e.currentTarget.value)} value={siteTagline} />
                </label>
                <label className='join join-vertical'>
                    <span className='p-3 bg-gray-200 join-item'>Site URL</span>
                    <input type="text" className='join-item input input-bordered' required onChange={e => setSiteUrl(e.currentTarget.value)} value={siteUrl} />
                </label>
                <div className='card-actions justify-end'>
                    <button type='submit' className='btn' form='site_general'>Save</button>
                </div>
            </div>
        </form>
    )
}

export default SiteGeneralOptionsForm