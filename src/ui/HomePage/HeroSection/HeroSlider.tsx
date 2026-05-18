"use client"
import Image from 'next/image'
import React from 'react'
import Carousel from 'react-multi-carousel'
import "react-multi-carousel/lib/styles.css";
import banner_2 from '../../../../static_assets/crbanner-01-01.webp'
import SliderDataModel from '@/types/SliderDataModel';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { type Locale } from '@/i18n/routing';
import { resolveLocalizedString } from '@/lib/resolveLocalized';

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

const HeroSLider = ({ slider }: { slider: SliderDataModel }) => {
    const locale = useLocale() as Locale
    const slides = slider.images?.length ? slider.images : [{
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
                    const heading = resolveLocalizedString(image.heading as any, locale) || 'Elegant Rugs'
                    const eyebrow = resolveLocalizedString(image.title as any, locale) || 'Sophisticated designs for every space'
                    const description = resolveLocalizedString(image.desc as any, locale) || 'Crafted for comfort. Made to impress.'

                    return (
                        <div key={`${imageSrc}-${index}`} className="relative h-[430px] overflow-hidden md:h-[540px] lg:h-[620px]">
                            <Image
                                src={imageSrc || banner_2.src}
                                alt={`Hero banner ${index + 1}`}
                                priority={isFirstSlide}
                                loading={isFirstSlide ? "eager" : "lazy"}
                                fill
                                sizes="100vw"
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/30 to-black/45" />
                            <div className="absolute inset-x-4 top-[16%] mx-auto flex max-w-4xl flex-col items-center text-center text-white md:top-[18%]">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d8b176] md:text-xs">
                                    {eyebrow}
                                </p>
                                <h1 className="mt-3 font-serif text-4xl font-semibold uppercase leading-none tracking-[0.12em] text-white drop-shadow md:text-6xl lg:text-7xl">
                                    {heading}
                                </h1>
                                <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-white/90 md:text-lg">
                                    {description}
                                </p>
                                <Link
                                    href="/products"
                                    className="mt-5 rounded-md bg-[#c99548] px-7 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white shadow-[0_10px_28px_rgba(0,0,0,0.18)] transition hover:bg-[#b68036] focus:outline-none focus:ring-2 focus:ring-white/80"
                                >
                                    Shop Collection
                                </Link>
                            </div>
                        </div>
                    )
                })
            }
        </Carousel>
    )
}

export default HeroSLider
