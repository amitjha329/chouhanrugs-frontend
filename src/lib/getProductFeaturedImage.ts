type ProductImageLike = Partial<{
    productFeaturedImage: string;
    productPrimaryImageIndex: number;
    images: string[];
}> | null | undefined

export function getProductFeaturedImage(product: ProductImageLike): string {
    if (!product) return ""

    const featuredImage = product.productFeaturedImage?.trim()
    if (featuredImage) return featuredImage

    const images = Array.isArray(product.images) ? product.images.filter(Boolean) : []
    const primaryIndex = typeof product.productPrimaryImageIndex === "number" ? product.productPrimaryImageIndex : 0

    return images[primaryIndex] ?? images[0] ?? ""
}

export function getProductGalleryImages(product: ProductImageLike): string[] {
    const images = Array.isArray(product?.images) ? product.images.filter(Boolean) : []
    const featuredImage = getProductFeaturedImage(product)

    if (!featuredImage) return images

    return [featuredImage, ...images.filter(image => image !== featuredImage)]
}
