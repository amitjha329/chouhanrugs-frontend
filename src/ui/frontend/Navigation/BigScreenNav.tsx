'use client'
import { Listbox, Menu, Transition } from "@headlessui/react"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { Fragment, useRef, useState } from "react"
import { BiCategoryAlt, BiChevronDown, BiChevronRight } from "react-icons/bi"
import { FaCaretDown } from "react-icons/fa"
import { MdAdminPanelSettings, MdOutlineAdminPanelSettings, MdOutlineCheckCircleOutline } from "react-icons/md"
import { RiInboxUnarchiveFill, RiInboxUnarchiveLine, RiLogoutCircleFill, RiLogoutCircleLine, RiUserFill, RiUserLine } from "react-icons/ri"
import clsx from "clsx"
import { useLocationContext } from '../Contexts/LocationContext'
import { useDataConnectionContext } from '../Contexts/DataConnectionContext'
import { useCurrencyContext } from "../Contexts/CurrencyContext"
import SiteLogoBig from "../SiteLogo/SiteLogoBig"
import SiteDataModel from "@/lib/types/SiteDataModel"
import Currency from "@/lib/types/Currency"
import CategoriesDataModel from "@/lib/types/CategoriesDataModel"
import { useRouter } from "next/navigation"
import { useSearchBox } from "react-instantsearch"
import { Autocomplete } from "./AutoCompleteSearchBox"
import { Button, Dialog, DialogTrigger, OverlayArrow, Popover } from "react-aria-components"
import CategoryPopOver from "./CategoryPopOver"

