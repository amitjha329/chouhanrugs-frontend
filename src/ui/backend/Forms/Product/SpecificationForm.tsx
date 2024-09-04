'use client';
import saveProductSpecification from '@/lib/actions/saveProductSpecification';
import stringEmptyOrNull from '@/lib/utilities/stringEmptyOrNull';
import onPageNotifications from '@/ui/common/onPageNotifications';
import { Editor as TinyMceEditor } from '@tinymce/tinymce-react';
import { useRef, useEffect, useState, useReducer } from 'react'
import { BsDash } from 'react-icons/bs';
import TINY_MCE_KEY from '../../../../../tinymce.config';

type propType = {
    productId: string
    productLongDesc: string
    productShortDesc: string
    productHighlights: string[]
    productCareInstructions: string[]
}


const STRINGARRAYACTIONS = {
    ADD: "add",
    DELETE: "delete"
}
const SpecificationForm = ({ productId, productLongDesc, productShortDesc, productHighlights, productCareInstructions }: propType) => {
    const handleStringArrayChange = (state: string[], action: { type: string, index?: number }): string[] => {
        switch (action.type) {
            case STRINGARRAYACTIONS.ADD:
                return [...state, ""]
            case STRINGARRAYACTIONS.DELETE:
                return state.filter((_, i) => {
                    return i != action.index
                })
            default:
                return []
        }
    }
    const longDescriptionEditorRef = useRef<any>(null)
    const [highlights, setHighLights] = useReducer(handleStringArrayChange, productHighlights)
    const [careInstructions, setCareInstructions] = useReducer(handleStringArrayChange, productCareInstructions)
    const [productShortDescNew, setProductShortDescnew] = useState(productShortDesc)

    return (
        <div className='card card-bordered card-body shadow mb-5'>
            <div className='card-title'>Product Specification/Description</div>
            <label className='input-group input-group-lg input-group-vertical'>
                <span>Product Short Description</span>
                <input type="text" value={productShortDescNew} className='input input-bordered w-full' name="product_description_short" maxLength={155} placeholder="Product Short Description (Max: 155)" onChange={e => setProductShortDescnew(e.currentTarget.value)} required />
            </label>
            <label className='input-group input-group-lg input-group-vertical'>
                <span>Product Long Description</span>
                <TinyMceEditor
                    id='product_long_description_tinymce'
                    apiKey={TINY_MCE_KEY}
                    initialValue={productLongDesc}
                    onInit={(_, editor) => longDescriptionEditorRef.current = editor}
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
            <div className='card card-bordered card-body'>
                <div className='card-title'>Highlights</div>
                <div className='flex flex-col gap-y-3' >
                    {
                        highlights.map((highlight, index) => {
                            let count = index
                            return (
                                <div className='join join-horizontal' key={highlight + count}>
                                    <input type="text" defaultValue={highlight} maxLength={100} placeholder={`Enter Highlight ${index + 1}`} className='input input-bordered w-full highlights join-item' required />
                                    <div className='btn btn-error shrink-0 join-item' onClick={_ => setHighLights({ type: STRINGARRAYACTIONS.DELETE, index: index })}><BsDash /></div>
                                </div>
                            )
                        })
                    }
                    <div className='btn btn-outline' onClick={_ => setHighLights({ type: STRINGARRAYACTIONS.ADD })}>Add More</div>
                </div>
            </div>
            <div className='card card-bordered card-body'>
                <div className='card-title'>Care Instructions</div>
                <div className='flex flex-col gap-y-3' >
                    {
                        careInstructions.map((careInstruction, index) => {
                            let count = index
                            return (
                                <div className='join join-horizontal' key={careInstruction + count}>
                                    <input type="text" defaultValue={careInstruction} maxLength={100} placeholder={`Enter Care Instruction ${index + 1}`} className='input input-bordered w-full join-item careInstructions' required />
                                    <div className='btn btn-error shrink-0 join-item' onClick={_ => setCareInstructions({ type: STRINGARRAYACTIONS.DELETE, index: index })}><BsDash /></div>
                                </div>
                            )
                        })
                    }
                    <div className='btn btn-outline' onClick={_ => setCareInstructions({ type: STRINGARRAYACTIONS.ADD })}>Add More</div>
                </div>
            </div>
            <div className='card-actions justify-end'>
                <button className='btn btn-primary' onClick={() => {
                    const HighlightArray: string[] = []
                    const careInstArray: string[] = []
                    for (const element of Array.from(document.getElementsByClassName("highlights"))) {
                        const item = element as HTMLInputElement
                        !stringEmptyOrNull(item.value) && HighlightArray.push(item.value)
                    }
                    for (const element of Array.from(document.getElementsByClassName("careInstructions"))) {
                        const item = element as HTMLInputElement
                        !stringEmptyOrNull(item.value) && careInstArray.push(item.value)
                    }

                    saveProductSpecification(productId, longDescriptionEditorRef.current.getContent(), productShortDescNew, HighlightArray, careInstArray).then(res => {
                        if (res.ack) {
                            onPageNotifications("success", "General Information Updated")
                        } else {
                            console.log(res.result)
                        }
                    }).catch(err => console.log(err))
                }}>Save</button>
            </div>
        </div>
    )
}

export default SpecificationForm