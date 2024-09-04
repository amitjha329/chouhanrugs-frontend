'use client'
import { Transition } from "@headlessui/react"
import { useEffect, useState } from "react"
import clsx from 'clsx'
import MobileSideNav from "./MobileSideNav";
import SiteDataModel from "@/lib/types/SiteDataModel";
import BigScreenNav from "./BigScreenNav";
import SmallScreenNav from "./SmallScreenNav";
import CategoriesDataModel from "@/lib/types/CategoriesDataModel";
import { AlgoliaSearchProvider } from "@/app/providers";

export default function Navigation({ siteData, categoriesData, indexName, queryIndexName }: { siteData: SiteDataModel, categoriesData: Array<CategoriesDataModel>, indexName: string, queryIndexName: string }) {
    const [hideNavbar, setHideNavbar] = useState(false);
    useEffect(() => {
        let prevScrollpos = window.scrollY;
        window.onscroll = () => {
            let currentScrollPos = window.scrollY;
            setHideNavbar(currentScrollPos > 180);
            // if (prevScrollpos > currentScrollPos) {
            //     setHideNavbar(false);
            // } else {
            //     setHideNavbar(currentScrollPos > 180);
            // }
            prevScrollpos = currentScrollPos;
        };
    }, []);

    const [sideNavOpen, setSideNavOpen] = useState(false)
    const toggleSideNav = () => {
        setSideNavOpen(!sideNavOpen)
    }

    useEffect(() => {
        document.body.classList.toggle("overflow-hidden", sideNavOpen)
    }, [sideNavOpen])

    return (
        <AlgoliaSearchProvider APPID={process.env.ALGOLIA_APPID ?? ""} KEY={process.env.ALGOLIA_KEY_CLIENT ?? ""} INDEX={process.env.ALGOLIA_INDEX ?? ""}>
            <nav className={clsx("drop-shadow w-full top-0 left-0 z-10 transition-transform duration-500 fixed", { '-translate-y-full': hideNavbar })}>
                <BigScreenNav queryIndexName={queryIndexName} algoliaIndex={indexName} categoriesData={categoriesData} siteData={siteData} />
                <SmallScreenNav algoliaIndex={indexName} queryIndexName={queryIndexName} siteData={siteData} classes="flex md:hidden flex-wrap justify-between items-center mx-auto max-w-screen-xl px-4 md:px-6 py-2.5 bg-primary-content" sideNavStateToggle={toggleSideNav} />
            </nav>
            <Transition
                as="aside"
                className="active fixed z-[99] top-0 left-0 bottom-0 right-0 h-full w-full"
                enter="transition-transform duration-300"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition-transform duration-300"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
                show={sideNavOpen}
            >
                <MobileSideNav siteData={siteData} sideNavStateToggle={toggleSideNav} closeSideNav={() => setSideNavOpen(false)} />
            </Transition>
        </AlgoliaSearchProvider>
    )
}