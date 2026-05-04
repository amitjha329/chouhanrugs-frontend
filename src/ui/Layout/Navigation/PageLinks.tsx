import { Link } from '@/i18n/navigation'
import LocaleSwitcher from '@/components/LocaleSwitcher'
import React from 'react'
import { getTranslations } from 'next-intl/server'
import { FaAmazon } from 'react-icons/fa'
import { SiEtsy } from 'react-icons/si'
import { TbBuildingStore } from 'react-icons/tb'

const marketplaceLinks = [
    {
        label: 'Etsy',
        href: 'https://www.etsy.com',
        icon: SiEtsy,
    },
    {
        label: 'Amazon',
        href: 'https://www.amazon.com',
        icon: FaAmazon,
    },
    {
        label: 'Faire',
        href: 'https://www.faire.com',
        icon: TbBuildingStore,
    },
]

const PageLinks = async () => {
    const t = await getTranslations('nav')
    return (
        <nav className='bg-secondary text-secondary-content text-xs z-50 relative' id='page_links'>
            <div className="fluid_container mx-auto flex flex-col gap-2 px-4 py-2 md:flex-row md:items-center md:justify-between md:px-0">
                <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap no-scrollbar">
                    <span className="font-semibold text-secondary-content/70">Shop on</span>
                    {marketplaceLinks.map(({ label, href, icon: Icon }) => (
                        <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full border border-secondary-content/20 px-2.5 py-1 font-medium transition-colors hover:bg-secondary-content hover:text-secondary"
                        >
                            <Icon className="h-3.5 w-3.5" />
                            {label}
                        </a>
                    ))}
                </div>

                <div className="flex items-center justify-center gap-5 overflow-x-auto whitespace-nowrap font-[500] no-scrollbar">
                    <Link href={'/'} >{t('home')}</Link>
                    <Link href={'/about-us'} >{t('aboutUs')}</Link>
                    <Link href={'/contact-us'} >{t('contact')}</Link>
                    <Link href={'/blog'} >{t('blog')}</Link>
                    <Link href={'/policies'} >{t('policies')}</Link>
                    <Link href={'/terms'} >{t('termsShort')}</Link>
                </div>

                <div className="flex justify-start md:justify-end">
                    <LocaleSwitcher />
                </div>
            </div>
        </nav>
    )
}

export default PageLinks
