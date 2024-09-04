'use client'
import Link from "next/link"
import { BiCategoryAlt, BiChevronDownCircle } from "react-icons/bi"
import { FiHelpCircle, FiInfo, FiShoppingBag, FiUser, FiX } from "react-icons/fi"
import SiteDataModel from "@/lib/types/SiteDataModel"
import SiteLogoSmall from "../SiteLogo/SiteLogoSmall"
import { signOut, useSession } from "next-auth/react"
import Currency from "@/lib/types/Currency"
import { useCurrencyContext } from "../Contexts/CurrencyContext"
import { Listbox, Transition } from "@headlessui/react"
import { BsCurrencyDollar } from "react-icons/bs"
import { Fragment, useEffect, useState } from "react"
import { MdOutlineCheckCircleOutline } from "react-icons/md"
import { AiOutlineLogin, AiOutlineLogout } from "react-icons/ai"
import { usePathname } from "next/navigation"
import { CiBoxes } from "react-icons/ci"

const MobileSideNav = ({ sideNavStateToggle, siteData, closeSideNav }: { siteData: SiteDataModel, sideNavStateToggle: () => void, closeSideNav: () => void }) => {
    const { currencies, userCurrency, setUserCurrency, setManualCurrency } = useCurrencyContext()
    const pathname = usePathname()
    const manualcurrency = (value: Currency) => {
        setUserCurrency && setUserCurrency(value)
        setManualCurrency && setManualCurrency(true)
    }
    const [path, setPath] = useState(pathname)

    useEffect(() => {
        if (path != pathname) {
            closeSideNav()
            setPath(pathname)
        }
    }, [pathname])


    const { data } = useSession()
    return (
        <div className="flex flex-col justify-between h-full w-full sm:w-80 bg-secondary rounded">
            <div className="flex justify-between items-center w-full mb-5 py-4 px-3">
                <Link href="/">
                    <SiteLogoSmall siteData={siteData} />
                </Link>
                <FiX className="w-5 h-5 cursor-pointer text-gray-600" onClick={sideNavStateToggle} />
            </div>
            <ul className="space-y-2 h-full overflow-y-scroll no-scrollbar">
                <li className="border-b-[0.5px] border-gray-200">
                    <a
                        href="/products/category"
                    >
                        <div className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <BiCategoryAlt className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                            <span className="ml-3">All Categories</span>
                        </div>
                    </a>
                </li>
                <li>
                    <Link
                        href="/user/profile"
                    >
                        <div className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <FiUser className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                            <span className="ml-3">My Account</span>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link
                        href="/user/bulk"
                    >
                        <div className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <CiBoxes className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                            <span className="ml-3">Bulk Orders</span>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link
                        href="/user/orders"
                    >
                        <div className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <FiShoppingBag className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                            <span className="flex-1 ml-3 whitespace-nowrap">My Orders</span>
                            {/* <span className="inline-flex justify-center items-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">
                                New
                            </span> */}
                        </div>
                    </Link>
                </li>
                {/* <li className="border-t-[0.5px] border-gray-200">
                    <Link
                        href="#"
                    >
                        <div className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <FiHelpCircle className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                            <span className="flex-1 ml-3 whitespace-nowrap">Help &amp; Support</span>
                        </div>
                    </Link>
                </li> */}
                {/* <li>
                    <Link
                        href="/about"
                    >
                        <div className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <FiInfo className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                            <span className="flex-1 ml-3 whitespace-nowrap">About</span>
                        </div>
                    </Link>
                </li> */}
                <li className="border-t-[0.5px] border-gray-200">
                    <Link
                        href="/contact-us"
                    >
                        <div className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <FiHelpCircle className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                            <span className="flex-1 ml-3 whitespace-nowrap">Contact Us</span>
                        </div>
                    </Link>
                </li>
                <li className="flex items-center text-sm">
                    <Listbox value={userCurrency} onChange={manualcurrency}>
                        <div className="relative w-full">
                            <Listbox.Button className="relative w-full cursor-default py-2 pl-2 pr-10 text-left sm:text-sm flex">
                                <BsCurrencyDollar className="flex-shrink-0 w-6 h-6 !text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                <span className="block truncate ml-3 whitespace-nowrap">{userCurrency?.currency}</span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <BiChevronDownCircle
                                        className="h-6 w-6 text-gray-500"
                                        aria-hidden="true"
                                    />
                                </span>
                            </Listbox.Button>
                            <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute mt-1 max-h-60 w-full min-w-[150px] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-30">
                                    {currencies?.map((currency) => (
                                        <Listbox.Option
                                            key={currency._id}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                                }`
                                            }
                                            value={currency}
                                        >
                                            <span
                                                className={`block truncate ${userCurrency?.currency === currency.currency ? 'font-medium' : 'font-normal'
                                                    }`}
                                            >
                                                {currency.currency}
                                            </span>
                                            {userCurrency?.currency === currency.currency ? (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                    <MdOutlineCheckCircleOutline className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            ) : null}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </Listbox>
                </li>
            </ul>
            <div className="flex flex-row justify-between w-full border-t-[1px]">
                {
                    data != null ? <button className="btn btn-primary justify-between rounded-none w-full" onClick={() => {
                        signOut().then(() => {
                            window.location.reload()
                        })
                    }}>Logout <AiOutlineLogout className="w-5 h-5" /></button> : <Link href="/signin" className="btn btn-primary justify-between rounded-none w-full">Login <AiOutlineLogin className="w-5 h-5" /></Link>
                }
            </div>
        </div>
    )
}
export default MobileSideNav
