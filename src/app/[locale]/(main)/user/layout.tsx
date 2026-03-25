// @ts-nocheck
import { getSession } from '@/lib/auth-server'
import { connection } from 'next/server'
import UserLayout from '@/ui/Layout/UserLayout'
import React from 'react'

const layout = async ({ children }: { children: React.ReactNode }) => {
    await connection()
    const session = await getSession()
    if (!session) {
        const { redirect } = await import('next/navigation')
        redirect('/signin')
    }
    return (
        <UserLayout>
            {children}
        </UserLayout>
    )
}

export default layout