'use client'
import { saveWhyShopWithUsForm } from '@/lib/actions/saveWhyShopWithUsForm'
import uploadImages from '@/lib/actions/uploadImages'
import WhyShopWithUsContent from '@/lib/types/WhyShopWithUsContent'
import stringEmptyOrNull from '@/lib/utilities/stringEmptyOrNull'
import onPageNotifications from '@/ui/common/onPageNotifications'
import { Editor } from '@tinymce/tinymce-react'
import Image from 'next/image'
import React, { useRef, useState, ChangeEvent } from 'react'
import TINY_MCE_KEY from '../../../../../tinymce.config'

const WhyShopWithUs = ({ data }: { data?: WhyShopWithUsContent }) => {
    const [sectionOneTitle, setSectiononeTitle] = useState<string>(data?.titleOne ?? "")
    const [imageOne, setImageOne] = useState<string>(data?.imageOne ?? "")
    const [sectionTwoTitle, setSectionTwoTitle] = useState<string>(data?.titleTwo ?? "")
    const [imageTwo, setImageTwo] = useState<string>(data?.imageTwo ?? "")
    const contentOne = useRef<any>(null)
    const contentTwo = useRef<any>(null)
    const handleIconUpload = (e: ChangeEvent<HTMLInputElement>, num: number) => {
        if (e.currentTarget.files != null) {
            const filesArray = Array.from(e.currentTarget.files)
            const data = new FormData()
            data.append("type", "shopByRoom")
            filesArray.forEach(item => {
                data.append("image", item)
            })
            uploadImages(data)
                .then(img => {
                    if (num == 1)
                        setImageOne(img[0].url)
                    else
                        setImageTwo(img[0].url)
                }).catch(err => console.log(err))
        }
        e.currentTarget.value = ""
    }
    return (
        <>
            <label className='input-group input-group-lg input-group-vertical'>
                <span>First Title</span>
                <input type="text" className='input input-bordered w-full' placeholder='Page Title' required onChange={e => setSectiononeTitle(e.currentTarget.value)} defaultValue={sectionOneTitle} />
            </label>
            <label className='input-group input-group-lg input-group-vertical'>
                <span>Image One</span>
                <input type="file" className='file-input file-input-bordered w-full' placeholder='Description' onChange={e => handleIconUpload(e, 1)} />
            </label>
            {
                imageOne && !stringEmptyOrNull(imageOne) && <Image src={imageOne} alt="" className='!w-40 !h-auto !relative' fill />
            }
            <label className='input-group input-group-lg input-group-vertical'>
                <span>First Content</span>
                <Editor
                    id='why_us_conten_one'
                    apiKey={TINY_MCE_KEY}
                    initialValue={data?.contentOne ?? ""}
                    onInit={(_, editor) => contentOne.current = editor}
                    init={{
                        menubar: true,
                        plugins: [
                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                        ],
                        toolbar: 'undo redo | blocks | ' +
                            'bold italic forecolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }} />
            </label>
            <label className='input-group input-group-lg input-group-vertical'>
                <span>Second Title</span>
                <input type="text" className='input input-bordered w-full' placeholder='Page Title' required onChange={e => setSectionTwoTitle(e.currentTarget.value)} defaultValue={sectionTwoTitle} />
            </label>
            <label className='input-group input-group-lg input-group-vertical'>
                <span>Image Two</span>
                <input type="file" className='file-input file-input-bordered w-full' placeholder='Description' onChange={e => handleIconUpload(e, 2)} />
            </label>
            {
                imageTwo && !stringEmptyOrNull(imageTwo) && <Image src={imageTwo} alt="" className='!w-40 !h-auto !relative' fill />
            }
            <label className='input-group input-group-lg input-group-vertical'>
                <span>Second Content</span>
                <Editor
                    id='why_us_conten_two'
                    apiKey={TINY_MCE_KEY}
                    initialValue={data?.contentTwo ?? ""}
                    onInit={(_, editor) => contentTwo.current = editor}
                    init={{
                        menubar: true,
                        plugins: [
                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                        ],
                        toolbar: 'undo redo | blocks | ' +
                            'bold italic forecolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }} />
            </label>
            <div className='card-actions justify-end'>
                <button className='btn btn-primary' onClick={() => {
                    saveWhyShopWithUsForm(sectionOneTitle, contentOne.current.getContent(), imageOne, sectionTwoTitle, contentTwo.current.getContent(), imageTwo).then(res => {
                        if (res.ack) {
                            onPageNotifications("success", "Content Updated.").then(() => {
                                window.location.reload()
                            }).catch(e => console.log(e))
                        } else {
                            console.log(res.result)
                        }
                    }).catch(err => console.log(err))
                }}>Save</button>
            </div>
        </>
    )
}

export default WhyShopWithUs