import Image from 'next/image'
import React from 'react'
import Logo from '../Logo'
import { Link } from '@/i18n/navigation'
import HeaderCartItemMobile from './HeaderCartItemMobile'
import AlgoliaMobileSearch from './AlgoliaMobileSearch'
import { getSession } from '@/lib/auth-server'
import { getConfigBulk } from '@/lib/services/ConfigService'
import LocaleSwitcher from '@/components/LocaleSwitcher'
import { HiOutlineAdjustmentsHorizontal, HiOutlineBars3, HiOutlineUserCircle } from 'react-icons/hi2'


const MobileNavigation = async () => {
    const session = await getSession()
    const algolia = await getConfigBulk(['ALGOLIA_APPID', 'ALGOLIA_KEY_CLIENT', 'ALGOLIA_INDEX', 'ALGOLIA_QUERY_INDEX'])
    return (
        <>
            <header className='sticky top-0 z-50 bg-[#fffaf5]/95 px-3 pb-3 pt-2.5 shadow-[0_8px_24px_rgba(69,42,22,0.06)] backdrop-blur relative'>
                <div className='flex items-center justify-between gap-2'>
                    <button
                        type="button"
                        id='mobile_menu_button'
                        aria-label="Open menu"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-primary"
                    >
                        <HiOutlineBars3 className="h-7 w-7" aria-hidden="true" />
                    </button>

                    <Logo logoClass='text-accent text-[1.18rem] min-[380px]:text-[1.32rem] leading-none' taglineClass='text-[7px] min-[380px]:text-[8px] text-center text-base-content' className="min-w-0 flex-1 text-left" />

                    <div className='flex shrink-0 items-center gap-1.5'>
                        <div className="hidden min-[410px]:block">
                            <LocaleSwitcher />
                        </div>
                        {session?.user ? (
                            <Link href="/user/profile" className='flex h-9 items-center gap-1 rounded-lg bg-[#f4ebe4] px-2 text-[11px] font-semibold text-primary'>
                                <HiOutlineUserCircle className="h-4 w-4" aria-hidden="true" />
                                <span className='hidden max-w-12 truncate min-[360px]:inline'>Hi, {session?.user?.name?.split(' ')[0] ?? ""}</span>
                            </Link>
                        ) : (
                            <Link href="/signin" className='flex h-9 items-center gap-1 rounded-lg bg-[#f4ebe4] px-2 text-[11px] font-semibold text-primary'>
                                <HiOutlineUserCircle className="h-4 w-4" aria-hidden="true" />
                                <span className="hidden min-[360px]:inline">Login</span>
                            </Link>
                        )}
                        <Link href="/cart" className="flex h-9 w-9 items-center justify-center rounded-full text-primary"><HeaderCartItemMobile /></Link>
                    </div>
                </div>

                <div className='pt-3'>
                    <AlgoliaMobileSearch
                        appId={algolia.ALGOLIA_APPID}
                        apiKey={algolia.ALGOLIA_KEY_CLIENT}
                        indexName={algolia.ALGOLIA_INDEX}
                        querySuggestionsIndex={algolia.ALGOLIA_QUERY_INDEX}
                    />
                    <button
                        type="button"
                        aria-label="Open filters"
                        className="pointer-events-none absolute right-6 top-[4.6rem] z-10 flex h-9 w-9 items-center justify-center text-primary"
                    >
                        <HiOutlineAdjustmentsHorizontal className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>
                {/* Fallback form for when JavaScript is disabled */}
                <noscript>
                    <form className='join join-horizontal w-full pb-4 pt-5 px-3' action="/products">
                        <input className='join-item input input-md input-bordered border-r-0 !rounded-l-full w-full placeholder:text-primary' placeholder='Search' name='search' type='text' id='search' />
                        <button className='join-item btn btn-outline btn-md border-l-0 !rounded-r-full border-gray-300' type='submit'><Image src="/vector/Search.svg" alt="Search" width={20} height={20} /></button>
                    </form>
                </noscript>
            </header>
        </>
    )
}

export default MobileNavigation