const BigScreenNav = ({ categoriesData, siteData, algoliaIndex, queryIndexName }: { siteData: SiteDataModel, categoriesData: Array<CategoriesDataModel>, algoliaIndex: string, queryIndexName: string }) => {
    const router = useRouter()
    const { cartCount } = useDataConnectionContext()
    const { data: session } = useSession()
    const { userLocation } = useLocationContext()
    const { currencies, userCurrency, setUserCurrency, setManualCurrency } = useCurrencyContext()
    const { query } = useSearchBox()

    const manualcurrency = (value: Currency) => {
        setUserCurrency && setUserCurrency(value)
        setManualCurrency && setManualCurrency(true)
    }

    return (
        <div className="hidden md:block bg-white">
            <div className="bg-secondary max-h-[2.5rem]">
                <div className="container mx-auto flex justify-between">
                    <div className="flex items-center text-sm">
                        <Link href="/" className="cursor-pointer py-2 border-b hover:border-b hover:border-black border-transparent">
                            Free Shipping Across The Globe
                        </Link>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Link href="/" className="text-opacity-70 cursor-pointer py-2 hover:text-opacity-100 border-b hover:border-b hover:border-black border-transparent">
                            Home
                        </Link>
                        <span className="">|</span>
                        <Link href="#" className="text-opacity-70 cursor-pointer py-2 hover:text-opacity-100 border-b hover:border-b hover:border-black border-transparent">
                            About Us
                        </Link>
                        <span className="">|</span>
                        <Link href="/contact-us" className="text-opacity-70 cursor-pointer py-2 hover:text-opacity-100 border-b hover:border-b hover:border-black border-transparent">
                            Contact Us
                        </Link>
                        <span className="">|</span>
                        <Link href="#" className="text-opacity-70 cursor-pointer py-2 hover:text-opacity-100 border-b hover:border-b hover:border-black border-transparent">
                            FAQ
                        </Link>
                        <span className="">|</span>
                        <Link href="/blog" className="text-opacity-70 cursor-pointer py-2 hover:text-opacity-100 border-b hover:border-b hover:border-black border-transparent">
                            Blogs
                        </Link>
                        <span className="">|</span>
                        <Link href="/policies" className="text-opacity-70 cursor-pointer py-2 hover:text-opacity-100 border-b hover:border-b hover:border-black border-transparent">
                            Policies
                        </Link>
                        <span className="">|</span>
                        <Link href="/terms" className="text-opacity-70 cursor-pointer py-2 hover:text-opacity-100 border-b hover:border-b hover:border-black border-transparent">
                            T&C
                        </Link>
                        <Listbox value={userCurrency} onChange={manualcurrency}>
                            <div className="relative">
                                <Listbox.Button className="relative w-full cursor-default bg-white py-2 pl-3 pr-10 text-left sm:text-sm">
                                    <span className="block truncate">{userCurrency?.currency}</span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                        <BiChevronDown
                                            className="h-5 w-5 text-gray-400"
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
                    </div>
                </div>
            </div>
            <div className="border py-3 px-6">
                <div className="container mx-auto">
                    <div className="flex justify-between">
                        <a href="/">
                            <SiteLogoBig siteData={siteData} />
                        </a>
                        <div className="flex flex-1 gap-x-3">
                            <div className="w-36"></div>
                            {/* <Popover className="relative min-w-[10rem]">
                                {({ open }) => (
                                    <>
                                        <Popover.Button
                                            as="button"
                                            className={`${open ? '' : 'text-opacity-90'} btn-primary flex flex-col w-full btn hover:btn-primary cursor-pointer select-none items-center gap-x-2 py-[0.4rem] px-4`}>
                                            <BiCategoryAlt
                                                className="h-5 w-5"
                                            />
                                            <span className="text-sm font-medium">Categories</span>
                                        </Popover.Button>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-200"
                                            enterFrom="opacity-0 translate-y-1"
                                            enterTo="opacity-100 translate-y-0"
                                            leave="transition ease-in duration-150"
                                            leaveFrom="opacity-100 translate-y-0"
                                            leaveTo="opacity-0 translate-y-1">
                                            <Popover.Panel as="div" className="bg-white fixed z-10 left-0 mt-[5.4rem] w-full max-w-[100vw] transform px-4 sm:px-0 mega-menu border-t border-primary rounded-none shadow-lg">
                                                <div className="overflow-hidden flex flex-row 3xl:container 3xl:mx-auto">

                                                    <div className="basis-1/3 lg:basis-1/4 xl:basis-1/5">
                                                        {
                                                            categoriesData.map((category, index) => {
                                                                return (
                                                                    category.parent == undefined && <div className={clsx("flex justify-between border-gray-300 bg-gray-100 p-4 items-center cursor-pointer hover:bg-gray-200 transition-all", categoriesData.length - 1 > index ? ' border-b' : '')} key={category._id} onMouseOver={() => setActiveCategory(category._id)}>
                                                                        <span>{category.name}</span><BiChevronRight />
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                    <div className="basis-2/3 lg:basis-3/4 xl:basis-4/5 p-8 flex flex-row justify-between">
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold">{categoriesData.find(cat => cat._id == activeCategory)?.name}</span>
                                                            {
                                                                categoriesData.filter(item => item.parent == categoriesData.find(cat => cat._id == activeCategory)?.name).map(item => <span key={item._id + "_sub"} className="font-semibold">{item?.name}</span>)
                                                            }
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold">Section Title</span>
                                                        </div>
                                                        <div className="flex flex-col basis-1/2">
                                                            <span className="font-semibold">Top Selling in {categoriesData.find(cat => cat._id == activeCategory)?.name}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Popover.Panel>
                                        </Transition>
                                    </>
                                )}
                            </Popover> */}
                            <div className="relative w-full">
                                <Autocomplete queryIndexName={queryIndexName} indexName={algoliaIndex} classNames={{
                                    form: "join !border !rounded-lg !drop-shadow-lg !w-full",
                                    inputWrapper: "join-item w-full",
                                    input: "input input-ghost w-full",
                                    inputWrapperPrefix: "btn btn-ghost join-item",
                                    submitButton: "!text-gray-800",
                                    loadingIndicator: "hidden",
                                    root: "relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm",
                                    inputWrapperSuffix: "btn btn-ghost join-item",
                                    panel: "absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm no-scrollbar z-[99]",
                                    list: "py-1",
                                    item: "relative select-none py-2 pl-4 pr-4 cursor-pointer hover:bg-gray-100"
                                }} detachedMediaQuery="none" openOnFocus onSubmit={(ev) => {
                                    window.location.replace(`/products?search=${query}`)
                                }} />
                            </div>
                        </div>
                        <div className="ml-2 flex">
                            <Link prefetch={false} href="/user/wishlist" className="lg:flex btn btn-ghost text-current hover:btn-secondary hidden cursor-pointer items-center gap-x-1 py-2 px-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="text-sm font-medium">Wishlist</span>
                            </Link>
                            <a href="/cart">
                                <div className="flex cursor-pointer items-center gap-x-1 py-2 px-4 btn btn-ghost hover:btn-secondary text-current">
                                    <div className="relative">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                        </svg>
                                        <span className={clsx((cartCount && cartCount > 0) ? "flex" : "hidden", "absolute -top-3 -right-2 h-5 w-5 items-center justify-center rounded-full bg-red-500 p-2 text-xs text-white")}>
                                            {cartCount ?? 0 < 11 ? cartCount : '10+'}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium">Cart</span>
                                </div>
                            </a>
                            {
                                !session && <Link href="/signin" >
                                    <div className="ml-2 btn btn-outline flex cursor-pointer items-center gap-x-1 py-2 px-4 hover:btn-secondary">
                                        <span className="text-sm font-medium">Sign in</span>
                                    </div>
                                </Link>
                            }
                            {
                                session && (
                                    <Menu as="div" className="relative inline-block text-left">
                                        <div>
                                            <Menu.Button className="ml-2 btn btn-outline flex cursor-pointer items-center gap-x-1 py-2 px-4 hover:btn-secondary">
                                                {session?.user?.name ? session.user.name.split(' ')[0] : session?.user?.email?.split('@')[0]}
                                                <FaCaretDown className="ml-2 -mr-1 h-5 w-5" />
                                            </Menu.Button>
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <div className="px-1 py-1 ">
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <Link href="/user/profile">
                                                                <button
                                                                    className={`${active ? 'bg-primary text-white' : 'text-gray-900'
                                                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                                >
                                                                    {active ? (
                                                                        <RiUserFill
                                                                            className="mr-2 h-5 w-5"
                                                                            aria-hidden="true"
                                                                        />
                                                                    ) : (
                                                                        <RiUserLine
                                                                            className="mr-2 h-5 w-5"
                                                                            aria-hidden="true"
                                                                        />
                                                                    )}
                                                                    My Profile
                                                                </button>
                                                            </Link>
                                                        )}
                                                    </Menu.Item>
                                                </div>
                                                <div className="px-1 py-1 ">
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <Link href="/user/orders">
                                                                <button
                                                                    className={`${active ? 'bg-primary text-white' : 'text-gray-900'
                                                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                                >
                                                                    {active ? (
                                                                        <RiInboxUnarchiveFill
                                                                            className="mr-2 h-5 w-5"
                                                                            aria-hidden="true"
                                                                        />
                                                                    ) : (
                                                                        <RiInboxUnarchiveLine
                                                                            className="mr-2 h-5 w-5"
                                                                            aria-hidden="true"
                                                                        />
                                                                    )}
                                                                    My Orders
                                                                </button>
                                                            </Link>
                                                        )}
                                                    </Menu.Item>
                                                </div>
                                                <div className="px-1 py-1 ">
                                                    {
                                                        (session?.user as { roles: string[] }).roles && ((session?.user as { roles: string[] }).roles.includes('admin') || (session?.user as { roles: string[] }).roles.includes('lister') || (session?.user as { roles: string[] }).roles.includes('editor')) && <Menu.Item>
                                                            {({ active }) => (
                                                                <button
                                                                    onClick={() => {
                                                                        if ((session?.user as { roles: string[] }).roles.includes('admin')) {
                                                                            router.push('/admin')
                                                                        }
                                                                        if ((session?.user as { roles: string[] }).roles.includes('editor')) {
                                                                            router.push('/admin/cms/blogs')
                                                                        }
                                                                        if ((session?.user as { roles: string[] }).roles.includes('lister')) {
                                                                            router.push('/admin/products/list')
                                                                        }
                                                                    }}
                                                                    className={`${active ? 'bg-primary text-white' : 'text-gray-900'
                                                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                                >
                                                                    {active ? (
                                                                        <MdAdminPanelSettings
                                                                            className="mr-2 h-5 w-5"
                                                                            aria-hidden="true"
                                                                        />
                                                                    ) : (
                                                                        <MdOutlineAdminPanelSettings
                                                                            className="mr-2 h-5 w-5"
                                                                            aria-hidden="true"
                                                                        />
                                                                    )}
                                                                    Admin Panel
                                                                </button>
                                                            )}
                                                        </Menu.Item>
                                                    }
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button
                                                                onClick={() => { signOut() }}
                                                                className={`${active ? 'bg-primary text-white' : 'text-gray-900'
                                                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                            >
                                                                {active ? (
                                                                    <RiLogoutCircleFill
                                                                        className="mr-2 h-5 w-5"
                                                                        aria-hidden="true"
                                                                    />
                                                                ) : (
                                                                    <RiLogoutCircleLine
                                                                        className="mr-2 h-5 w-5"
                                                                        aria-hidden="true"
                                                                    />
                                                                )}
                                                                Logout
                                                            </button>
                                                        )}
                                                    </Menu.Item>
                                                </div>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                )
                            }
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex gap-x-2 py-1 px-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-500"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-sm font-medium">
                                {
                                    (userLocation?.region && userLocation?.country_name) ? userLocation.region + ", " + userLocation.country_name : "Not Available"
                                }
                            </span>
                        </div>
                        <div className="lg:flex gap-x-8 hidden">
                            {categoriesData.map(category => {
                                return (
                                    category.parent?.length == undefined && categoriesData.filter(i => i.parent == category.name).length > 0 ?
                                        category.popular && <CategoryPopOver category={category} categoryList={categoriesData} />
                                        : category.popular && <div key={category._id}>
                                            <Link href={`/products/category/${category.name}`}>
                                                <span className="cursor-pointer py-1 px-2 text-sm font-medium btn btn-ghost btn-sm text-current hover:btn-primary hover:text-black capitalize">
                                                    {category.name}
                                                </span>
                                            </Link>
                                        </div>
                                )
                            })}
                        </div>
                        <Link href="/track-order" className="cursor-pointer py-1 px-2 text-sm font-medium btn btn-ghost btn-sm text-current hover:btn-secondary">
                            Track Orders
                        </Link>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default BigScreenNav