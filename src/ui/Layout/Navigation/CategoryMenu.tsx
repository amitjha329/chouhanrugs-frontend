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
                    return category.popular && <CategoryMenuItem
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
    return (
        (submenu?.length??0) > 0 ?<Link href={href ?? ""} className={clsx("text-sm", { "dropdown dropdown-hover": (submenu?.length ?? 0) > 0 })}>
        <span className='flex items-center gap-2'>{label} {(submenu?.length ?? 0) > 0 && <FaChevronDown />}</span>
        {
            (submenu?.length ?? 0) > 0 && <div className='dropdown-content menu bg-base-100 rounded-box z-[60] w-52 p-2 shadow border border-primary'>
                <ul>
                    {submenu?.map(item => <li key={item._id}><Link href={'/products/category/' + item.name}>{item.name}</Link></li>)}
                </ul>
            </div>
        }
    </Link>:
        <Link href={href ?? ""} className={clsx("text-sm", { "dropdown dropdown-hover": (submenu?.length ?? 0) > 0 })}>
            <span className='flex items-center gap-2'>{label} {(submenu?.length ?? 0) > 0 && <FaChevronDown />}</span>
            {
                (submenu?.length ?? 0) > 0 && <div className='dropdown-content menu bg-base-100 rounded-box z-[60] w-52 p-2 shadow border border-primary'>
                    <ul>
                        {submenu?.map(item => <li key={item._id}><Link href={'/products/category/' + item.name}>{item.name}</Link></li>)}
                    </ul>
                </div>
            }
        </Link>
    );
}

export default CategoryMenu