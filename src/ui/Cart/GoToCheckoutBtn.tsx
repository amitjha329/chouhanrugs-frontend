"use client"
import { useRouter } from 'next/navigation'
import React from 'react'
import { useSession } from '@/lib/auth-client'
import { HiOutlineLockClosed } from 'react-icons/hi2'
import { useTranslations } from 'next-intl'

const GoToCheckoutBtn = ({ isDisabled }: { isDisabled: boolean }) => {
    const router = useRouter()
    const { data: session } = useSession();
    const t = useTranslations('cart')

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
            {t('proceedToCheckout')}
        </button>
    )
}

export default GoToCheckoutBtn