import ColorDataModel from '@/types/ColorDataModel'
import Link from 'next/link'
import React from 'react'

const ColorItem = (props: ColorDataModel) => {
    const hex = props.colorCode?.hex || '#d8c8b8'

    return (
        <Link
            href={`/products?color=${encodeURIComponent(props.name)}`}
            prefetch={false}
            aria-label={`Shop ${props.name} products`}
            className="group flex min-w-0 items-center gap-2 rounded-full border border-[#eadfd6] bg-white py-1.5 pl-1.5 pr-3 text-left shadow-[0_8px_22px_rgba(83,53,28,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_12px_28px_rgba(83,53,28,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
        >
            <span
                className="h-9 w-9 shrink-0 rounded-full border border-black/10 shadow-inner ring-2 ring-white"
                style={{ backgroundColor: hex }}
                aria-hidden="true"
            />
            <span className="min-w-0">
                <span className="block truncate text-xs font-semibold leading-4 text-[#2d2119] sm:text-[13px]">
                    {props.name}
                </span>
                <span className="block text-[10px] font-medium uppercase tracking-[0.12em] text-base-content/45">
                    Explore
                </span>
            </span>
        </Link>
    )
}

export default ColorItem
