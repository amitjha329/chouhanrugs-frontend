type DataContextDataModel = {
    mainSocket?: WebSocket
    cartCount: number|undefined
    wishlistItems: string[]
    refreshWishList: () => void
    refreshCartItems: () => void
}
export default DataContextDataModel