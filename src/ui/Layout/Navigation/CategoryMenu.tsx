import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'
import { FaChevronDown } from 'react-icons/fa6'

interface MenuItemProp {
    label: string
    href?: string
    submenu?: MenuItemProp[]
}

const CategoryMenu = () => {
    return (
        <nav className='bg-secondary text-secondary-content font-[500] flex items-center justify-center gap-10 py-5 sticky top-0 z-50' id='category_links'>
            <CategoryMenuItem label='Cushion & Pillow' href='/products/category/Cushion%20&%20Pillow' submenu={[
                { label: "Demo Category", href: "/" },
                { label: "Demo Category", href: "/" },
                { label: "Demo Category", href: "/" },
                { label: "Demo Category", href: "/" }
            ]} />
            <CategoryMenuItem label='Rugs & Runners' href='/products/category/Rugs%20&%20Runners' />
            <CategoryMenuItem label='Throw Blankets' href='/products/category/Throw%20Blankets' />
            <CategoryMenuItem label='Wool Jute Kilim Rugs' href='/products/category/Wool%20Jute%20Kilim%20Rugs' />
            <CategoryMenuItem label='Braided Jute Rugs' href='/products/category/Braided%20Jute%20Rug' submenu={[
                { label: "Demo Category", href: "/" },
                { label: "Demo Category", href: "/" },
                { label: "Demo Category", href: "/" },
                { label: "Demo Category", href: "/" }
            ]} />
            <CategoryMenuItem label='Moroccan Juna Rugs' href='/category/Moroccan%20Juna%20Rug' />
        </nav>
    )
}

const CategoryMenuItem = ({ label, submenu, href }: MenuItemProp) => {
    return href ? <Link href={href} className={clsx("text-sm", { "group": (submenu?.length ?? 0) > 0 })}>
        <span className='flex items-center gap-2'>{label} {(submenu?.length ?? 0) > 0 && <FaChevronDown />}</span>
    </Link> : <div className={clsx("text-sm", { "group": (submenu?.length ?? 0) > 0 })}>
        <span className='flex items-center gap-2'>{label} {(submenu?.length ?? 0) > 0 && <FaChevronDown />}</span>
    </div>
}

export default CategoryMenu