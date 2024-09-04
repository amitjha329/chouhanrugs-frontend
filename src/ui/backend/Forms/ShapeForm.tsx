'use client'
import saveShapeForm from '@/lib/actions/saveShapeForm'
import ShapeDataModel from '@/lib/types/ShapeDataModel'
import onPageNotifications from '@/ui/common/onPageNotifications'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const ShapeForm = ({ shapeData }: { shapeData: ShapeDataModel }) => {
    const router = useRouter()
    const [patternName, setpatternName] = useState(shapeData.name)
    const [shapeDescription, setpatternDesc] = useState(shapeData.shapeDescription)

    return (
        <>
            <div className="mt-2">
                <div className='form-control space-y-3' id='pattern_form'>
                    <input defaultValue={patternName} className='input input-bordered w-full' placeholder='pattern Name' name='pattern_name' onChange={e => setpatternName(e.currentTarget.value)} required />
                    <input defaultValue={shapeDescription} className='input input-bordered w-full' placeholder='pattern Code' name='pattern_name' onChange={e => setpatternDesc(e.currentTarget.value)} required />
                </div>
            </div>
            <div className="mt-4 join">
                <button
                    type="submit"
                    className="join-item btn btn-outline"
                    onClick={e => {
                        saveShapeForm(shapeData._id, patternName, shapeDescription).then(res => {
                            if (res.ack) {
                                onPageNotifications("success", "Shape Information Updated/Added").then(() => {
                                    router.back()
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

export default ShapeForm