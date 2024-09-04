'use client'
import saveAddSlideForm from '@/lib/actions/saveAddSlideForm'
import uploadImages from '@/lib/actions/uploadImages'
import ImageUploadResponse from '@/lib/types/ImageUploadResponse'
import onPageNotifications from '@/ui/common/onPageNotifications'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { ChangeEventHandler, useState } from 'react'

const SliderSlideForm = ({ slideId }: { slideId: string }) => {
    const router = useRouter()
    const [title, settitle] = useState("")
    const [heading, setheading] = useState("")
    const [description, setdescription] = useState("")
    const [image, setimage] = useState<ImageUploadResponse>({
        imgName: "",
        url: ""
    })

    const handleImageAdd: ChangeEventHandler<HTMLInputElement> = (e) => {
        if (e.currentTarget.files != null) {
            const filesArray = Array.from(e.currentTarget.files)
            const data = new FormData()
            data.append("id", slideId.toString())
            data.append("type", "slider")
            filesArray.forEach(item => {
                data.append("image", item)
            })
            uploadImages(data)
                .then(img => {
                    setimage(img[0])
                }).catch(err => console.log(err))
        }
        e.currentTarget.value = ""
    }

    return (
        <div className="card-body">
            <label className='input-group input-group-lg input-group-vertical'>
                <span>Slider Title</span>
                <input type="text" value={title} className='input input-bordered w-full' name="product_name" placeholder='Name' required onChange={e => { settitle(e.currentTarget.value) }} />
            </label>
            <label className='input-group input-group-lg input-group-vertical'>
                <span>Slider Heading</span>
                <input type="text" value={heading} className='input input-bordered w-full' name="product_name" placeholder='Name' required onChange={e => { setheading(e.currentTarget.value) }} />
            </label>
            <label className='input-group input-group-lg input-group-vertical'>
                <span>Slider Description</span>
                <input type="text" value={description} className='input input-bordered w-full' name="product_name" placeholder='Name' required onChange={e => { setdescription(e.currentTarget.value) }} />
            </label>
            <input type="file" className='file-input file-input-bordered w-full' onChange={handleImageAdd} />
            <div className='realtive h-28 w-full'>
                <Image src={image.url} alt={title} className="!relative !h-full !w-auto mx-auto" fill />
            </div>
            <div className='btn btn-error' onClick={() => {
                saveAddSlideForm(slideId, title, heading, description, image.url).then(res => {
                    if (res.ack) {
                        onPageNotifications("success", "Slide Added").then(() => {
                            router.back()
                        })
                    } else {
                        console.log(res.result)
                    }
                }).catch(err => console.log(err))
            }}>Add</div>
        </div>
    )
}

export default SliderSlideForm