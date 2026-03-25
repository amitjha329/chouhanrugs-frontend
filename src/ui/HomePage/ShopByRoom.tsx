import React from 'react'
import SectionTitle from '../SectionTitle'
import { getTranslations } from 'next-intl/server'

const ShopByRoom = async () => {
    const t = await getTranslations('homepage')
    return (
        <div className="py-16 px-4 bg-secondary/50">
            <div className='fluid_container'>
                <SectionTitle title={t('shopByRoom')} className='text-center mb-12' />
                <div className="grid grid-cols-2 max-md:grid-cols-1 gap-12">
                    <div className="flex items-start">
                        <div className="text-9xl text-secondary font-bold">1</div>
                        <div className="ml-6">
                            <div className="~text-lg/xl">{t('areaRugs')}</div>
                            <p className="mt-2 text-neutral-700 font-light text-sm">
                                {t('areaRugsDesc')}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="text-9xl text-secondary font-bold">2</div>
                        <div className="ml-6">
                            <div className="~text-lg/xl">{t('bedRoomRugs')}</div>
                            <p className="mt-2 text-neutral-700 font-light text-sm">
                                {t('bedRoomRugsDesc')}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="text-9xl text-secondary font-bold">3</div>
                        <div className="ml-6">
                            <div className="~text-lg/xl">{t('diningRoomRugs')}</div>
                            <p className="mt-2 text-neutral-700 font-light text-sm">
                                {t('diningRoomRugsDesc')}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="text-9xl text-secondary font-bold">4</div>
                        <div className="ml-6">
                            <div className="~text-lg/xl">{t('livingRoomRugs')}</div>
                            <p className="mt-2 text-neutral-700 font-light text-sm">
                                {t('livingRoomRugsDesc')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShopByRoom