type BulkPurchaseDataModel = {
    _id?: string,
    email: string,
    contactNum: string,
    quantity: number,
    message: string,
    productId: string,
    color: string,
    size: string,
    user: string,
    requestDate?: string
    status?: boolean
    newChat?: number
}

export default BulkPurchaseDataModel