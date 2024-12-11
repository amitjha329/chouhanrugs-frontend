import Image from 'next/image'
import React from 'react'
import Logo from '../Logo'
import { auth } from '@/auth'
import Link from 'next/link'
import UserMenu from './UserMenu'
import HeaderCartItem from './HeaderCartItem'

const Header = async () => {
    const session = await auth()
    return (
        <header className='flex items-center justify-between px-10 py-5 bg-base-100'>
            <div className='flex gap-10'>
                <Link href="/track-order"><HeaderItem icon='/vector/TrackOrder.svg' text='Track Order' /></Link>
                {/* <CurrencySelector currency={currency}><HeaderItem icon='/vector/Currency.svg' text={JSON.parse(cookie.get('selectedCurrency')?.value ?? '{}').currency ?? 'INR'} /></CurrencySelector> */}
                <HeaderItem icon='/vector/Search.svg' text='Search' id='search_button' />
            </div>
            <Logo logoClass='text-accent' taglineClass='~text-xs/sm' className='text-center' />
            <div className='flex gap-10'>
                <Link href="/user/wishlist"><HeaderItem icon='/vector/Heart.svg' text='Wishlist' /></Link>
                {session?.user == null ? <Link href="/signin"><HeaderItem icon='/vector/UserIcon.svg' text={'Login'} /></Link> : <UserMenu><HeaderItem icon='/vector/UserIcon.svg' text={session?.user?.name?.split(' ')[0] ?? ""} /></UserMenu>}
                <Link href="/cart"><HeaderCartItem icon='/vector/Cart.svg' text='Cart' /></Link>
            </div>
        </header>
    )
}

const HeaderItem = ({ icon, text, id }: { icon: string, text: string, id?: string }) => <div className='gap-3 flex items-center cursor-pointer' id={id}>
    <Image src={icon} alt={text} height={25} width={25} />
    <span>{text}</span>
</div>

export default Header