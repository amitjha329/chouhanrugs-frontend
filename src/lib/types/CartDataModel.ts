import { ProductDataModel } from "./ProductDataModel"

type CartDataModel = {
    _id: string
    quantity: number
    cartProduct: ProductDataModel[]
    variationCode: string | null | undefined,
    customSize: CustomSize | null | undefined
}

export type CustomSize = {
    unit: string,
    shape: "Rectangle" | "Round" | "Square" | "Runner",
    dimensions: {
        length?: number,
        width?: number,
        diameter?: number
    }
}

export default CartDataModel