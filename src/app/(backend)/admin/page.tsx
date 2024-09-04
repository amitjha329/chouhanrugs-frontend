import dastboardData from '@/lib/actions/getDashboardData'
import { Metadata } from 'next'
import React from 'react'
import { BsBarChartSteps, BsCart4, BsCashCoin } from 'react-icons/bs'
import { MdAccountTree } from 'react-icons/md'

export const metadata: Metadata = {
    title: 'Dashboard',
}

const AdminDashBoard = async () => {
    const dahboardDetails = await dastboardData()
    const dashboardCardsSale = [
        { title: "Total Sale", id: "saleTotal", color: "text-purple-500" },
        { title: "Orders Today", id: "orderToday", color: "text-green-500" },
        { title: "Month Sale", id: "saleMonth", color: "text-blue-500" },
        { title: "Year Sale", id: "saleYear", color: "text-yellow-500" }
    ]

    const dashboardCardsOrders = [
        { title: "Orders", id: "orders", color: "text-purple-500" },
        { title: "Pending Orders", id: "orderPending", color: "text-green-500" },
        { title: "Delivered Orders", id: "orderDelivered", color: "text-blue-500" },
        { title: "Returns", id: "orderReturns", color: "text-yellow-500" }
    ]

    const dashboardCardsEarnings = [
        { title: "Total Earnings", id: "earnTotal", color: "text-purple-500" },
        { title: "Today Earnings", id: "earnToday", color: "text-green-500" },
        { title: "Month Earnings", id: "earnMonth", color: "text-blue-500" },
        { title: "Year Earnings", id: "earnYear", color: "text-yellow-500" }
    ]

    const dashboardCardsStats = [
        { title: "Products", id: "productCount", color: "text-purple-500" },
        { title: "Customers", id: "customerCount", color: "text-green-500" },
        { title: "Categories", id: "categoriesCount", color: "text-blue-500" },
        { title: "Tags", id: "TagCount", color: "text-yellow-500" }
    ]
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {
                dashboardCardsSale.map(card => {
                    return (
                        <div key={card.id} className="card card-bordered shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white py-5">
                            <div className="flex flex-row items-center justify-between card-body">
                                <div className="flex flex-col">
                                    <span className="card-normal opacity-75">{card.title}</span>
                                    {(() => {
                                        switch (card.id) {
                                            case 'saleTotal':
                                                return <span className='card-title' id={card.id}>{dahboardDetails.orders.total}</span>
                                            case 'orderToday':
                                                return <span className='card-title' id={card.id}>{dahboardDetails.orders.today}</span>
                                            case 'saleMonth':
                                                return <span className='card-title' id={card.id}>{dahboardDetails.orders.month}</span>
                                            case 'saleYear':
                                                return <span className='card-title' id={card.id}>{dahboardDetails.orders.year}</span>
                                        }
                                    })()}
                                </div>
                                <BsBarChartSteps className={`h-9 w-9 card-side ${card.color}`} />
                            </div>
                        </div>
                    )
                })
            }
            {
                dashboardCardsOrders.map(card => {
                    return (
                        <div key={card.id} className="card card-bordered shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white py-5">
                            <div className="flex flex-row items-center justify-between card-body">
                                <div className="flex flex-col">
                                    <span className="card-normal opacity-75">{card.title}</span>
                                    {(() => {
                                        switch (card.id) {
                                            case 'orders':
                                                return <span className='card-title' id={card.id}>{dahboardDetails.orders.total}</span>
                                            case 'orderPending':
                                                return <span className='card-title' id={card.id}>{dahboardDetails.orders.pending}</span>
                                            case 'orderDelivered':
                                                return <span className='card-title' id={card.id}>{dahboardDetails.orders.delivered}</span>
                                            case 'orderReturns':
                                                return <span className='card-title' id={card.id}>{dahboardDetails.orders.return}</span>
                                        }
                                    })()}
                                </div>
                                <BsCart4 className={`h-9 w-9 card-side ${card.color}`} />
                            </div>
                        </div>
                    )
                })
            }
            {
                dashboardCardsEarnings.map(card => {
                    return (
                        <div key={card.id} className="card card-bordered shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white py-5">
                            <div className="flex flex-row items-center justify-between card-body">
                                <div className="flex flex-col">
                                    <span className="card-normal opacity-75">{card.title}</span>
                                    {(() => {
                                        switch (card.id) {
                                            case 'earnTotal':
                                                return <span className='card-title' id={card.id}>$ {dahboardDetails.earning.total.toFixed(2)}</span>
                                            case 'earnToday':
                                                return <span className='card-title' id={card.id}>$ {dahboardDetails.earning.today.toFixed(2)}</span>
                                            case 'earnMonth':
                                                return <span className='card-title' id={card.id}>$ {dahboardDetails.earning.month.toFixed(2)}</span>
                                            case 'earnYear':
                                                return <span className='card-title' id={card.id}>$ {dahboardDetails.earning.year.toFixed(2)}</span>
                                        }
                                    })()}
                                </div>
                                <BsCashCoin className={`h-9 w-9 card-side ${card.color}`} />
                            </div>
                        </div>
                    )
                })
            }
            {
                dashboardCardsStats.map(card => {
                    return (
                        <div key={card.id} className="card card-bordered shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white py-5">
                            <div className="flex flex-row items-center justify-between card-body">
                                <div className="flex flex-col">
                                    <span className="card-normal opacity-75">{card.title}</span>
                                    {(() => {
                                        switch (card.id) {
                                            case 'productCount':
                                                return <span className='card-title' id={card.id}>{dahboardDetails.general.prod}</span>
                                            case 'customerCount':
                                                return <span className='card-title' id={card.id}>{dahboardDetails.general.user}</span>
                                            case 'categoriesCount':
                                                return <span className='card-title' id={card.id}>{dahboardDetails.general.cats}</span>
                                            case 'TagCount':
                                                return <span className='card-title' id={card.id}>{dahboardDetails.general.tags}</span>
                                        }
                                    })()}
                                </div>
                                <MdAccountTree className={`h-9 w-9 card-side ${card.color}`} />
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default AdminDashBoard