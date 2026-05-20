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

const SizeDiagram = ({ active }: { active: boolean }) => {
    return (
        <div className={`mx-auto mt-3 h-14 w-24 rounded-sm border ${active ? 'border-white/55' : 'border-primary/25'} p-1.5 sm:mt-4 sm:h-20 sm:w-32 sm:p-2`}>
            <div className={`h-full rounded-sm border ${active ? 'border-white/45 bg-white/10' : 'border-primary/20 bg-primary/5'} p-2`}>
                <div className={`mx-auto h-2.5 w-14 rounded-sm border sm:h-4 sm:w-20 ${active ? 'border-white/50' : 'border-primary/25'}`} />
                <div className="mt-2 flex items-center justify-between sm:mt-3">
                    <div className={`h-4 w-4 rounded-full border sm:h-7 sm:w-7 ${active ? 'border-white/45' : 'border-primary/20'}`} />
                    <div className={`h-5 w-8 rounded-sm border sm:h-8 sm:w-12 ${active ? 'border-white/45 bg-white/10' : 'border-primary/20 bg-white'}`} />
                    <div className={`h-4 w-4 rounded-full border sm:h-7 sm:w-7 ${active ? 'border-white/45' : 'border-primary/20'}`} />
                </div>
            </div>
        </div>
    )
}

const SizeItems = (props: SizeItemsProps) => {
    const isFeatured = props.index === 0
    const description = sizeDescriptions[props.index] ?? 'A versatile size for everyday styling'
    const roomLabel = roomLabels[props.index] ?? 'Everyday spaces'

    return (
        <Link
            href={`/products?size=${props.sizeCode}`}
            aria-label={`Shop ${props.name} rugs`}
            className={`group relative flex min-h-[13.5rem] overflow-hidden rounded-xl border transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 sm:min-h-[21rem] sm:rounded-[18px] ${
                isFeatured
                    ? 'border-primary bg-primary text-primary-content shadow-[0_18px_45px_rgba(69,42,22,0.20)]'
                    : 'border-primary/10 bg-[#fffaf3] text-base-content shadow-sm hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl'
            }`}
        >
            <div className="flex w-full flex-col">
                <div className="relative h-24 overflow-hidden bg-base-200 sm:h-40">
                    <Image
                        src={props.sizeBanner}
                        alt={`${props.name} rug in a styled room`}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 44vw, (max-width: 1024px) 42vw, 18vw"
                    />
                    {isFeatured && (
                        <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.08em] text-primary-content sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-[0.65rem] sm:tracking-[0.12em]">
                            Popular
                        </span>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent" />
                </div>

                <div className={`flex flex-1 flex-col px-3 py-3 text-center sm:px-5 sm:py-5 ${isFeatured ? 'bg-primary' : 'bg-[#fffaf3]'}`}>
                    <div className={`font-serif text-2xl leading-none sm:text-4xl ${isFeatured ? 'text-white' : 'text-primary'}`}>
                        {formatSizeName(props.name)}
                    </div>
                    <p className={`mx-auto mt-2 min-h-8 max-w-40 text-[11px] leading-4 sm:mt-3 sm:min-h-10 sm:max-w-48 sm:text-sm sm:leading-5 ${isFeatured ? 'text-white/88' : 'text-base-content/70'}`}>
                        {description}
                    </p>
                    <SizeDiagram active={isFeatured} />
                    <div className={`mt-auto pt-3 text-[11px] font-semibold uppercase tracking-[0.06em] sm:pt-5 sm:text-sm sm:tracking-[0.08em] ${isFeatured ? 'text-white' : 'text-primary'}`}>
                        Shop now <span aria-hidden="true" className="inline-block transition group-hover:translate-x-1">-&gt;</span>
                    </div>
                    <div className={`mt-1 text-[10px] sm:mt-2 sm:text-xs ${isFeatured ? 'text-white/65' : 'text-base-content/45'}`}>
                        {roomLabel}
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default SizeItems
