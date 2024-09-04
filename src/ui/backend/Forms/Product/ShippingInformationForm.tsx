'use client';
import React, { useRef } from 'react'
import { Editor as TinyMceEditor } from '@tinymce/tinymce-react';
import onPageNotifications from '@/ui/common/onPageNotifications';
import saveProductShippingInformation from '@/lib/actions/saveProductShippingInformation';
import TINY_MCE_KEY from '../../../../../tinymce.config';

type proptype = {
    productId: string
    productShippingInfo: string
}

const ShippingInformationForm = ({ productId, productShippingInfo }: proptype) => {
    const shippingDetailsEditorRef = useRef<any>(null)
    return (
        <div className='card card-body card-bordered shadow-md mb-5'>
            <div className='card-title'>Product Shipping</div>
            <label className='input-group input-group-lg input-group-vertical'>
                <span>Product Shipping Information</span>
                <TinyMceEditor
                    id='shipping_info_tinymce'
                    apiKey={TINY_MCE_KEY}
                    initialValue={productShippingInfo}
                    onInit={(_, editor) => shippingDetailsEditorRef.current = editor}
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
                    saveProductShippingInformation(productId, shippingDetailsEditorRef.current.getContent()).then(res => {
                        if (res.ack) {
                            onPageNotifications("success", "Shipping Information Updated")
                        } else {
                            console.log(res.result)
                        }
                    }).catch(err => console.log(err))
                }}>Save</button>
            </div>
        </div>
    )
}

export default ShippingInformationForm