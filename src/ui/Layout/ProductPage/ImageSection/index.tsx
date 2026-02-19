"use client"
import Image from "next/image"
import React, { MouseEventHandler, useRef, useState, useCallback, useMemo, memo, useEffect } from "react"
import { createPortal } from "react-dom"
import clsx from "clsx"
import './ProductImageGallery.scss'
import { useProductContext } from '@/utils/Contexts/ProductContext'
import addProductToWishlist from "@/backend/serverActions/addProductToWishlist"
import deleteProductFromWishlist from "@/backend/serverActions/deleteProductFromWishlist"
import { useDataConnectionContext } from "@/utils/Contexts/DataConnectionContext"
import onPageNotifications from "@/utils/onPageNotifications"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { FaHeart } from "react-icons/fa"
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5"
import { blurPlaceholders, imageQuality, productImageSizes } from "@/utils/imageOptimization"

/**
 * Optimized thumbnail component with lazy loading and blur placeholder
 * Memoized to prevent unnecessary re-renders
 */
const ThumbnailImage = memo(function ThumbnailImage({
    image,
    index,
    productName,
    isSelected,
    onHover
}: {
    image: string
    index: number
    productName: string
    isSelected: boolean
    onHover: (index: number) => void
}) {
    const [isLoaded, setIsLoaded] = useState(false)

    return (
        <div
            data-carousel-item
            data-item-url={image}
            className={clsx(
                "cursor-pointer carousel-item overflow-hidden rounded-lg w-20 h-20 border-primary border transition-all duration-200",
                { 'ring-2 ring-primary shadow ring-offset-1': isSelected },
                { 'opacity-0': !isLoaded }
            )}
            onMouseOver={() => onHover(index)}
            onClick={() => onHover(index)}
        >
            <Image
                src={image}
                alt={`${productName} - Image ${index + 1}`}
                height={100}
                width={100}
                className={clsx(
                    "!relative object-cover transition-opacity duration-300",
                    isLoaded ? "opacity-100" : "opacity-0"
                )}
                quality={imageQuality.thumbnail}
                loading={index < 3 ? "eager" : "lazy"}
                sizes={productImageSizes.thumbnail}
                placeholder="blur"
                blurDataURL={blurPlaceholders.warmNeutral}
                onLoad={() => setIsLoaded(true)}
            />
        </div>
    )
})

/**
 * Skeleton placeholder for main image during loading
 */
const MainImageSkeleton = memo(function MainImageSkeleton() {
    return (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-2xl flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-primary rounded-full animate-spin" />
        </div>
    )
})

/**
 * Thumbnail skeleton during initial load
 */
const ThumbnailSkeleton = memo(function ThumbnailSkeleton() {
    return (
        <div className="flex gap-3 py-3 pl-2">
            {[...Array(4)].map((_, i) => (
                <div
                    key={i}
                    className="w-20 h-20 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                />
            ))}
        </div>
    )
})

/**
 * Mobile Fullscreen Gallery with pinch-to-zoom and pan
 */
