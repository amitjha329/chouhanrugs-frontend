import clsx from 'clsx'
import React from 'react'
import { FaChevronDown } from 'react-icons/fa6'

interface MenuItemProp {
    label: string
    href?: string
    submenu?: MenuItemProp[]
}

const CategoryMenu = () => {
    return (
        <nav className='bg-secondary text-secondary-content font-[500] flex items-center justify-center gap-10 py-5 sticky top-0 z-[99999]' id='category_links'>
            <CategoryMenuItem label='Cushion & Pillow' href='/category/cushion_pillow' submenu={[
                { label: "Demo Category", href: "/" },
                { label: "Demo Category", href: "/" },
                { label: "Demo Category", href: "/" },
                { label: "Demo Category", href: "/" }
            ]} />
            <CategoryMenuItem label='Rugs & Runners' href='/category/rugs_runners' />
            <CategoryMenuItem label='Throw Blankets' href='/category/throw_blankets' />
            <CategoryMenuItem label='Wool Jute Kilim Rugs' href='/category/wool_jute_kilim_rugs' />
            <CategoryMenuItem label='Braided Jute Rugs' href='/category/braided_jute_rugs' submenu={[
                { label: "Demo Category", href: "/" },
                { label: "Demo Category", href: "/" },
                { label: "Demo Category", href: "/" },
                { label: "Demo Category", href: "/" }
            ]} />
            <CategoryMenuItem label='Moroccan Jute Rugs' href='/category/moroccan_jute_rugs' />
        </nav>
    )
}

const CategoryMenuItem = ({ label, submenu, href }: MenuItemProp) => <div className={clsx("text-sm", { "group": (submenu?.length ?? 0) > 0 })}>
    <span className='flex items-center gap-2'>{label} {(submenu?.length ?? 0) > 0 && <FaChevronDown />}</span>
</div>

export default CategoryMenu