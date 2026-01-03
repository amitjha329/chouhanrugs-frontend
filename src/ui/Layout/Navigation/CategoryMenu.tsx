// @ts-nocheck
import getCategoriesList from '@/backend/serverActions/getCategoriesList'
import CategoriesDataModel from '@/types/CategoriesDataModel'
import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'
import { FaChevronDown } from 'react-icons/fa6'

interface MenuItemProp {
    label: string
    href?: string
    submenu?: CategoriesDataModel[]
}

const CategoryMenu = async () => {
    const categories = await getCategoriesList()
    return (
        <nav className='bg-secondary text-secondary-content font-[500] flex items-center justify-center gap-10 py-5 sticky top-0 z-50' id='category_links'>
            {
                categories.map(category => {
                    return category.active && category.popular && <CategoryMenuItem
                        key={category._id}
                        label={category.name}
                        href={'/products/category/' + category.name}
                        submenu={categories.filter(i => i.parent == category.name)} />
                })
            }
        </nav>
    )
}

const CategoryMenuItem = ({ label, submenu, href }: MenuItemProp) => {
    const hasSubmenu = (submenu?.length ?? 0) > 0;
    return (
        hasSubmenu ? (
            <div className="relative group inline-block font-semibold">
                <div className="text-sm flex items-center gap-2 cursor-pointer select-none px-4 py-1 rounded-md transition-colors duration-200 group-hover:bg-primary/10">
                    {label} <FaChevronDown />
                </div>
                <div className="absolute left-0 top-full min-w-[180px] bg-white rounded-lg shadow-lg z-50 py-1 border border-primary opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
                    <ul className="list-none m-0 p-0 font-light">
                        {submenu?.map(item => (
                            <li key={item._id}>
                                <Link href={'/products/category/' + item.name} className="block px-4 py-2 text-gray-900 rounded-md hover:bg-primary/10 hover:text-primary transition-colors duration-200">
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        ) : (
            <Link href={href ?? ""} className="text-sm flex items-center gap-2 px-4 py-1 rounded-md transition-colors duration-200 hover:bg-primary/10 font-semibold">
                {label}
            </Link>
        )
    );
}

export default CategoryMenu