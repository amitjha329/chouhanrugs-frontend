'use client'
import useChatScroll from '@/lib/customHooks/useChatScroll'
import BulkPurchaseDataModel from '@/lib/types/BulkPurchaseDataModel'
import { ChatMsgDataModel } from '@/lib/types/ChatMsgDataModel'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { MouseEventHandler, useEffect, useState } from 'react'
import { webSocketInitializer } from '../Contexts/DataConnectionContext'
import { ProductDataModel, ProductDataModelWithColorMap } from '@/lib/types/ProductDataModel'
import clsx from 'clsx'
import { BsSendFill } from 'react-icons/bs'

let socket: WebSocket | undefined = undefined

const UserBulkChat = ({ bulkRequest, productData, chatHistory }: { bulkRequest: BulkPurchaseDataModel, productData: ProductDataModelWithColorMap | null, chatHistory: Array<ChatMsgDataModel> }) => {
    const { data: session } = useSession()
    const [sendingMsg, setSendingMsg] = useState<string>("")
    const [messages, setMessageList] = useState<Array<ChatMsgDataModel>>([
        { type: "customer", message: bulkRequest.message, date: bulkRequest.requestDate ?? new Date().toISOString() },
        ...chatHistory
    ])
    const chatref = useChatScroll(messages)

    const sendMessage = (data: ChatMsgDataModel) => {
        if (socket && socket.readyState === WebSocket.OPEN && session) {
            socket.send(JSON.stringify({
                meta: "chat_msg",
                roomID: bulkRequest._id,
                clientID: (session.user as { id: string }).id,
                message: data,
            }))
        }
    }

    useEffect(() => {
        (!socket || socket.readyState !== WebSocket.OPEN) && webSocketInitializer(window.location.host).then((result) => {
            socket = result
        })
    }, [])


    useEffect(() => {
        if (socket && socket.readyState === WebSocket.OPEN && session) {
            socket.onopen = (_: Event) => { }

            socket.send(JSON.stringify({
                meta: "join_chat",
                roomID: bulkRequest._id,
                clientID: (session.user as { id: string }).id,
                message: ""
            }))
            socket.onmessage = (event) => {
                const { message } = JSON.parse(event.data)
                if (Array.isArray(message)) {
                    setMessageList([{ type: "received", message: bulkRequest.message, date: bulkRequest.requestDate }, ...message])
                }
            }
        }
    }, [socket, session])

    const handleCLoseRequest: MouseEventHandler = (e) => {
        e.preventDefault()
        // closeBulkPurchaseRequest(bulkRequest._id).then(() => {
        //     onPageNotifications("success", "The Bulk Request has been successfully Closed.")
        // })
    }
    return (
        <div className="mx-auto px-4 sm:px-6 basis-full lg:basis-3/4">
            <div className='container mx-auto my-8 card card-normal drop-shadow-lg bg-white max-h-full'>
                <div className='card-body'>
                    <div className='min-h-[700px] max-md:min-h-[550px] mb-3 bg-gray-100 rounded-xl p-5 flex flex-col justify-end relative'>
                        <div className='absolute top-2 left-2 right-2 bg-white p-5 border border-gray-800 flex max-xl:flex-wrap'>
                            <div className='mr-4 max-md:hidden'>
                                <Image src={productData?.images[productData.productPrimaryImageIndex] ?? ""} alt="" height={100} width={100} className='object-cover' />
                            </div>
                            <div className='flex flex-col  justify-between'>
                                <span className='w-full text-base max-md:text-sm font-semibold'>{productData?.productName ?? ""}</span>
                                <span className='w-full text-base max-md:hidden'>{productData?.productDescriptionShort ?? ""}</span>
                                <div className='grid grid-cols-2 max-md:text-xs'>
                                    <span><b>Client Name:</b> {session?.user?.name}</span>
                                    <span><b>Client Email:</b> {bulkRequest.email}</span>
                                    <span><b>Contact number:</b> {bulkRequest.contactNum}</span>
                                    <span><b>Quantity:</b> {bulkRequest.quantity}</span>
                                </div>
                            </div>
                            <div className='h-full flex flex-col items-center justify-center gap-5'>
                                <div className='font-bold flex gap-3'>Status: <span className={clsx({ "text-error": !bulkRequest.status }, { "text-success": bulkRequest.status })}>{bulkRequest.status ? "Open" : "Closed"}</span></div>
                                {/* <button className='btn' onClick={handleCLoseRequest}>Close Request</button> */}
                            </div>
                        </div>
                        <div className='max-h-[500px] max-md:max-h-[350px] overflow-y-scroll overflow-x-clip px-5' ref={chatref}>
                            {
                                messages.map(msg => {
                                    return <div key={msg.date} className={clsx("chat flex flex-col", { "chat-end": (msg.type == "customer") }, { "chat-start": (msg.type == "agent") })}>
                                        <div className="chat-bubble">{msg.message}</div>
                                        <span className='text-xs text-gray-700'>{new Date(msg.date).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "medium" })}</span>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                    <form className='input-group input-group-lg w-full' onClick={e => {
                        e.preventDefault()
                        sendingMsg.length > 0 && sendMessage({ date: new Date().toISOString(), message: sendingMsg, type: "customer" })
                        setSendingMsg("")
                    }}>
                        <input className='input-lg input input-bordered w-full' placeholder='Enter Message To Reply' onChange={e => { setSendingMsg(e.currentTarget.value) }} value={sendingMsg} />
                        <button className='btn btn-lg btn-success btn-square' type='submit'><BsSendFill /></button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UserBulkChat