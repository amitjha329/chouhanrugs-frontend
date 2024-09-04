'use client'
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from '@headlessui/react'
import Image from "next/image";
import { GrClose } from "react-icons/gr"
import Link from "next/link";
import PopUpDataModel from "@/lib/types/PopUpDataModel";

const SitePopUp = ({ popupData }: { popupData: PopUpDataModel }) => {
    const [isOpen, setIsOpen] = useState(false)

    const closeModal = () => {
        setIsOpen(false)
    }

    const openModal = () => {
        setIsOpen(true)
    }

    useEffect(() => {
        popupData?.isActive && (document.cookie.indexOf("popupShown=true") == -1) && setTimeout(() => {
            openModal()
            document.cookie = "popupShown=true; max-age=86400";
        }, 3000)
    }, [popupData])

    return popupData?.isActive && popupData.data ? <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-black/25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden bg-white shadow-xl transition-all flex relative">
                            <div className="absolute top-3 right-3 z-20 border border-white cursor-pointer hover:bg-white transition-all" onClick={() => closeModal()}><GrClose className="h-10 w-10 bg-blend-difference" /></div>
                            <div className="sm:basis-1/2 m-6 flex items-center justify-center flex-col w-full">
                                <Dialog.Title className="text-4xl">
                                    {popupData.data.title}
                                </Dialog.Title>
                                <Dialog.Description className="text-justify">
                                    {popupData.data.description}
                                </Dialog.Description>
                                {
                                    popupData.data.isSubscribeEnabled && <>
                                        <input type="text" placeholder="Enter Email" className="input input-bordered w-full rounded-none mt-5" />
                                        <button className="btn btn-outline rounded-none w-full mt-5">Subscribe</button>
                                    </>
                                }
                                <Link href={popupData.data.button.url} className="btn btn-outline rounded-none w-full mt-5">{popupData.data.button.text}</Link>
                            </div>
                            <figure className="basis-1/2 relative hidden sm:block">
                                <div className="w-full h-full absolute bg-gradient-to-r from-white to-transparent z-10"></div>
                                <Image fill alt="Popup Image" sizes="23vw" className="!relative !h-full !w-auto min-h-[600px]" src={popupData.data.image || "/test.jpg"} quality={20} />
                            </figure>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </div>
        </Dialog>
    </Transition> : null
}

export default SitePopUp