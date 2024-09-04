'use client'
import { useState, useEffect } from 'react'
import { Transition } from '@headlessui/react'
import clsx from 'clsx'
import NavBar from './NavBar'
import SideBar from './Sidebar'
import ReactStickyBox from "react-sticky-box"
import SiteDataModel from '@/lib/types/SiteDataModel'
import { Session } from 'next-auth'

const AdminNavigation = ({
    children,
    siteData,
    session
}: {
    children: React.ReactNode, siteData: SiteDataModel, session: Session | null
}) => {

    const [isCollapsed, setIsCollapsed] = useState(false)

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed)
    }

    useEffect(() => {
        document.body.classList.toggle("overflow-hidden", isCollapsed)
    }, [isCollapsed])

    return (
        <div className={clsx("bg-gray-50 flex flex-row items-start")}>
            <Transition
                as="aside"
                className="active fixed z-[99] top-0 left-0 bottom-0 right-0 h-full w-full"
                enter="transition-transform duration-300"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition-transform duration-300"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
                show={isCollapsed}
            >
                <SideBar toggleSidebar={toggleSidebar} siteData={siteData} session={session} />
            </Transition>
            <ReactStickyBox offsetBottom={0} offsetTop={0}>
                <SideBar toggleSidebar={toggleSidebar} siteData={siteData} session={session} bigScreen />
            </ReactStickyBox>
            <div className="container mx-auto">
                <NavBar toggleSidebar={toggleSidebar} />
                <div className="py-16 px-5">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default AdminNavigation