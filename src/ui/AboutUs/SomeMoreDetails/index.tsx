import Image from 'next/image'
import React from 'react'
import about_1 from '../../../../static_assets/about_some_more_1.webp'
import about_2 from '../../../../static_assets/about_some_more_2.webp'
import SectionTitle from '@/ui/SectionTitle'

const SomeMoreDetails = () => {
    return (
        <div className='flex flex-col items-center ~gap-5/10 ~py-5/14 ~px-5/0 fluid_container'>
            <SectionTitle title='We craft jute products with hands only' className='' />
            <div className='~text-xs/sm text-gray-500 text-center'>
                Savor the classiness of Chouhan Rugs, where skill and creativity collide. Enter our world of handcrafted, pure jute products, which are carefully designed to provide a touch of elegance and sustainability to your living area. Experience the everlasting beauty of our unique designs that will add authenticity and environmentally aware workmanship to your decor.
            </div>
            <div className='join join-horizontal mx-auto w-3/4 max-md:w-full gap-5'>
                <Image src={about_1} alt='some more 1' className='w-full h-52 object-cover rounded-2xl join-item' />
                <Image src={about_2} alt='some more 2' className='w-full h-52 object-cover rounded-2xl join-item' />
            </div>
            <div className='flex items-center max-md:items-start gap-10'>
                <div className='flex flex-col items-center justify-center gap-5' >
                    <div className='flex items-center justify-center border-[14px] border-secondary text-transparent rounded-full ~p-3/7 aspect-square font-extrabold text-xl' style={{
                        WebkitTextStroke: "1px grey",
                    }}>
                        100%
                    </div>
                    <div className='~text-sm/base text-primary'>
                        Jute Crafting Techniques
                    </div>
                </div>
                <div className='flex flex-col items-center justify-center gap-4' >
                    <div className='flex items-center justify-center border-[14px] border-secondary text-transparent rounded-full ~p-3/7 aspect-square font-extrabold text-xl' style={{
                        WebkitTextStroke: "1px grey",
                    }}>
                        100%
                    </div>
                    <div className='~text-sm/base text-primary'>
                        Hand Crafted Techniques
                    </div>
                </div>
                <div className='flex flex-col items-center justify-center gap-5' >
                    <div className='flex items-center justify-center border-[14px] border-secondary text-transparent rounded-full ~p-3/7 aspect-square font-extrabold text-xl' style={{
                        WebkitTextStroke: "1px grey",
                    }}>
                        100%
                    </div>
                    <div className='~text-sm/base text-primary'>
                        Ancient Crafting Techniques
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SomeMoreDetails