'use client'
import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react'
import getUserAllWishlist from '@/backend/serverActions/getUserAllWishlist'
import getUserCartItemCount from '@/backend/serverActions/getUserCartItemCount'
import DataContextDataModel from '@/types/DataContextDataModel'
import { Session } from 'next-auth'
import { useSession } from 'next-auth/react'

/**
 * This Method Initializes the Socket Connection to the Server and accepts domain name for websocket connection.
 * @param {String} basePath Base Path/ Domain to eastablish WS Connection
 */
export const webSocketInitializer = async (basePath: string) => {
    if (basePath.startsWith("localhost") || basePath.startsWith("192.168"))
        return new WebSocket(`ws://${basePath.split(':')[0]}:4000`)
    return new WebSocket(`wss://ws.${basePath}`)
}

const DataConnectionContext = createContext<DataContextDataModel>({
    mainSocket: undefined,
    cartCount: undefined,
    wishlistItems: [],
    refreshWishList: () => { },
    refreshCartItems: () => { }
})

const DataConnectionContextProvider = ({ children }: { children: ReactNode }) => {
    const [cartCount, setCartCount] = useState<number>()
    const [mainSocket, setMainSocket] = useState<WebSocket>()
    const [wishlistItems, setWishlistitems] = useState<string[]>([])
    const { data: session } = useSession()

    // Helper to get local cart count - memoized to avoid repeated localStorage parsing
    const getLocalCartCount = useMemo(() => {
        if (typeof window !== 'undefined') {
            const localCartRaw = localStorage.getItem('pending_cart')
            if (localCartRaw) {
                try {
                    const localCart = JSON.parse(localCartRaw)
                    if (Array.isArray(localCart)) return localCart.length
                } catch { }
            }
        }
        return 0
    }, [])

    const refreshWishList = () => {
        getUserAllWishlist((session?.user as { id: string })?.id, false).then(result => {
            setWishlistitems(result?.itemIds ?? [])
        }).catch(err => console.log(err))
    }

    const refreshCartItems = () => {
        if (session?.user) {
            getUserCartItemCount((session?.user as { id: string }).id).then(result => {
                setCartCount(result.cartItemCount)
            }).catch(err => console.log(err))
        } else {
            setCartCount(getLocalCartCount)
        }
    }

    useEffect(() => {
        // On mount or session change, update cart count from server or localStorage
        if (session?.user) {
            getUserCartItemCount((session?.user as { id: string }).id).then(result => {
                setCartCount(result.cartItemCount)
            }).catch(err => console.log(err))
        } else {
            setCartCount(getLocalCartCount)
        }
        (!mainSocket || mainSocket.readyState !== WebSocket.OPEN) && webSocketInitializer(window.location.host).then((result) => {
            setMainSocket(result)
        }).catch(err => console.log(err))
        session && getUserAllWishlist((session?.user as { id: string }).id, false).then(result => {
            setWishlistitems(result?.itemIds ?? [])
        }).catch(err => console.log(err))
    }, [session])

    useEffect(() => {
        if (mainSocket && mainSocket.readyState === WebSocket.OPEN && session) {
            mainSocket.onopen = (_: Event) => { }

            mainSocket.send(JSON.stringify({
                meta: "join_room",
                roomID: (session.user as { id: string }).id,
                clientID: (session.user as { id: string }).id,
                message: ""
            }))
            mainSocket.onmessage = (event) => {
                const { message } = JSON.parse(event.data)
                if (message.hasOwnProperty('cartCount')) {
                    setCartCount(message.cartCount)
                }

            }
        }
    }, [mainSocket, session])

    useEffect(() => {
        // Listen for local cart changes (add/remove) while logged out
        if (!session?.user) {
            const handleStorage = () => {
                // Recompute local cart count from localStorage when storage changes
                if (typeof window !== 'undefined') {
                    const localCartRaw = localStorage.getItem('pending_cart')
                    if (localCartRaw) {
                        try {
                            const localCart = JSON.parse(localCartRaw)
                            if (Array.isArray(localCart)) {
                                setCartCount(localCart.length)
                                return
                            }
                        } catch { }
                    }
                    setCartCount(0)
                }
            }
            window.addEventListener('storage', handleStorage)
            return () => window.removeEventListener('storage', handleStorage)
        }
    }, [session])

    const value = useMemo(() => ({
        mainSocket,
        cartCount,
        wishlistItems,
        refreshCartItems,
        refreshWishList
    }), [cartCount, mainSocket, wishlistItems])

    return <DataConnectionContext.Provider value={value}>
        {children}
    </DataConnectionContext.Provider>
}

export const useDataConnectionContext = () => {
    return useContext(DataConnectionContext)
}

export default DataConnectionContextProvider