const MobileGallery = memo(function MobileGallery({
    images,
    initialIndex,
    productName,
    onClose
}: {
    images: string[]
    initialIndex: number
    productName: string
    onClose: () => void
}) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex)
    const [scale, setScale] = useState(1)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const lastTouchRef = useRef<{ x: number; y: number; dist: number } | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    
    const currentImage = images[currentIndex]
    
    // Reset zoom and position when changing images
    useEffect(() => {
        setScale(1)
        setPosition({ x: 0, y: 0 })
    }, [currentIndex])
    
    // Prevent body scroll when gallery is open
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = ''
        }
    }, [])
    
    // Handle touch start
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        if (e.touches.length === 2) {
            // Pinch gesture start
            const touch1 = e.touches[0]
            const touch2 = e.touches[1]
            const dist = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY)
            const midX = (touch1.clientX + touch2.clientX) / 2
            const midY = (touch1.clientY + touch2.clientY) / 2
            lastTouchRef.current = { x: midX, y: midY, dist }
        } else if (e.touches.length === 1 && scale > 1) {
            // Pan gesture start (only when zoomed)
            setIsDragging(true)
            lastTouchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, dist: 0 }
        }
    }, [scale])
    
    // Handle touch move
    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (e.touches.length === 2 && lastTouchRef.current) {
            // Pinch to zoom
            const touch1 = e.touches[0]
            const touch2 = e.touches[1]
            const dist = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY)
            const scaleDelta = dist / lastTouchRef.current.dist
            
            setScale(prev => Math.max(1, Math.min(4, prev * scaleDelta)))
            
            const midX = (touch1.clientX + touch2.clientX) / 2
            const midY = (touch1.clientY + touch2.clientY) / 2
            lastTouchRef.current = { x: midX, y: midY, dist }
        } else if (e.touches.length === 1 && isDragging && lastTouchRef.current && scale > 1) {
            // Pan when zoomed
            const deltaX = e.touches[0].clientX - lastTouchRef.current.x
            const deltaY = e.touches[0].clientY - lastTouchRef.current.y
            
            setPosition(prev => ({
                x: prev.x + deltaX,
                y: prev.y + deltaY
            }))
            
            lastTouchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, dist: 0 }
        }
    }, [isDragging, scale])
    
    // Handle touch end
    const handleTouchEnd = useCallback(() => {
        setIsDragging(false)
        lastTouchRef.current = null
        
        // Snap back if scale is less than 1
        if (scale < 1.1) {
            setScale(1)
            setPosition({ x: 0, y: 0 })
        }
    }, [scale])
    
    // Navigate to previous image
    const goToPrev = useCallback(() => {
        if (scale > 1) {
            setScale(1)
            setPosition({ x: 0, y: 0 })
        }
        setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1))
    }, [images.length, scale])
    
    // Navigate to next image
    const goToNext = useCallback(() => {
        if (scale > 1) {
            setScale(1)
            setPosition({ x: 0, y: 0 })
        }
        setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0))
    }, [images.length, scale])
    
    // Double tap to zoom
    const lastTapRef = useRef<number>(0)
    const handleDoubleTap = useCallback((e: React.TouchEvent) => {
        const now = Date.now()
        if (now - lastTapRef.current < 300) {
            // Double tap detected
            if (scale > 1) {
                setScale(1)
                setPosition({ x: 0, y: 0 })
            } else {
                setScale(2.5)
            }
        }
        lastTapRef.current = now
    }, [scale])
    
    return (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 text-white">
                <button
                    onClick={onClose}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    aria-label="Close gallery"
                >
                    <IoClose className="w-6 h-6" />
                </button>
                <span className="text-sm font-medium">
                    {currentIndex + 1} / {images.length}
                </span>
                <div className="w-10" /> {/* Spacer for centering */}
            </div>
            
            {/* Main image area */}
            <div
                ref={containerRef}
                className="flex-1 relative overflow-hidden touch-none"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={handleDoubleTap as any}
            >
                <div
                    className="absolute inset-0 flex items-center justify-center transition-transform duration-100"
                    style={{
                        transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                    }}
                >
                    <Image
                        src={currentImage}
                        alt={`${productName} - Image ${currentIndex + 1}`}
                        fill
                        className="object-contain"
                        quality={imageQuality.high}
                        sizes="100vw"
                        priority
                    />
                </div>
                
                {/* Navigation arrows - only show when not zoomed */}
                {scale === 1 && images.length > 1 && (
                    <>
                        <button
                            onClick={goToPrev}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                            aria-label="Previous image"
                        >
                            <IoChevronBack className="w-6 h-6" />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                            aria-label="Next image"
                        >
                            <IoChevronForward className="w-6 h-6" />
                        </button>
                    </>
                )}
            </div>
            
            {/* Thumbnail strip */}
            <div className="p-4 bg-black/50">
                <div className="flex gap-2 justify-center overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                        <button
                            key={img}
                            onClick={() => {
                                setScale(1)
                                setPosition({ x: 0, y: 0 })
                                setCurrentIndex(idx)
                            }}
                            className={clsx(
                                "relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all",
                                idx === currentIndex ? "ring-2 ring-white" : "opacity-50"
                            )}
                        >
                            <Image
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                fill
                                quality={imageQuality.thumbnail}
                                className="object-cover"
                                sizes="64px"
                            />
                        </button>
                    ))}
                </div>
                
                {/* Zoom hint */}
                <p className="text-center text-white/60 text-xs mt-2">
                    Pinch to zoom • Double tap to toggle zoom
                </p>
            </div>
        </div>
    )
})

/**
 * Magnifier configuration
 */
const MAGNIFIER_CONFIG = {
    size: 340,           // Diameter of the magnifier circle
    zoomLevel: 3,      // Magnification level
    borderWidth: 2,      // Border thickness
}

