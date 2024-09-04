'use client'
import AckResponse from '@/lib/types/AckResponse'
import axiosInstance from '@/lib/utilities/axiosInastances'
import onPageNotifications from '@/ui/common/onPageNotifications'
import Image from 'next/image'
import React, { FormEventHandler, useEffect, useState } from 'react'

type propsType = {
    logoSrc: string
}

const LogoForm = ({ logoSrc }: propsType) => {
    const [logoImage, setLogoImage] = useState<File | null | undefined>(undefined)
    const [logoObjectUrl, setLogoObjectUrl] = useState(logoSrc)
    const changeLogo: FormEventHandler = (event) => {
        event.preventDefault()
        if (logoSrc == logoObjectUrl) {
            onPageNotifications("warning", "No Change in logo detected.")
            console.log("No Change In Site Logo")
            return
        }
        const data = new FormData()
        logoImage && data.append("logo", logoImage)
        axiosInstance().post('/admin/cms/site/changelogo', data).then(({ data }: { data: AckResponse }) => {
            if (data.ack) {
                onPageNotifications("success", "Logo Update")
            } else {
                if (data.result.code == "NO_DATA") {
                    onPageNotifications("error", "Logo Update Failed, No Data Passed.")
                }
                onPageNotifications("error", "Check Log For Details.")
                console.error(data.result)
            }
        }).catch(err => {
            console.error(err)
            onPageNotifications("error", `Error: ${err.code}, Message: ${err.message}`)
        })
    }

    useEffect(() => {
        logoImage && setLogoObjectUrl(URL.createObjectURL(logoImage))
    }, [logoImage])
    return (
        <form id='site_logo' onSubmit={changeLogo}>
            <div className='card-body'>
                <div className='card-title'>Logo</div>
                <label className='join'>
                    <input type="file" className='file-input file-input-bordered join-item file:!btn file:!btn-ghost mr-3 ml-0 w-full' onChange={e => { setLogoImage(e.target.files?.item(0)) }} accept='.png' />
                    <figure className='h-auto w-32 relative join-item'>
                        <Image src={logoObjectUrl} alt="siteImage" fill />
                    </figure>
                </label>
                <div className='card-actions justify-end'>
                    <button type='submit' className='btn' form='site_logo'>Save</button>
                </div>
            </div>
        </form>
    )
}

export default LogoForm