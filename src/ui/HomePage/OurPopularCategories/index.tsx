import React from 'react'
import cushion_pop from '../../../../static_assets/cushion_popular.webp'
import rugs_pop from '../../../../static_assets/rugs_pop.webp'
import macrame_pop from '../../../../static_assets/cushion_popular.webp'
import blankets_pop from '../../../../static_assets/throw_bl_pop.webp'
import bags_pop from '../../../../static_assets/bags_pop.webp'
import Image from 'next/image'
import { headers } from 'next/headers';
import getDevice from '@/utils/getDevice'
import SectionTitle from '@/ui/SectionTitle'
import Link from 'next/link'

const OurPopularCategories = async () => {
    const header = await headers()
    const isMobile = getDevice({ headers: header }) == "mobile"
    const popularCategories = [
        {
            title: "Popular in Cushion & Pillow",
            desc: "Lorem ipsum dolor sit amet consectetur. Massa eu sollicitudin ac arcu.",
            link: "Cushion%20&%20Pillow",
            image: cushion_pop,
            lgspan: 1,
            span: 2
        },
        {
            title: "Popular in Rugs & Runners",
            desc: "Lorem ipsum dolor sit amet consectetur. Massa eu sollicitudin ac arcu.",
            link: "Rugs%20&%20Runners",
            image: rugs_pop,
            lgspan: 2,
            span: 2
        },
        {
            title: "Popular in Wall Hanging Macrame",
            desc: "Lorem ipsum dolor sit amet consectetur. Massa eu sollicitudin ac arcu.",
            link: "Wall%20Hanging%20Macrame",
            image: cushion_pop,
            lgspan: 1,
            span: 4
        },
        {
            title: "Popular in Throw Blankets",
            desc: "Lorem ipsum dolor sit amet consectetur. Massa eu sollicitudin ac arcu.",
            link: "Throw%20Blankets",
            image: blankets_pop,
            lgspan: 2,
            span: 2,
        }, {
            title: "Popular in Bags",
            desc: "Lorem ipsum dolor sit amet consectetur. Massa eu sollicitudin ac arcu.",
            link: "Bags",
            image: bags_pop,
            lgspan: 2,
            span: 2,
        }
    ]

    return (<>
        <SectionTitle title='Our Popular Categories' className='text-center pt-10 pb-5' />
        <div className='grid grid-cols-4 gap-5 fluid_container ~py-5/14 ~px-5/0'>
            {
                popularCategories.map(category => {
                    return (
                        (<div key={category.title + category.link} className={`col-span-${category.lgspan} min-h-60 ${(isMobile && category.span === 2) || (!isMobile && category.lgspan === 1) ? "bg-accent" : "bg-secondary/50"} card card-body relative overflow-hidden flex flex-col gap-5 items-start w-full ${isMobile && "p-5"}`} style={{
                            ...(isMobile && { gridColumn: `span ${category.span} / span ${category.span}` })
                        }}>
                            <Image src={category.image} alt={category.title} height={400} width={400} className={`absolute z-10 ${!isMobile ? category.lgspan == 2 ? "-bottom-40 -right-40" : "-bottom-28 -right-28" : category.span == 2 ? "-bottom-16 -right-16" : "-bottom-28 -right-28"} opacity-50`} />
                            <h2 className='~text-base/2xl font-semibold z-20'>
                                {category.title}
                            </h2>
                            {(!isMobile || (isMobile && category.span === 4)) && <div className='text-xs z-20 max-w-xl'>
                                {category.desc}
                            </div>}
                            <Link href={`/products/category/${category.link}`} className={`btn z-20 ${isMobile && "btn-sm"}`}>
                                View All
                            </Link>
                        </div>)
                    );
                })
            }
        </div>
    </>);
}

export default OurPopularCategories