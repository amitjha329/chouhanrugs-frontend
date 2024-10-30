"use client"
import { useRouter } from 'next/navigation'
import React from 'react'

const GoToCheckoutBtn = ({isDisabled}:{isDisabled:boolean}) => {
    const router = useRouter()

    return (
        <button className="w-full sm:w-1/2 lg:w-1/4 btn btn-primary mt-4" onClick={e => router.push('/cart/checkout')} disabled={isDisabled}>Proceed To Checkout</button>
    )
}

export default GoToCheckoutBtn