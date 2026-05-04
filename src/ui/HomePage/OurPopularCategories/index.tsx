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
import { getTranslations } from 'next-intl/server'

const OurPopularCategories = async () => {
    const header = await headers()
    const isMobile = getDevice({ headers: header }) == "mobile"
    const t = await getTranslations('homepage')
    const tCommon = await getTranslations('common')
    const popularCategories = [
        {
            title: t('popularCushionPillow'),
            desc: t('popularCushionPillowDesc'),
            link: "cushion-pillow",
            image: cushion_pop,
            lgspan: 1,
            span: 2
        },
        {
            title: t('popularRugsRunners'),
            desc: t('popularRugsRunnersDesc'),
            link: "rugs-runners",
            image: rugs_pop,
            lgspan: 2,
            span: 2
        },
        {
            title: t('popularMacrame'),
            desc: t('popularMacrameDesc'),
            link: "wall-hanging-macrame",
            image: macrame_pop,
            lgspan: 1,
            span: 4
        },
        {
            title: t('popularBlankets'),
            desc: t('popularBlanketsDesc'),
            link: "throw-blankets",
            image: blankets_pop,
            lgspan: 2,
            span: 2,
        }, {
            title: t('popularBags'),
            desc: t('popularBagsDesc'),
            link: "bags",
            image: bags_pop,
            lgspan: 2,
            span: 2,
        }
    ]

    return (<>
        <SectionTitle title={t('ourPopularCategories')} className='text-center pt-10 pb-5' />
        <div className='grid grid-cols-4 gap-5 fluid_container ~py-5/14 ~px-5/0'>
            {
                popularCategories.map(category => {
                    return (
                        (<div key={category.title + category.link} className={`col-span-${category.lgspan} min-h-60 ${(isMobile && category.span === 2) || (!isMobile && category.lgspan === 1) ? "bg-accent" : "bg-secondary/50"} card card-body relative overflow-hidden flex flex-col gap-5 items-start w-full ${isMobile && "p-5"}`} style={{
                            ...(isMobile && { gridColumn: `span ${category.span} / span ${category.span}` })
                        }}>
                            <Image 
                                src={category.image} 
                                alt={category.title} 
                                height={400} 
                                width={400} 
                                className={`absolute z-10 ${!isMobile ? category.lgspan == 2 ? "-bottom-40 -right-40" : "-bottom-28 -right-28" : category.span == 2 ? "-bottom-16 -right-16" : "-bottom-28 -right-28"} opacity-50`}
                                placeholder="blur"
                                loading="lazy"
                            />
                            <h2 className='~text-base/2xl font-semibold z-20'>
                                {category.title}
                            </h2>
                            {(!isMobile || (isMobile && category.span === 4)) && <div className='text-xs z-20 max-w-xl'>
                                {category.desc}
                            </div>}
                            <Link href={`/products/category/${category.link}`} className={`btn z-20 ${isMobile && "btn-sm"}`}>
                                {tCommon('viewAll')}
                            </Link>
                        </div>)
                    );
                })
            }
        </div>
    </>);
}

export default OurPopularCategories