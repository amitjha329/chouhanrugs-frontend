'use client'
import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import AdminDataPointsModel from '@/lib/types/AdminDataPointsModel'
import onPageNotifications from '@/ui/common/onPageNotifications'
import clearNotificationCount from '@/lib/actions/clearNotificationCount'
import clearDataCountBadge from '@/lib/actions/clearDataCountBadge'
import getInitialDataPointsData from '@/lib/actions/getInitialDataPointsData'

/**
 * This Method Initializes the Socket Connection to the Server and accepts domain name for websocket connection.
 * @param {String} basePath Base Path/ Domain to eastablish WS Connection
 */
export const webSocketInitializer = async (basePath: string) => {
    if (basePath.startsWith("localhost") || basePath.startsWith("192.168"))
        return new WebSocket(`ws://${basePath.split(':')[0]}:4000`)
    return new WebSocket(`wss://ws.${basePath}`)
}

const AdminDataPointsContext = createContext<AdminDataPointsModel>({
    mainSocket: undefined,
    newOrder: false,
    notifCount: 0,
    pendingOrders: 0,
    processingOrders: 0,
    bulkOrders: 0,
    helpers: {
        clearNotifCount: () => { },
        clearDataCount: async () => { },
    }
})

const AdminDataPointsContextProvider = ({ children }: { children: ReactNode }) => {
    const [mainSocket, setMainSocket] = useState<WebSocket>()
    const { data: session } = useSession()
    const roles = useMemo<string[]>(() => (session?.user as { roles: string[] })?.roles, [session])
    const [newOrder, setnewOrder] = useState(false)
    const [notifCount, setnotifCount] = useState(0)
    const [pendingOrders, setpendingOrders] = useState(0)
    const [processingOrders, setprocessingOrders] = useState(0)
    const [bulkOrders, setbulkOrders] = useState(0)

    const clearNotifCount = async () => {
        await clearNotificationCount()
    }

    const clearDataCount = (key:string) => {
        return clearDataCountBadge(key)
    }

    useEffect(() => {
        (!mainSocket || mainSocket.readyState !== WebSocket.OPEN) && webSocketInitializer(window.location.host).then((result) => {
            setMainSocket(result)
        }).catch(err => console.log(err))
        session != null && (
            getInitialDataPointsData().then(result => {
                setnewOrder(result.newOrder)
                setpendingOrders(result.pendingOrders)
                setprocessingOrders(result.processingOrders)
                setbulkOrders(result.bulkOrders)
                setnotifCount(result.notifCount)
            })
        )
    }, [session])

    useEffect(() => {
        if (mainSocket && mainSocket.readyState === WebSocket.OPEN && session && roles.includes("admin")) {
            mainSocket.onopen = (_: Event) => { }

            mainSocket.send(JSON.stringify({
                meta: "admin_data_points",
                roomID: (session?.user as { id: string }).id,
                clientID: (session?.user as { id: string }).id,
                message: ""
            }))
            mainSocket.onmessage = (event) => {
                const { message } = JSON.parse(event.data)
                if (message.hasOwnProperty('newOrder')) {
                    if (message.newOrder) {
                        onPageNotifications("info", "There's a new Order.")
                    }
                    setnewOrder(message.newOrder)
                }
                if (message.hasOwnProperty('newNotifCount')) {
                    if (message.newNotifCount > notifCount) {
                        onPageNotifications("info", "There's a new Notification.")
                    }
                    setnotifCount(message.newNotifCount)
                }
                if (message.hasOwnProperty('pendingOrders')) {
                    setpendingOrders(message.pendingOrders)
                }
                if (message.hasOwnProperty('processingOrders')) {
                    setprocessingOrders(message.processingOrders)
                }
                if (message.hasOwnProperty('bulkOrders')) {
                    setbulkOrders(message.bulkOrders)
                }
            }
        }
    }, [mainSocket, session, roles])

    const value = useMemo(() => ({
        mainSocket,
        newOrder,
        notifCount,
        pendingOrders,
        processingOrders,
        bulkOrders,
        helpers: {
            clearNotifCount,
            clearDataCount
        }
    }), [bulkOrders, mainSocket, newOrder, notifCount, pendingOrders, processingOrders])

    return <AdminDataPointsContext.Provider value={value}>
        {children}
    </AdminDataPointsContext.Provider>
}

export const useAdminDataContext = () => {
    return useContext(AdminDataPointsContext)
}

export default AdminDataPointsContextProvider