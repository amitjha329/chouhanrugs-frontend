type AdminDataPointsModel = {
    _id?: string
    mainSocket?: WebSocket
    notifCount: number
    newOrder: boolean
    processingOrders: number
    pendingOrders: number
    bulkOrders: number
    helpers?: {
        clearNotifCount: () => void,
        clearDataCount:(key:string)=>Promise<void>
    }
}
export default AdminDataPointsModel