'use client'
import React, { useState, useMemo } from 'react'
import OrderDataModel from '@/types/OrderDataModel'
import OrderItemCard from './OrderItemCard'
import { HiOutlineShoppingBag, HiOutlineMagnifyingGlass, HiXMark } from 'react-icons/hi2'

type FilterType = 'all' | 'active' | 'cancelled' | 'delivered'

const UserAllOrders = ({ orderItems }: { orderItems: OrderDataModel[] }) => {
    const [filter, setFilter] = useState<FilterType>('all')
    const [searchQuery, setSearchQuery] = useState('')

    // Calculate order statistics
    const stats = useMemo(() => {
        const total = orderItems?.length || 0
        const active = orderItems?.filter(o => 
            !['cancelled', 'delivered', 'returned'].includes(o.orderStatus)
        ).length || 0
        const cancelled = orderItems?.filter(o => o.orderStatus === 'cancelled').length || 0
        const delivered = orderItems?.filter(o => o.orderStatus === 'delivered').length || 0
        return { total, active, cancelled, delivered }
    }, [orderItems])

    // Filter orders based on selected filter and search query
    const filteredOrders = useMemo(() => {
        let filtered = orderItems || []
        
        // Apply status filter
        switch (filter) {
            case 'active':
                filtered = filtered.filter(o => 
                    !['cancelled', 'delivered', 'returned'].includes(o.orderStatus)
                )
                break
            case 'cancelled':
                filtered = filtered.filter(o => o.orderStatus === 'cancelled')
                break
            case 'delivered':
                filtered = filtered.filter(o => o.orderStatus === 'delivered')
                break
        }

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(o => 
                o._id.toLowerCase().includes(query)
            )
        }

        return filtered
    }, [orderItems, filter, searchQuery])

    const filterButtons: { key: FilterType; label: string; count: number; color: string }[] = [
        { key: 'all', label: 'All Orders', count: stats.total, color: 'primary' },
        { key: 'active', label: 'Active', count: stats.active, color: 'info' },
        { key: 'delivered', label: 'Delivered', count: stats.delivered, color: 'success' },
        { key: 'cancelled', label: 'Cancelled', count: stats.cancelled, color: 'error' },
    ]

    return (
        <div className="w-full">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-base-content flex items-center gap-3">
                    <HiOutlineShoppingBag className="w-8 h-8 text-primary" />
                    My Orders
                </h1>
                <p className="text-base-content/60 mt-1">Track and manage your orders</p>
            </div>

            {/* Filters & Search Card */}
            <div className="bg-base-100 rounded-2xl border border-base-300/50 overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-base-300/50 bg-gradient-to-r from-primary/5 to-transparent">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="font-semibold text-base-content">Order History</h2>
                        
                        {/* Search Bar */}
                        <div className="relative w-full sm:w-64">
                            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
                            <input
                                type="text"
                                placeholder="Search by order ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input input-bordered input-sm w-full pl-9 pr-8 focus:input-primary"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs btn-circle"
                                >
                                    <HiXMark className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="px-4 py-3 bg-base-100 border-b border-base-300/50 overflow-x-auto">
                    <div className="flex gap-2 min-w-max">
                        {filterButtons.map(({ key, label, count, color }) => (
                            <button
                                key={key}
                                onClick={() => setFilter(key)}
                                className={`btn btn-sm gap-2 ${
                                    filter === key 
                                        ? 'btn-primary' 
                                        : 'btn-ghost'
                                }`}
                            >
                                {label}
                                <span className={`badge badge-sm ${filter === key ? 'badge-primary-content bg-white/20' : 'badge-ghost'}`}>
                                    {count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List */}
                <div className="p-4 sm:p-6">
                    {filteredOrders.length > 0 ? (
                        <div className="space-y-4">
                            {filteredOrders.map(order => (
                                order && <OrderItemCard key={order._id} orderItem={order} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center mb-4">
                                <HiOutlineShoppingBag className="w-10 h-10 text-base-content/30" />
                            </div>
                            <h3 className="text-lg font-semibold text-base-content mb-1">
                                No orders found
                            </h3>
                            <p className="text-sm text-base-content/60 max-w-sm">
                                {filter !== 'all' 
                                    ? `You don't have any ${filter} orders.`
                                    : searchQuery 
                                        ? `No orders match "${searchQuery}"`
                                        : "Start shopping to see your orders here!"
                                }
                            </p>
                            {(filter !== 'all' || searchQuery) && (
                                <button
                                    onClick={() => { setFilter('all'); setSearchQuery(''); }}
                                    className="btn btn-primary btn-sm mt-4"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserAllOrders