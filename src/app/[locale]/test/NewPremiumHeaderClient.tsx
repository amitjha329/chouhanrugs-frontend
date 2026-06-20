'use client'

import React from 'react'
import Image from '@/ui/components/OptimizedImage'
import { useDataConnectionContext } from '@/utils/Contexts/DataConnectionContext'

export function SearchButton() {
    const handleSearchClick = () => {
        const searchContainer = document.getElementById("search_container")
        if (searchContainer) {
            if (searchContainer.style.height === "65px") {
                searchContainer.style.removeProperty("height")
            } else {
                searchContainer.style.height = "65px"
                window.dispatchEvent(new CustomEvent("chouhanrugs:open-search"))
            }
        }
    }

    return (
        <button
            onClick={handleSearchClick}
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#e5ccb5]/20 transition-colors duration-200"
        >
            <Image src="/vector/Search.svg" alt="Search" width={18} height={18} />
        </button>
    )
}

export function PremiumCartItem({ icon }: { icon: string }) {
    const { cartCount } = useDataConnectionContext()
    return (
        <div className="relative flex items-center justify-center">
            <Image src={icon} alt="Cart" width={18} height={18} />
            {(cartCount ?? 0) > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#6c4624] text-[9px] font-bold text-white shadow-[0_1px_4px_rgba(0,0,0,0.15)] animate-pulse-soft">
                    {cartCount}
                </span>
            )}
        </div>
    )
}
