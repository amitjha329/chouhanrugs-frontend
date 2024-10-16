import Link from 'next/link'
import React from 'react'
import { FaUser } from 'react-icons/fa'
import { RiFolderUserFill } from 'react-icons/ri'

const UserLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='fluid_container flex flex-row gap-3 mx-auto items-start ~py-10/20'>
            <div className="basis-1/4 hidden lg:block flex-grow-0 sticky top-20 bottom-0">
                <div className='flex flex-col gap-5'>
                    <ul className="menu shadow-lg rounded-md bg-white">
                        <li className='menu-title border-b p-6 font-bold flex flex-row justify-between'>
                            Account Settings
                            <FaUser className='w-6 h-6 !text-blue-500 !p-0' />
                        </li>
                        <li><Link href='/user/profile'>Profile Settings</Link></li>
                        <li><Link href='/user/address'>Address Management</Link></li>
                    </ul>
                    <ul className="menu shadow-lg rounded-md bg-white">
                        <li className='menu-title border-b p-6 font-bold flex flex-row justify-between'>
                            My
                            <RiFolderUserFill className='w-6 h-6 !text-blue-500 !p-0' />
                        </li>
                        <li><Link href='/user/orders'>Orders</Link></li>
                        <li><Link href='/user/wishlist'>Wishlist</Link></li>
                        <li><Link href='/user/bulk'>Bulk Orders</Link></li>
                    </ul>
                </div>
            </div>
            {children}
        </div>
    )
}

export default UserLayout