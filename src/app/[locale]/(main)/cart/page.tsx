import React from 'react'
import { getSession } from '@/lib/auth-server'
import getUserCartitems from '@/backend/serverActions/getUserCartitems'
import dynamic from 'next/dynamic'
import CartPageClient from '@/ui/Cart/CartPageClient'

const CartLocalStorage = dynamic(() => import('@/ui/Cart/CartLocalStorage'))

const CartPage = async () => {
    const session = await getSession()
    const cart = await getUserCartitems((session?.user as { id: string })?.id)
    const isLoggedIn = !!session?.user
    
    return isLoggedIn ? <CartPageClient initialCart={cart} source="user" /> : <CartLocalStorage />
}

export default CartPage
