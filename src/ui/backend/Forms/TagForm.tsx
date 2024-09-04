'use client'
import saveTagForm from '@/lib/actions/saveTagForm'
import TagDataModel from '@/lib/types/TagDataModel'
import onPageNotifications from '@/ui/common/onPageNotifications'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const TagForm = ({ tagData }: { tagData: TagDataModel }) => {
    const router = useRouter()
    const [tagname, settagname] = useState(tagData.name)
    const [tagdesc, settagdesc] = useState(tagData.description)
    return (
        <>
            <div className="mt-2">
                <div className='form-control space-y-3'>
                    <input className='input input-bordered w-full' placeholder='Tag Name' name='tag_name' defaultValue={tagname} onChange={e => settagname(e.currentTarget.value)} required />
                    <input className='input input-bordered w-full' placeholder='Tag Description' name='tag_desc' defaultValue={tagdesc} onChange={e => settagdesc(e.currentTarget.value)} required />
                </div>
            </div>
            <div className="mt-4 join">
                <button
                    type="submit"
                    className="join-item btn btn-outline"
                    onClick={e => {
                        saveTagForm(tagData._id, tagname, tagdesc).then(res => {
                            if (res.ack) {
                                onPageNotifications("success", "Tag Information Updated/Added").then(() => {
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
                    className="join-item btn btn-outline btn-error"
                    onClick={_ => { router.back() }}
                >
                    Cancel
                </button>
            </div>
        </>
    )
}

export default TagForm