'use client'
import deleteImage from '@/lib/actions/deleteImage'
import saveBrandForm from '@/lib/actions/saveBrandForm'
import uploadImages from '@/lib/actions/uploadImages'
import BrandDataModel from '@/lib/types/BrandDataModel'
import ImageUploadResponse from '@/lib/types/ImageUploadResponse'
import stringEmptyOrNull from '@/lib/utilities/stringEmptyOrNull'
import onPageNotifications from '@/ui/common/onPageNotifications'
import { Switch } from '@headlessui/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const BrandForm = ({ brandData }: { brandData: BrandDataModel }) => {
    const router = useRouter()
    const [brandsName, setBrandsName] = useState(brandData.name)
    const [brandsDescription, setBrandsDescription] = useState(brandData.description)
    const [brandImage, setbrandImage] = useState<ImageUploadResponse>({
        imgName: "",
        url: brandData.imgSrc
    })
    const [brandActive, setBrandActive] = useState(brandData.active)
    const [brandPopular, setBrandPopular] = useState(brandData.popular)
    return (
        <>
            <div className="mt-2">
                <div className='form-control space-y-3' id='brand_creation_form'>
                    <input className='input input-bordered w-full' placeholder='Brand Name' name='brand_name' required value={brandsName} onChange={e => setBrandsName(e.currentTarget.value)} />
                    <input className='input input-bordered w-full' placeholder='Brand Description' name='brand_desc' required value={brandsDescription} onChange={e => setBrandsDescription(e.currentTarget.value)} />
                    <input type="file" className='input input-bordered w-full file:!btn file:!btn-outline' placeholder='Brand Image' name='brand_img' onChange={e => {
                        const fileList = e.currentTarget.files?.item(0)
                        if (fileList != null && fileList) {
                            const formData = new FormData()
                            formData.append("id", brandData._id)
                            formData.append("type", "brands")
                            formData.append("image", fileList)
                            uploadImages(formData).then(result => {
                                if (result[0].url != brandImage.url && result[0].url != brandData.imgSrc && !stringEmptyOrNull(brandImage.url))
                                    deleteImage(brandImage.url)
                                setbrandImage(result[0])
                            }).catch(err => console.log(err))
                        }
                    }} />
                    {brandImage.url && <Image src={brandImage.url} alt={brandsName} height={100} width={100} className="aspect-1/1 mx-auto" />}
                    <div className='flex flex-row items-center justify-center space-x-5'>
                        <Switch.Group>
                            <div className="flex items-center">
                                <Switch.Label className="mr-3">Popular</Switch.Label>
                                <Switch
                                    checked={brandPopular}
                                    onChange={setBrandPopular}
                                    className={`${brandPopular ? 'bg-blue-600' : 'bg-gray-200'
                                        } relative inline-flex h-6 w-11 items-center rounded-full`}>
                                    <span
                                        className={`${brandPopular ? 'translate-x-6' : 'translate-x-1'
                                            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                    />
                                </Switch>
                            </div>
                        </Switch.Group>
                        <Switch.Group>
                            <div className="flex items-center">
                                <Switch.Label className="mr-3">Active</Switch.Label>
                                <Switch
                                    checked={brandActive}
                                    onChange={setBrandActive}
                                    className={`${brandActive ? 'bg-blue-600' : 'bg-gray-200'
                                        } relative inline-flex h-6 w-11 items-center rounded-full`}>
                                    <span
                                        className={`${brandActive ? 'translate-x-6' : 'translate-x-1'
                                            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                    />
                                </Switch>
                            </div>
                        </Switch.Group>
                    </div>
                </div>
            </div>
            <div className="mt-4 join">
                <button
                    type="submit"
                    className="btn btn-outline join-item"
                    onClick={e => {
                        saveBrandForm(brandData._id, brandsName, brandsDescription, brandPopular, brandActive, brandImage.url).then(res => {
                            if (res.ack) {
                                onPageNotifications("success", "Brand Information Updated/Added").then(() => {
                                    router.back()
                                }).catch(err => console.log(err))
                            } else {
                                console.log(res.result)
                            }
                        }).catch(err => console.log(err))
                    }}
                >
                    Update
                </button>
                <button
                    type="button"
                    className="btn btn-outline btn-error join-item"
                    onClick={_ => { router.back() }}
                >
                    Cancel
                </button>
            </div>
        </>
    )
}

export default BrandForm