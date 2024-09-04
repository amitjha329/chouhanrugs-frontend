'use client'
import { useSession } from "next-auth/react"
import Link from "next/link"
import { MouseEventHandler, useState } from "react"
import { BiUserCircle } from "react-icons/bi"
import SiteLogoSmall from "../SiteLogo/SiteLogoSmall"
import SiteDataModel from "@/lib/types/SiteDataModel"
import { useDataConnectionContext } from "../Contexts/DataConnectionContext"
import { MdClose } from "react-icons/md"
import { FaHeart } from "react-icons/fa"
import { Autocomplete } from "./AutoCompleteSearchBox"
import { useSearchBox } from "react-instantsearch-core"

const SmallScreenNav = ({ classes, sideNavStateToggle, siteData, algoliaIndex,queryIndexName }: { siteData: SiteDataModel, sideNavStateToggle: () => void, classes: string, algoliaIndex: string,queryIndexName:string }) => {
    const { data: session } = useSession()
    const { cartCount } = useDataConnectionContext()
    const [freeShipBanner, setFreeShipBanner] = useState(true)
    const { query } = useSearchBox()

    const toggleFreeShipBanner: MouseEventHandler = (e) => {
        setFreeShipBanner(!freeShipBanner)
    }

    return (
        <>

            {
                freeShipBanner && <div className="bg-secondary border-b border-gray-100 drop-shadow sm:hidden">
                    <div className="container md:hidden mx-auto flex justify-between items-center w-full py-2">
                        <span className="w-full text-center">Free Shipping Across The Globe</span>
                        <MdClose className="h-5 w-5 mr-3" onClick={toggleFreeShipBanner} />
                    </div>
                </div>
            }
            <div className={classes}>
                <button
                    type="button"
                    className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    onClick={sideNavStateToggle}
                >
                    <span className="sr-only">Open main menu</span>
                    <svg
                        className="w-6 h-6"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
                <a href="/">
                    <SiteLogoSmall siteData={siteData} />
                </a>
                {
                    session && (
                        <>
                            <a href="/cart">
                                <div className="flex cursor-pointer items-center gap-x-1 rounded-md py-2 px-2 hover:bg-gray-100">
                                    <div className="relative">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-gray-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                        </svg>
                                        <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 p-2 text-xs text-white">
                                            {cartCount}
                                        </span>
                                    </div>
                                </div>
                            </a>
                            <a href="/user/wishlist">
                                <div className="flex cursor-pointer items-center gap-x-1 rounded-md py-2 px-2 hover:bg-gray-100">
                                    <div className="relative">
                                        <FaHeart className="h-6 w-6 text-gray-500" />
                                    </div>
                                </div>
                            </a>
                        </>
                    )
                }
                {
                    !session && (
                        <>
                            <a href="/cart">
                                <div className="flex cursor-pointer items-center gap-x-1 rounded-md py-2 pr-4 hover:bg-gray-100">
                                    <div className="relative">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-gray-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                        </svg>
                                    </div>
                                </div>
                            </a>
                            <Link href="/signin">
                                <div className="flex cursor-pointer items-center gap-x-1 rounded-md py-2 hover:bg-gray-100">
                                    <span className="text-sm font-medium">Login</span>
                                    <div className="relative">
                                        <BiUserCircle
                                            className="h-6 w-6 text-gray-500" />
                                    </div>
                                </div>
                            </Link>
                        </>
                    )
                }
                <div className="-ml-4 -mr-4 w-[calc(100%+2rem)] -mb-2.5">
                    <div className="relative w-full">
                        <Autocomplete queryIndexName={queryIndexName} indexName={algoliaIndex} classNames={{
                            form: "join !border-none !rounded-none !w-full",
                            inputWrapper: "join-item w-full",
                            input: "!input !input-sm w-full !rounded-none bg-white",
                            inputWrapperPrefix: "btn !btn-sm btn-ghost !rounded-none join-item",
                            submitButton: "!text-gray-800",
                            loadingIndicator: "hidden",
                            root: "relative w-full cursor-default overflow-hidden bg-white text-left shadow-md sm:text-sm",
                            inputWrapperSuffix: "btn !btn-sm btn-ghost join-item",
                            panel: "absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm no-scrollbar z-[99]",
                            list: "py-1",
                            item: "relative select-none py-2 pl-10 pr-4 cursor-pointer over:bg-gray-100"
                        }} detachedMediaQuery="none" openOnFocus onSubmit={(ev) => {
                            window.location.replace(`/products?search=${query}`)
                        }} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default SmallScreenNav