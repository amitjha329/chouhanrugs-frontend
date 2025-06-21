// @ts-nocheck
/* eslint-disable @next/next/no-html-link-for-pages */
import React from 'react'
import { BiCategoryAlt } from 'react-icons/bi'
import { CiBoxes } from 'react-icons/ci'
import { FiX, FiShoppingBag, FiInfo, FiHelpCircle, FiHeart } from 'react-icons/fi'
import Logo from '../Logo'
import SignoutButton from './SignoutButton'
import { FaRegUserCircle, FaSignInAlt } from 'react-icons/fa'
import { auth } from '@/auth'
import Link from 'next/link'

const SideNav = async () => {
    const session = await auth()
    return (
        <div className='z-10 fixed left-0 top-0 bg-secondary w-screen h-screen overflow-hidden !text-primary'>
            <div className='w-3/4 mr-auto'>
                <div className="flex flex-col justify-between h-full w-full sm:w-80 rounded">
                    <div className="flex justify-between items-center w-full mb-5 py-4 px-3">
                        <Logo logoClass='text-accent' taglineClass='text-[8px] text-center' />
                        <FiX className="w-5 h-5 cursor-pointer text-gray-600" id="close_mobile_menu" />
                    </div>
                    <ul className="space-y-2 h-full overflow-y-scroll no-scrollbar">
                        {(session?.user?.name || session?.user?.email) && <li className="border-b-[0.5px] border-gray-200">
                            <a
                                href="/user/profile"
                            >
                                <div className="flex items-center p-2 text-base font-normal text-primary rounded-lg ">
                                    <FaRegUserCircle className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 " />
                                    <span className="ml-3 font-bold">{session?.user?.name ?? session?.user?.email}</span>
                                </div>
                            </a>
                        </li>}
                        <li className="border-b-[0.5px] border-gray-200">
                            <a
                                href="/products/category"
                            >
                                <div className="flex items-center p-2 text-base font-normal text-primary rounded-lg">
                                    <BiCategoryAlt className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 " />
                                    <span className="ml-3">All Categories</span>
                                </div>
                            </a>
                        </li>
                        {/* <li>
                            <a
                                href="/user/bulk"
                            >
                                <div className="flex items-center p-2 text-base font-normal text-primary rounded-lg ">
                                    <CiBoxes className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 " />
                                    <span className="ml-3">Bulk Orders</span>
                                </div>
                            </a>
                        </li> */}
                        <li>
                            <a
                                href="/user/orders"
                            >
                                <div className="flex items-center p-2 text-base font-normal text-primary rounded-lg ">
                                    <FiShoppingBag className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 " />
                                    <span className="flex-1 ml-3 whitespace-nowrap">My Orders</span>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a
                                href="/user/wishlist"
                            >
                                <div className="flex items-center p-2 text-base font-normal text-primary rounded-lg ">
                                    <FiHeart className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 " />
                                    <span className="flex-1 ml-3 whitespace-nowrap">My Wishlist</span>
                                </div>
                            </a>
                        </li>
                        <li className="border-t-[0.5px] border-gray-200">
                            <a
                                href="/about-us"
                            >
                                <div className="flex items-center p-2 text-base font-normal text-primary rounded-lg ">
                                    <FiInfo className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 " />
                                    <span className="flex-1 ml-3 whitespace-nowrap">About</span>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a
                                href="/contact-us"
                            >
                                <div className="flex items-center p-2 text-base font-normal text-primary rounded-lg ">
                                    <FiHelpCircle className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 " />
                                    <span className="flex-1 ml-3 whitespace-nowrap">Contact Us</span>
                                </div>
                            </a>
                        </li>
                        <li className="border-t-[0.5px] border-gray-200">
                            {
                                session?.user ? <SignoutButton /> : <Link href="/signin" className='flex items-center p-2 text-base font-bold text-primary rounded-lg dark:text-white bg-gray-100 dark:bg-gray-700'>
                                    <FaSignInAlt className="flex-shrink-0 w-6 h-6 transition duration-75 text-primary dark:text-white" />
                                    <span className="flex-1 ml-3 whitespace-nowrap">Log In</span>
                                </Link>
                            }
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default SideNav