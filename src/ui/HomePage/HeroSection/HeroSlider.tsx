"use client"
import Image from 'next/image'
import React from 'react'
import Carousel from 'react-multi-carousel'
import "react-multi-carousel/lib/styles.css";
import banner_2 from '../../../../static_assets/crbanner-01-01.webp'
import SliderDataModel from '@/types/SliderDataModel';

const HeroSLider = ({ isMobile, slider }: { isMobile: boolean, slider: SliderDataModel }) => {
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
            {
                slider.images.map((image, index) => {
                    return <Image src={image.src.toString() ?? banner_2} key={image.src.toString()} alt='nbanner 1' style={{
                        display: 'block',
                        height: '100%',
                        margin: 'auto',
                        width: '100%'
                    }} priority {...(image.src.toString() != null) && { fill: true }} />
                })
            }
        </Carousel>
    )
}

export default HeroSLider