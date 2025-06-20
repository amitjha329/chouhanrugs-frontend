'use client'
import { ProductDataModelWithColorMap } from '@/types/ProductDataModel'
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

const ProductDataContext = createContext<Partial<{
    product: ProductDataModelWithColorMap,
    variation: string,
    isVariation: boolean,
    images: string[],
    setIsVariation: React.Dispatch<React.SetStateAction<boolean>>,
    setVariation: React.Dispatch<React.SetStateAction<string>>,
    selectedImageIndex: number,
    setSelectedImageIndex: React.Dispatch<React.SetStateAction<number>>,
    handleThumbnailHover: (index: number) => void,
    zoomPosition: { x: number; y: number } | null,
    handleImageMouseMove: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, mainImageRef: React.RefObject<HTMLImageElement>) => void,
    handleImageMouseLeave: () => void,
    // Add these for color/size selection
    selectedColor: string,
    setSelectedColor: React.Dispatch<React.SetStateAction<string>>,
    selectedSize: string,
    setSelectedSize: React.Dispatch<React.SetStateAction<string>>,
    handleAddToCart: (userId: string, productId: string, quantity: number, variationCode: string, onSuccess?: () => void, onError?: (err: any) => void) => Promise<void>,
    handleBuyNow: (userId: string, productId: string, quantity: number, variationCode: string, onSuccess?: () => void, onError?: (err: any) => void) => Promise<void>,
    priceLoading: boolean,
}>>({})

