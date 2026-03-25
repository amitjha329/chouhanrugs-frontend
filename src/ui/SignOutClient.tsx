'use client'
import { signOut } from '@/lib/auth-client'
import React from 'react'

const SignOutClient = ({ children }: { children: React.ReactNode }) => {
    return (
        <div onClick={e => { signOut() }}>
            {children}
        </div>
    )
}

export default SignOutClient