'use client'
import { saveFooterContentSections } from '@/lib/actions/saveFooterContentSections'
import onPageNotifications from '@/ui/common/onPageNotifications'
import { Editor } from '@tinymce/tinymce-react'
import React, { useRef, useState } from 'react'
import TINY_MCE_KEY from '../../../../../tinymce.config'

const FooterContentForm = ({ data, page }: { page: string, data?: FooterContentDataModel }) => {
    const footerShortContent = useRef<any>(null)
    const footerContent = useRef<any>(null)
    const [butttonText, setbutttonText] = useState(data?.buttonText ?? "")
    return (
        <>
            <label className='input-group input-group-lg input-group-vertical'>
                <span>Button text</span>
                <input type="text" className='input input-bordered w-full' placeholder='Page Title' required onChange={e => setbutttonText(e.currentTarget.value)} defaultValue={butttonText} />
            </label>
            <label className='input-group input-group-lg input-group-vertical'>
                <span>Footer Content</span>
                <Editor
                    id='footer_content'
                    apiKey={TINY_MCE_KEY}
                    initialValue={data?.content ?? ""}
                    onInit={(_, editor) => footerContent.current = editor}
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
                <span>Footer Short Content</span>
                <Editor
                    id='footer_short_content'
                    apiKey={TINY_MCE_KEY}
                    initialValue={data?.shortContent ?? ""}
                    onInit={(_, editor) => footerShortContent.current = editor}
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
                    saveFooterContentSections(page, footerContent.current.getContent(), butttonText, footerShortContent.current.getContent()).then(res => {
                        if (res.ack) {
                            onPageNotifications("success", "Footer Content Updated.").then(() => {
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

export default FooterContentForm