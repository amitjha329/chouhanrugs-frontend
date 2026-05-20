document.addEventListener('DOMContentLoaded', function () {
    const menuButton = document.getElementById('mobile_menu_button')
    const closeButton = document.getElementById('close_mobile_menu')
    const overlay = document.getElementById('mobile_menu_overlay')
    const panel = document.getElementById('mobile_menu_panel')
    const mainContainer = document.getElementById('main-container')
    let isOpen = false

    const setMenuOpen = (open) => {
        if (!overlay || !panel) return

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

    menuButton?.addEventListener('click', function () {
        setMenuOpen(true)
    })

    closeButton?.addEventListener('click', function () {
        setMenuOpen(false)
    })

    overlay?.addEventListener('click', function (event) {
        if (event.target === overlay) {
            setMenuOpen(false)
        }
    })

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && isOpen) {
            setMenuOpen(false)
        }
    })
})
