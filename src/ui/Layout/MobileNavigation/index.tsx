import Image from 'next/image'
import React from 'react'
import Logo from '../Logo'
import Link from 'next/link'
import HeaderCartItemMobile from './HeaderCartItemMobile'
import AlgoliaMobileSearch from './AlgoliaMobileSearch'
import { auth } from '@/auth'


const MobileNavigation = async () => {
    const session = await auth()
    return (
        <>
            <header className='sticky top-0 z-50 bg-base-100'>
                <div className='flex pt-3 px-3 justify-between items-center'>
                    <Image src="/vector/menu.svg" alt="Search" width={25} height={25} id='mobile_menu_button' />
                    <Logo logoClass='text-accent' taglineClass='text-[8px] text-center' />
                    <div className='flex items-center gap-5'>
                        <Link href="/user/wishlist"><Image src="/vector/Heart.svg" alt="My Wishlist" width={20} height={20} /></Link>
                        {session?.user ? (
                            <Link href="/user/profile" className='flex items-center flex-col justify-center'>
                                <Image src="/vector/UserIcon.svg" alt="My Profile" width={20} height={20} />
                                <span className='text-xs'>{session?.user?.name?.split(' ')[0].slice(0,4) ?? ""}</span>
                            </Link>
                        ) : (
                            <Link href="/signin" className='flex items-center flex-col justify-center'>
                                <Image src="/vector/UserIcon.svg" alt="Login" width={20} height={20} />
                                <span className='text-xs'>Login</span>
                            </Link>
                        )}
                        <Link href="/cart"><HeaderCartItemMobile /></Link>
                    </div>
                </div>                <div className='pb-4 pt-5 px-3'>
                    <AlgoliaMobileSearch
                        appId={process.env.NEXT_PUBLIC_ALGOLIA_APPID ?? ""}
                        apiKey={process.env.NEXT_PUBLIC_ALGOLIA_KEY_CLIENT ?? ""}
                        indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX ?? ""}
                        querySuggestionsIndex={process.env.NEXT_PUBLIC_ALGOLIA_QUERY_INDEX ?? ""}
                    />
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