const ProductContext = ({ children, product }: { children: React.ReactNode, product: any }) => {
    const [variation, setVariation] = useState("")
    const [images, setImages] = useState<string[]>(product.images)
    const [isVariation, setIsVariation] = useState(false)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [zoomPosition, setZoomPosition] = useState<{ x: number; y: number } | null>(null)

    useEffect(()=>{
        console.log("Product images:", product)
    }, [product])

    // New state for color and size selection (handle missing colorData/sizeData gracefully)
    // Find the smallest size by area for default selection
    const getSmallestSizeCode = () => {
        if (!product.sizeData || product.sizeData.length === 0) return '';
        const parse = (s: string) => {
            const match = s.match(/(\d+(?:\.\d+)?)\s*[xX]\s*(\d+(?:\.\d+)?)/);
            if (!match) return [0, 0];
            return [parseFloat(match[1]), parseFloat(match[2])];
        };
        const sorted = [...product.sizeData].sort((a: any, b: any) => {
            const [aw, ah] = parse(a.sizeCode);
            const [bw, bh] = parse(b.sizeCode);
            return (aw * ah) - (bw * bh);
        });
        return sorted[0]?.sizeCode || '';
    };
    const [selectedColor, setSelectedColor] = useState(product.colorData?.[0]?.name || '');
    const [selectedSize, setSelectedSize] = useState(getSmallestSizeCode());

    // If sizeData changes, update selectedSize to the new smallest
    useEffect(() => {
        if (product.sizeData && product.sizeData.length > 0) {
            const smallest = getSmallestSizeCode();
            setSelectedSize((prev: string) => (product.sizeData.some((s: any) => s.sizeCode === prev) ? prev : smallest));
        }
    }, [product.sizeData])

    useEffect(() => {
        if (selectedColor && selectedSize) {
            setVariation(`${selectedSize}_${selectedColor}`)
            setIsVariation(true)
        } else if (selectedColor) {
            setVariation(selectedColor)
            setIsVariation(true)
        } else if (selectedSize) {
            setVariation(selectedSize)
            setIsVariation(true)
        } else {
            setIsVariation(false)
        }
    }, [selectedColor, selectedSize])

    useEffect(() => {
        if (isVariation) {
            const variationImage = (product.variations.find((item: any) => item.variationCode == variation)?.variationImages ?? [])
            setImages((variationImage?.length ?? 0) > 0 ? variationImage : product.images)
            setSelectedImageIndex(0)
        }
    }, [isVariation, product, variation])

    // Helper: get current variation object
    const getCurrentVariation = React.useCallback(() => {
        if (!product.variations) return undefined;
        if (selectedColor && selectedSize) {
            return product.variations.find((v: any) => v.variationColor === selectedColor && v.variationSize === selectedSize);
        } else if (selectedColor) {
            return product.variations.find((v: any) => v.variationColor === selectedColor);
        } else if (selectedSize) {
            return product.variations.find((v: any) => v.variationSize === selectedSize);
        }
        return undefined;
    }, [product.variations, selectedColor, selectedSize]);

    // Update images, msrp, and price when variation changes
    useEffect(() => {
        const variationObj = getCurrentVariation();
        if (variationObj) {
            setVariation(variationObj.variationCode);
            setIsVariation(true);
            // Update images if variationImages exist
            if (variationObj.variationImages && variationObj.variationImages.length > 0) {
                setImages(variationObj.variationImages);
                setSelectedImageIndex(0);
            } else {
                setImages(product.images);
                setSelectedImageIndex(0);
            }
        } else {
            setIsVariation(false);
            setVariation('');
            setImages(product.images);
            setSelectedImageIndex(0);
        }
    }, [selectedColor, selectedSize, product.images, product.variations, getCurrentVariation]);
    useEffect(() => {
        if (typeof window !== 'undefined' && product.colorData && selectedColor) {
            const colorObj = product.colorData.find((c: any) => c.name === selectedColor);
            const colorDisplayer = document.getElementById('display-color');
            if (colorDisplayer && colorObj) {
                colorDisplayer.style.backgroundColor = colorObj.colorCode.hex;
            }
        }
    }, [selectedColor, product.colorData]);

    // Handler for thumbnail hover
    const handleThumbnailHover = (index: number) => {
        setSelectedImageIndex(index)
    }

    // Handler for mouse move on main image
    const handleImageMouseMove = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        mainImageRef: React.RefObject<HTMLImageElement>
    ) => {
        const mainImage = mainImageRef.current
        if (!mainImage) return
        const rect = mainImage.getBoundingClientRect()
        let x = e.clientX - rect.left
        let y = e.clientY - rect.top
        let xperc = (x / rect.width) * 100
        let yperc = (y / rect.height) * 100
        if (x > 0.01 * rect.width) xperc += 0.15 * xperc
        if (y >= 0.01 * rect.height) yperc += 0.15 * yperc
        setZoomPosition({ x: xperc - 9, y: yperc - 9 })
    }

    // Optimization: Preload images for instant switching (browser cache)
    useEffect(() => {
        if (!images || images.length === 0) return;
        images.forEach((img) => {
            const url = `/_next/image?url=${encodeURIComponent(img)}&w=1920&q=100`;
            const preload = new window.Image();
            preload.src = url;
        });
    }, [images]);

    // Optimization: Reset zoomPosition on mouse leave for accessibility and performance
    const handleImageMouseLeave = () => {
        setZoomPosition(null);
    };

    // Add to Cart and Buy Now handlers
    const handleAddToCart = async (userId: string, productId: string, quantity: number, variationCode: string, onSuccess?: () => void, onError?: (err: any) => void) => {
        try {
            const res = await fetch('/api/user/addtocart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, userId, quantity, variationCode })
            });
            if (res.ok) {
                if (onSuccess) onSuccess();
            } else {
                if (onError) onError(await res.text());
            }
        } catch (err) {
            if (onError) onError(err);
        }
    };

    const handleBuyNow = async (userId: string, productId: string, quantity: number, variationCode: string, onSuccess?: () => void, onError?: (err: any) => void) => {
        try {
            const res = await fetch('/api/user/addtocart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, userId, quantity, variationCode })
            });
            if (res.ok) {
                if (onSuccess) onSuccess();
            } else {
                if (onError) onError(await res.text());
            }
        } catch (err) {
            if (onError) onError(err);
        }
    };

    // Universal loading state for price/variation
    const [priceLoading, setPriceLoading] = useState(true);
    useEffect(() => {
        // If product has no variations, or both colorData and sizeData are empty, loading should be false
        if (
            (!product.variations || product.variations.length === 0) ||
            ((Array.isArray(product.colorData) && product.colorData.length === 0) && (Array.isArray(product.sizeData) && product.sizeData.length === 0))
        ) {
            setPriceLoading(false);
        } else if (selectedSize && (selectedColor !== undefined)) {
            setPriceLoading(false);
        } else {
            setPriceLoading(true);
        }
    }, [selectedSize, selectedColor, product.variations, product.colorData, product.sizeData]);

    const value = useMemo(() => ({
        product,
        variation,
        isVariation,
        images,
        setVariation,
        setIsVariation,
        selectedImageIndex,
        setSelectedImageIndex,
        handleThumbnailHover,
        zoomPosition,
        handleImageMouseMove,
        handleImageMouseLeave,
        // Expose new state and setters
        selectedColor,
        setSelectedColor,
        selectedSize,
        setSelectedSize,
        handleAddToCart,
        handleBuyNow,
        priceLoading
    }), [images, isVariation, product, variation, selectedImageIndex, zoomPosition, selectedColor, selectedSize, priceLoading])

    return <ProductDataContext.Provider value={value}>
        {children}
    </ProductDataContext.Provider>
}

export const useProductContext = () => {
    return useContext(ProductDataContext)
}

export default ProductContext