"use client"
import Image from 'next/image'
import React from 'react'
import Carousel from 'react-multi-carousel'
import "react-multi-carousel/lib/styles.css";
import banner_1 from '../../../../static_assets/crbanner-01.webp'
import banner_2 from '../../../../static_assets/crbanner-01-01.webp'

const HeroSLider = ({ isMobile }: { isMobile: boolean }) => {
    return (
        <Carousel
            additionalTransfrom={0}
            autoPlaySpeed={3000}
            deviceType='lg'
            centerMode={false}
            containerClass="w-full h-full z-auto"
            dotListClass=""
            draggable
            focusOnSelect={false}
            infinite
            itemClass={isMobile ? "" : "h-full w-full"}
            keyBoardControl
            minimumTouchDrag={80}
            pauseOnHover
            arrows={false}
            // renderArrowsWhenDisabled={false}
            // renderButtonGroupOutside={false}
            // renderDotsOutside
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
            sliderClass={isMobile ? "" : "h-full"}
            slidesToSlide={1}
            swipeable
            ssr>
            <Image src={banner_1} alt='nbanner 1' style={{
                display: 'block',
                height: '100%',
                margin: 'auto',
                width: '100%'
            }} priority />
            <Image src={banner_2} alt='nbanner 1' style={{
                display: 'block',
                height: '100%',
                margin: 'auto',
                width: '100%'
            }} priority />
        </Carousel>
    )
}

export default HeroSLider