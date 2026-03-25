import Link from 'next/link'
import React from 'react'
import { getTranslations } from 'next-intl/server'

const PageLinks = async () => {
    const t = await getTranslations('nav')
    return (
        <nav className='bg-secondary text-secondary-content font-[500] flex items-center justify-center gap-5 py-2 text-xs z-50 relative' id='page_links'>
            <Link href={'/'} >{t('home')}</Link>
            <Link href={'/about-us'} >{t('aboutUs')}</Link>
            <Link href={'/contact-us'} >{t('contact')}</Link>
            <Link href={'/blog'} >{t('blog')}</Link>
            <Link href={'/policies'} >{t('policies')}</Link>
            <Link href={'/terms'} >{t('termsShort')}</Link>
        </nav>
    )
}

export default PageLinks