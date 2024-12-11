import Image from 'next/image'
import React from 'react'
import Logo from '../Logo'
import Link from 'next/link'
import HeaderCartItemMobile from './HeaderCartItemMobile'


const MobileNavigation = () => {
    return (
        <>
            <header className='sticky top-0 z-50 bg-base-100'>
                <div className='flex pt-3 px-3 justify-between items-center'>
                    <Image src="/vector/menu.svg" alt="Search" width={25} height={25} id='mobile_menu_button' />
                    <Logo logoClass='text-accent' taglineClass='text-[8px] text-center' />
                    <Link href="/user/wishlist"><Image src="/vector/Heart.svg" alt="My WIshlist" width={20} height={20} /></Link>
                    <Link href="/cart"><HeaderCartItemMobile /></Link>
                </div>
                <form className='join join-horizontal w-full pb-4 pt-5 px-3' action="/products">
                    <input className='join-item input input-md input-bordered border-r-0 !rounded-l-full w-full placeholder:text-primary' placeholder='Search' name='search' type='text' id='search' />
                    <button className='join-item btn btn-outline btn-md border-l-0 !rounded-r-full border-gray-300' type='submit'><Image src="/vector/Search.svg" alt="Search" width={20} height={20} /></button>
                </form>
            </header>
        </>
    )
}

export default MobileNavigation