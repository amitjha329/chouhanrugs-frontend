import React from 'react'

const BottomNavigation = () => {
    return (
        <div className='fixed bottom-1 left-0 right-0 z-[9999] p-2'>
            <div className='flex justify-evenly bg-base-100 border-t border-gray-200 shadow-md rounded-xl'>

                <button className="bottom-nav-item active flex flex-col items-center gap-0.5 py-1">
                    <svg className="w-5 h-5 text-[#5C2D0A]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                    </svg>
                    <span className="text-[10px] font-medium text-[#5C2D0A]">Home</span>
                    <div className="nav-dot block"></div>
                </button>

                <button className="bottom-nav-item flex flex-col items-center gap-0.5 py-1">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                    <span className="text-[10px] font-medium text-gray-400">Categories</span>
                    <div className="nav-dot"></div>
                </button>

                <button className="bottom-nav-item flex flex-col items-center gap-0.5 py-1">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    <span className="text-[10px] font-medium text-gray-400">Search</span>
                    <div className="nav-dot"></div>
                </button>

                <button className="bottom-nav-item flex flex-col items-center gap-0.5 py-1">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <span className="text-[10px] font-medium text-gray-400">Wishlist</span>
                    <div className="nav-dot"></div>
                </button>

                <button className="bottom-nav-item flex flex-col items-center gap-0.5 py-1">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="text-[10px] font-medium text-gray-400">Account</span>
                    <div className="nav-dot"></div>
                </button>

            </div>
        </div>
    )
}

export default BottomNavigation