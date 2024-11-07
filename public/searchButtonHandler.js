const searchButton = document.getElementById("search_button")
const searchContainer = document.getElementById("search_container")
let openSearch = true

/** 
 * @returns Mouse Event Handler
 */
const handleSearchButtonClick = (e) => {
    console.log("search_button_clicked")
    if (openSearch) {
        searchContainer.style.height = "65px"
    } else {
        searchContainer.style.removeProperty("height")
    }
    openSearch = !openSearch
}
searchButton.addEventListener("click", handleSearchButtonClick)