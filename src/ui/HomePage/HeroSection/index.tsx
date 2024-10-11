import React from 'react'
import "react-multi-carousel/lib/styles.css";
import Image from 'next/image'
import bg_section from '../../../../static_assets/1370e2249338920089a9a7217d235002.webp'
import clsx from 'clsx';
import HeroSLider from './HeroSlider';
import { headers } from 'next/headers';
import getDevice from '@/utils/getDevice';
import CategoriesInHero from './CategoriesInHero';
import SectionTitle from '@/ui/SectionTitle';


const HeroSection = () => {
    const header = headers()
    const isMobile = getDevice({ headers: header }) == "mobile"
    return (
        <div className={clsx('flex w-full overflow-hidden relative', { "flex-col": isMobile })}>
            {
                !isMobile && <>
                    <Image className='z-10 object-cover' src={bg_section} alt='banner' fill priority />
                    <div className='h-full w-full z-20 bg-secondary/80 absolute'></div>
                </>
            }
            <div className={clsx({ "~lg/2xl:~w-[40rem]/[60rem]": !isMobile }, { "w-full": isMobile }, "z-30")}>
                <HeroSLider isMobile={isMobile} />
            </div>
            <SectionTitle title='Shop With Categories' className='lg:hidden pt-3' />
            <div className='flex-grow w-full z-30 grid grid-cols-4 justify-center ~gap-1/3 items-center ~px-2/10 py-5'>
                <CategoriesInHero />
                <span className='~text-xl/3xl text-wrap ~max-w-20/52 font-bold ml-2 max-lg:hidden'>Shop With Categories</span>
            </div>
        </div>
    )
}

export default HeroSection