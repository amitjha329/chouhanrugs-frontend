'use client'
import updateBulkRequestStatus from '@/lib/actions/updateBulkRequestStatus'
import useChatScroll from '@/lib/customHooks/useChatScroll'
import BulkPurchaseDataModel from '@/lib/types/BulkPurchaseDataModel'
import { ChatMsgDataModel } from '@/lib/types/ChatMsgDataModel'
import { ProductDataModel, ProductDataModelWithColorMap } from '@/lib/types/ProductDataModel'
import UserProfileDataModel from '@/lib/types/UserProfileDataModel'
import onPageNotifications from '@/ui/common/onPageNotifications'
import { webSocketInitializer } from '@/ui/frontend/Contexts/DataConnectionContext'
import clsx from 'clsx'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { MouseEventHandler, useEffect, useState } from 'react'
import { BsSendFill } from 'react-icons/bs'

let socket: WebSocket | undefined = undefined


const AdminBulkChat = ({ bulkRequest, productData, userData, chatHistory, adminData }: { productData: ProductDataModelWithColorMap|null, bulkRequest: BulkPurchaseDataModel, userData?: UserProfileDataModel, adminData?: UserProfileDataModel, chatHistory: Array<ChatMsgDataModel> }) => {
    const { data: session } = useSession()
    const [sendingMsg, setSendingMsg] = useState<string>("")
    const [messages, setMessageList] = useState<Array<ChatMsgDataModel>>([
        { type: "customer", message: bulkRequest.message, date: bulkRequest.requestDate ?? "" },
        ...chatHistory
    ])
    const chatref = useChatScroll(messages)

    const sendMessage = (data: ChatMsgDataModel) => {
        if (socket && socket.readyState === WebSocket.OPEN && session) {
            socket.send(JSON.stringify({
                meta: "chat_msg",
                roomID: bulkRequest._id,
                clientID: adminData?._id,
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
                clientID: adminData?._id,
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
        updateBulkRequestStatus(bulkRequest._id ?? "").then(() => {
            onPageNotifications("success", "The Bulk Request has been successfully Closed.")
        })
    }
    return (
        <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white max-h-full'>
            <div className='card-body'>
                <div className='min-h-[700px] mb-3 bg-gray-100 rounded-xl p-5 flex flex-col justify-end relative'>
                    <div className='absolute top-2 left-2 right-2 bg-white p-5 border border-gray-800 flex'>
                        <div className='mr-4'>
                            <Image src={productData?.images[productData.productPrimaryImageIndex]??""} alt="" height={100} width={100} className='object-cover' />
                        </div>
                        <div className='flex flex-col  justify-between'>
                            <span className='w-full text-base font-semibold'>{productData?.productName}</span>
                            <span className='w-full text-base'>{productData?.productDescriptionShort}</span>
                            <div className='grid grid-cols-2 '>
                                <span><b>Client Name:</b> {userData?.name ?? ""}</span>
                                <span><b>Client Email:</b> {bulkRequest.email}</span>
                                <span><b>Contact number:</b> {bulkRequest.contactNum}</span>
                                <span><b>Quantity:</b> {bulkRequest.quantity}</span>
                            </div>
                        </div>
                        <div className='h-full flex flex-col justify-between gap-5'>
                            <div className='font-bold'>Status: <span className={clsx({ "text-error": !bulkRequest.status }, { "text-success": bulkRequest.status })}>{bulkRequest.status ? "Open" : "Closed"}</span></div>
                            <button className='btn' onClick={handleCLoseRequest}>Close Request</button>
                        </div>
                    </div>
                    <div className='max-h-[500px] overflow-y-scroll overflow-x-clip px-5' ref={chatref}>
                        {
                            messages.map(msg => {
                                return <div key={msg.date} className={clsx("chat flex flex-col", { "chat-end": (msg.type == "agent") }, { "chat-start": (msg.type == "customer") })}>
                                    <div className="chat-bubble">{msg.message}</div>
                                    <span className='text-xs text-gray-700'>{new Date(msg.date).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "medium" })}</span>
                                </div>
                            })
                        }
                    </div>
                </div>
                <form className='join w-full' onClick={e => {
                    e.preventDefault()
                    sendingMsg.length > 0 && sendMessage({ date: new Date().toISOString(), message: sendingMsg, type: "agent" })
                    setSendingMsg("")
                }}>
                    <input className={clsx('input-lg input input-bordered w-full join-item', { "btn-disabled": !bulkRequest.status })} placeholder='Enter Message To Reply' onChange={e => { setSendingMsg(e.currentTarget.value) }} value={sendingMsg} />
                    <button className={clsx('btn btn-lg btn-success btn-square join-item', { "btn-disabled": !bulkRequest.status })} type='submit'><BsSendFill /></button>
                </form>
            </div>
        </div>
    )
}

export default AdminBulkChat