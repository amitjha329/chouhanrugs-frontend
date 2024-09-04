type ShopByRoomContentDataModel = {
    _id: string
    bannerImage: string,
    content: ShopByRoomContent[]
}

export type ShopByRoomContent = {
    id: number
    title: string
    content: string
}

export default ShopByRoomContentDataModel