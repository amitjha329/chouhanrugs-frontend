import Image from 'next/image'
import React from 'react'
import Logo from '../Logo'
import { getSession } from '@/lib/auth-server'
import { Link } from '@/i18n/navigation'
import UserMenu from './UserMenu'
import HeaderCartItem from './HeaderCartItem'
import { getTranslations } from 'next-intl/server'

const Header = async () => {
    const session = await getSession()
    const t = await getTranslations('nav')
    return (
        <header className='flex items-center justify-between px-10 py-5 bg-base-100'>
            <div className='flex gap-10'>
                <Link href="/track-order"><HeaderItem icon='/vector/TrackOrder.svg' text={t('trackOrder')} /></Link>
                {/* <CurrencySelector currency={currency}><HeaderItem icon='/vector/Currency.svg' text={JSON.parse(cookie.get('selectedCurrency')?.value ?? '{}').currency ?? 'INR'} /></CurrencySelector> */}
                <HeaderItem icon='/vector/Search.svg' text={t('search')} id='search_button' />
            </div>
            <Logo logoClass='text-accent' taglineClass='~text-xs/sm' className='text-center z-50 relative' />
            <div className='flex gap-10'>
                <Link href="/user/wishlist"><HeaderItem icon='/vector/Heart.svg' text={t('wishlist')} /></Link>
                {session?.user == null ? <Link href="/signin"><HeaderItem icon='/vector/UserIcon.svg' text={t('login')} /></Link> : <UserMenu><HeaderItem icon='/vector/UserIcon.svg' text={session?.user?.name?.split(' ')[0] ?? ""} /></UserMenu>}
                <Link href="/cart"><HeaderCartItem icon='/vector/Cart.svg' text={t('cart')} /></Link>
            </div>
        </header>
    )
}

const HeaderItem = ({ icon, text, id }: { icon: string, text: string, id?: string }) => <div className='gap-3 flex items-center cursor-pointer z-50 relative' id={id}>
    <Image src={icon} alt={text} height={25} width={25} />
    <span>{text}</span>
</div>

export default Header
