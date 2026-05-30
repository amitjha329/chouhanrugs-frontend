type DataContextDataModel = {
    mainSocket?: WebSocket
    cartCount: number|undefined
    cartSyncing: boolean
    wishlistItems: string[]
    refreshWishList: () => void
    refreshCartItems: () => void
}
export default DataContextDataModel
