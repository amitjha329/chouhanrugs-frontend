import { Dispatch, FC, Fragment, SetStateAction, useEffect, useState } from "react";
import { Dialog, Transition } from '@headlessui/react'
import Image from "next/image";
import { GrClose } from "react-icons/gr"
import ReviewImageLightBoxStyle from "./ReviewImageLightBox.module.scss"
import ReviewDataModel from "@/lib/types/ReviewDataModel";
import Flicked from "../../Sliders/Flicked";

type propsType = {
    review: ReviewDataModel,
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

const ReviewImageLightBox: FC<propsType> = ({ review, setIsOpen, isOpen: isOpen = false }) => {
    console.log(review)

    const closeModal = () => {
        setIsOpen(false)
    }

    return review && <Transition appear show={isOpen} as={Fragment}>
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
                        <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden bg-white shadow-xl transition-all flex relative">
                            <div className="absolute top-3 right-3 z-20 border border-white cursor-pointer hover:bg-white transition-all" onClick={() => closeModal()}>
                                <GrClose className="h-7 w-7 bg-blend-difference" />
                            </div>

                            <div className={ReviewImageLightBoxStyle.custompageDots + " sm:basis-1/2 relative hidden sm:block bg-slate-900"}>
                                <Flicked options={{
                                    groupCells: true,
                                    dragThreshold: 10,
                                    selectedAttraction: 0.01,
                                    friction: 0.15,
                                }} elementType="div" >
                                    {review.reviewImages.map((reviewImage: any) => {
                                        return (
                                            <div key={reviewImage} className="flex items-center justify-center w-full xl:!h-[30rem] pt-3">
                                                <Image alt="Review Image" src={reviewImage} fill className="!relative !w-auto" />
                                            </div>
                                        )
                                    })}
                                </Flicked>
                            </div>

                            <div className="basis-1/2 hidden sm:flex m-6  flex-col w-full overflow-y-scroll my-12">
                                <Dialog.Title className="text-2xl text-start font-semibold">
                                    {review.reviewTitle}
                                </Dialog.Title>
                                <Dialog.Description className="text-justify">
                                    {review.reviewDetailed}
                                </Dialog.Description>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </div>
        </Dialog>
    </Transition>
}

export default ReviewImageLightBox