'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaArrowRight, FaChevronRight } from 'react-icons/fa'

const serifFace = {
    fontFamily: 'Georgia, "Times New Roman", serif',
}

interface RoomItem {
    id: number
    title: string
    content: string
    image: string
}

const roomItems: RoomItem[] = [
    {
        id: 1,
        title: 'Entryway / Hallway',
        content: 'This area has heavy foot traffic, so choose a long runner rug. Darker shades and durable jute materials hide dirt easily and withstand daily wear.',
        image: '/test/room-entryway.png',
    },
    {
        id: 2,
        title: 'Bedroom',
        content: 'The bedroom is a relaxing sanctuary. Select soft, textured rugs with a cohesive color scheme, placed under or alongside the bed for morning comfort.',
        image: '/test/room-bedroom.png',
    },
    {
        id: 3,
        title: 'Dining Room',
        content: 'The dining room needs a flat-weave or durable jute rug that fits completely under the table and chairs, aligning perfectly with the table shape.',
        image: '/test/room-dining.png',
    },
    {
        id: 4,
        title: 'Living Room',
        content: 'For the living room, match your rug to the scale of your sofa layout. Choose coordinating tones and textures to tie the room and decor together.',
        image: '/test/room-living.png',
    },
]

// ==========================================
// --- OPTION 1: Luxury Asymmetric Gallery Cards (Visual Grid) ---
// ==========================================
function RoomLayoutOption1({ items }: { items: RoomItem[] }) {
    return (
        <div className="w-full py-12 bg-[#fdfaf6]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <span className="text-xs uppercase tracking-widest text-[#a76f3c] font-semibold">Option 1</span>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal text-gray-900 mt-1" style={serifFace}>
                        Shop By Room &mdash; Asymmetric Gallery
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 max-w-xl mx-auto">
                        A beautiful visual grid of styled living spaces featuring our signature collection.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {items.map((item, idx) => {
                        // Alternate wide and narrow layout
                        // Card 1: Wide (col-span-7), Card 2: Narrow (col-span-5)
                        // Card 3: Narrow (col-span-5), Card 4: Wide (col-span-7)
                        const gridColSpan = idx === 0 || idx === 3 ? 'lg:col-span-7' : 'lg:col-span-5'
                        return (
                            <div
                                key={item.id}
                                className={`relative overflow-hidden rounded-3xl aspect-[16/10] lg:aspect-auto lg:h-[350px] group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 border border-[#e5ccb5]/20 ${gridColSpan}`}
                            >
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    sizes="(min-width: 1024px) 50vw, 100vw"
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-300" />
                                
                                <div className="text-5xl font-serif text-white/10 absolute right-6 bottom-6 group-hover:text-[#d0a368]/20 transition-colors duration-300 pointer-events-none">
                                    0{item.id}
                                </div>

                                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-white z-10">
                                    <h3 className="text-xl sm:text-2xl font-bold leading-tight font-serif text-[#fcfcfc] group-hover:text-[#dfc3a3] transition-colors duration-300">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2 text-xs sm:text-sm text-neutral-300 font-light max-w-[85%] leading-relaxed line-clamp-2 lg:line-clamp-3">
                                        {item.content}
                                    </p>
                                    <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#d0a368] group-hover:text-white transition-colors duration-300">
                                        Explore Rugs <FaArrowRight className="size-3" />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

// ==========================================
// --- OPTION 2: Elegant Editorial Tabs with Interactive Showcase ---
// ==========================================
function RoomLayoutOption2({ items }: { items: RoomItem[] }) {
    const [activeIndex, setActiveIndex] = useState(0)
    const activeItem = items[activeIndex]

    return (
        <div className="w-full py-12 bg-[#f8f5f0]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <span className="text-xs uppercase tracking-widest text-[#a76f3c] font-semibold">Option 2</span>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal text-gray-900 mt-1" style={serifFace}>
                        Shop By Room &mdash; Editorial Showcase
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 max-w-xl mx-auto">
                        An interactive editorial style guide displaying rug placement recommendations.
                    </p>
                </div>

                {/* Mobile Tab Scroll */}
                <div className="flex lg:hidden overflow-x-auto gap-2 scrollbar-hide pb-4 -mx-4 px-4">
                    {items.map((item, idx) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveIndex(idx)}
                            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-all duration-300 ${
                                activeIndex === idx
                                    ? 'bg-[#a76f3c] text-white border-[#a76f3c] shadow-sm'
                                    : 'bg-white text-gray-700 border-[#e5ccb5]/40 hover:border-[#a76f3c]/40'
                            }`}
                        >
                            0{item.id}. {item.title}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mt-4">
                    {/* Left Column: Vertical Links (Desktop Only) */}
                    <div className="hidden lg:flex lg:col-span-5 flex-col gap-6">
                        {items.map((item, idx) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveIndex(idx)}
                                className="group flex items-start text-left gap-4 py-2.5 transition-all duration-300 border-l-2 border-transparent pl-4 hover:border-[#a76f3c]/30"
                            >
                                <span className={`text-sm font-serif transition-colors duration-300 ${activeIndex === idx ? 'text-[#a76f3c] font-bold' : 'text-gray-400 group-hover:text-[#a76f3c]'}`}>
                                    0{item.id}
                                </span>
                                <div>
                                    <h3 className={`text-lg font-semibold tracking-wide transition-colors duration-300 uppercase ${activeIndex === idx ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-900'}`}>
                                        {item.title}
                                    </h3>
                                    <div className={`h-[1px] bg-[#a76f3c] transition-all duration-300 ${activeIndex === idx ? 'w-16 mt-1' : 'w-0 group-hover:w-8 mt-1'}`} />
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Right Column: Visual Box */}
                    <div className="col-span-1 lg:col-span-7">
                        <div className="border border-[#dfd0c2]/60 rounded-3xl p-3 sm:p-4 bg-white/70 backdrop-blur shadow-sm flex flex-col gap-4 sm:gap-6">
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100">
                                <Image
                                    key={activeItem.id} // Forces re-mount or re-render animation
                                    src={activeItem.image}
                                    alt={activeItem.title}
                                    fill
                                    sizes="(min-width: 1024px) 50vw, 100vw"
                                    className="object-cover animate-[fadeIn_0.5s_ease-in-out]"
                                />
                            </div>
                            <div className="px-2 pb-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs uppercase tracking-widest font-semibold text-[#a76f3c]">Recommended Design</span>
                                    <div className="h-px flex-1 bg-[#dfd0c2]/50" />
                                </div>
                                <h4 className="text-xl font-bold font-serif text-gray-900 mt-2">
                                    {activeItem.title} Placement
                                </h4>
                                <p className="mt-3 text-sm text-gray-600 leading-relaxed font-light">
                                    {activeItem.content}
                                </p>
                                <div className="mt-5">
                                    <Link href="/products" className="inline-flex items-center gap-2 text-xs font-semibold text-[#a76f3c] hover:text-[#6c4624] transition-colors duration-300 uppercase tracking-widest border-b border-[#a76f3c] pb-0.5">
                                        Browse Room Collection <FaChevronRight className="size-2.5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ==========================================
// --- OPTION 3: Modern Alternating Split Grid ---
// ==========================================
function RoomLayoutOption3({ items }: { items: RoomItem[] }) {
    return (
        <div className="w-full py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <span className="text-xs uppercase tracking-widest text-[#a76f3c] font-semibold">Option 3</span>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal text-gray-900 mt-1" style={serifFace}>
                        Shop By Room &mdash; Alternating Split
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 max-w-xl mx-auto">
                        A clean, structured layout displaying detailed placement guide alongside styled imagery.
                    </p>
                </div>

                <div className="flex flex-col gap-16 lg:gap-24">
                    {items.map((item, idx) => {
                        const isEven = idx % 2 === 0
                        return (
                            <div
                                key={item.id}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
                            >
                                {/* Image Container */}
                                <div className={`relative h-[260px] sm:h-[340px] rounded-3xl overflow-hidden shadow-md group ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        sizes="(min-width: 1024px) 50vw, 100vw"
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                                </div>

                                {/* Text Content */}
                                <div className={`flex flex-col ${isEven ? 'lg:order-2 lg:pl-4' : 'lg:order-1 lg:pr-4'}`}>
                                    <span className="text-5xl font-serif text-[#e5ccb5]/40 leading-none select-none">
                                        0{item.id}
                                    </span>
                                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-2">
                                        {item.title}
                                    </h3>
                                    <div className="w-12 h-[2.5px] bg-[#a76f3c] rounded-full my-4" />
                                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-light">
                                        {item.content}
                                    </p>
                                    <div className="mt-6">
                                        <Link href="/products" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-900 text-xs font-semibold text-gray-900 uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all duration-300">
                                            Shop {item.title} <FaChevronRight className="size-2.5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

// ==========================================
// --- OPTION 4: Editorial Room Cards Row / Carousel ---
// ==========================================
function RoomLayoutOption4({ items }: { items: RoomItem[] }) {
    return (
        <div className="w-full py-12 bg-[#faf7f2] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <span className="text-xs uppercase tracking-widest text-[#a76f3c] font-semibold">Option 4</span>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal text-gray-900 mt-1" style={serifFace}>
                        Shop By Room &mdash; Luxury Carousel Cards
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 max-w-xl mx-auto">
                        Sleek vertical cards that present styled photography and placement guidelines in a horizontal row.
                    </p>
                </div>

                {/* Mobile Scroll / Desktop Grid Container */}
                <div className="flex lg:grid lg:grid-cols-4 overflow-x-auto lg:overflow-x-visible gap-6 scrollbar-hide pb-6 lg:pb-0 px-4 -mx-4 lg:px-0 lg:mx-0">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="w-[280px] sm:w-[320px] lg:w-auto shrink-0 flex flex-col group bg-white border border-[#e5ccb5]/20 rounded-3xl p-3 sm:p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-[#6c4624]/20"
                        >
                            {/* Card Image */}
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    sizes="(min-width: 1024px) 25vw, 80vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                            </div>

                            {/* Card Body */}
                            <div className="relative mt-4 px-2 pb-2">
                                {/* Watermark number behind text */}
                                <div className="text-6xl font-serif text-[#e5ccb5]/15 absolute right-2 -top-6 select-none font-bold group-hover:text-[#a76f3c]/15 transition-colors duration-300">
                                    {item.id}
                                </div>
                                
                                <div className="h-[2px] w-8 bg-[#a76f3c] mb-3" />
                                <h3 className="text-lg font-bold font-serif text-gray-900 group-hover:text-[#a76f3c] transition-colors duration-300">
                                    {item.title}
                                </h3>
                                <p className="mt-2 text-xs text-gray-500 leading-relaxed font-light line-clamp-3">
                                    {item.content}
                                </p>
                                <div className="mt-4 pt-1">
                                    <Link href="/products" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#a76f3c] uppercase tracking-wider group-hover:underline">
                                        Explore <FaArrowRight className="size-2.5 transition-transform duration-300 group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ==========================================
// --- Switcher Shell Component ---
// ==========================================
export default function RoomOptionsSwitcher() {
    const [selectedOption, setSelectedOption] = useState<1 | 2 | 3 | 4>(1)

    return (
        <div className="w-full border-t border-[#dfd0c2]/40 bg-white">
            {/* Sticky controls bar */}
            <div className="sticky top-0 z-30 w-full border-b border-[#dfd0c2]/30 bg-white/90 py-3.5 backdrop-blur-md shadow-sm">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-left">
                        <span className="text-xs uppercase tracking-widest text-[#a76f3c] font-semibold">Redesign Switcher</span>
                        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Shop By Room Options</h2>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2 bg-[#f5efe7] rounded-full p-1 border border-[#e5ccb5]/30">
                        {([1, 2, 3, 4] as const).map((num) => (
                            <button
                                key={num}
                                onClick={() => setSelectedOption(num)}
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                                    selectedOption === num
                                        ? 'bg-[#a76f3c] text-white shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-[#e5ccb5]/20'
                                }`}
                            >
                                Option {num}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Layout Display Section */}
            <div className="transition-all duration-500 animate-[fadeIn_0.4s_ease-out]">
                {selectedOption === 1 && <RoomLayoutOption1 items={roomItems} />}
                {selectedOption === 2 && <RoomLayoutOption2 items={roomItems} />}
                {selectedOption === 3 && <RoomLayoutOption3 items={roomItems} />}
                {selectedOption === 4 && <RoomLayoutOption4 items={roomItems} />}
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
