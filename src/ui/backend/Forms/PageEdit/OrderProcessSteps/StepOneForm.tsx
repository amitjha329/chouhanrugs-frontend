'use client'
import deleteImage from '@/lib/actions/deleteImage'
import { saveHomePageOrderProcessSteps } from '@/lib/actions/saveHomePageContentSections'
import uploadImages from '@/lib/actions/uploadImages'
import { Steps } from '@/lib/types/OrderProcessStepsDataModel'
import stringEmptyOrNull from '@/lib/utilities/stringEmptyOrNull'
import onPageNotifications from '@/ui/common/onPageNotifications'
import Image from 'next/image'
import { useState, ChangeEventHandler } from 'react'

const StepOneForm = ({ data }: { data?: Steps }) => {
  const [title, setTitle] = useState<string>(data?.title ?? "")
  const [description, setDescription] = useState<string>(data?.description ?? "")
  const [icon, setIcon] = useState<string>(data?.icon ?? "")

  const handleIconUpload: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.currentTarget.files != null) {
      const filesArray = Array.from(e.currentTarget.files)
      const data = new FormData()
      data.append("type", "order_process")
      filesArray.forEach(item => {
        data.append("image", item)
      })
      uploadImages(data)
        .then(img => {
          setIcon(img[0].url)
        }).catch(err => console.log(err))
    }
    e.currentTarget.value = ""
  }
  return (
    <div className='form-control gap-4'>
      <label className='input-group input-group-lg input-group-vertical'>
        <span>Title</span>
        <input type="text" className='input input-bordered w-full' placeholder='Page Title' required onChange={e => setTitle(e.currentTarget.value)} defaultValue={title} />
      </label>
      <label className='input-group input-group-lg input-group-vertical'>
        <span>Description</span>
        <input type="text" className='input input-bordered w-full' placeholder='Description' required onChange={e => setDescription(e.currentTarget.value)} defaultValue={description} />
      </label>
      <label className='input-group input-group-lg input-group-vertical'>
        <span>Icon</span>
        <input type="file" className='file-input file-input-bordered w-full' placeholder='Description' onChange={handleIconUpload} />
      </label>
      {
        icon && icon != null && <Image src={icon} alt="" className='!w-40 !h-auto !relative' fill />
      }
      <div className='card-actions justify-end'>
        <button className='btn btn-primary' type='submit' onClick={e => {
          saveHomePageOrderProcessSteps({ description, title, icon }, "stepOne").then((result) => {
            if (result.ack) {
              if (data && !stringEmptyOrNull(data?.icon)) {
                deleteImage(data.icon).catch(e => console.log(e))
              }
              onPageNotifications("success", "Data Updated").then(() => {
                window.location.reload()
              }).catch(e => console.log(e))
            } else {
              onPageNotifications("error", "Unable to Update Data").catch(e => console.log(e))
            }
          }).catch(e => console.log(e))
        }}>Save</button>
      </div>
    </div>
  )
}

export default StepOneForm