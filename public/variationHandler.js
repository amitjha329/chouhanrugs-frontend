
const colorSelector = document.getElementById("color-select")
const colorDisplayer = document.getElementById("display-color")

if (colorSelector) {
    colorSelector.onchange(e => {
        colorDisplayer.style.backgroundColor = e.target.value
    })
}

const buyNowBtn = document.getElementById("buy_now_btn")
const addToCartButton = document.getElementById("add_to_cart_btn")
const productQuantity = document.getElementById("product_quantity")
const productSize = document.getElementById("selected_size")
const productHiddenInp = document.getElementById("prod_data")
const product = JSON.parse(productHiddenInp.value)

if (addToCartButton) {
    addToCartButton.onmousedown(e => {
        console.log(product)
    })
}

if (buyNowBtn) {
    buyNowBtn.onmousedown(e => {
        console.log(product)
    })
}