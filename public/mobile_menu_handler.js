document.addEventListener('DOMContentLoaded', function() {
    const menuButtom = document.getElementById("mobile_menu_button")
    const close_mobile_menu = document.getElementById("close_mobile_menu")
    const main_body_container = document.getElementById("main_body_container")
    let openMenu = true

    /**
     * @returns Mouse Event Handler
     */
    const handleMenuClick = (e) => {
        console.log(`menu.clicked ${openMenu ? "close" : "open"}`)
        if (openMenu) {
            main_body_container.style.borderRadius = "3rem"
            main_body_container.style.left = "75%"
            main_body_container.style.scale = 0.9
            main_body_container.style.maxHeight = "100vh"
            main_body_container.style.pointerEvents = "none"
            main_body_container.style.overflow = "hidden"
        } else {
            main_body_container.style.removeProperty("border-radius")
            main_body_container.style.removeProperty("left")
            main_body_container.style.removeProperty("scale")
            main_body_container.style.removeProperty("max-height")
            main_body_container.style.removeProperty("pointer-events")
            main_body_container.style.removeProperty("overflow")
        }
        openMenu = !openMenu
    }
    if (menuButtom && close_mobile_menu) {
        menuButtom.addEventListener("click", handleMenuClick)
        close_mobile_menu.addEventListener("click", handleMenuClick)
    }
});