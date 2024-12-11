// @ts-nocheck
'use client'
import SiteDataModel from "@/types/SiteDataModel";
import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment } from "react";
import { BsFillChatDotsFill } from "react-icons/bs";
import { FaEnvelope, FaWhatsapp } from "react-icons/fa";
import { MdClose } from "react-icons/md";

const FloatingButtonChat = ({ siteData }: { className?: string, siteData: SiteDataModel }) => {
    return (
        <div className="fixed bottom-20 right-3 z-[9999]">
            <Popover className="relative">
                {
                    ({ open }) => (
                        <>
                            <PopoverButton className="rounded-full p-3 bg-primary text-white">
                                {
                                    open ? <MdClose size={35} /> : <BsFillChatDotsFill size={25} />
                                }
                            </PopoverButton>
                            <Transition as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1">
                                <PopoverPanel className="absolute bottom-[70px] right-3 shadow-sm bg-white border-2 border-primary rounded-lg before:border-t-primary before:border-t-8 before:border-x-8 before:border-x-transparent before:left-[90%] before:absolute before:content-[''] before:z-20 before:top-full">
                                    <div className="flex flex-col">
                                        <div className="bg-primary w-56 p-2 text-white">
                                            <p className="text-xl">Hello There?</p>
                                            <p className="text-sm">We are just a messeage away.</p>
                                        </div>
                                        <div className="bg-white w-56 rounded-lg">
                                            <Link href={`mailto:${siteData.contact_details.email}`} className="flex items-center justify-start gap-5 p-3 border-b border-b-primary">
                                                <FaEnvelope /> Email Us
                                            </Link>
                                            <Link target="_blank" href={`https://wa.me/${siteData.contact_details.whatsapp}`} className="flex items-center justify-start gap-5 p-3">
                                                <FaWhatsapp /> Whatsapp Us
                                            </Link>
                                        </div>
                                    </div>
                                </PopoverPanel>
                            </Transition>
                        </>
                    )
                }
            </Popover>
        </div>
    );
}

export default FloatingButtonChat;