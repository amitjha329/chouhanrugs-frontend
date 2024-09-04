'use client'
import { Dialog, Transition } from '@headlessui/react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { Fragment, useState } from 'react'
import bulkBanner from '../../../../public/images/bulk-banner.svg'
import SizeDataModel from '@/lib/types/SizeDataModel'
import ColorDataModel from '@/lib/types/ColorDataModel'
import saveBulkPurchaseRequest from '@/lib/actions/saveBulkPurchaseRequest'
import onPageNotifications from '@/ui/common/onPageNotifications'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/utilities/axiosInastances'
import { useProductContext } from '../Contexts/ProductContext'

const BulkPurchase = ({ sizeVariation, colorVaration }: {
    sizeVariation: SizeDataModel[],
    colorVaration: ColorDataModel[]
}) => {
    const { product } = useProductContext()
    const router = useRouter()
    const [email, setEmail] = useState<string>()
    const [contact, setContact] = useState<string>()
    const [quantity, setQuantity] = useState<number>()
    const [size, setSize] = useState<string>()
    const [color, setColor] = useState<string>()
    const [longMessage, setLongMessage] = useState<string>()
    const { data: session } = useSession()
    const [bulkDialogDisplay, setBulkDialogDisplay] = useState(false)

    return (
        <>
            <div className="card card-bordered rounded-lg hover:shadow-md hover:scale-[1.005] transition-all cursor-pointer card-side" onClick={e => setBulkDialogDisplay(true)}>
                <div className='card-body'>
                    <div className='card-title'>
                        Bulk Purchase
                    </div>
                    <span>Have some specific number in mind. Reach us and order in bulk.</span>
                </div>
                <figure className='px-8'>
                    <svg
                        width={33}
                        height={57}
                        viewBox='0 0 33 57'
                        xmlns='http://www.w3.org/2000/svg'
                        xmlnsXlink='http://www.w3.org/1999/xlink'
                        className='w-auto h-24 drop-shadow'
                    >
                        <defs>
                            <path id='bb3ajbqdma' d='M0 0h33v56H0z' />
                        </defs>
                        <g fill='none' fillRule='evenodd'>
                            <g transform='translate(0 .5)'>
                                <mask id='nn50zy6hhb' fill='#fff'>
                                    <use xlinkHref='#bb3ajbqdma' />
                                </mask>
                                <path
                                    d='m30.848 20.04-3.654-5.593 3.654-5.593V20.04zm0 12.122-5.825 8.916a.85.85 0 0 0 0 .95l5.039 7.712H23.09l-5.66-8.662c-.19-.293-.546-.475-.93-.475s-.739.182-.93.475L9.908 49.74H2.936l5.039-7.712a.85.85 0 0 0 0-.95L2.15 32.162v-8.325l5.825-8.915a.85.85 0 0 0 0-.95L2.936 6.26h7.052l5.66 8.662c.19.293.545.475.93.475.384 0 .739-.182.93-.475l5.661-8.662h6.893l-5.039 7.712a.85.85 0 0 0 0 .95l5.825 8.915v8.325zm0 14.984-3.654-5.593 3.654-5.593v11.186zM12.39 49.74l4.11-6.287 4.109 6.287h-8.22zM2.15 35.96l3.654 5.593-3.654 5.593V35.96zm0-27.106 3.654 5.593L2.15 20.04V8.854zM20.688 6.26l-4.11 6.287-4.109-6.287h8.219zM33 5.31V.95c0-.525-.48-.95-1.075-.95-.594 0-1.075.425-1.075.95v3.41h-2.992V.95c0-.525-.481-.95-1.075-.95-.595 0-1.075.425-1.075.95v3.41h-2.993V.95c0-.525-.48-.95-1.075-.95-.594 0-1.075.425-1.075.95v3.41h-2.99V.95c0-.525-.48-.95-1.075-.95-.594 0-1.075.425-1.075.95v3.41h-2.992V.95c0-.525-.481-.95-1.075-.95-.595 0-1.075.425-1.075.95v3.41H7.29V.95C7.29.425 6.81 0 6.215 0 5.621 0 5.14.425 5.14.95v3.41H2.15V.95C2.15.425 1.67 0 1.075 0 .481 0 0 .425 0 .95v54.1c0 .525.48.95 1.075.95.594 0 1.075-.425 1.075-.95v-3.41h2.99v3.41c0 .525.481.95 1.075.95.595 0 1.075-.425 1.075-.95v-3.41h2.993v3.41c0 .525.48.95 1.075.95.594 0 1.075-.425 1.075-.95v-3.41h2.992v3.41c0 .525.48.95 1.075.95.594 0 1.075-.425 1.075-.95v-3.41h2.99v3.41c0 .525.481.95 1.075.95s1.075-.425 1.075-.95v-3.41h2.993v3.41c0 .525.48.95 1.075.95.594 0 1.075-.425 1.075-.95v-3.41h2.992v3.41c0 .525.48.95 1.075.95.594 0 1.075-.425 1.075-.95v-4.36l-.002-.009V5.319l.002-.01z'
                                    stroke='#1F3041'
                                    fill='#FFF'
                                    mask='url(#nn50zy6hhb)'
                                />
                            </g>
                            <path
                                d='m16.707 35.286-4.364-7.175 4.364-7.175 1.894 3.117 2.468 4.058-4.362 7.175zm.652-16.315a1.002 1.002 0 0 0-.858-.471c-.354 0-.682.18-.858.471l-5.51 9.058a.896.896 0 0 0 0 .942l5.51 9.058c.176.29.504.471.858.471s.682-.18.858-.47l5.507-9.06a.895.895 0 0 0 0-.94L17.36 18.97z'
                                stroke='#1F3041'
                                fill='#FFF'
                            />
                        </g>
                    </svg>
                </figure>
            </div>
            <Transition appear show={bulkDialogDisplay} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={e => setBulkDialogDisplay(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur" />
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
                                <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white p-7 text-left align-middle shadow-xl transition-all">
                                    <div className='flex flex-row'>
                                        <div className="basis-1/2 max-sm:hidden relative mr-10">
                                            <Image src={bulkBanner.src} alt="Bulk Banner" fill className='max-w-sm' />
                                        </div>
                                        <div className='sm:basis-1/2'>
                                            <Dialog.Title
                                                as="h3"
                                                className="text-xl font-semibold leading-6"
                                            >
                                                Submit a Bulk Purchase Query for This Product
                                            </Dialog.Title>
                                            <div className="mt-8">
                                                <div className='form-control gap-3'>
                                                    <input className='input input-bordered' type="email" placeholder="Your Email" required value={email} onChange={e => setEmail(e.currentTarget.value)} pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$" />
                                                    <input className='input input-bordered' type="text" placeholder="Your Contact Number" required value={contact} onChange={e => setContact(e.currentTarget.value)} pattern="[6789][0-9]{9}" />
                                                    <input className='input input-bordered' type="number" min={0} step={1} max={10000} placeholder="Expected Quantity Requirements." required value={quantity} onChange={e => setQuantity(Number(e.currentTarget.value))} />
                                                    <select className='select select-bordered' onChange={e => setSize(e.currentTarget.value)}>
                                                        <option value={0} disabled selected>Select Size Option</option>
                                                        {
                                                            sizeVariation.map(size => <option key={size._id} value={size._id}>{size.name}({size.sizeCode})</option>)
                                                        }
                                                    </select>
                                                    <select className='select select-bordered' onChange={e => setColor(e.currentTarget.value)}>
                                                        <option value={"0"} disabled selected>Select Color Option</option>
                                                        {
                                                            colorVaration.map(color => <option key={color._id} value={color._id}>{color.name}</option>)
                                                        }
                                                    </select>
                                                    <textarea className='textarea textarea-bordered' placeholder='Explain Your Requirements' required value={longMessage} onChange={e => setLongMessage(e.currentTarget.value)} />
                                                </div>
                                            </div>
                                            <div className="mt-4 sm:join max-sm:gap-3 max-sm:flex max-sm:flex-col">
                                                <button
                                                    type="submit"
                                                    onClick={e => {
                                                        axiosInstance().post('/api/user/createbulkrequest', {
                                                            contactNum: contact ?? "",
                                                            email: email ?? "",
                                                            message: longMessage ?? "",
                                                            productId: product?._id?.toString() ?? "",
                                                            quantity: quantity ?? 0,
                                                            color: color ?? "",
                                                            size: size ?? "",
                                                            user: (session?.user as { id: string }).id
                                                        }).then(({ data }) => {
                                                            if (data.ack) {
                                                                onPageNotifications("success", "Bulk Request Submitted").then(() => {
                                                                    router.push("/user/bulk")
                                                                })
                                                            } else {
                                                                onPageNotifications("error", "Error! Please Try After Some Time.")
                                                                console.error(data.result)
                                                            }
                                                        }).catch(e => console.log(e))
                                                    }}
                                                    className="join-item btn btn-primary text-white w-full"
                                                >
                                                    Submit Request
                                                </button>
                                                <button
                                                    type="button"
                                                    className="join-item btn btn-outline btn-error w-full"
                                                    onClick={e => setBulkDialogDisplay(!bulkDialogDisplay)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition >
        </>
    )
}

export default BulkPurchase