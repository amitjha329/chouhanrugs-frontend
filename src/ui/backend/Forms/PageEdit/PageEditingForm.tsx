'use client'
import savePageEditForm from '@/lib/actions/savePageEditForm'
import PageMetaDataModel from '@/lib/types/PageMetaDataModel'
import capitalize from '@/lib/utilities/capitalize'
import onPageNotifications from '@/ui/common/onPageNotifications'
import { Switch } from '@headlessui/react'
import React, { FormEventHandler, useState } from 'react'

const PageEditingForm = ({ pageData, page }: { pageData?: PageMetaDataModel, page: string }) => {
    const [pageTitle, setPageTitle] = useState<string>(pageData?.pageTitle ?? "")
    const [pageKeywords, setPageKeywords] = useState<string>(pageData?.pageKeywords ?? "")
    const [pageDescription, setPageDescription] = useState<string>(pageData?.pageDescription ?? "")
    const [pageSlider, setPageSlider] = useState<number>(pageData?.sliderId ?? 0)
    const [videoBanner, setVideoBanner] = useState<boolean>(pageData?.videoBanner ?? false)
    const [videoFile, setVideoFile] = useState<File | undefined | null>(undefined)

    console.log(pageData)

    const handleFormSave: FormEventHandler = (e) => {
        e.preventDefault()
        savePageEditForm(page, pageTitle, pageKeywords, pageDescription, pageSlider, videoBanner).then((res) => {
            if (res.ack)
                onPageNotifications("success", "Pade Meta Updated").catch(e => console.log(e))
            else
                onPageNotifications("success", "Pade Meta Update Failed").catch(e => console.log(e))
        }).catch(e => console.log(e))
    }
    return (
        <form className='card-body' onSubmit={handleFormSave}>
            <div className='card-title'>{capitalize(pageData?.page ?? page)} Page Details</div>
            <label className='input-group input-group-lg input-group-vertical'>
                <span>Page Title</span>
                <input type="text" className='input input-bordered w-full' placeholder='Page Title' required onChange={e => setPageTitle(e.currentTarget.value)} defaultValue={pageTitle} />
            </label>
            <label className='input-group input-group-lg input-group-vertical'>
                <span>Page Description</span>
                <input type="text" className='input input-bordered w-full' placeholder='Description' required onChange={e => setPageDescription(e.currentTarget.value)} defaultValue={pageDescription} />
            </label>
            <label className='input-group input-group-lg input-group-vertical'>
                <span>Page Keywords</span>
                <input type="text" className='input input-bordered w-full' placeholder='Keywords' required onChange={e => setPageKeywords(e.currentTarget.value)} defaultValue={pageKeywords} />
            </label>
            <Switch.Group>
                <div className="flex justify-between items-center border border-gray-300 rounded-lg">
                    <Switch.Label className="mr-3 leading-5 text-lg w-full cursor-pointer p-4">Video in Header</Switch.Label>
                    <Switch
                        checked={videoBanner}
                        onChange={setVideoBanner}
                        className={`${videoBanner ? 'bg-blue-600' : 'bg-gray-200'
                            } relative inline-flex h-6 w-11 items-center rounded-full mr-4`}>
                        <span
                            className={`${videoBanner ? 'translate-x-6' : 'translate-x-1'
                                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                        />
                    </Switch>
                </div>
            </Switch.Group>
            <label className='input-group input-group-lg input-group-vertical'>
                <span>Video File</span>
                <input type="file" className='file-input file-input-bordered w-full' placeholder='Header Slider ID' onChange={e => setVideoFile(e.currentTarget.files?.item(0))} accept=".mp4,video/mp4" />
            </label>
            <label className='input-group input-group-lg input-group-vertical'>
                <span>Page Header Slider ID</span>
                <input type="number" className='input input-bordered w-full' placeholder='Header Slider ID' required onChange={e => setPageSlider(Number(e.currentTarget.value))} defaultValue={pageSlider} />
            </label>
            <div className='card-actions'>
                <button className='btn btn-primary' type='submit'>Save</button>
            </div>
        </form>
    )
}

export default PageEditingForm