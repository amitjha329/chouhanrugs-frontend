import Image from 'next/image'
import React from 'react'
import Logo from '../Logo'

const MobileNavigation = () => {
    return (
        <header className='sticky top-0 z-[99999] bg-base-100'>
            <div className='flex pt-3 px-3 justify-between items-center'>
                <Image src="/vector/menu.svg" alt="Search" width={25} height={25} />
                <Logo logoClass='text-accent' taglineClass='text-[8px] text-center' />
                <Image src="/vector/UserIcon.svg" alt="User Account" width={20} height={20} />
                <Image src="/vector/Cart.svg" alt="Cart" width={20} height={20} />
            </div>
            <div className='join join-horizontal w-full pb-4 pt-5 px-3'>
                <input className='join-item input input-md input-bordered border-r-0 !rounded-l-full w-full placeholder:text-primary' placeholder='Search' />
                <button className='join-item btn btn-outline btn-md border-l-0 !rounded-r-full border-gray-300'><Image src="/vector/Search.svg" alt="Search" width={20} height={20} /></button>
            </div>
        </header>
    )
}

export default MobileNavigation