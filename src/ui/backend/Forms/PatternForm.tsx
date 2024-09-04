'use client'
import savePatternForm from '@/lib/actions/savePatternForm'
import PatternDataModel from '@/lib/types/PatternDataModel'
import onPageNotifications from '@/ui/common/onPageNotifications'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const PatternForm = ({ patternData }: { patternData: PatternDataModel }) => {
    const router = useRouter()
    const [shapeName, setshapeName] = useState(patternData.name)
    const [patternDescription, setPatternDescription] = useState(patternData.patternDescription)

    return (
        <>
            <div className="mt-2">
                <div className='form-control space-y-3' id='shape_form'>
                    <input defaultValue={shapeName} className='input input-bordered w-full' placeholder='shape Name' name='shape_name' onChange={e => setshapeName(e.currentTarget.value)} required />
                    <input defaultValue={patternDescription} className='input input-bordered w-full' placeholder='shape Code' name='shape_name' onChange={e => setPatternDescription(e.currentTarget.value)} required />
                </div>
            </div>
            <div className="mt-4 join">
                <button
                    type="submit"
                    className="join-item btn btn-outline"
                    onClick={e => {
                        savePatternForm(patternData._id, shapeName, patternDescription).then(res => {
                            if (res.ack) {
                                onPageNotifications("success", "Pattern Information Updated/Added").then(() => {
                                    router.back()
                                }).catch(err => console.log(err))
                            } else {
                                console.log(res.result)
                            }
                            window.location.reload()
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

export default PatternForm