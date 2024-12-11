// @ts-nocheck
import React from 'react'
import { IoIosSend } from 'react-icons/io'

const SubscribeFields = () => {
  return (
    <>
      <label className='join w-full'>
        <input className="input input-secondary bg-opacity-30 input-lg bg-base-200 join-item border-none w-full placeholder-secondary !outline-none placeholder:~text-xs/base" placeholder="Enter Your Email Address" />
        <button className="btn join-item btn-lg bg-opacity-50 border-none !outline-none"><IoIosSend className='h-9 w-9' /></button>
      </label>
    </>
  )
}

export default SubscribeFields