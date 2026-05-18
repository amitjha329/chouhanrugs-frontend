import React from 'react'
import "react-multi-carousel/lib/styles.css";
import Image from 'next/image'
import HeroSLider from './HeroSlider';
import CategoriesInHero from './CategoriesInHero';
import SliderDataModel from '@/types/SliderDataModel';
import freeShippingIcon from '../../../../static_assets/free_shipping.svg'
import handCraftedIcon from '../../../../static_assets/hand_crafted.svg'
import verifiedIcon from '../../../../static_assets/verified.svg'
import customSizeIcon from '../../../../static_assets/custom_size.svg'

const promises = [
    {
        icon: freeShippingIcon,
        title: 'Free worldwide shipping',
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

const HeroSection = async ({ slider }: { slider: SliderDataModel }) => {
    return (
        <section className="bg-[#fbf7ef] pb-10">
            <div className="relative">
                <HeroSLider slider={slider} />
            </div>

            <div className="fluid_container relative z-10 -mt-8">
                <div className="grid overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_12px_34px_rgba(54,43,30,0.12)] sm:grid-cols-2 lg:grid-cols-4">
                    {promises.map((promise) => (
                        <div key={promise.title} className="flex items-center gap-4 border-b border-neutral-200 px-5 py-4 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0">
                            <Image src={promise.icon} alt="" className="h-9 w-9 object-contain" aria-hidden="true" />
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-neutral-900">{promise.title}</p>
                                <p className="mt-1 text-[12px] leading-4 text-neutral-600">{promise.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="fluid_container pt-8">
                <div className="mb-6 text-center">
                    <h2 className="text-xl font-medium uppercase tracking-[0.08em] text-neutral-900 md:text-2xl">
                        Shop With Categories
                    </h2>
                    <div className="mx-auto mt-3 flex w-24 items-center justify-center gap-2" aria-hidden="true">
                        <span className="h-px flex-1 bg-neutral-300" />
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span className="h-px flex-1 bg-neutral-300" />
                    </div>
                </div>

                <div className="grid auto-cols-[124px] grid-flow-col gap-3 overflow-x-auto pb-2 sm:grid-flow-row sm:grid-cols-4 sm:overflow-visible md:grid-cols-6 lg:grid-cols-8">
                    <CategoriesInHero />
                </div>
            </div>
        </section>
    )
}

export default HeroSection
