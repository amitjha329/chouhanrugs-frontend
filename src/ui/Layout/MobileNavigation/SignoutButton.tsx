'use client'

import { signOut } from '@/lib/auth-client'
import React, { useState } from 'react'
import { HiOutlineArrowRightOnRectangle, HiOutlineChevronRight } from 'react-icons/hi2'

const SignoutButton = () => {
    const [isSigningOut, setIsSigningOut] = useState(false)

    const handleSignOut = async () => {
        if (isSigningOut) return

        setIsSigningOut(true)
        await signOut()
        window.location.href = '/'
    }

    return (
        <button
            type="button"
            className="group flex w-full items-center justify-between rounded-lg py-2 text-sm font-semibold transition hover:bg-[#f4ebe4] disabled:cursor-wait disabled:opacity-70"
            onClick={handleSignOut}
            disabled={isSigningOut}
        >
            <span className="flex items-center gap-3">
                <HiOutlineArrowRightOnRectangle aria-hidden="true" />
                <span>{isSigningOut ? 'Signing out...' : 'Sign out'}</span>
            </span>
            <HiOutlineChevronRight aria-hidden="true" />
        </button>
    )
}

export default SignoutButton
