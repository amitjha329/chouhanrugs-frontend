const searchButton = document.getElementById("search_button")
const searchContainer = document.getElementById("search_container")
let openSearch = true

/** 
 * @returns Mouse Event Handler
 */
const handleSearchButtonClick = (e) => {
    if (openSearch) {
        searchContainer.style.height = "65px"
        window.dispatchEvent(new CustomEvent("chouhanrugs:open-search"))
    } else {
        searchContainer.style.removeProperty("height")
    }
    openSearch = !openSearch
}
if (searchButton && searchContainer) {
    searchButton.addEventListener("click", handleSearchButtonClick)
}
