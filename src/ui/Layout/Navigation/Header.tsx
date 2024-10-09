import Image from 'next/image'
import React from 'react'
import Logo from '../Logo'

const Header = () => {
    return (
        <header className='flex items-center justify-between px-10 py-5 bg-base-100'>
            <div className='flex gap-10'>
                <HeaderItem icon='/vector/TrackOrder.svg' text='Track Order' />
                <HeaderItem icon='/vector/Search.svg' text='Search' />
            </div>
            {/* <Image src='/chouhanrugs.png' height={85} width={228} alt='chouhanrugs_logo' /> */}
            <Logo logoClass='text-accent' className='text-center' />
            <div className='flex gap-10'>
                <HeaderItem icon='/vector/Heart.svg' text='Wishlist' />
                <HeaderItem icon='/vector/UserIcon.svg' text='Sign In' />
                <HeaderItem icon='/vector/Cart.svg' text='Cart' />
            </div>
        </header>
    )
}

const HeaderItem = ({ icon, text }: { icon: string, text: string }) => <div className='gap-3 flex items-center'>
    <Image src={icon} alt={text} height={25} width={25} />
    <span>{text}</span>
</div>

export default Header