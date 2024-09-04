'use client'
import deleteImage from '@/lib/actions/deleteImage'
import saveSizeForm from '@/lib/actions/saveSizeForm'
import uploadImages from '@/lib/actions/uploadImages'
import ImageUploadResponse from '@/lib/types/ImageUploadResponse'
import SizeDataModel from '@/lib/types/SizeDataModel'
import stringEmptyOrNull from '@/lib/utilities/stringEmptyOrNull'
import onPageNotifications from '@/ui/common/onPageNotifications'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const SizeForm = ({ sizeData }: { sizeData: SizeDataModel }) => {
    const router = useRouter()
    const [sizeName, setSizeName] = useState(sizeData.name)
    const [sizeCode, setSizeCode] = useState(sizeData.sizeCode)
    const [sampleImage, setSampleImage] = useState<ImageUploadResponse>({
        imgName: "",
        url: sizeData.sizeBanner
    })
    const oldImage = sizeData.sizeBanner

    return (
        <>
            <div className="mt-2">
                <div className='form-control space-y-3' id='Size_form'>
                    <input defaultValue={sizeName} className='input input-bordered w-full' placeholder='Size Name' name='Size_name' onChange={e => setSizeName(e.currentTarget.value)} required />
                    <input defaultValue={sizeCode} className='input input-bordered w-full' placeholder='Size Code' name='Size_name' onChange={e => setSizeCode(e.currentTarget.value)} required />
                    <input type="file" className='file-input file-input-bordered w-full' placeholder='Size Code' name='Size_name' onChange={e => {
                        const fileList = e.currentTarget.files?.item(0)
                        if (fileList != null && fileList) {
                            const formData = new FormData()
                            formData.append("id", sizeData._id)
                            formData.append("type", "sizes")
                            formData.append("image", fileList)
                            uploadImages(formData).then(result => {
                                if (result[0].url != sampleImage.url && result[0].url != sizeData.sizeBanner && !stringEmptyOrNull(sizeData.sizeBanner))
                                    deleteImage(sampleImage.url)
                                setSampleImage(result[0])
                            }).catch(err => console.log(err))
                        }
                    }} required />
                    {!stringEmptyOrNull(sampleImage.url) && <Image src={sampleImage.url} alt={sizeName} width={100} height={100} className="mx-auto" />}
                </div>
            </div>
            <div className="mt-4 join">
                <button
                    type="submit"
                    className="join-item btn btn-outline"
                    onClick={e => {
                        saveSizeForm(sizeData._id, sizeName, sizeCode, sampleImage.url).then(res => {
                            if (res.ack) {
                                onPageNotifications("success", "Size Information Updated/Added").then(() => {
                                    if (sampleImage.url != sizeData.sizeBanner && !stringEmptyOrNull(sizeData.sizeBanner))
                                        deleteImage(oldImage).then(_ => router.back()).catch(err => console.log(err))
                                    else
                                        router.back()
                                    window.location.reload()
                                }).catch(err => console.log(err))
                            } else {
                                console.log(res.result)
                            }
                        }).catch(err => console.log(err))
                    }}
                >Update
                </button>
                <button
                    type="button"
                    className="join-item btn btn-outline btn-error"
                    onClick={_ => { router.back() }}
                >
                    Cancel
                </button>
            </div>
        </>
    )
}

export default SizeForm