'use client'
import { Transition } from "@headlessui/react"
import { useEffect, useState } from "react"
import clsx from 'clsx'
import MobileSideNav from "./MobileSideNav";
import SiteDataModel from "@/lib/types/SiteDataModel";
import SmallScreenNav from "./SmallScreenNav";
import CategoriesDataModel from "@/lib/types/CategoriesDataModel";
import BigScreenNavThemed from "./BigScreenNavThemed";
import Lights from "../Decor/Lights";
import ThemeDataModel from "@/lib/types/ThemeDataModel";

export default function NavigationThemed({ siteData, categoriesData, theme, indexName, queryIndexName }: { siteData: SiteDataModel, categoriesData: Array<CategoriesDataModel>, theme: ThemeDataModel, indexName: string, queryIndexName: string }) {
    const [hideNavbar, setHideNavbar] = useState(false);
    useEffect(() => {
        let prevScrollpos = window.scrollY;
        window.onscroll = () => {
            let currentScrollPos = window.scrollY;

            if (prevScrollpos > currentScrollPos) {
                setHideNavbar(false);
            } else {
                setHideNavbar(currentScrollPos > 180);
            }
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
        <>
            <nav className={clsx("w-full top-0 left-0 z-10 transition-transform duration-500 fixed", { '-translate-y-full': hideNavbar })}>
                <BigScreenNavThemed queryIndexName={queryIndexName} algoliaIndex={indexName} categoriesData={categoriesData} siteData={siteData} festive={theme.festive} />
                <SmallScreenNav algoliaIndex={indexName} queryIndexName={queryIndexName} siteData={siteData} classes="flex md:hidden flex-wrap justify-between items-center mx-auto max-w-screen-xl px-4 md:px-6 py-2.5 bg-primary-content" sideNavStateToggle={toggleSideNav} />
            </nav>
            <Lights />
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
        </>
    )
}