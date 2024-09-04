import Image from 'next/image'
import React from 'react'
import { getHomePageWhyUsSection } from '@/lib/actions/getPageAdditionalData'


const HomeContentBottomSection = async () => {
    const dataForContent = await getHomePageWhyUsSection()
    return (
        <>
            {
                dataForContent && <section className="container mx-auto max-sm:hidden mt-6 shadow-xl card card-bordered card-body rounded-none">
                    <h2 className="text-xl md:text-3xl p-3">Why You Should Shop With Us?</h2>
                    <div className="card card-side">
                        <figure className="relative basis-1/3">
                            <Image fill className="!relative !w-full !h-80 object-contain" alt="" src={dataForContent.imageOne} />
                        </figure>
                        <div className="card-body basis-2/3 justify-center">
                            <h3 className="card-title" dangerouslySetInnerHTML={{ __html: dataForContent.titleOne }}></h3>
                            <p className="grow-0" dangerouslySetInnerHTML={{ __html: dataForContent.contentOne }}></p>
                        </div>
                    </div>
                    <div className="card card-side">
                        <div className="card-body basis-2/3 justify-center">
                            <h3 className="card-title" dangerouslySetInnerHTML={{ __html: dataForContent.titleTwo }}></h3>
                            <p className="grow-0" dangerouslySetInnerHTML={{ __html: dataForContent.contentTwo }}></p>
                        </div>
                        <figure className="relative basis-1/3">
                            <Image fill className="!relative !w-full !h-80 object-contain" alt="" src={dataForContent.imageTwo} />
                        </figure>
                    </div>
                </section>
            }
        </>
    )
}

export default HomeContentBottomSection