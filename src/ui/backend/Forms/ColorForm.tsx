'use client'
import deleteImage from '@/lib/actions/deleteImage'
import saveColorForm from '@/lib/actions/saveColorForm'
import uploadImages from '@/lib/actions/uploadImages'
import ColorDataModel from '@/lib/types/ColorDataModel'
import ImageUploadResponse from '@/lib/types/ImageUploadResponse'
import stringEmptyOrNull from '@/lib/utilities/stringEmptyOrNull'
import onPageNotifications from '@/ui/common/onPageNotifications'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { SketchPicker } from 'react-color'

const ColorForm = ({ colorData }: { colorData: ColorDataModel }) => {
    const router = useRouter()
    const [sampleImage, setSampleImage] = useState<ImageUploadResponse>({
        imgName: "",
        url: colorData.sampleImg
    })
    const oldImage = colorData.sampleImg
    const [colorName, setColorName] = useState(colorData.name)
    const [colorCode, setColorCode] = useState<any>(colorData.colorCode)
    return (
        <>
            <div className="mt-2">
                <div className='form-control space-y-3' id='color_form' onSubmit={e => { }}>
                    <input defaultValue={colorName} className='input input-bordered w-full' placeholder='Color Name' name='color_name' onChange={e => setColorName(e.currentTarget.value)} required />
                    <span className='text-sm font-bold opacity-70'>Please Select Color Below:</span>
                    <SketchPicker disableAlpha={true} color={colorCode} onChangeComplete={setColorCode} className="mx-auto" />
                    <span className='text-sm font-bold opacity-70'>Please Select Sample Image:</span>
                    <input type="file" className='file-input file-input-bordered w-full' placeholder='Color Name' name='color_name' onChange={e => {
                        const fileList = e.currentTarget.files?.item(0)
                        if (fileList != null && fileList) {
                            const formData = new FormData()
                            formData.append("id", colorData._id)
                            formData.append("type", "colors")
                            formData.append("image", fileList)
                            uploadImages(formData).then(result => {
                                if (result[0].url != sampleImage.url && result[0].url != colorData.sampleImg && !stringEmptyOrNull(colorData.sampleImg))
                                    deleteImage(sampleImage.url)
                                setSampleImage(result[0])
                            }).catch(err => console.log(err))
                        }
                    }} required />
                    {!stringEmptyOrNull(sampleImage.url) && <Image src={sampleImage.url} alt={colorName} height={100} width={100} className="aspect-1/1 mx-auto" />}
                </div>
            </div>
            <div className="mt-4 join">
                <button
                    type="submit"
                    className="join-item btn btn-outline"
                    onClick={e => {
                        saveColorForm(colorData._id, colorName, colorCode, sampleImage.url).then(res => {
                            if (res.ack) {
                                onPageNotifications("success", "Color Information Updated/Added").then(() => {
                                    if (sampleImage.url != colorData.sampleImg && !stringEmptyOrNull(colorData.sampleImg))
                                        deleteImage(oldImage).then(_ => router.back()).catch(err => console.log(err))
                                    else
                                        router.back()
                                }).catch(err => console.log(err))
                            } else {
                                console.log(res.result)
                            }
                        }).catch(err => console.log(err))
                    }}
                >Update</button>
                <button
                    type="button"
                    className="join-item btn btn-outline btn-error"
                    onClick={() => { router.back() }}
                >
                    Cancel
                </button>
            </div >
        </>
    )
}

export default ColorForm