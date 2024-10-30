'use client'
import { signOut } from 'next-auth/react'
import React from 'react'

const SignOutClient = ({ children }: { children: React.ReactNode }) => {
    return (
        <div onClick={e => { signOut() }}>
            {children}
        </div>
    )
}

export default SignOutClient