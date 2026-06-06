import React from 'react'
import "react-multi-carousel/lib/styles.css";
import Image from '@/ui/components/OptimizedImage'
import HeroSLider from './HeroSlider';
import CategoriesInHero from './CategoriesInHero';
import SliderDataModel from '@/types/SliderDataModel';
import freeShippingIcon from '../../../../static_assets/free_shipping.svg'
import handCraftedIcon from '../../../../static_assets/hand_crafted.svg'
import verifiedIcon from '../../../../static_assets/verified.svg'
import customSizeIcon from '../../../../static_assets/custom_size.svg'
import Link from 'next/link'

const promises = [
    {
        icon: freeShippingIcon,
        title: 'Free shipping',
        description: 'On all orders over $99',
    },
    {
        icon: handCraftedIcon,
        title: 'Handmade by artisans',
        description: 'Supporting traditional craft',
    },
    {
        icon: verifiedIcon,
        title: 'Eco friendly materials',
        description: 'Sustainable and natural fibres',
    },
    {
        icon: customSizeIcon,
        title: 'Custom size available',
        description: 'Made just for your space',
    },
]

const HeroSection = async ({ slider }: { slider: SliderDataModel | null }) => {
    return (
        <section className="bg-[#fbf7ef] pb-8 md:pb-10">
            <div className="relative">
                <HeroSLider slider={slider} />
            </div>

            <div className="fluid_container relative z-10 mt-6 px-4 md:-mt-8 md:px-0">
                <div className="grid grid-cols-4 overflow-hidden rounded-2xl border border-primary sm:border-neutral-200 bg-secondary/20 sm:bg-[#fffaf7] shadow-[0_12px_34px_rgba(54,43,30,0.10)] md:rounded-xl sm:grid-cols-2 lg:grid-cols-4">
                    {promises.map((promise) => (
                        <div key={promise.title} className="relative flex items-center justify-start gap-1 border-neutral-200 px-2 py-4 text-start sm:text-center flex-row md:gap-4 md:border-b md:px-5 md:text-left md:last:border-b-0 lg:border-b-0 after:absolute after:right-0 after:top-1/2 after:h-1/2 after:w-[1px] after:-translate-y-1/2 after:bg-primary/50 last:after:hidden md:after:hidden lg:after:block lg:last:after:hidden">
                            <Image src={promise.icon} alt="" className="~h-5 w-5 object-contain md:h-9 md:w-9" aria-hidden="true" />
                            <div>
                                <p className="text-[8px] text-start sm:text-center font-bold leading-3 text-neutral-900 md:text-[11px] md:uppercase md:tracking-[0.06em]">{promise.title}</p>
                                <p className="mt-1 hidden text-[12px] text-start sm:text-center leading-4 text-neutral-600 md:block">{promise.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="fluid_container px-4 pt-8 md:px-0">
                <div className="mb-5 flex items-center justify-between md:mb-6 md:block md:text-center">
                    <h2 className="text-[1.35rem] font-semibold tracking-normal text-neutral-950 md:text-2xl md:font-medium md:uppercase md:tracking-[0.08em]">
                        <span className="md:hidden">Shop by Categories</span>
                        <span className="hidden md:inline">Shop With Categories</span>
                    </h2>
                    <Link href="/products/category" className="flex items-center gap-2 text-sm font-semibold text-primary md:hidden">
                        View all <span aria-hidden="true">›</span>
                    </Link>
                    <div className="mx-auto mt-3 hidden w-24 items-center justify-center gap-2 md:flex" aria-hidden="true">
                        <span className="h-px flex-1 bg-neutral-300" />
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span className="h-px flex-1 bg-neutral-300" />
                    </div>
                </div>

                <div className="grid gap-x-5 gap-y-6 pb-2 grid-cols-4 sm:overflow-visible lg:grid-cols-9">
                    <CategoriesInHero />
                </div>
            </div>
        </section>
    )
}

export default HeroSection
