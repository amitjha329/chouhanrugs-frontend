import SizeDataModel from '@/types/SizeDataModel'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type SizeItemsProps = SizeDataModel & {
    index: number
}

const sizeDescriptions = [
    'Perfect for compact spaces and small seating areas',
    'Great for bedrooms and layered corners',
    'Ideal for living rooms and larger lounge areas',
    'Balanced for dining rooms and spacious layouts',
    'Best for open spaces and grand interiors',
]

const roomLabels = ['Living room', 'Bedroom', 'Lounge', 'Dining', 'Open plan']

const formatSizeName = (name: string) => {
    const cleanedName = name.replace(/\s+/g, ' ').trim()
    return cleanedName.replace(/\b(feet|foot)\b/gi, 'FT')
}

const SizeItems = (props: SizeItemsProps) => {
    const description = sizeDescriptions[props.index] ?? 'A versatile size for everyday styling'
    const roomLabel = roomLabels[props.index] ?? 'Everyday spaces'

    return (
        <Link
            href={`/products?size=${props.sizeCode}`}
            aria-label={`Shop ${props.name} rugs`}
            className="group relative flex min-h-[13.5rem] overflow-hidden rounded-xl border border-primary/10 bg-[#fffaf3] text-base-content shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#7c5737] hover:bg-[#6b4428] hover:text-white hover:shadow-[0_24px_54px_rgba(69,42,22,0.24)] focus:outline-none focus-visible:-translate-y-1 focus-visible:border-[#7c5737] focus-visible:bg-[#6b4428] focus-visible:text-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 sm:min-h-[21rem] sm:rounded-[18px]"
        >
            <div className="flex w-full flex-col">
                <div className="relative h-24 overflow-hidden bg-[#f3eadf] sm:h-40">
                    <Image
                        src={props.sizeBanner}
                        alt={`${props.name} rug in a styled room`}
                        fill
                        className="object-scale-down p-2 transition duration-500 group-hover:scale-[1.03] sm:p-3"
                        sizes="(max-width: 640px) 44vw, (max-width: 1024px) 42vw, 18vw"
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_38%)] opacity-60 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
                </div>

                <div className="flex flex-1 flex-col bg-[#fffaf3] px-3 py-3 text-center transition duration-300 group-hover:bg-[#6b4428] group-focus-visible:bg-[#6b4428] sm:px-5 sm:py-5">
                    <div className="font-serif text-2xl leading-none text-primary transition duration-300 group-hover:text-[#f8e4d1] group-focus-visible:text-[#f8e4d1] sm:text-4xl">
                        {formatSizeName(props.name)}
                    </div>
                    <p className="mx-auto mt-2 min-h-8 max-w-40 text-[11px] leading-4 text-base-content/70 transition duration-300 group-hover:text-[#f7ede4] group-focus-visible:text-[#f7ede4] sm:mt-3 sm:min-h-10 sm:max-w-48 sm:text-sm sm:leading-5">
                        {description}
                    </p>
                    <div className="mt-auto pt-4 text-[11px] font-semibold uppercase tracking-[0.06em] text-primary transition duration-300 group-hover:text-[#f8e4d1] group-focus-visible:text-[#f8e4d1] sm:pt-6 sm:text-sm sm:tracking-[0.08em]">
                        Shop now <span aria-hidden="true" className="inline-block transition group-hover:translate-x-1">-&gt;</span>
                    </div>
                    <div className="mt-1 text-[10px] text-base-content/45 transition duration-300 group-hover:text-[#f0d7c4] group-focus-visible:text-[#f0d7c4] sm:mt-2 sm:text-xs">
                        {roomLabel}
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default SizeItems
