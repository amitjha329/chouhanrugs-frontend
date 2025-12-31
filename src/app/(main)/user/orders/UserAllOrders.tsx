'use client'
import React, { useState, useMemo } from 'react'
import OrderDataModel from '@/types/OrderDataModel'
import OrderItemCard from './OrderItemCard'
import { FaBox, FaTimes } from 'react-icons/fa'

type FilterType = 'all' | 'active' | 'cancelled' | 'delivered'

const UserAllOrders = ({ className, orderItems }: { className: string, orderItems: OrderDataModel[] }) => {
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

    const filterButtons: { key: FilterType; label: string; shortLabel: string; count: number }[] = [
        { key: 'all', label: 'All', shortLabel: 'All', count: stats.total },
        { key: 'active', label: 'Active', shortLabel: 'Active', count: stats.active },
        { key: 'delivered', label: 'Delivered', shortLabel: 'Done', count: stats.delivered },
        { key: 'cancelled', label: 'Cancelled', shortLabel: 'Cancel', count: stats.cancelled },
    ]

    return (
        <section className={className}>
            <div className="mx-auto px-2 sm:px-4">
                <div className="container mx-auto my-2 sm:my-4">
                    {/* Header Section - Compact */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4 mb-3">
                        <div className="flex items-center justify-between gap-2 mb-3">
                            <h1 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-1.5">
                                <FaBox className="text-primary text-sm" />
                                My Orders
                            </h1>
                            
                            {/* Search Bar - Compact */}
                            <div className="relative flex-1 max-w-[180px] sm:max-w-[200px]">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-2.5 pr-7 py-1.5 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-primary/20 focus:border-primary"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                                    >
                                        <FaTimes size={10} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Filter Tabs - Compact */}
                        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-1 px-1">
                            {filterButtons.map(({ key, label, shortLabel, count }) => (
                                <button
                                    key={key}
                                    onClick={() => setFilter(key)}
                                    className={`flex-shrink-0 px-2.5 py-1.5 rounded text-xs font-medium transition-all whitespace-nowrap ${
                                        filter === key 
                                            ? 'bg-primary text-white' 
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <span className="hidden sm:inline">{label}</span>
                                    <span className="sm:hidden">{shortLabel}</span>
                                    <span className="ml-1 opacity-75">({count})</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Orders List */}
                    <div className="space-y-2 sm:space-y-3">
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map(order => (
                                order && <OrderItemCard key={order._id} orderItem={order} />
                            ))
                        ) : (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FaBox className="text-gray-400 text-lg" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-800 mb-1">
                                    No orders found
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {filter !== 'all' 
                                        ? `No ${filter} orders.`
                                        : searchQuery 
                                            ? `No match for "${searchQuery}"`
                                            : "Start shopping to see orders here!"
                                    }
                                </p>
                                {(filter !== 'all' || searchQuery) && (
                                    <button
                                        onClick={() => { setFilter('all'); setSearchQuery(''); }}
                                        className="mt-2 text-primary text-xs font-medium"
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default UserAllOrders