import Image from "next/image"
import Link from "next/link"
import { BiCart, BiCategoryAlt, BiLayer, BiSupport, BiUser } from "react-icons/bi"
import { PiShapes } from 'react-icons/pi'
import { FiX } from "react-icons/fi"
import { BsBag, BsBagCheck, BsBagPlus, BsBell, BsBug, BsCardImage, BsCart2, BsCartCheck, BsCartDash, BsCartPlus, BsCash, BsCreditCard2Front, BsCurrencyExchange, BsFileEarmarkPost, BsGear, BsHash, BsMailbox, BsPercent, BsReverseLayoutTextSidebarReverse, BsTags, BsTextareaT } from "react-icons/bs"
import { MdOutlineAutoGraph, MdOutlineCategory, MdOutlineDesignServices, MdOutlineEmail } from "react-icons/md"
import { HiOutlineColorSwatch, HiOutlineUserGroup } from 'react-icons/hi'
import { Disclosure, Transition } from "@headlessui/react"
import { FaAngleRight, FaGoogle, FaMicrosoft, FaRegEdit, FaTape } from "react-icons/fa"
import { GoPackage } from "react-icons/go"
import { TbReceiptTax, TbTruckDelivery, TbTruckReturn } from "react-icons/tb"
import { AiOutlineTransaction } from 'react-icons/ai'
import { CiBoxes } from 'react-icons/ci'
import clsx from "clsx"
import SiteDataModel from "@/lib/types/SiteDataModel"
import generateNewProduct from "@/lib/actions/generateNewProduct"
import { useRouter } from "next/navigation"
import { Session } from "next-auth"
import { useEffect, useMemo } from 'react'
import { useAdminDataContext } from "../Contexts/AdminDataPointsContext"

type propTypes = {
    siteData: SiteDataModel
    toggleSidebar: () => void
    bigScreen?: boolean,
    session: Session | null
}

