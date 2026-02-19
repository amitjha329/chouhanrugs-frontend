'use client'

import Image, { ImageProps } from 'next/image'
import React, { useState, useCallback, memo } from 'react'
import clsx from 'clsx'
import { blurPlaceholders, imageQuality, productImageSizes } from '@/utils/imageOptimization'

type ImageVariant = 'main' | 'card' | 'thumbnail' | 'gallery'

interface ProductImageProps extends Omit<ImageProps, 'placeholder' | 'blurDataURL' | 'onLoad' | 'onError'> {
    /** Variant determines default sizes and quality settings */
    variant?: ImageVariant
    /** Show loading skeleton while image loads */
    showSkeleton?: boolean
    /** Custom skeleton component */
    skeleton?: React.ReactNode
    /** Callback when image loads successfully */
    onImageLoad?: () => void
    /** Callback when image fails to load */
    onImageError?: () => void
    /** Custom blur placeholder color */
    blurColor?: keyof typeof blurPlaceholders
    /** Whether to use shimmer animation placeholder */
    useShimmer?: boolean
    /** Aspect ratio for the container (e.g., "square", "4/3", "16/9") */
    aspectRatio?: 'square' | '4/3' | '16/9' | '3/4' | 'auto'
    /** Container className */
    containerClassName?: string
}

/**
 * Optimized product image component with:
 * - Blur placeholder support
 * - Loading skeleton with smooth transitions
 * - Configurable quality and sizes based on variant
 * - Error handling with fallback
 * - Lazy loading for off-screen images
 */
const ProductImage = memo(function ProductImage({
    variant = 'card',
    showSkeleton = true,
    skeleton,
    onImageLoad,
    onImageError,
    blurColor = 'warmNeutral',
    useShimmer = false,
    aspectRatio = 'auto',
    containerClassName,
    className,
    alt,
    ...props
}: ProductImageProps) {
    const [isLoaded, setIsLoaded] = useState(false)
    const [hasError, setHasError] = useState(false)

    // Get default settings based on variant
    const getVariantSettings = useCallback(() => {
        switch (variant) {
            case 'main':
                return {
                    sizes: productImageSizes.main,
                    quality: imageQuality.high,
                    loading: 'eager' as const,
                    fetchPriority: 'high' as const,
                }
            case 'gallery':
                return {
                    sizes: productImageSizes.gallery,
                    quality: imageQuality.high,
                    loading: 'eager' as const,
                    fetchPriority: 'auto' as const,
                }
            case 'thumbnail':
                return {
                    sizes: productImageSizes.thumbnail,
                    quality: imageQuality.thumbnail,
                    loading: 'lazy' as const,
                    fetchPriority: 'auto' as const,
                }
            case 'card':
            default:
                return {
                    sizes: productImageSizes.card,
                    quality: imageQuality.standard,
                    loading: 'lazy' as const,
                    fetchPriority: 'auto' as const,
                }
        }
    }, [variant])

    const settings = getVariantSettings()

    const handleLoad = useCallback(() => {
        setIsLoaded(true)
        onImageLoad?.()
    }, [onImageLoad])

    const handleError = useCallback(() => {
        setHasError(true)
        onImageError?.()
    }, [onImageError])

    // Aspect ratio classes
    const aspectRatioClass = {
        square: 'aspect-square',
        '4/3': 'aspect-[4/3]',
        '16/9': 'aspect-video',
        '3/4': 'aspect-[3/4]',
        auto: '',
    }[aspectRatio]

    // Default skeleton
    const defaultSkeleton = (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
            {variant === 'main' && (
                <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin" />
            )}
        </div>
    )

    // Error fallback
    if (hasError) {
        return (
            <div 
                className={clsx(
                    "relative overflow-hidden bg-gray-100 flex items-center justify-center",
                    aspectRatioClass,
                    containerClassName
                )}
            >
                <div className="text-gray-400 text-center p-4">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">Image unavailable</span>
                </div>
            </div>
        )
    }

    return (
        <div 
            className={clsx(
                "relative overflow-hidden",
                aspectRatioClass,
                containerClassName
            )}
        >
            {/* Skeleton/Loading state */}
            {showSkeleton && !isLoaded && (skeleton || defaultSkeleton)}

            {/* Actual image */}
            <Image
                alt={alt}
                className={clsx(
                    "transition-opacity duration-300",
                    isLoaded ? "opacity-100" : "opacity-0",
                    className
                )}
                sizes={props.sizes || settings.sizes}
                quality={props.quality || settings.quality}
                loading={props.loading || settings.loading}
                fetchPriority={settings.fetchPriority}
                placeholder="blur"
                blurDataURL={useShimmer ? blurPlaceholders.shimmer : blurPlaceholders[blurColor]}
                onLoad={handleLoad}
                onError={handleError}
                {...props}
            />
        </div>
    )
})

export default ProductImage
