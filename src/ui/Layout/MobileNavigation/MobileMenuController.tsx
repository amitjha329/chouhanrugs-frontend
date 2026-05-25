'use client'

import { useEffect } from 'react'

const MobileMenuController = () => {
    useEffect(() => {
        const menuButton = document.getElementById('mobile_menu_button')
        const closeButton = document.getElementById('close_mobile_menu')
        const overlay = document.getElementById('mobile_menu_overlay')
        const panel = document.getElementById('mobile_menu_panel')
        const mainContainer = document.getElementById('main-container')
        const topNav = document.getElementById('mobile_top_nav')

        if (!menuButton || !closeButton || !overlay || !panel) return

        let isOpen = overlay.getAttribute('aria-hidden') === 'false'

        const setMenuOpen = (open: boolean) => {
            isOpen = open
            overlay.setAttribute('aria-hidden', String(!open))
            overlay.classList.toggle('pointer-events-none', !open)
            overlay.classList.toggle('opacity-0', !open)
            overlay.classList.toggle('opacity-100', open)
            panel.classList.toggle('-translate-x-full', !open)
            panel.classList.toggle('translate-x-0', open)

            if (mainContainer) {
                mainContainer.style.overflow = open ? 'hidden' : ''
            }
        }

        const openMenu = () => setMenuOpen(true)
        const closeMenu = () => setMenuOpen(false)

        const handleOverlayClick = (event: MouseEvent) => {
            if (event.target === overlay) {
                closeMenu()
            }
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                closeMenu()
            }
        }

        const handlePanelClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement | null
            if (!target) return

            const closeTrigger = target.closest('a[href], button[data-close-menu="true"]')
            if (closeTrigger) {
                closeMenu()
            }
        }

        const focusSearch = () => {
            closeMenu()
            topNav?.classList.remove('-translate-y-full')
            topNav?.classList.add('translate-y-0')

            window.requestAnimationFrame(() => {
                const searchInput = document.querySelector<HTMLInputElement>('#mobile_algolia_search .aa-Input')
                if (!searchInput) return
                searchInput.focus()
                searchInput.click()
            })
        }

        const handleOpenEvent = () => openMenu()
        const handleCloseEvent = () => closeMenu()
        const handleFocusSearchEvent = () => focusSearch()

        menuButton.addEventListener('click', openMenu)
        closeButton.addEventListener('click', closeMenu)
        overlay.addEventListener('click', handleOverlayClick)
        panel.addEventListener('click', handlePanelClick)
        document.addEventListener('keydown', handleEscape)
        window.addEventListener('mobile-menu:open', handleOpenEvent as EventListener)
        window.addEventListener('mobile-menu:close', handleCloseEvent as EventListener)
        window.addEventListener('mobile-search:focus', handleFocusSearchEvent as EventListener)

        return () => {
            menuButton.removeEventListener('click', openMenu)
            closeButton.removeEventListener('click', closeMenu)
            overlay.removeEventListener('click', handleOverlayClick)
            panel.removeEventListener('click', handlePanelClick)
            document.removeEventListener('keydown', handleEscape)
            window.removeEventListener('mobile-menu:open', handleOpenEvent as EventListener)
            window.removeEventListener('mobile-menu:close', handleCloseEvent as EventListener)
            window.removeEventListener('mobile-search:focus', handleFocusSearchEvent as EventListener)
            if (mainContainer) {
                mainContainer.style.overflow = ''
            }
        }
    }, [])

    return null
}

export default MobileMenuController
