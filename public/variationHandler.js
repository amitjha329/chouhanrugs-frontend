const productHiddenInp = document.getElementById("prod_data")
const product = JSON.parse(productHiddenInp.value)

const colorSelector = document.getElementById("color-select")
const colorDisplayer = document.getElementById("display-color")
const sizeSelector = document.getElementById("size-select")
const msrp = document.getElementById("msrp")
const sellPrice = document.getElementById("selling_price")

const session = document.getElementById('session_user')


function calculateDiscountedAmount(discountPercentage, originalAmount) {
    const discountRate = discountPercentage / 100;
    const discountedAmount = originalAmount - (originalAmount * discountRate);

    return discountedAmount;
}

let selectedVaration = null


if (colorSelector) {
    colorSelector.onchange = e => {
        colorDisplayer.style.backgroundColor = product.colorData.find(c => c.name == e.target.value).colorCode.hex
        if (Array.isArray(product.variations)) {
            let variation
            if (sizeSelector) {
                variation = product.variations.find(it => it.variationColor == e.target.value && it.variationSize == sizeSelector.value)
            } else {
                variation = product.variations.find(it => it.variationColor == e.target.value)
            }
            console.log(variation)
            if (variation) {
                selectedVaration = variation.variationCode
                sellPrice.innerText = `$ ${calculateDiscountedAmount(variation.variationDiscount, variation.variationPrice).toFixed(1)}`
                msrp.innerText = `$ ${variation.variationPrice}`
            }
        }
    }
}

if (sizeSelector) {
    sizeSelector.onchange = e => {
        if (Array.isArray(product.variations)) {
            let variation
            if (colorSelector) {
                variation = product.variations.find(it => it.variationColor == colorSelector.value && it.variationSize == e.target.value)
            } else {
                variation = product.variations.find(it => it.variationSize == e.target.value)
            }
            console.log(variation)
            if (variation) {
                selectedVaration = variation.variationCode
                sellPrice.innerText = `$ ${calculateDiscountedAmount(variation.variationDiscount, variation.variationPrice).toFixed(1)}`
                msrp.innerText = `$ ${variation.variationPrice}`
            }
        }
    }
}


const buyNowBtn = document.getElementById("buy_now_btn")
const addToCartButton = document.getElementById("add_to_cart_btn")
const productQuantity = document.getElementById("product_quantity")

if (addToCartButton) {
    addToCartButton.onmousedown = e => {
        addToCartButton.disabled = true
        buyNowBtn.disabled = true
        addToCartButton.classList.add('btn-disabled')
        buyNowBtn.classList.add('btn-disabled')
        fetch('/api/user/addtocart', {
            method: "POST", body: JSON.stringify({
                productId: product._id,
                userId: session.value,
                quantity: Number(productQuantity.value),
                variationCode: selectedVaration
            })
        }).then(res => {
            window.location.reload()
        }).catch(err => console.log(err));
    }
}

if (buyNowBtn) {
    buyNowBtn.onmousedown = e => {
        addToCartButton.disabled = true
        buyNowBtn.disabled = true
        buyNowBtn.classList.add('btn-disabled')
        addToCartButton.classList.add('btn-disabled')
        fetch('/api/user/addtocart', {
            method: "POST", body: JSON.stringify({
                productId: product._id,
                userId: session.value,
                quantity: Number(productQuantity.value),
                variationCode: selectedVaration
            })
        }).then(res => {
            window.location.href = "/cart/checkout"
        }).catch(err => console.log(err));
    }
}