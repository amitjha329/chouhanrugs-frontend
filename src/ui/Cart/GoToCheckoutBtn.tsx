"use client"
import { useRouter } from 'next/navigation'
import React from 'react'
import { useSession } from 'next-auth/react'

const GoToCheckoutBtn = ({ isDisabled }: { isDisabled: boolean }) => {
    const router = useRouter()
    const { data: session } = useSession();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        // if (session?.user) {
            router.push('/cart/checkout');
        // } else {
        //     router.push('/signin?cb=/cart/checkout');
        // }
    }

    return (
        <button className="w-full sm:w-1/2 lg:w-1/4 btn btn-primary mt-4" onClick={handleClick} disabled={isDisabled}>
            Proceed To Checkout
        </button>
    )
}

export default GoToCheckoutBtn