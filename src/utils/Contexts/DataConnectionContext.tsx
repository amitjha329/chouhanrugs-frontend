'use client'
import React, { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import getUserAllWishlist from '@/backend/serverActions/getUserAllWishlist'
import getUserCartItemCount from '@/backend/serverActions/getUserCartItemCount'
import DataContextDataModel from '@/types/DataContextDataModel'
import { useSession } from '@/lib/auth-client'
import syncLocalCartToUser from '@/utils/syncLocalCartToUser'

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
    cartSyncing: false,
    wishlistItems: [],
    refreshWishList: () => { },
    refreshCartItems: () => { }
})

const DataConnectionContextProvider = ({ children }: { children: ReactNode }) => {
    const [cartCount, setCartCount] = useState<number>()
    const [cartSyncing, setCartSyncing] = useState(false)
    const [mainSocket, setMainSocket] = useState<WebSocket>()
    const [wishlistItems, setWishlistitems] = useState<string[]>([])
    const syncedUserRef = useRef<string | null>(null)
    const { data: sessionData } = useSession()
    const session = sessionData
    const userId = session?.user?.id

    // Helper to get local cart count
    const getLocalCartCount = () => {
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
    }

    const refreshWishList = useCallback(() => {
        getUserAllWishlist(userId ?? '', false).then(result => {
            setWishlistitems(result?.itemIds ?? [])
        }).catch(err => console.log(err))
    }, [userId])

    const refreshCartItems = useCallback(() => {
        if (userId) {
            getUserCartItemCount(userId).then(result => {
                setCartCount(result.cartItemCount)
            }).catch(err => console.log(err))
        } else {
            setCartCount(getLocalCartCount())
        }
    }, [userId])

    useEffect(() => {
        if (userId) {
            const localCartCount = getLocalCartCount()
            if (localCartCount > 0 && syncedUserRef.current !== userId) {
                syncedUserRef.current = userId
                setCartSyncing(true)
                setCartCount(localCartCount)
                syncLocalCartToUser(userId)
                    .then(() => getUserCartItemCount(userId))
                    .then(result => setCartCount(result.cartItemCount))
                    .catch(err => {
                        console.log(err)
                        setCartCount(getLocalCartCount())
                    })
                    .finally(() => setCartSyncing(false))
            } else {
                getUserCartItemCount(userId).then(result => {
                    setCartCount(result.cartItemCount)
                }).catch(err => console.log(err))
            }
        } else {
            syncedUserRef.current = null
            setCartSyncing(false)
            setCartCount(getLocalCartCount())
        }
        (!mainSocket || mainSocket.readyState !== WebSocket.OPEN) && webSocketInitializer(window.location.host).then((result) => {
            setMainSocket(result)
        }).catch(err => console.log(err))
        session && getUserAllWishlist(session.user?.id, false).then(result => {
            setWishlistitems(result?.itemIds ?? [])
        }).catch(err => console.log(err))
    }, [session])

    useEffect(() => {
        if (mainSocket && mainSocket.readyState === WebSocket.OPEN && session) {
            mainSocket.onopen = (_: Event) => { }

            mainSocket.send(JSON.stringify({
                meta: "join_room",
                roomID: session.user?.id,
                clientID: session.user?.id,
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
        const handleStorage = () => {
            if (!session?.user) setCartCount(getLocalCartCount())
        }
        const handleLocalCartUpdated = () => {
            if (!session?.user) setCartCount(getLocalCartCount())
        }

        if (!session?.user) {
            window.addEventListener('storage', handleStorage)
            window.addEventListener('local-cart-updated', handleLocalCartUpdated)
            return () => {
                window.removeEventListener('storage', handleStorage)
                window.removeEventListener('local-cart-updated', handleLocalCartUpdated)
            }
        }
    }, [session])

    const value = useMemo(() => ({
        mainSocket,
        cartCount,
        cartSyncing,
        wishlistItems,
        refreshCartItems,
        refreshWishList
    }), [cartCount, cartSyncing, mainSocket, refreshCartItems, refreshWishList, wishlistItems])

    return <DataConnectionContext.Provider value={value}>
        {children}
    </DataConnectionContext.Provider>
}

export const useDataConnectionContext = () => {
    return useContext(DataConnectionContext)
}

export default DataConnectionContextProvider
