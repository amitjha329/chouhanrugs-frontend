import React from 'react'

const StatusCounts = () => {
    return (
        <div className="flex justify-center items-center bg-secondary ~py-10/16 ~px-10/0 ~gap-20/40">
            <div className="text-center">
                <div className="~text-4xl/7xl font-bold text-transparent text-str" style={{ WebkitTextStroke: "1px grey" }}>1,000+</div>
                <div className="~text-xl/3xl font-bold text-gray-400">Jute Products</div>
            </div>
            <div className="h-24 border-r border-white"></div>
            <div className="text-center">
                <div className="~text-4xl/7xl font-bold text-transparent" style={{ WebkitTextStroke: "1px grey" }}>20+</div>
                <div className="~text-xl/3xl font-bold text-gray-400">Product Categories</div>
            </div>
        </div>
    )
}

export default StatusCounts