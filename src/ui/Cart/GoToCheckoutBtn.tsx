"use client"
import { useRouter } from 'next/navigation'
import React from 'react'
import { useSession } from 'next-auth/react'
import { HiOutlineLockClosed } from 'react-icons/hi2'

const GoToCheckoutBtn = ({ isDisabled }: { isDisabled: boolean }) => {
    const router = useRouter()
    const { data: session } = useSession();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        router.push('/cart/checkout');
    }

    return (
        <button 
            className="w-full btn btn-primary btn-lg gap-2 mt-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200" 
            onClick={handleClick} 
            disabled={isDisabled}
        >
            <HiOutlineLockClosed className="w-5 h-5" />
            Proceed to Checkout
        </button>
    )
}

export default GoToCheckoutBtn