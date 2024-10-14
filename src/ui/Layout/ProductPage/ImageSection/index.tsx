'use client'
import Image from "next/image"
import React, { useId, useState } from "react"
import clsx from "clsx"
import './ProductImageGallery.scss'
import imageHoverZoomHandler from "@/backend/clientActions/imageHoveZoomHandler"

const ImageSection = ({ className, imageArray, mobile = false }: { mobile: boolean, className?: string, imageArray: string[] }) => {
    const [picSelected, setPicSelected] = useState(0)
    const generatedId = useId()

    return (
        <section className={className}>
            <div className={clsx("sm:overflow-visible items-center justify-center flex")}>
                {
                    Array.isArray(imageArray) && imageArray.map((image, index) => (
                        <div key={image} className={clsx(picSelected !== index ? "hidden" : `image-${picSelected}`, "rounded-lg mb-4 relative img-zoom-container !h-[500px] overflow-hidden")} onMouseMove={e => {
                            imageHoverZoomHandler(e, document.getElementById(`${generatedId}-zoomed-${index}`) as HTMLDivElement, document.getElementById(`${generatedId}-mainImage-${index}`) as HTMLImageElement)
                        }}>
                            <Image src={image} alt={`image-${index}`} id={`${generatedId}-mainImage-${index}`} className="!relative mx-auto object-cover" fill onContextMenu={e => { e.preventDefault() }} quality={50} placeholder="blur" blurDataURL="data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjcwMCIgaGVpZ2h0PSI0NzUiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImciPgogICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMzMzIiBvZmZzZXQ9IjIwJSIgLz4KICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzIyMiIgb2Zmc2V0PSI1MCUiIC8+CiAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMzMzMiIG9mZnNldD0iNzAlIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjcwMCIgaGVpZ2h0PSI0NzUiIGZpbGw9IiMzMzMiIC8+CiAgPHJlY3QgaWQ9InIiIHdpZHRoPSI3MDAiIGhlaWdodD0iNDc1IiBmaWxsPSJ1cmwoI2cpIiAvPgogIDxhbmltYXRlIHhsaW5rOmhyZWY9IiNyIiBhdHRyaWJ1dGVOYW1lPSJ4IiBmcm9tPSItNzAwIiB0bz0iNzAwIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgIC8+Cjwvc3ZnPg==" fetchPriority="high" priority />
                            <div className="img-zoomed z-10" style={{
                                backgroundImage: `url("/_next/image?url=${encodeURIComponent(image)}&w=1920&q=75")`,
                                backgroundRepeat: "no-repeat",
                                backgroundColor: "#fff"
                            }} id={`${generatedId}-zoomed-${index}`} onContextMenu={e => e.preventDefault()}></div>
                        </div>
                    ))
                }
            </div>
            <div className="carousel w-full gap-3">
                {
                    imageArray?.map((image, index) => (
                        <div key={image} className={clsx("cursor-pointer carousel-item overflow-hidden rounded-lg w-20 h-20 border-primary border")}>
                            <Image src={image} alt={`image-${index}`} onMouseOver={e => setPicSelected(index)} fill onContextMenu={e => e.preventDefault()} className={clsx("!relative object-cover", { "ring-2 ring-primary shadow ring-offset-1": picSelected === index })} quality={5} placeholder="blur" blurDataURL="data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjcwMCIgaGVpZ2h0PSI0NzUiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImciPgogICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMzMzIiBvZmZzZXQ9IjIwJSIgLz4KICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzIyMiIgb2Zmc2V0PSI1MCUiIC8+CiAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMzMzMiIG9mZnNldD0iNzAlIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjcwMCIgaGVpZ2h0PSI0NzUiIGZpbGw9IiMzMzMiIC8+CiAgPHJlY3QgaWQ9InIiIHdpZHRoPSI3MDAiIGhlaWdodD0iNDc1IiBmaWxsPSJ1cmwoI2cpIiAvPgogIDxhbmltYXRlIHhsaW5rOmhyZWY9IiNyIiBhdHRyaWJ1dGVOYW1lPSJ4IiBmcm9tPSItNzAwIiB0bz0iNzAwIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgIC8+Cjwvc3ZnPg==" />
                        </div>
                    ))
                }
            </div>
        </section>
    )
}

export default ImageSection