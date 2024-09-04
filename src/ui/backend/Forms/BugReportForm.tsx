'use client'
import axiosInstance from '@/lib/utilities/axiosInastances'
import onPageNotifications from '@/ui/common/onPageNotifications'
import { useState, FormEventHandler } from 'react'

const BugReportForm = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const createNewCoupon: FormEventHandler = (e) => {
    e.preventDefault()
    const data = {
      title,
      body: description
    }
    axiosInstance().post('/api/admin/createissue', data).then((res) => {
      onPageNotifications("success", "Issue Created")
      window.location.reload()
    }).catch((err) => {
      onPageNotifications("error", "Unable To Submit Issue.")
    })
  }
  return (
    <form id="coupon-form" onSubmit={createNewCoupon}>
      <div className="card-body">
        <div className="card-title mb-5">Add New Issue</div>
        <label className='join join-vertical'>
          <span className='join-item bg-gray-200 p-2'>Title</span>
          <input type="text" className='input input-bordered w-full join-item' name="coupon_name" placeholder='Issue Title' required onChange={e => setTitle(e.currentTarget.value)} />
        </label>
        <label className='join join-vertical'>
          <span className='join-item bg-gray-200 p-2'>Description</span>
          <input type="text" className='input input-bordered w-full join-item' name="product_name" placeholder='Descrie the issue here' required onChange={e => setDescription(e.currentTarget.value)} />
        </label>
        <div className="card-actions justify-end">
          <button className="btn" type="submit">Create Issue</button>
        </div>
      </div>
    </form>
  )
}

export default BugReportForm