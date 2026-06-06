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
            className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-content transition hover:bg-primary/90 disabled:opacity-50" 
            onClick={handleClick} 
            disabled={isDisabled}
        >
            <HiOutlineLockClosed className="w-5 h-5" />
            {t('proceedToCheckout')}
        </button>
    )
}

export default GoToCheckoutBtn
