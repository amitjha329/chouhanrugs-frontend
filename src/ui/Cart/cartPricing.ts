import { stringNotEmptyOrNull } from '@/lib/stringEmptyOrNull'
import CartDataModel from '@/types/CartDataModel'

export function getCartItemUnitPrice(item: CartDataModel): number {
    const product = item.cartProduct[0]
    if (!product) return 0

    if (stringNotEmptyOrNull(item.variationCode) && item.variationCode !== 'customSize') {
        const variation = product.variations.find((value) => value.variationCode === item.variationCode)
        const variationPrice = Number(variation?.variationPrice ?? product.productSellingPrice ?? 0)
        const variationDiscount = Number(variation?.variationDiscount ?? 0)
        return variationPrice - (variationPrice * (variationDiscount / 100))
    }

    if (item.variationCode === 'customSize') {
        switch (item.customSize?.shape) {
            case 'Rectangle':
            case 'Runner':
            case 'Square':
                return product.productPriceSqFt * (item.customSize?.dimensions.length ?? 1) * (item.customSize?.dimensions.width ?? 1)
            case 'Round':
                return product.productPriceSqFt * (Math.pow((item.customSize?.dimensions.diameter ?? 1) / 2, 2) * Math.PI)
            default:
                return 0
        }
    }

    return Number(product.productSellingPrice ?? 0)
}

export function getCartItemTotal(item: CartDataModel, exchangeRate = 1): number {
    return getCartItemUnitPrice(item) * item.quantity * exchangeRate
}