const SideBar = ({ toggleSidebar, siteData, bigScreen, session }: propTypes) => {
    const router = useRouter()
    const { newOrder, pendingOrders, processingOrders, bulkOrders } = useAdminDataContext()
    const isAdmin = useMemo(() => {
        return (session?.user as { roles: string[] }).roles.includes("admin")
    }, [session])
    const isEditor = useMemo(() => {
        return (session?.user as { roles: string[] }).roles.includes("editor")
    }, [session])
    const isLister = useMemo(() => {
        return (session?.user as { roles: string[] }).roles.includes("lister")
    }, [session])
    useEffect(() => { console.log(newOrder) }, [newOrder])
    return (
        <div className={clsx(
            bigScreen ? 'h-screen hidden md:flex w-72 bg-primary rounded-r-lg' : 'flex h-full w-full sm:w-80 bg-primary-content', " flex-col justify-between"
        )}>
            <div className="flex justify-between items-center w-full mb-5 py-4 px-3">
                <Link href="/">
                    <div className={clsx(
                        bigScreen ? 'mx-auto' : 'pl-2.5', "flex items-center"
                    )}>
                        <div className="relative">
                            <Image
                                src={siteData.logoSrc}
                                fill
                                className="!h-auto !w-auto mx-auto !relative"
                                alt="Site Logo"
                            />
                        </div>
                    </div>
                </Link>
                {
                    !bigScreen && <FiX className="w-5 h-5 cursor-pointer text-gray-600" onClick={toggleSidebar} />
                }
            </div>
            <ul className="space-y-2 h-full overflow-y-scroll no-scrollbar">
                <li>
                    <Link
                        href="/admin"
                    >
                        <div className={clsx(
                            bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                        )}>
                            <BiLayer className="flex-shrink-0 w-6 h-6 transition duration-75" />
                            <span className="ml-3 w-full">Dashboard</span>
                        </div>
                    </Link>
                </li>
                <li className="divider" />
                {
                    (isAdmin || isLister) && <>
                        <Disclosure as="li" className="w-full">
                            {({ open }) => (
                                <>
                                    <Disclosure.Button className={clsx(
                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '',
                                        open && bigScreen ? 'bg-secondary' : '',
                                        "flex items-center justify-between p-2 text-base font-normal cursor-pointer w-full"
                                    )}>
                                        <BsBagCheck className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                        <span className="ml-3 w-full text-left">Product</span>
                                        <FaAngleRight className={`flex-shrink-0 w-5 h-5 transition-transform transform-gpu duration-100 ${open ? 'rotate-90' : ''}`} />
                                    </Disclosure.Button>
                                    <Transition
                                        enter="transition duration-100 ease-out"
                                        enterFrom="transform scale-95 opacity-0"
                                        enterTo="transform scale-100 opacity-100"
                                        leave="transition duration-75 ease-out"
                                        leaveFrom="transform scale-100 opacity-100"
                                        leaveTo="transform scale-95 opacity-0">
                                        <Disclosure.Panel as="ul" className="space-y-2 h-full pl-5">
                                            <li>
                                                <div className={clsx(
                                                    bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                                )} onClick={() => {
                                                    generateNewProduct().then(result => router.push('/admin/products/edit/' + result)).catch(err => console.log(err))
                                                }}>
                                                    <BsBagPlus className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                                    <span className="ml-3 w-full">Add New</span>
                                                </div>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/admin/products/list"
                                                >
                                                    <div className={clsx(
                                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                                    )}>
                                                        <BsBag className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                                        <span className="ml-3 w-full">List All</span>
                                                    </div>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/admin/products/colors"
                                                >
                                                    <div className={clsx(
                                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                                    )}>
                                                        <HiOutlineColorSwatch className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                                        <span className="ml-3 w-full">Color Options</span>
                                                    </div>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/admin/products/shapes"
                                                >
                                                    <div className={clsx(
                                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                                    )}>
                                                        <PiShapes className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                                        <span className="ml-3 w-full">Shape Options</span>
                                                    </div>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/admin/products/patterns"
                                                >
                                                    <div className={clsx(
                                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                                    )}>
                                                        <MdOutlineDesignServices className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                                        <span className="ml-3 w-full">Pattern Options</span>
                                                    </div>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/admin/products/sizes"
                                                >
                                                    <div className={clsx(
                                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                                    )}>
                                                        <FaTape className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                                        <span className="ml-3 w-full">Size Options</span>
                                                    </div>
                                                </Link>
                                            </li>
                                        </Disclosure.Panel>
                                    </Transition>
                                </>
                            )}
                        </Disclosure>

                        <Disclosure as="li" className="w-full">
                            {({ open }) => (
                                <>
                                    <Disclosure.Button className={clsx(
                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '',
                                        open && bigScreen ? 'bg-secondary' : '',
                                        "flex items-center justify-between p-2 text-base font-normal cursor-pointer w-full"
                                    )}>
                                        <BiCategoryAlt className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                        <span className="ml-3 w-full text-left">Categories, Tags &amp; Brands</span>
                                        <FaAngleRight className={`flex-shrink-0 w-5 h-5 transition-transform transform-gpu duration-100 ${open ? 'rotate-90' : ''}`} />
                                    </Disclosure.Button>
                                    <Transition
                                        enter="transition duration-100 ease-out"
                                        enterFrom="transform scale-95 opacity-0"
                                        enterTo="transform scale-100 opacity-100"
                                        leave="transition duration-75 ease-out"
                                        leaveFrom="transform scale-100 opacity-100"
                                        leaveTo="transform scale-95 opacity-0">
                                        <Disclosure.Panel as="ul" className="space-y-2 h-full pl-5">
                                            <li>
                                                <Link
                                                    href="/admin/categories"
                                                >
                                                    <div className={clsx(
                                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                                    )}>
                                                        <MdOutlineCategory className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                                        <span className="ml-3 w-full">Categories</span>
                                                    </div>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/admin/tags"
                                                >
                                                    <div className={clsx(
                                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                                    )}>
                                                        <BsHash className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                                        <span className="ml-3 w-full">Tags</span>
                                                    </div>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/admin/brands"
                                                >
                                                    <div className={clsx(
                                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                                    )}>
                                                        <BsTags className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                                        <span className="ml-3 w-full">Brands</span>
                                                    </div>
                                                </Link>
                                            </li>
                                        </Disclosure.Panel>
                                    </Transition>
                                </>
                            )}
                        </Disclosure>
                    </>
                }
                {
                    isAdmin && <>
                        <Disclosure as="li" className="w-full">
                            {({ open }) => (
                                <>
                                    <Disclosure.Button className={clsx(
                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '',
                                        open && bigScreen ? 'bg-secondary' : '',
                                        "flex items-center justify-between p-2 text-base font-normal cursor-pointer w-full"
                                    )}>
                                        <BiCart className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                        <span className="ml-3 w-full text-left">Orders</span>
                                        {newOrder && <div className="badge">New</div>}
                                        <FaAngleRight className={`flex-shrink-0 w-5 h-5 transition-transform transform-gpu duration-100 ${open ? 'rotate-90' : ''}`} />
                                    </Disclosure.Button>
                                    <Transition
                                        enter="transition duration-100 ease-out"
                                        enterFrom="transform scale-95 opacity-0"
                                        enterTo="transform scale-100 opacity-100"
                                        leave="transition duration-75 ease-out"
                                        leaveFrom="transform scale-100 opacity-100"
                                        leaveTo="transform scale-95 opacity-0">
                                        <Disclosure.Panel as="ul" className="space-y-2 h-full pl-5">
                                            <li>
                                                <Link
                                                    href="/admin/orders/all"
                                                >
                                                    <div className={clsx(
                                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                                    )}>
                                                        <BsCart2 className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                                        <span className="ml-3 w-full">All Orders</span>
                                                    </div>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/admin/orders/pending"
                                                >
                                                    <div className={clsx(
                                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                                    )}>
                                                        <BsCartDash className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                                        <span className="ml-3 w-full">Pending Orders</span>
                                                        {pendingOrders > 0 && <div className="badge">{pendingOrders}</div>}
                                                    </div>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/admin/orders/bulk"
                                                >
                                                    <div className={clsx(
                                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                                    )}>
                                                        <CiBoxes className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                                        <span className="ml-3 w-full">Bulk Orders</span>
                                                        {bulkOrders > 0 && <div className="badge">{bulkOrders}</div>}
                                                    </div>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/admin/orders/processing"
                                                >
                                                    <div className={clsx(
                                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                                    )}>
                                                        <BsCartPlus className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                                        <span className="ml-3 w-full">Processing Orders</span>
                                                        {processingOrders > 0 && <div className="badge">{processingOrders}</div>}
                                                    </div>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/admin/orders/shipped"
                                                >
                                                    <div className={clsx(
                                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                                    )}>
                                                        <BsCartCheck className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                                        <span className="ml-3 w-full">Shipped Orders</span>
                                                    </div>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/admin/orders/delivered"
                                                >
                                                    <div className={clsx(
                                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                                    )}>
                                                        <GoPackage className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                                        <span className="ml-3 w-full">Delivered Orders</span>
                                                    </div>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/admin/orders/returns"
                                                >
                                                    <div className={clsx(
                                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                                    )}>
                                                        <TbTruckReturn className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                                        <span className="ml-3 w-full">Returns/Cancelled</span>
                                                    </div>
                                                </Link>
                                            </li>
                                        </Disclosure.Panel>
                                    </Transition>
                                </>
                            )}
                        </Disclosure>
                        <li>
                            <Link
                                href="/admin/users"
                            >
                                <div className={clsx(
                                    bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                )}>
                                    <BiUser className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                    <span className="ml-3 w-full">Users & Roles</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin/taxation"
                            >
                                <div className={clsx(
                                    bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                )}>
                                    <TbReceiptTax className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                    <span className="ml-3 w-full">Tax Settings</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin"
                            >
                                <div className={clsx(
                                    bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                )}>
                                    <AiOutlineTransaction className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                    <span className="ml-3 w-full">Transactions</span>
                                </div>
                            </Link>
                        </li>
                        <Disclosure as="li" className="w-full">
                            {({ open }) => (
                                <>
                                    <Disclosure.Button className={clsx(
                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '',
                                        open && bigScreen ? 'bg-secondary' : '',
                                        "flex items-center justify-between p-2 text-base font-normal cursor-pointer w-full"
                                    )}>
                                        <TbTruckDelivery className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                        <span className="ml-3 w-full text-left">Delivery Management</span>
                                        <FaAngleRight className={`flex-shrink-0 w-5 h-5 transition-transform transform-gpu duration-100 ${open ? 'rotate-90' : ''}`} />
                                    </Disclosure.Button>
                                    <Transition
                                        enter="transition duration-100 ease-out"
                                        enterFrom="transform scale-95 opacity-0"
                                        enterTo="transform scale-100 opacity-100"
                                        leave="transition duration-75 ease-out"
                                        leaveFrom="transform scale-100 opacity-100"
                                        leaveTo="transform scale-95 opacity-0">
                                        <Disclosure.Panel as="ul" className="space-y-2 h-full pl-5">
                                            <li>
                                                <Link
                                                    href="/admin/shipping"
                                                >
                                                    <div className={clsx(
                                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                                    )}>
                                                        <BsCurrencyExchange className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                                        <span className="ml-3 w-full">Delivery Charges</span>
                                                    </div>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/admin/shipping/partners"
                                                >
                                                    <div className={clsx(
                                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                                    )}>
                                                        <BsGear className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                                        <span className="ml-3 w-full">Partner Management</span>
                                                    </div>
                                                </Link>
                                            </li>
                                        </Disclosure.Panel>
                                    </Transition>
                                </>
                            )}
                        </Disclosure>
                        <li>
                            <Link
                                href="/admin/currencies"
                            >
                                <div className={clsx(
                                    bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                )}>
                                    <BsCash className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                    <span className="ml-3 w-full">Currencies</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin/coupons"
                            >
                                <div className={clsx(
                                    bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                )}>
                                    <BsPercent className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                    <span className="ml-3 w-full">Coupons</span>
                                </div>
                            </Link>
                        </li>
                    </>
                }
                {
                    (isAdmin || isEditor) && <>
                        <Disclosure as="li" className="w-full">
                            {({ open }) => (
                                <>
                                    <Disclosure.Button className={clsx(
                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '',
                                        open && bigScreen ? 'bg-secondary' : '',
                                        "flex items-center justify-between p-2 text-base font-normal cursor-pointer w-full"
                                    )}>
                                        <BsFileEarmarkPost className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                        <span className="ml-3 w-full text-left">Content Management</span>
                                        <FaAngleRight className={`flex-shrink-0 w-5 h-5 transition-transform transform-gpu duration-100 ${open ? 'rotate-90' : ''}`} />
                                    </Disclosure.Button>
                                    <Transition
                                        enter="transition duration-100 ease-out"
                                        enterFrom="transform scale-95 opacity-0"
                                        enterTo="transform scale-100 opacity-100"
                                        leave="transition duration-75 ease-out"
                                        leaveFrom="transform scale-100 opacity-100"
                                        leaveTo="transform scale-95 opacity-0">
                                        <Disclosure.Panel as="ul" className="space-y-2 h-full pl-5">
                                            <li>
                                                <Link
                                                    href="/admin/cms/site"
                                                >
                                                    <div className={clsx(
                                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                                    )}>
                                                        <BsGear className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                                        <span className="ml-3 w-full">Site Options</span>
                                                    </div>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/admin/cms/blogs"
                                                >
                                                    <div className={clsx(
                                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                                    )}>
                                                        <FaRegEdit className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                                        <span className="ml-3 w-full">Blogs</span>
                                                    </div>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/admin/cms/pages"
                                                >
                                                    <div className={clsx(
                                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                                    )}>
                                                        <BsReverseLayoutTextSidebarReverse className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                                        <span className="ml-3 w-full">Pages</span>
                                                    </div>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/admin/cms/testimonials"
                                                >
                                                    <div className={clsx(
                                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                                    )}>
                                                        <BsTextareaT className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                                        <span className="ml-3 w-full">Testimonials</span>
                                                    </div>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/admin/cms/sliders"
                                                >
                                                    <div className={clsx(
                                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                                    )}>
                                                        <BsCardImage className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                                        <span className="ml-3 w-full">Sliders &amp; Header</span>
                                                    </div>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/admin/cms/popup"
                                                >
                                                    <div className={clsx(
                                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                                    )}>
                                                        <BsBell className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                                        <span className="ml-3 w-full">PopUp Management</span>
                                                    </div>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/admin/cms/terms"
                                                >
                                                    <div className={clsx(
                                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                                    )}>
                                                        <BsGear className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                                        <span className="ml-3 w-full">Terms &amp; Conditions</span>
                                                    </div>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/admin/cms/policies"
                                                >
                                                    <div className={clsx(
                                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                                    )}>
                                                        <BsGear className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                                        <span className="ml-3 w-full">Policies</span>
                                                    </div>
                                                </Link>
                                            </li>
                                        </Disclosure.Panel>
                                    </Transition>
                                </>
                            )}
                        </Disclosure>
                        <Disclosure as="li" className="w-full">
                            {({ open }) => (
                                <>
                                    <Disclosure.Button className={clsx(
                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '',
                                        open && bigScreen ? 'bg-secondary' : '',
                                        "flex items-center justify-between p-2 text-base font-normal cursor-pointer w-full"
                                    )}>
                                        <MdOutlineAutoGraph className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                        <span className="ml-3 w-full text-left">Analytics & Tools</span>
                                        <FaAngleRight className={`flex-shrink-0 w-5 h-5 transition-transform transform-gpu duration-100 ${open ? 'rotate-90' : ''}`} />
                                    </Disclosure.Button>
                                    <Transition
                                        enter="transition duration-100 ease-out"
                                        enterFrom="transform scale-95 opacity-0"
                                        enterTo="transform scale-100 opacity-100"
                                        leave="transition duration-75 ease-out"
                                        leaveFrom="transform scale-100 opacity-100"
                                        leaveTo="transform scale-95 opacity-0">
                                        <Disclosure.Panel as="ul" className="space-y-2 h-full pl-5">
                                            <li>
                                                <Link
                                                    href="/admin/seo/google"
                                                >
                                                    <div className={clsx(
                                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                                    )}>
                                                        <FaGoogle className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                                        <span className="ml-3 w-full">Google</span>
                                                    </div>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/admin/seo/bing"
                                                >
                                                    <div className={clsx(
                                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                                    )}>
                                                        <FaMicrosoft className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                                        <span className="ml-3 w-full">Bing</span>
                                                    </div>
                                                </Link>
                                            </li>
                                        </Disclosure.Panel>
                                    </Transition>
                                </>
                            )}
                        </Disclosure>
                    </>
                }
                {
                    isAdmin && <>
                        <Disclosure as="li" className="w-full">
                            {({ open }) => (
                                <>
                                    <Disclosure.Button className={clsx(
                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '',
                                        open && bigScreen ? 'bg-secondary' : '',
                                        "flex items-center justify-between p-2 text-base font-normal cursor-pointer w-full"
                                    )}>
                                        <BiCategoryAlt className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                        <span className="ml-3 w-full text-left">CRM</span>
                                        <FaAngleRight className={`flex-shrink-0 w-5 h-5 transition-transform transform-gpu duration-100 ${open ? 'rotate-90' : ''}`} />
                                    </Disclosure.Button>
                                    <Transition
                                        enter="transition duration-100 ease-out"
                                        enterFrom="transform scale-95 opacity-0"
                                        enterTo="transform scale-100 opacity-100"
                                        leave="transition duration-75 ease-out"
                                        leaveFrom="transform scale-100 opacity-100"
                                        leaveTo="transform scale-95 opacity-0">
                                        <Disclosure.Panel as="ul" className="space-y-2 h-full pl-5">
                                            <li>
                                                <Link
                                                    href="/admin/crm/support"
                                                >
                                                    <div className={clsx(
                                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                                    )}>
                                                        <BiSupport className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                                        <span className="ml-3 w-full">Support Inbox</span>
                                                    </div>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/admin/crm/subscribers"
                                                >
                                                    <div className={clsx(
                                                        bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                                    )}>
                                                        <HiOutlineUserGroup className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                                        <span className="ml-3 w-full">Subscribers</span>
                                                    </div>
                                                </Link>
                                            </li>
                                        </Disclosure.Panel>
                                    </Transition>
                                </>
                            )}
                        </Disclosure>
                        <li>
                            <Link
                                href="/admin/cms/bulk-mail"
                            >
                                <div className={clsx(
                                    bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                )}>
                                    <MdOutlineEmail className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                    <span className="ml-3 w-full">Bulk Mail</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin/payments"
                            >
                                <div className={clsx(
                                    bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                )}>
                                    <BsCreditCard2Front className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                    <span className="ml-3 w-full">Payment Gateway</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin/core"
                            >
                                <div className={clsx(
                                    bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                )}>
                                    <BsGear className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                    <span className="ml-3 w-full">Core Config</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin/bug-report"
                            >
                                <div className={clsx(
                                    bigScreen ? 'text-primary-content hover:bg-secondary' : '', "flex items-center justify-between p-2 text-base font-normal cursor-pointer"
                                )}>
                                    <BsBug className="flex-shrink-0 w-6 h-6 transition duration-75" />
                                    <span className="ml-3 w-full">Bug Report</span>
                                </div>
                            </Link>
                        </li>
                    </>
                }
            </ul>
            {/* <div className="flex flex-row justify-between w-full border-t-[1px] ">
                <Link
                    href="#"
                >
                    <div className={className(
                        bigScreen ? 'text-primary-content' : '', "flex items-center w-full p-5 border-r-[1px] text-base font-normal"
                    )}>
                        <FiLogIn className="flex-shrink-0 w-6 h-6 transition duration-75 " />
                        <span className="flex-1 ml-3 whitespace-nowrap">Sign In</span>
                    </div>
                </Link>
                <Link
                    href="#"
                >
                    <div className={className(
                        bigScreen ? 'text-primary-content' : '', "flex items-center w-full p-5 text-base font-normal"
                    )} >
                        <FiUserPlus className="flex-shrink-0 w-6 h-6 transition duration-75" />
                        <span className="flex-1 ml-3 whitespace-nowrap">Sign Up</span>
                    </div>
                </Link>
            </div> */}
        </div>
    )
}

export default SideBar