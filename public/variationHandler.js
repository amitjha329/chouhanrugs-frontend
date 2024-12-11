const productHiddenInp = document.getElementById("prod_data")
const product = JSON.parse(productHiddenInp.value)

const colorSelector = document.getElementById("color-select")
const colorDisplayer = document.getElementById("display-color")
const sizeSelector = document.getElementById("size-select")
const msrp = document.getElementById("msrp")
const sellPrice = document.getElementById("selling_price")
const imageProductCarousel = document.getElementById("thumbnail-carousel")
// const mainImageList = document.querySelectorAll('[data-main-image]');
// const zoomedImageList = document.querySelectorAll('[data-zoomed-image]');

const userSessionValue = document.getElementById('session_user')

function calculateDiscountedAmount(discountPercentage, originalAmount) {
    const discountRate = discountPercentage / 100;
    const discountedAmount = originalAmount - (originalAmount * discountRate);
    return discountedAmount;
}

function deleteChild(element) {
    let child = element.lastElementChild;
    while (child) {
        element.removeChild(child);
        child = element.lastElementChild;
    }
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
            if (variation) {
                selectedVaration = variation.variationCode
                sellPrice.innerText = `$ ${calculateDiscountedAmount(variation.variationDiscount, variation.variationPrice).toFixed(1)}`
                msrp.innerText = `$ ${variation.variationPrice}`
                if (imageProductCarousel) {
                    deleteChild(imageProductCarousel)
                    const imageElements = []
                    variation.variationImages.forEach((element, index) => {
                        const tempEl = document.createElement("div")
                        const imageEl = document.createElement("img")
                        imageEl.setAttribute("src", `/_next/image?url=${element}&w=256&q=5`)
                        imageEl.setAttribute("alt", `${element}-${index}`)
                        imageEl.setAttribute("height", "100")
                        imageEl.setAttribute("width", "100")
                        imageEl.setAttribute("class", "!relative object-cover")
                        imageEl.setAttribute("quality", "5")
                        tempEl.classList.add("cursor-pointer", "carousel-item", "overflow-hidden", "rounded-lg", "w-20", "h-20", "border-primary", "border")
                        tempEl.setAttribute("data-carousel-item", "true")
                        tempEl.setAttribute("data-item-url", element)
                        tempEl.onclick = (ev) => {

                        }
                        tempEl.append(imageEl)
                        imageElements.push(tempEl)

                        // const viewIMageContainer = document.createElement('div')
                        // const ViewImage = document.createElement('img')
                        // viewIMageContainer.classList.add(`image-${index}`, "rounded-3xl", "mb-4", "relative", "img-zoom-container", "!h-[500px]", "overflow-hidden", `${index > 0 ? "hidden" : ""}`)
                        // ViewImage.setAttribute("src", element)
                    });
                    worker.postMessage({ images: variation.variationImages.map(it => `/_next/image?url=${encodeURIComponent(it)}&w=1920&q=100`) });
                    mainImageList[0].setAttribute('src', `/_next/image?url=${encodeURIComponent(variation.variationImages[0])}&w=1920&q=100`)
                    zoomedImageList[0].style.backgroundImage = `url("/_next/image?url=${encodeURIComponent(variation.variationImages[0])}&w=1920&q=100")`
                    // imageProductCarousel.innerHTML = variation.variationImages.map((image, index) => `<div data-carousel-item="true" class="cursor-pointer carousel-item overflow-hidden rounded-lg w-20 h-20 border-primary border">
                    //     <img src='${image}' alt='${image}-${index}' height="100" width="100" class="!relative object-cover" quality="5" />
                    // </div>`)
                    carouselItems = imageElements
                    imageElements.forEach((item, index) => {
                        item.addEventListener('mouseover', () => {
                            picSelected = index;
                            updateImageSelection();
                            console.log(index);
                        });
                    });
                    imageProductCarousel.replaceChildren(...imageElements)
                }
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
        if (userSessionValue.value.length > 0) {
            fetch('/api/user/addtocart', {
                method: "POST", body: JSON.stringify({
                    productId: product._id,
                    userId: userSessionValue.value,
                    quantity: Number(productQuantity.value),
                    variationCode: selectedVaration
                })
            }).then(res => {
                window.location.reload()
            }).catch(err => console.log(err));
        } else {
            window.location.href = "/signin?cb=" + window.location.pathname
        }
    }
}

if (buyNowBtn) {
    buyNowBtn.onmousedown = e => {
        addToCartButton.disabled = true
        buyNowBtn.disabled = true
        buyNowBtn.classList.add('btn-disabled')
        addToCartButton.classList.add('btn-disabled')
        if (userSessionValue.value.length > 0) {
            fetch('/api/user/addtocart', {
                method: "POST", body: JSON.stringify({
                    productId: product._id,
                    userId: userSessionValue.value,
                    quantity: Number(productQuantity.value),
                    variationCode: selectedVaration
                })
            }).then(res => {
                window.location.href = "/cart/checkout"
            }).catch(err => console.log(err));
        } else {
            window.location.href = "/signin?cb=" + window.location.pathname
        }
    }
}