'use client'

import React, { useState } from 'react'
import { IoIosSend } from 'react-icons/io'
import addSubscriber from '@/lib/actions/addSubscriber'

const SubscribeFields = () => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async () => {

    if (!email.trim()) {
      setMessage('Please enter your email')
      setIsSuccess(false)
      return
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      const result = await addSubscriber(email, 'footer')

      if (result.ack) {
        setMessage(result.result.message)
        setIsSuccess(true)
        setEmail('')
      } else {
        setMessage(result.result.message)
        setIsSuccess(false)
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.')
      setIsSuccess(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="w-full">
        <div className='join w-full'>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-secondary bg-opacity-30 input-lg bg-base-200 join-item border-none w-full placeholder-secondary !outline-none placeholder:~text-xs/base"
            placeholder="Enter Your Email Address"
            disabled={isSubmitting}
            required
          />
          <button
            onClick={() => handleSubmit()}
            className="btn join-item btn-lg bg-opacity-50 border-none !outline-none"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              <IoIosSend className='h-9 w-9' />
            )}
          </button>
        </div>
        {message && (
          <p className={`mt-2 text-sm ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

export default SubscribeFields