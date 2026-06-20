// @ts-nocheck
import React, { Suspense } from 'react'
import { Link } from '@/i18n/navigation'
import LocaleSwitcher from '@/components/LocaleSwitcher'
import LoginLink from '@/components/LoginLink'
import UserMenu from './UserMenu'
import HeaderCartItem from './HeaderCartItem'
import LazyAlgoliaSearch from './LazyAlgoliaSearch'
import ScrollToTopButton from './ScrollToTopButton'
import { FaAmazon, FaChevronDown } from 'react-icons/fa'
import { SiEtsy } from 'react-icons/si'
import { TbBuildingStore } from 'react-icons/tb'
import { getConfigBulk } from '@/lib/services/ConfigService'
import { getSession } from '@/lib/auth-server'
import getCategoriesList from '@/backend/serverActions/getCategoriesList'
import getSiteData from '@/backend/serverActions/getSiteData'
import { getTranslations } from 'next-intl/server'

const PLATFORM_ICONS = {
    etsy: SiEtsy,
    amazon: FaAmazon,
    faire: TbBuildingStore,
    custom: TbBuildingStore,
} as const

const Navigation = async () => {
    const [session, categories, siteData, t, algolia] = await Promise.all([
        getSession(),
        getCategoriesList(),
        getSiteData(),
        getTranslations('nav'),
        getConfigBulk(['ALGOLIA_APPID', 'ALGOLIA_KEY_CLIENT', 'ALGOLIA_INDEX', 'ALGOLIA_QUERY_INDEX'])
    ])

    const marketplaceLinks = (siteData.marketplaceLinks ?? []).filter(link => link.enabled && link.url)

    return (
        <>
            {/* Custom stylesheet to override Algolia input form elements to match Layout 2 theme */}
            <style dangerouslySetInnerHTML={{__html: `
                #desktop_algolia_search_wrapper {
                    width: 100%;
                    max-width: 32rem; /* max-w-lg */
                    margin-left: auto;
                    margin-right: auto;
                }
                #desktop_algolia_search_wrapper .aa-Form,
                #desktop_algolia_search_wrapper .cr-desktop-search-form {
                    height: 2.75rem !important;
                    border: 2px solid #e5ccb5 !important;
                    border-radius: 9999px !important;
                    background-color: #fdfaf4 !important;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
                    padding-left: 0.5rem !important;
                    padding-right: 0.5rem !important;
                }
                #desktop_algolia_search_wrapper .aa-Form:focus-within,
                #desktop_algolia_search_wrapper .cr-desktop-search-form:focus-within {
                    border-color: #6c4624 !important;
                    background-color: #ffffff !important;
                    box-shadow: 0 4px 12px rgba(93, 60, 30, 0.06) !important;
                }
                #desktop_algolia_search_wrapper .aa-Input,
                #desktop_algolia_search_wrapper .cr-desktop-search-input {
                    padding-left: 1.25rem !important;
                    padding-right: 3.5rem !important;
                    font-size: 0.825rem !important;
                    font-weight: 500 !important;
                    color: #5d3c1e !important;
                }
                #desktop_algolia_search_wrapper .aa-InputWrapperPrefix,
                #desktop_algolia_search_wrapper .cr-desktop-search-prefix {
                    left: auto !important;
                    right: 0.6rem !important;
                    background-color: transparent !important;
                }
                #desktop_algolia_search_wrapper .aa-Input::placeholder,
                #desktop_algolia_search_wrapper .cr-desktop-search-input::placeholder {
                    color: #8b7868 !important;
                    opacity: 0.7 !important;
                }
                #desktop_algolia_search_wrapper .aa-SubmitButton,
                #desktop_algolia_search_wrapper .cr-desktop-search-submit {
                    color: #6c4624 !important;
                    width: 2.25rem !important;
                    height: 2.25rem !important;
                }
                #desktop_algolia_search_wrapper .aa-Panel,
                #desktop_algolia_search_wrapper .cr-desktop-search-panel {
                    border-radius: 1rem !important;
                    border: 1px solid #e5ccb5 !important;
                    box-shadow: 0 10px 30px rgba(93, 60, 30, 0.15) !important;
                    background: rgba(255, 255, 255, 0.98) !important;
                    backdrop-filter: blur(8px) !important;
                    margin-top: 0.5rem !important;
                }
            `}} />

            <header className="w-full bg-[#faf9f6] hidden md:block border-b border-[#e5ccb5]/25">
                {/* Top Deck: Grid Layout for Corporate Header */}
                <div className="bg-white border-b border-[#e5ccb5]/20 py-4 px-8">
                    <div className="max-w-[1600px] mx-auto grid grid-cols-12 items-center gap-4">
                        {/* Brand Logo (Left 3 cols) */}
                        <div className="col-span-3 shrink-0">
                            <Link href="/">
                                <img src="/chouhanrugs.png" alt="Chouhan Rugs" className="h-[65px] w-auto object-contain" />
                            </Link>
                        </div>

                        {/* Search Field (Center 5 cols) - Prominent and centered directly in Header */}
                        <div className="col-span-5 flex justify-center">
                            <div id="desktop_algolia_search_wrapper">
                                <Suspense fallback={
                                    <div className="w-full relative flex items-center">
                                        <input 
                                            type="text" 
                                            placeholder="Search for rugs..." 
                                            readOnly 
                                            className="w-full pl-6 pr-12 py-2.5 text-xs font-medium rounded-full bg-[#fdfaf4] border-2 border-[#e5ccb5] focus:outline-none"
                                        />
                                    </div>
                                }>
                                    <LazyAlgoliaSearch
                                        appId={algolia.ALGOLIA_APPID}
                                        apiKey={algolia.ALGOLIA_KEY_CLIENT}
                                        indexName={algolia.ALGOLIA_INDEX}
                                        querySuggestionsIndex={algolia.ALGOLIA_QUERY_INDEX}
                                    />
                                </Suspense>
                            </div>
                        </div>

                        {/* Top Right Quick Links & Language (Right 4 cols) */}
                        <div className="col-span-4 flex items-center justify-end gap-5 text-xs font-semibold text-gray-500">
                            <Link href="/" className="hover:text-[#6c4624]">{t('home')}</Link>
                            <Link href="/about-us" className="hover:text-[#6c4624]">{t('aboutUs')}</Link>
                            <Link href="/contact-us" className="hover:text-[#6c4624]">{t('contact')}</Link>
                            <Link href="/blog" className="hover:text-[#6c4624]">{t('blog')}</Link>
                            <span className="h-3 w-px bg-gray-200" />
                            <LocaleSwitcher />
                        </div>
                    </div>
                </div>

                {/* Mid Deck: Symmetrical Info & Actions Ribbon */}
                <div className="bg-[#f4ebe1] py-2.5 px-8 text-xs text-[#5d3c1e] font-bold border-b border-[#e5ccb5]/30">
                    <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                        {/* Marketplace Badges */}
                        <div className="flex items-center gap-2">
                            <span>Buy on Boutique Stores:</span>
                            {marketplaceLinks.map(({ label, url, platform }) => {
                                const Icon = PLATFORM_ICONS[platform as keyof typeof PLATFORM_ICONS] || TbBuildingStore
                                return (
                                    <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline text-[#6c4624] ml-2">
                                        <Icon className="w-3.5 h-3.5" />
                                        <span>{label}</span>
                                    </a>
                                )
                            })}
                        </div>

                        {/* Actions panel */}
                        <div className="flex items-center gap-6">
                            <Link href="/track-order" className="flex items-center gap-1.5 hover:text-[#6c4624]">
                                <img src="/vector/TrackOrder.svg" alt="" className="w-4 h-4 opacity-80" />
                                <span>Track Order</span>
                            </Link>
                            <Link href="/user/wishlist" className="flex items-center gap-1.5 hover:text-[#6c4624]">
                                <img src="/vector/Heart.svg" alt="" className="w-4 h-4 opacity-80" />
                                <span>My Wishlist</span>
                            </Link>
                            {session?.user == null ? (
                                <LoginLink className="flex items-center gap-1.5 hover:text-[#6c4624]">
                                    <img src="/vector/UserIcon.svg" alt="" className="w-4 h-4 opacity-80" />
                                    <span>Sign In / Register</span>
                                </LoginLink>
                            ) : (
                                <Suspense fallback={
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#5d3c1e]">
                                        <img src="/vector/UserIcon.svg" alt="" className="w-4 h-4 opacity-80" />
                                        <span>Account ({session.user.name?.split(' ')[0]})</span>
                                    </div>
                                }>
                                    <UserMenu>
                                        <div className="flex items-center gap-1.5 hover:text-[#6c4624]">
                                            <img src="/vector/UserIcon.svg" alt="" className="w-4 h-4 opacity-80" />
                                            <span>Account ({session.user.name?.split(' ')[0]})</span>
                                        </div>
                                    </UserMenu>
                                </Suspense>
                            )}
                            <span className="h-4.5 w-px bg-[#e5ccb5]/60" />
                            <Link href="/cart">
                                <HeaderCartItem icon='/vector/Cart.svg' text='My Cart' />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Deck: Category Dropdowns */}
                <div className="bg-white py-3 px-8 text-center shadow-sm sticky top-0 z-50 border-b border-[#e5ccb5]/20">
                    <nav className="max-w-[1600px] mx-auto flex items-center justify-center gap-9">
                        {categories
                            .filter((c) => c.active && c.popular)
                            .map((c) => (
                                <CategoryMenuItem
                                    key={c._id}
                                    label={c.name}
                                    href={`/products/category/${encodeURIComponent(c.slug ?? c.name)}`}
                                    submenu={categories.filter((i) => i.parent === c.name)}
                                />
                            ))}
                    </nav>
                </div>
            </header>
            <ScrollToTopButton />
        </>
    )
}

