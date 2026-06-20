'use client'

import React, { useEffect, useState } from 'react'
import { FaArrowUp } from 'react-icons/fa'

export default function ScrollToTopButton() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const container = document.getElementById("main-container")
        if (!container) return

        const handleScroll = () => {
            if (container.scrollTop > 300) {
                setVisible(true)
            } else {
                setVisible(false)
            }
        }

        container.addEventListener('scroll', handleScroll)
        // Check initial state
        handleScroll()
        
        return () => container.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTop = () => {
        const container = document.getElementById("main-container")
        if (container) {
            container.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-24 left-8 md:bottom-28 md:left-10 z-[80] w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm border border-[#e5ccb5] shadow-lg flex items-center justify-center text-[#6c4624] hover:bg-[#6c4624] hover:text-white hover:border-[#6c4624] transition-all duration-300 transform active:scale-95 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
            aria-label="Scroll to top"
            title="Scroll to top"
        >
            <FaArrowUp className="w-4 h-4" />
        </button>
    )
}
