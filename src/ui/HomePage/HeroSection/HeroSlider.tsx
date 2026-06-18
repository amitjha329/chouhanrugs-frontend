"use client"
import Image from '@/ui/components/OptimizedImage'
import React from 'react'
import Carousel from 'react-multi-carousel'
import "react-multi-carousel/lib/styles.css";
import banner_2 from '../../../../static_assets/crbanner-01-01.webp'
import SliderDataModel from '@/types/SliderDataModel';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { type Locale } from '@/i18n/routing';
import { resolveLocalizedString } from '@/lib/resolveLocalized';
import { imageQuality } from '@/utils/imageOptimization';

const HeroArrow = ({ onClick, direction }: { onClick?: () => void, direction: 'left' | 'right' }) => (
    <button
        type="button"
        onClick={onClick}
        aria-label={direction === 'left' ? 'Previous hero banner' : 'Next hero banner'}
        className={`absolute top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-xl text-white transition hover:bg-black/55 focus:outline-none focus:ring-2 focus:ring-white/80 md:flex ${direction === 'left' ? 'left-4' : 'right-4'}`}
    >
        {direction === 'left' ? '‹' : '›'}
    </button>
)

const HeroSLider = ({ slider }: { slider: SliderDataModel | null }) => {
    const locale = useLocale() as Locale
    const slides = slider?.images?.length ? slider.images : [{
        src: banner_2.src,
        title: 'Sophisticated designs for every space',
        heading: 'Elegant Rugs',
        desc: 'Crafted for comfort. Made to impress.',
    }]

    return (
        <Carousel
            additionalTransfrom={0}
            autoPlaySpeed={3000}
            deviceType='lg'
            centerMode={false}
            containerClass="w-full"
            dotListClass="!bottom-5"
            draggable
            focusOnSelect={false}
            infinite
            itemClass="h-full"
            keyBoardControl
            minimumTouchDrag={80}
            pauseOnHover
            arrows
            customLeftArrow={<HeroArrow direction="left" />}
            customRightArrow={<HeroArrow direction="right" />}
            responsive={{
                desktop: {
                    breakpoint: {
                        max: 3000,
                        min: 1024
                    },
                    items: 1
                },
                mobile: {
                    breakpoint: {
                        max: 464,
                        min: 0
                    },
                    items: 1
                },
                tablet: {
                    breakpoint: {
                        max: 1024,
                        min: 464
                    },
                    items: 1
                }
            }}
            rewind={false}
            rewindWithAnimation={false}
            rtl={false}
            shouldResetAutoplay
            showDots
            sliderClass="h-full"
            slidesToSlide={1}
            swipeable
            ssr>
            {
                slides.map((image, index) => {
                    const isFirstSlide = index === 0
                    const imageSrc = typeof image.src === 'string' ? image.src : image.src.toString()
                    // const heading = resolveLocalizedString(image.heading as any, locale) || 'Elegant Rugs'
                    // const eyebrow = resolveLocalizedString(image.title as any, locale) || 'Sophisticated designs for every space'
                    // const description = resolveLocalizedString(image.desc as any, locale) || 'Crafted for comfort. Made to impress.'

                    return (
                        <div key={`${imageSrc}-${index}`} className="relative aspect-[16/5] overflow-hidden mx-0 rounded-none">
                            <Image
                                src={imageSrc || banner_2.src}
                                alt={`Hero banner ${index + 1}`}
                                priority={isFirstSlide}
                                loading={isFirstSlide ? "eager" : "lazy"}
                                fill
                                sizes="100vw"
                                className="object-fill"
                                quality={imageQuality.high}
                            />
                            {/* <div className="absolute inset-0 bg-gradient-to-r from-[#fff8ef]/90 via-[#fff8ef]/45 to-transparent md:bg-gradient-to-b md:from-black/15 md:via-black/30 md:to-black/45" />
                            <div className="absolute inset-x-6 top-8 mx-auto flex max-w-4xl flex-col items-start text-left text-primary md:inset-x-4 md:top-[18%] md:items-center md:text-center md:text-white">
                                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary md:text-xs md:text-[#d8b176]">
                                    {eyebrow}
                                </p>
                                <h1 className="mt-3 max-w-[15rem] font-serif text-[2rem] font-semibold leading-tight tracking-normal text-neutral-950 md:max-w-none md:text-6xl md:uppercase md:leading-none md:tracking-[0.12em] md:text-white md:drop-shadow lg:text-7xl">
                                    {heading}
                                </h1>
                                <p className="mt-4 max-w-[15rem] text-sm font-semibold leading-6 text-primary md:max-w-2xl md:text-lg md:text-white/90">
                                    {description}
                                </p>
                                <Link
                                    href="/products"
                                    className="mt-5 rounded-lg bg-primary px-6 py-3 text-[12px] font-semibold text-primary-content shadow-[0_10px_28px_rgba(69,42,22,0.20)] transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 md:rounded-md md:bg-[#c99548] md:px-7 md:py-2.5 md:text-[11px] md:uppercase md:tracking-[0.08em] md:text-white md:hover:bg-[#b68036] md:focus:ring-white/80"
                                >
                                    Shop Collection
                                </Link>
                            </div> */}
                        </div>
                    )
                })
            }
        </Carousel>
    )
}

export default HeroSLider