const CategoryMenuItem = ({ label, submenu, href }: { label: string, href?: string, submenu?: any[] }) => {
    const hasSubmenu = (submenu?.length ?? 0) > 0
    return (
        hasSubmenu ? (
            <div className="relative group inline-block font-semibold">
                <div className="text-sm flex items-center gap-2 cursor-pointer select-none px-4 py-1 rounded-md transition-colors duration-200 group-hover:bg-primary/10 text-[#5d3c1e] hover:text-[#6c4624]">
                    {label} <FaChevronDown className="w-2.5 h-2.5 transition-transform duration-200 group-hover:rotate-180" />
                </div>
                <div className="absolute left-0 top-full min-w-[180px] bg-white rounded-lg shadow-lg z-[100] py-1 border border-primary opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
                    <ul className="list-none m-0 p-0 font-light">
                        {submenu?.map(item => (
                            <li key={item._id}>
                                <Link 
                                    href={`/products/category/${encodeURIComponent(item.slug ?? item.name)}`} 
                                    className="block px-4 py-2 text-gray-900 rounded-md hover:bg-primary/10 hover:text-primary transition-colors duration-200 text-xs font-semibold text-left"
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        ) : (
            <Link href={href ?? ""} className="text-sm flex items-center gap-2 px-4 py-1 rounded-md transition-colors duration-200 hover:bg-primary/10 font-semibold text-[#5d3c1e] hover:text-[#6c4624]">
                {label}
            </Link>
        )
    )
}

export default Navigation