const ImageSection = ({ className, mobile }: { mobile: boolean, className?: string }) => {
    const {
        product,
        selectedImageIndex,
        handleThumbnailHover,
        images
    } = useProductContext() || {}
    
    const sectionRef = useRef<HTMLElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const selectedImage = images?.[selectedImageIndex ?? 0] ?? images?.[0] ?? ""
    
    // Zoom state - position relative to viewport for magnifier placement
    const [isZooming, setIsZooming] = useState(false)
    const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0 })
    const [zoomBgPos, setZoomBgPos] = useState({ x: 0, y: 0 })
    const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)
    
    // Mobile gallery state
    const [isMobileGalleryOpen, setIsMobileGalleryOpen] = useState(false)
    
    // Create portal container on mount
    useEffect(() => {
        setPortalContainer(document.body)
    }, [])

    const [wishAnimate, setWishAnimate] = useState(false)
    const { wishlistItems, refreshWishList } = useDataConnectionContext()
    const { data: session } = useSession()
    const router = useRouter()

    // Memoize zoom background URL for high-res zoom
    const zoomBackgroundUrl = useMemo(() => 
        `/_next/image?url=${encodeURIComponent(selectedImage)}&w=1920&q=${imageQuality.high}`,
        [selectedImage]
    )

    // Handle mouse move for zoom - calculate positions relative to section
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (mobile) return
        
        const container = containerRef.current
        const section = sectionRef.current
        if (!container || !section) return
        
        const containerBounds = container.getBoundingClientRect()
        const sectionBounds = section.getBoundingClientRect()
        
        // Mouse position relative to container (for zoom background calculation)
        const mouseX = e.clientX - containerBounds.left
        const mouseY = e.clientY - containerBounds.top
        
        // Calculate percentage position for background
        const xPercent = Math.max(0, Math.min(100, (mouseX / containerBounds.width) * 100))
        const yPercent = Math.max(0, Math.min(100, (mouseY / containerBounds.height) * 100))
        
        // Magnifier position - use viewport coordinates for portal positioning
        const magnifierX = e.clientX - (MAGNIFIER_CONFIG.size / 2)
        const magnifierY = e.clientY - (MAGNIFIER_CONFIG.size / 2)
        
        setMagnifierPos({ x: magnifierX, y: magnifierY })
        setZoomBgPos({ x: xPercent, y: yPercent })
    }, [mobile])

    const handleMouseEnter = useCallback(() => {
        if (!mobile) setIsZooming(true)
    }, [mobile])

    const handleMouseLeave = useCallback(() => {
        setIsZooming(false)
    }, [])

    const addToWishlist: MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
        e.preventDefault()
        if (session?.user === undefined) {
            router.push("/signin?cb=" + encodeURIComponent(window.location.pathname))
            return
        }
        !wishlistItems.includes((product?._id ?? product?.objectID ?? "").toString() ?? "") ? addProductToWishlist(product?._id?.toString() ?? "", (session?.user as { id: string }).id).then(res => {
            res.ack ? onPageNotifications("success", "Added To Wishlist").catch(e => console.log(e)) : res.ack && onPageNotifications("error", "Failed Adding To Wishlist").catch(e => console.log(e))
        }).catch(err => {
            onPageNotifications("error", "Failed Adding To Wishlist").catch(e => console.log(e))
            console.log(err)
        }).finally(() => { refreshWishList() }) : deleteProductFromWishlist(product?._id?.toString() ?? "", (session?.user as { id: string }).id).then(res => {
            res.ack ? onPageNotifications("success", "Removed From Wishlist").catch(e => console.log(e)) : res.ack && onPageNotifications("error", "Failed Removing From Wishlist").catch(e => console.log(e))
        }).catch(err => {
            onPageNotifications("error", "Failed Removing From Wishlist").catch(e => console.log(e))
            console.log(err)
        }).finally(() => { refreshWishList() })
        setWishAnimate(!wishAnimate)
    }, [session?.user, wishlistItems, product, router, wishAnimate, refreshWishList])

    // Track main image loading state for progressive loading
    const [mainImageLoaded, setMainImageLoaded] = useState(false)
    const [imagesInitialized, setImagesInitialized] = useState(false)

    // Reset loading states when images change
    React.useEffect(() => {
        setMainImageLoaded(false)
        const timer = setTimeout(() => setImagesInitialized(true), 50)
        return () => clearTimeout(timer)
    }, [selectedImage])

    // Preload next/previous images for smoother navigation
    React.useEffect(() => {
        if (!images || images.length <= 1) return
        
        const preloadIndices = [
            (selectedImageIndex ?? 0) - 1,
            (selectedImageIndex ?? 0) + 1
        ].filter(i => i >= 0 && i < images.length)
        
        preloadIndices.forEach(index => {
            const img = new window.Image()
            img.src = images[index]
        })
    }, [selectedImageIndex, images])

    return (
        <section ref={sectionRef} className={clsx(className, "relative pt-4 md:pt-6")}>
            {/* Wishlist button - mobile only */}
            <button 
                className="absolute right-3 top-7 md:top-9 z-30 bg-white/80 backdrop-blur-sm rounded-full p-3 md:hidden transition-all active:scale-90 shadow-md hover:bg-white" 
                onClick={addToWishlist}
                aria-label={wishlistItems.includes((product?._id ?? product?.objectID ?? "").toString() ?? "") ? "Remove from wishlist" : "Add to wishlist"}
            >
                {
                    wishlistItems.includes((product?._id ?? product?.objectID ?? "").toString() ?? "") ?
                        <FaHeart className={clsx("text-red-500 w-6 h-6 transition-transform", wishAnimate && "animate-bounce")} /> : 
                        <FaHeart className='text-gray-400 w-6 h-6 hover:text-red-400 transition-colors' />
                }
            </button>
            
            {/* Main Image Container */}
            <div
                ref={containerRef}
                className={clsx(
                    "rounded-2xl relative md:h-[500px] max-md:aspect-square max-md:w-full max-md:h-auto overflow-hidden bg-gray-50 transition-shadow duration-300",
                    isZooming && "shadow-lg"
                )}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => mobile && setIsMobileGalleryOpen(true)}
                style={{ cursor: mobile ? 'pointer' : (!mobile ? 'none' : 'default') }}
            >
                {/* Skeleton placeholder while image loads */}
                {!mainImageLoaded && <MainImageSkeleton />}
                
                <Image
                    src={selectedImage}
                    alt={product?.productName ?? 'Product image'}
                    data-main-image
                    className={clsx(
                        "!relative object-cover h-full w-full transition-opacity duration-300",
                        mainImageLoaded ? "opacity-100" : "opacity-0"
                    )}
                    loading="eager"
                    sizes={productImageSizes.main}
                    width={800}
                    height={800}
                    quality={imageQuality.high}
                    placeholder="blur"
                    blurDataURL={blurPlaceholders.warmNeutral}
                    onLoad={() => setMainImageLoaded(true)}
                    fetchPriority="high"
                />
            </div>
            
            {/* Circular Magnifier - rendered in portal to avoid clipping */}
            {isZooming && !mobile && mainImageLoaded && portalContainer && createPortal(
                <div
                    className="fixed pointer-events-none rounded-full overflow-hidden"
                    style={{
                        zIndex: 9999,
                        width: MAGNIFIER_CONFIG.size,
                        height: MAGNIFIER_CONFIG.size,
                        left: magnifierPos.x,
                        top: magnifierPos.y,
                        border: `${MAGNIFIER_CONFIG.borderWidth}px solid white`,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255,255,255,0.5)',
                        backgroundImage: `url("${zoomBackgroundUrl}")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: `${zoomBgPos.x}% ${zoomBgPos.y}%`,
                        backgroundSize: `${MAGNIFIER_CONFIG.zoomLevel * 100}%`,
                        backgroundColor: '#fff',
                    }}
                >
                    {/* Crosshair in center of magnifier */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-px h-4 bg-black/20" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="h-px w-4 bg-black/20" />
                    </div>
                </div>,
                portalContainer
            )}
            
            {/* Thumbnails with optimized loading */}
            <div className="carousel w-full gap-3 py-3 pl-2" id="thumbnail-carousel">
                {!imagesInitialized ? (
                    <ThumbnailSkeleton />
                ) : (
                    images?.map((image, index) => (
                        <ThumbnailImage
                            key={image}
                            image={image}
                            index={index}
                            productName={product?.productName ?? 'Product'}
                            isSelected={index === (selectedImageIndex ?? 0)}
                            onHover={handleThumbnailHover ?? (() => {})}
                        />
                    ))
                )}
            </div>
            
            {/* Mobile fullscreen gallery */}
            {mobile && isMobileGalleryOpen && portalContainer && images && createPortal(
                <MobileGallery
                    images={images}
                    initialIndex={selectedImageIndex ?? 0}
                    productName={product?.productName ?? 'Product'}
                    onClose={() => setIsMobileGalleryOpen(false)}
                />,
                portalContainer
            )}
        </section>
    )
}

export default ImageSection
