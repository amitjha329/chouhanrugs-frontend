'use client'
import enableDisablePopup from '@/lib/actions/enableDisablePopup'
import updatePopUpData from '@/lib/actions/updatePopUpData'
import uploadImages from '@/lib/actions/uploadImages'
import PopUpDataModel from '@/lib/types/PopUpDataModel'
import findImageDimension from '@/lib/utilities/findImageDimension'
import onPageNotifications from '@/ui/common/onPageNotifications'
import clsx from 'clsx'
import Image from 'next/image'
import React, { useState, ChangeEventHandler } from 'react'

const PopupForm = ({ popupData }: { popupData: PopUpDataModel }) => {
    const [isPopUpActive, setIsPopUpActive] = useState<boolean>(popupData.isActive || false)
    const [popupTitle, setPopupTitle] = useState<string>(popupData.data.title)
    const [popupDescription, setPopupDescription] = useState<string>(popupData.data.description)
    const [buttonText, setbuttonText] = useState<string>(popupData.data.button?.text)
    const [buttonUrl, setbuttonUrl] = useState<string>(popupData.data.button?.url)
    const [subscribeEnabled, setSubsribeEnabled] = useState<boolean>(popupData.data.isSubscribeEnabled)
    const [popupObjectUrl, setPopupObjectUrl] = useState<string>(popupData.data.image)

    const updatePopup = () => {
        const data = {
            title: popupTitle, description: popupDescription, button: { text: buttonText, url: buttonUrl }, isSubscribeEnabled: subscribeEnabled, image: popupObjectUrl
        }
        updatePopUpData(data).then(() => {
            onPageNotifications("success", "Pop up Data Updated")
        }).catch(() => {
            onPageNotifications("error", "Failed TO Update PopUp Data")
        })
    }

    const handleImageUpload: ChangeEventHandler<HTMLInputElement> = (e) => {
        const imageFile = e.currentTarget.files?.item(0)
        if (imageFile != null) {
            findImageDimension(imageFile).then((result) => {
                if (result.height / result.width === 1.25) {
                    const data = new FormData()
                    data.append("type", "popupImage")
                    data.append("image", imageFile)
                    uploadImages(data)
                        .then(img => {
                            setPopupObjectUrl(img[0].url)
                        }).catch(err => console.log(err))
                } else {
                    onPageNotifications("error","Image Should Be of Height:1000 and Width:800 or Aspect 1.25:1")
                }
            })
        }
        e.currentTarget.value = ""
    }

    const activationDeactivation = () => {
        enableDisablePopup(!isPopUpActive).then(() => {
            onPageNotifications("success", "Pop up Status Changed")
            setIsPopUpActive(!isPopUpActive)
        }).catch(() => {
            onPageNotifications("error", "Failed TO Update PopUp Data")
        })
    }
    return (
        <>
            <div className='card-title'>Popup Options<span className={clsx(isPopUpActive ? "text-success" : "text-error")}>({isPopUpActive ? "Active" : "Deactivated"})</span></div>
            <label className='join join-vertical'>
                <span className="join-item bg-gray-200 p-2">Popup Title</span>
                <input type="text" className='input input-bordered w-full join-item' name="product_name" placeholder='Popup Title' required onChange={e => setPopupTitle(e.currentTarget.value)} value={popupTitle} />
            </label>
            <label className='join join-vertical'>
                <span className="join-item bg-gray-200 p-2">Popup Description/Body</span>
                <textarea className='textarea textarea-bordered w-full join-item' minLength={200} rows={10} name="product_description_long" placeholder='Popup Body/Description' required onChange={e => setPopupDescription(e.currentTarget.value)} value={popupDescription} />
            </label>
            <label className='join join-vertical'>
                <span className="join-item bg-gray-200 p-2">Popup Button Text</span>
                <input type="text" className='input input-bordered w-full join-item' name="product_name" placeholder='Popup Button Text' required onChange={e => setbuttonText(e.currentTarget.value)} value={buttonText} />
            </label>
            <label className='join join-vertical'>
                <span className="join-item bg-gray-200 p-2">Popup Button Action Url</span>
                <input type="text" className='input input-bordered w-full join-item' name="product_name" placeholder='http://www.example.com/example?value=example' required onChange={e => setbuttonUrl(e.currentTarget.value)} value={buttonUrl} />
            </label>
            <label className='join join-vertical'>
                <span className="join-item bg-gray-200 p-2">Popup Button Action Url</span>
                <input type="file" className='file-input file-input-bordered w-full join-item' name="product_name" placeholder='http://www.example.com/example?value=example' required onChange={handleImageUpload} />
            </label>
            {
                popupObjectUrl && <div className='relative flex items-center justify-center'>
                    <Image fill alt='popup image' src={popupObjectUrl} className="!relative !h-auto max-w-xs !w-36" />
                </div>
            }
            <div className='card-actions justify-end'>
                <button className='btn btn-primary' onClick={updatePopup}>Update</button>
                <button className={clsx("btn", isPopUpActive ? "btn-error" : "btn-success")} onClick={activationDeactivation}>{isPopUpActive ? "DeActivate" : "Activate"}</button>
            </div>
        </>
    )
}

export default PopupForm
