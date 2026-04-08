'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function ScrollToTop() {
    const pathname = usePathname()

    useEffect(() => {
        const container = document.getElementById('main-container')
        if (container) {
            container.scrollTo(0, 0)
        }
    }, [pathname])

    return null
}
