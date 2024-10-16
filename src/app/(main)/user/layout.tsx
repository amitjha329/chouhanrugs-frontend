
import { auth } from '@/auth'
import UserLayout from '@/ui/Layout/UserLayout'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

const layout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth()
    return (
        <SessionProvider session={session}>
            <UserLayout>
                {children}
            </UserLayout>
        </SessionProvider>
    )
}

export default layout