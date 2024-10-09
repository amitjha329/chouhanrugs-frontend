"use client"
import React from 'react'
import { useFormState } from 'react-dom'
import SubscribeFields from './SubscribeFields'

const Subscribe = () => {
  const [state, action] = useFormState(() => {
    return { email: "" }
  }, {
    email: ""
  })
  return (
    <form action={action} className='form-control w-full'>
      <SubscribeFields />
    </form>
  )
}

export default Subscribe