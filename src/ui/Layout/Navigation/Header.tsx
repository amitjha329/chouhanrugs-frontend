import Image from 'next/image'
import React from 'react'
import Logo from '../Logo'
import { auth } from '@/auth'
import CurrencySelector from './CurrencySelector'
import { cookies } from 'next/headers'
import getCurrencyList from '@/backend/serverActions/getCurrencyList'
import Link from 'next/link'
import UserMenu from './UserMenu'

const Header = async () => {
    const session = await auth()
    const cookie = cookies()
    const currency = await getCurrencyList()
    return (
        <header className='flex items-center justify-between px-10 py-5 bg-base-100'>
            <div className='flex gap-10'>
                <Link href="/track-order"><HeaderItem icon='/vector/TrackOrder.svg' text='Track Order' /></Link>
                <CurrencySelector currency={currency}><HeaderItem icon='/vector/Currency.svg' text={JSON.parse(cookie.get('selectedCurrency')?.value ?? '{}').currency ?? 'INR'} /></CurrencySelector>
                <HeaderItem icon='/vector/Search.svg' text='Search' />
            </div>
            {/* <Image src='/chouhanrugs.png' height={85} width={228} alt='chouhanrugs_logo' /> */}
            <Logo logoClass='text-accent' className='text-center' />
            <div className='flex gap-10'>
                <Link href="/user/wishlist"><HeaderItem icon='/vector/Heart.svg' text='Wishlist' /></Link>
                {session == null ? <Link href="/signin"><HeaderItem icon='/vector/UserIcon.svg' text={'Login'} /></Link> : <UserMenu><HeaderItem icon='/vector/UserIcon.svg' text={session?.user?.name?.split(' ')[0] ?? ""} /></UserMenu>}
                <Link href="/cart"><HeaderItem icon='/vector/Cart.svg' text='Cart' /></Link>
            </div>
        </header>
    )
}

const HeaderItem = ({ icon, text }: { icon: string, text: string }) => <div className='gap-3 flex items-center'>
    <Image src={icon} alt={text} height={25} width={25} />
    <span>{text}</span>
</div>

export default Header