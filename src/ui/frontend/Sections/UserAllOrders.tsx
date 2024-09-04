import React from 'react'
import OrderItemCard from '../Cards/OrderItemCard'
import OrderDataModel from '@/lib/types/OrderDataModel'

const UserAllOrders = ({ className, orderItems }: { className: string, orderItems: OrderDataModel[] }) => {

    return (
        <section className={className}>
            <div className="mx-auto px-4 sm:px-6">
                <div className="container mx-auto my-8 drop-shadow-lg card card-bordered bg-white">
                    <div className='card-body min-h-[600px]'>
                        <div className='card-title'>Your Orders</div>
                        <div className='flex flex-col gap-5'>
                            {
                                orderItems?.map(order => {
                                    return order && <OrderItemCard orderItem={order} />
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default UserAllOrders