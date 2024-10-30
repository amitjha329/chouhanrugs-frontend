"use client"
import React, { useActionState } from 'react'
import SubscribeFields from './SubscribeFields'

const Subscribe = () => {
  const [state, action] = useActionState(() => {
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