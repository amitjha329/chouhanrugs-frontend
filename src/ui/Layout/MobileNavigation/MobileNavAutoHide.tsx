'use client'

import { useEffect } from 'react'

const SCROLL_DELTA = 8
const TOP_VISIBLE_OFFSET = 24

const MobileNavAutoHide = () => {
    useEffect(() => {
        const scrollContainer = document.getElementById('main-container')
        const topNav = document.getElementById('mobile_top_nav')
        const bottomNav = document.getElementById('mobile_bottom_nav')

        if (!scrollContainer || !topNav || !bottomNav) return

        let lastScrollTop = scrollContainer.scrollTop
        let ticking = false

        const setHidden = (hidden: boolean) => {
            const floatingActions = Array.from(
                document.querySelectorAll<HTMLElement>('[data-floating-action="true"]')
            )

            topNav.classList.toggle('-translate-y-full', hidden)
            topNav.classList.toggle('translate-y-0', !hidden)
            bottomNav.classList.toggle('translate-y-[calc(100%+1rem)]', hidden)
            bottomNav.classList.toggle('translate-y-0', !hidden)

            floatingActions.forEach((action) => {
                action.classList.toggle('translate-y-[calc(100%+1rem)]', hidden)
                action.classList.toggle('translate-y-0', !hidden)
                action.classList.toggle('opacity-0', hidden)
                action.classList.toggle('pointer-events-none', hidden)
            })
        }

        const handleScroll = () => {
            if (ticking) return

            ticking = true
            window.requestAnimationFrame(() => {
                const currentScrollTop = scrollContainer.scrollTop
                const scrollDifference = currentScrollTop - lastScrollTop
                const menuIsOpen = document.getElementById('mobile_menu_overlay')?.getAttribute('aria-hidden') === 'false'

                if (menuIsOpen || currentScrollTop <= TOP_VISIBLE_OFFSET) {
                    setHidden(false)
                } else if (Math.abs(scrollDifference) >= SCROLL_DELTA) {
                    setHidden(scrollDifference > 0)
                    lastScrollTop = currentScrollTop
                }

                ticking = false
            })
        }

        setHidden(false)
        scrollContainer.addEventListener('scroll', handleScroll, { passive: true })

        return () => {
            scrollContainer.removeEventListener('scroll', handleScroll)
            setHidden(false)
        }
    }, [])

    return null
}

export default MobileNavAutoHide
