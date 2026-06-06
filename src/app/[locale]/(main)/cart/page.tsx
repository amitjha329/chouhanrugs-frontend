import React from 'react'
import { getSession } from '@/lib/auth-server'
import getUserCartitems from '@/backend/serverActions/getUserCartitems'
import dynamic from 'next/dynamic'
import CartPageClient from '@/ui/Cart/CartPageClient'

const CartLocalStorage = dynamic(() => import('@/ui/Cart/CartLocalStorage'))

const CartPage = async () => {
    const session = await getSession()
    const isLoggedIn = !!session?.user
    const cart = isLoggedIn ? await getUserCartitems((session.user as { id: string }).id) : []
    
    return isLoggedIn ? <CartPageClient initialCart={cart} source="user" /> : <CartLocalStorage />
}

export default CartPage
