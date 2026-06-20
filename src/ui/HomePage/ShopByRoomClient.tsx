'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaChevronRight } from 'react-icons/fa'

const serifFace = {
    fontFamily: 'Georgia, "Times New Roman", serif',
}

interface RoomItem {
    id: number
    title: string
    content: string
    image: string
}

interface ShopByRoomClientProps {
    items: RoomItem[]
    title: string
    headingTag: any
}

export default function ShopByRoomClient({ items, title, headingTag: HeadingTag = 'h2' }: ShopByRoomClientProps) {
    const [activeIndex, setActiveIndex] = useState(0)
    const activeItem = items[activeIndex] || items[0]

    return (
        <div className="w-full py-10 bg-[#f8f5f0]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Title with Subtitle and Gold Underline */}
                <div className="text-center mb-8">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a76f3c] mb-1.5 block">
                        Placement Guide
                    </span>
                    <HeadingTag className="text-center font-serif text-2xl md:text-3xl font-extrabold text-[#5d3c1e] tracking-tight leading-tight mb-3">
                        {title}
                    </HeadingTag>
                    <div className="h-0.5 w-16 bg-[#e5ccb5] mx-auto" />
                </div>

                {/* Mobile Tab Horizontal Scroll */}
                <div className="flex lg:hidden overflow-x-auto gap-2 scrollbar-hide pb-3 -mx-4 px-4 mb-3">
                    {items.map((item, idx) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveIndex(idx)}
                            className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all duration-300 ${
                                activeIndex === idx
                                    ? 'bg-[#a76f3c] text-white border-[#a76f3c] shadow-sm'
                                    : 'bg-white text-[#5d3c1e] border-[#e5ccb5]/40 hover:border-[#a76f3c]/40'
                            }`}
                        >
                            0{item.id}. {item.title}
                        </button>
                    ))}
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                    {/* Left Column: Vertical Links (Desktop Only) */}
                    <div className="hidden lg:flex lg:col-span-5 flex-col gap-4">
                        {items.map((item, idx) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveIndex(idx)}
                                className="group flex items-start text-left gap-3.5 py-2 transition-all duration-300 border-l-2 border-transparent pl-4 hover:border-[#a76f3c]/30"
                            >
                                <span className={`text-sm font-serif transition-colors duration-300 ${activeIndex === idx ? 'text-[#a76f3c] font-bold' : 'text-gray-400 group-hover:text-[#a76f3c]'}`}>
                                    0{item.id}
                                </span>
                                <div>
                                    <h3 className={`text-sm sm:text-base font-bold tracking-wider transition-colors duration-300 uppercase ${activeIndex === idx ? 'text-[#5d3c1e]' : 'text-gray-500 group-hover:text-gray-900'}`}>
                                        {item.title}
                                    </h3>
                                    <div className={`h-[1.5px] bg-[#a76f3c] transition-all duration-300 ${activeIndex === idx ? 'w-12 mt-1' : 'w-0 group-hover:w-6 mt-1'}`} />
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Right Column: Visual Showcase Box */}
                    <div className="col-span-1 lg:col-span-7">
                        <div className="border border-[#dfd0c2]/60 rounded-2xl p-2.5 sm:p-3.5 bg-white/70 backdrop-blur shadow-sm flex flex-col gap-3 sm:gap-4">
                            <div className="relative aspect-[16/10] max-h-[220px] sm:max-h-[300px] rounded-xl overflow-hidden bg-stone-50">
                                <Image
                                    key={activeItem.id} // Forces re-mount or re-render fade animation on change
                                    src={activeItem.image}
                                    alt={activeItem.title}
                                    fill
                                    sizes="(min-width: 1024px) 50vw, 100vw"
                                    className="object-cover animate-[fadeIn_0.5s_ease-in-out]"
                                    priority
                                />
                            </div>
                            <div className="px-1.5 pb-1">
                                <div className="flex items-center gap-2.5">
                                    <span className="text-[10px] uppercase tracking-widest font-semibold text-[#a76f3c]">Room Guide</span>
                                    <div className="h-px flex-1 bg-[#dfd0c2]/30" />
                                </div>
                                <h4 className="text-lg font-bold font-serif text-[#5d3c1e] mt-1.5" style={serifFace}>
                                    {activeItem.title} Rug Placement
                                </h4>
                                <p className="mt-2 text-xs text-gray-600 leading-relaxed font-light">
                                    {activeItem.content}
                                </p>
                                <div className="mt-4">
                                    <Link href="/products" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#a76f3c] hover:text-[#6c4624] transition-colors duration-300 uppercase tracking-widest border-b border-[#a76f3c] pb-0.5">
                                        Shop {activeItem.title} Rugs <FaChevronRight className="size-2" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    )
}
