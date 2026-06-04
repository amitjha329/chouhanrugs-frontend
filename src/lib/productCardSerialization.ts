import type ColorDataModel from '@/types/ColorDataModel'
import type { ProductDataModelWithColorMap, Variation } from '@/types/ProductDataModel'

const toStringId = (value: unknown): string | undefined => {
    if (!value) return undefined
    if (typeof value === 'string') return value
    if (typeof value === 'number') return String(value)
    if (typeof value === 'object') {
        const maybeId = value as { toHexString?: () => string; toString?: () => string }
        if (typeof maybeId.toHexString === 'function') return maybeId.toHexString()
        if (typeof maybeId.toString === 'function') {
            const text = maybeId.toString()
            return text === '[object Object]' ? undefined : text
        }
    }
    return undefined
}

const toNumber = (value: unknown): number => {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
}

const toStringArray = (value: unknown): string[] => {
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

const serializeVariation = (variation: Variation): Variation => ({
    variationCode: String(variation.variationCode ?? ''),
    variationStock: String(variation.variationStock ?? ''),
    variationPrice: String(variation.variationPrice ?? ''),
    variationDiscount: String(variation.variationDiscount ?? ''),
    variationColor: variation.variationColor ? String(variation.variationColor) : null,
    variationSize: variation.variationSize ? String(variation.variationSize) : null,
    variationImages: toStringArray(variation.variationImages),
})

const serializeColor = (color: ColorDataModel): ColorDataModel | null => {
    if (!color?.colorCode?.hex) return null

    return {
        _id: toStringId(color._id) ?? color.name ?? color.colorCode.hex,
        name: String(color.name ?? ''),
        sampleImg: String(color.sampleImg ?? ''),
        colorCode: {
            ...color.colorCode,
            hex: String(color.colorCode.hex),
        },
    }
}

export type SerializableProductCardData = ProductDataModelWithColorMap

export const serializeProductCardData = (product: ProductDataModelWithColorMap): SerializableProductCardData => ({
    _id: toStringId(product._id),
    objectID: String(product.objectID ?? toStringId(product._id) ?? ''),
    productName: product.productName,
    productTitle: product.productTitle,
    productURL: product.productURL,
    productCategory: String(product.productCategory ?? ''),
    productMSRP: toNumber(product.productMSRP),
    productDiscountPercentage: String(product.productDiscountPercentage ?? '0'),
    productSellingPrice: toNumber(product.productSellingPrice),
    productPrimaryImageIndex: toNumber(product.productPrimaryImageIndex),
    productFeaturedImage: product.productFeaturedImage ? String(product.productFeaturedImage) : undefined,
    images: toStringArray(product.images),
    variations: Array.isArray(product.variations) ? product.variations.map(serializeVariation) : [],
    productReviews: {
        average: toNumber(product.productReviews?.average),
        totalReviews: toNumber(product.productReviews?.totalReviews),
        reviews: [],
    },
    colorMap: Array.isArray(product.colorMap)
        ? product.colorMap.map(serializeColor).filter((color): color is ColorDataModel => Boolean(color))
        : [],
    priceRange: product.priceRange
        ? { min: toNumber(product.priceRange.min), max: toNumber(product.priceRange.max) }
        : undefined,
    msrpRange: product.msrpRange
        ? { min: toNumber(product.msrpRange.min), max: toNumber(product.msrpRange.max) }
        : undefined,
} as unknown as SerializableProductCardData)

export const serializeProductCardList = (products: ProductDataModelWithColorMap[]): SerializableProductCardData[] => (
    products.map(serializeProductCardData)
)
