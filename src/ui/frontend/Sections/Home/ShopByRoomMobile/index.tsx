'use client'
import { Component } from 'react'
import ShopByRoomStyle from './ShopByRoomMobile.module.scss'
import clsx from 'clsx';
import ShopByMobileSliderDataModel from '@/lib/types/ShopByMobileSliderDataModel';

type propType = {
    slides: Array<ShopByMobileSliderDataModel>
}

type stateType = {
    activeSlide: number
    prevSlide: number
    sliderReady: boolean
}

class ShopByRoomMobile extends Component<propType, stateType> {
    changeTO: any;
    IMAGE_PARTS: number;
    AUTOCHANGE_TIME: number;
    constructor(props: propType) {
        super(props);

        this.IMAGE_PARTS = 4;

        this.changeTO = null;
        this.AUTOCHANGE_TIME = 4000;

        this.state = { activeSlide: -1, prevSlide: -1, sliderReady: false };
    }

    componentWillUnmount() {
        window.clearTimeout(this.changeTO);
    }

    componentDidMount() {
        this.runAutochangeTO();
        setTimeout(() => {
            this.setState({ activeSlide: 0, sliderReady: true });
        }, 0);
    }

    runAutochangeTO() {
        this.changeTO = setTimeout(() => {
            this.changeSlides(1);
            this.runAutochangeTO();
        }, this.AUTOCHANGE_TIME);
    }

    changeSlides(change: number) {
        window.clearTimeout(this.changeTO);
        const { length } = this.props.slides;
        const prevSlide = this.state.activeSlide;
        let activeSlide = prevSlide + change;
        if (activeSlide < 0) activeSlide = length - 1;
        if (activeSlide >= length) activeSlide = 0;
        this.setState({ activeSlide, prevSlide });
    }

    render() {
        const { activeSlide, prevSlide, sliderReady } = this.state;
        return (this.props.slides?.length ?? 0) > 0 && (
            <div className={clsx('mt-10 lg:hidden', sliderReady && ShopByRoomStyle.s__ready, ShopByRoomStyle.slider)}>
                <p className={ShopByRoomStyle.slider__top_heading}>Shop By Rooms</p>
                <div className={ShopByRoomStyle.slider__slides}>
                    {this.props.slides.map((slide, index) => (
                        <div
                            className={clsx(ShopByRoomStyle.slider__slide, activeSlide === index && ShopByRoomStyle.s__active, prevSlide === index && ShopByRoomStyle.s__prev)}
                            key={slide.title + index.toString()}
                        >
                            <div className={ShopByRoomStyle.slider__slide_content}>
                                <h3 className={ShopByRoomStyle.slider__slide_subheading}>{slide.heading}</h3>
                                <h2 className={ShopByRoomStyle.slider__slide_heading}>
                                    {slide.title.split('').map((l, i) => <span key={slide.title + l + i.toString()}>{l}</span>)}
                                </h2>
                                <p className={ShopByRoomStyle.slider__slide_readmore}>Shop Now</p>
                            </div>
                            <div className={ShopByRoomStyle.slider__slide_parts}>
                                {[...Array(this.IMAGE_PARTS).fill(undefined)].map((x, i) => (
                                    <div className={ShopByRoomStyle.slider__slide_part} key={slide.title + slide.src + i.toString()}>
                                        <div className={ShopByRoomStyle.slider__slide_part_inner} style={{ backgroundImage: `url(/_next/image?url=${encodeURI(slide.src)}&w=640&q=75)` }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className={ShopByRoomStyle.slider__control} onClick={() => this.changeSlides(-1)} />
                <div className={clsx(ShopByRoomStyle.slider__control, ShopByRoomStyle.slider__control__right)} onClick={() => this.changeSlides(1)} />
            </div>
        );
    }
}

export default ShopByRoomMobile