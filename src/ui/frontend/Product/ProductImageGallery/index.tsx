'use client'
import Image from "next/image"
import React, { useId, useState } from "react"
import Flicked from "../../Sliders/Flicked"
import clsx from "clsx"
import imageHoverZoomHandler from "@/lib/utilities/imageHoverZoomHandler"
import './ProductImageGallery.scss'
import { useProductContext } from "../../Contexts/ProductContext"

const ProductImageGallery = ({ className, mobile = false }: { mobile: boolean, className?: string }) => {
    const [picSelected, setPicSelected] = useState(0)
    const generatedId = useId()
    const { images: imageArray } = useProductContext()

    return (
        <section className={className}>
            {
                !mobile && <div className="overflow-y-scroll h-full ml-3 max-h-[450px]">
                    {
                        imageArray?.map((image, index) => (
                            <div key={image} className={clsx("focus:outline-none cursor-pointer m-3 flex items-center justify-center", { "carousel-cell": !mobile })}>
                                <Image src={image} alt={`image-${index}`} onClick={e => setPicSelected(index)} fill onContextMenu={e => e.preventDefault()} className={clsx("!relative !w-full max-h-16", { "ring-2 ring-primary shadow ring-offset-1": picSelected === index })} quality={5} />
                            </div>
                        ))
                    }
                </div>
            }
            <div className={clsx("sm:overflow-visible items-center justify-center flex", { "mb-4 overflow-hidden relative h-full w-full min-h-[400px] max-h-[500px]": mobile }, { "basis-11/12": !mobile })}>
                {
                    Array.isArray(imageArray) && imageArray.map((image, index) => (
                        <div key={image} className={clsx(picSelected !== index ? "hidden" : `image-${picSelected}`, "rounded-lg mb-4 relative img-zoom-container")} onMouseMove={e => {
                            imageHoverZoomHandler(e, document.getElementById(`${generatedId}-zoomed-${index}`) as HTMLDivElement, document.getElementById(`${generatedId}-mainImage-${index}`) as HTMLImageElement)
                        }}>
                            <Image src={image} alt={`image-${index}`} id={`${generatedId}-mainImage-${index}`} className="!relative mx-auto !h-full !w-auto" fill onContextMenu={e => { e.preventDefault() }} quality={50} placeholder="blur" blurDataURL="data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjcwMCIgaGVpZ2h0PSI0NzUiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImciPgogICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMzMzIiBvZmZzZXQ9IjIwJSIgLz4KICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzIyMiIgb2Zmc2V0PSI1MCUiIC8+CiAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMzMzMiIG9mZnNldD0iNzAlIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjcwMCIgaGVpZ2h0PSI0NzUiIGZpbGw9IiMzMzMiIC8+CiAgPHJlY3QgaWQ9InIiIHdpZHRoPSI3MDAiIGhlaWdodD0iNDc1IiBmaWxsPSJ1cmwoI2cpIiAvPgogIDxhbmltYXRlIHhsaW5rOmhyZWY9IiNyIiBhdHRyaWJ1dGVOYW1lPSJ4IiBmcm9tPSItNzAwIiB0bz0iNzAwIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgIC8+Cjwvc3ZnPg==" fetchPriority="high" priority />
                            <div className="img-zoomed z-10" style={{
                                backgroundImage: `url("/_next/image?url=${encodeURIComponent(image)}&w=1920&q=75")`,
                                backgroundRepeat: "no-repeat",
                                backgroundColor: "#fff"
                            }} id={`${generatedId}-zoomed-${index}`} onContextMenu={e => e.preventDefault()}></div>
                        </div>
                    ))
                }
            </div>
            {mobile && <div className="sm:-mx-2 mb-4 py-4">
                <Flicked options={{
                    asNavFor: "",
                    imagesLoaded: true,
                    draggable: false,
                    percentPosition: false,
                    groupCells: "100%",
                    pageDots: false
                }} className={clsx("px-4", !mobile ? "carousel-nav" : "", { "h-full": mobile })}>
                    {
                        imageArray?.map((image, index) => (
                            <div key={image} className={clsx("focus:outline-none cursor-pointer m-3", { "carousel-cell": !mobile })}>
                                <Image src={image} alt={`image-${index}`} onMouseOver={e => setPicSelected(index)} fill onContextMenu={e => e.preventDefault()} className={clsx("!relative !w-auto !h-16", { "ring-2 ring-primary shadow ring-offset-1": picSelected === index }, { "-rotate-90": !mobile })} quality={5} placeholder="blur" blurDataURL="data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjcwMCIgaGVpZ2h0PSI0NzUiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImciPgogICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjMzMzIiBvZmZzZXQ9IjIwJSIgLz4KICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzIyMiIgb2Zmc2V0PSI1MCUiIC8+CiAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMzMzMiIG9mZnNldD0iNzAlIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjcwMCIgaGVpZ2h0PSI0NzUiIGZpbGw9IiMzMzMiIC8+CiAgPHJlY3QgaWQ9InIiIHdpZHRoPSI3MDAiIGhlaWdodD0iNDc1IiBmaWxsPSJ1cmwoI2cpIiAvPgogIDxhbmltYXRlIHhsaW5rOmhyZWY9IiNyIiBhdHRyaWJ1dGVOYW1lPSJ4IiBmcm9tPSItNzAwIiB0bz0iNzAwIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgIC8+Cjwvc3ZnPg==" />
                            </div>
                        ))
                    }
                </Flicked>
            </div>}
        </section>
    )
}

export default ProductImageGallery