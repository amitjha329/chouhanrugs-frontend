'use client'
import deleteImage from '@/lib/actions/deleteImage'
import { saveHomePageShopByRoomSection } from '@/lib/actions/saveHomePageContentSections'
import uploadImages from '@/lib/actions/uploadImages'
import ShopByRoomContentDataModel, { ShopByRoomContent } from '@/lib/types/ShopByRoomContentDataModel'
import stringEmptyOrNull from '@/lib/utilities/stringEmptyOrNull'
import onPageNotifications from '@/ui/common/onPageNotifications'
import Image from 'next/image'
import React, { ChangeEventHandler, useReducer, useState } from 'react'

const contentActionHandler = (state: ShopByRoomContent[], action: { operation: "new" | "update-title" | "update-content", data: ShopByRoomContent }): ShopByRoomContent[] => {
    let tempIndex = 0
    let tempData: ShopByRoomContent[] = []
    switch (action.operation) {
        case "new":
            return [...state, {
                id: state.length + 1,
                content: "",
                title: ""
            }]
        case "update-title":
            tempIndex = state.findIndex(item => item.id === action.data.id)
            tempData = state
            tempData[tempIndex].title = action.data.title
            return tempData
        case "update-content":
            tempIndex = state.findIndex(item => item.id === action.data.id)
            tempData = state
            tempData[tempIndex].content = action.data.content
            return tempData
    }
}

const ShopByRoomForm = ({ data }: { data?: ShopByRoomContentDataModel }) => {
    const [bannerImage, setBannerImage] = useState<string>("")
    const [content, dispatchActionForContent] = useReducer(contentActionHandler, data?.content ?? [])
    const handleIconUpload: ChangeEventHandler<HTMLInputElement> = (e) => {
        if (e.currentTarget.files != null) {
            const filesArray = Array.from(e.currentTarget.files)
            const data = new FormData()
            data.append("type", "shopByRoom")
            filesArray.forEach(item => {
                data.append("image", item)
            })
            uploadImages(data)
                .then(img => {
                    setBannerImage(img[0].url)
                }).catch(err => console.log(err))
        }
        e.currentTarget.value = ""
    }

    return (
        <>
            <label className='input-group input-group-lg input-group-vertical'>
                <span>Banner Image</span>
                <input type="file" className='file-input file-input-bordered w-full' placeholder='Description' onChange={handleIconUpload} />
            </label>
            {
                bannerImage && !stringEmptyOrNull(bannerImage) && <Image src={bannerImage} alt="" className='!w-40 !h-auto !relative' fill />
            }
            {
                content.map(item => <div key={item.id} className='card-body'>
                    <div className='card-title'>Content: {item.id}</div>
                    <label className='input-group input-group-lg input-group-vertical'>
                        <span>Title</span>
                        <input type="text" defaultValue={item.title} className='input input-bordered w-full' placeholder='Title' onChange={e => {
                            dispatchActionForContent(
                                {
                                    data: {
                                        id: item.id,
                                        content: "",
                                        title: e.currentTarget.value
                                    },
                                    operation: "update-title"
                                }
                            )
                        }} />
                    </label>
                    <label className='input-group input-group-lg input-group-vertical'>
                        <span>Content</span>
                        <input type="text" defaultValue={item.content} className='input input-bordered w-full' placeholder='Content' onChange={e => {
                            dispatchActionForContent(
                                {
                                    data: {
                                        id: item.id,
                                        content: e.currentTarget.value,
                                        title: ""
                                    },
                                    operation: "update-content"
                                }
                            )
                        }} />
                    </label>
                </div>)
            }
            <button className='btn w-full btn-primary' onClick={e => dispatchActionForContent(
                {
                    data: {
                        id: content.length + 1,
                        content: "",
                        title: ""
                    },
                    operation: "new"
                }
            )}>Add New</button>
            <div className='card-actions justify-end'>
                <button className='btn btn-primary' onClick={_ => {
                    saveHomePageShopByRoomSection(bannerImage, content).then(result => {
                        if (result.ack) {
                            if (data && !stringEmptyOrNull(data.bannerImage)) {
                                deleteImage(data.bannerImage).catch(e => console.log(e))
                            }
                            onPageNotifications("success", "Data Updated").catch(e => console.log(e))
                        } else {
                            console.log(result.result)
                        }
                    }).catch(e => console.log(e))
                }}>Save</button>
            </div>
        </>
    )
}

export default ShopByRoomForm