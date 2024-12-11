let picSelected = 0;

let imageContainers = document.querySelectorAll('[data-image-container]');
let carouselItems = document.querySelectorAll('[data-carousel-item]');
let zoomedImageList = document.querySelectorAll('[data-zoomed-image]');
let mainImageList = document.querySelectorAll('[data-main-image]');
let imagesInputHidden = document.getElementById('imagesProducts');

function updateImageSelection() {

    const img = carouselItems[picSelected].getAttribute('data-item-url')

    mainImageList[0].setAttribute('src', `/_next/image?url=${encodeURIComponent(img)}&w=1920&q=100`)
    zoomedImageList[0].style.backgroundImage = `url("/_next/image?url=${encodeURIComponent(img)}&w=1920&q=100")`


    carouselItems.forEach((item, index) => {
        if (index === picSelected) {
            item.classList.add('ring-2', 'ring-primary', 'shadow', 'ring-offset-1');
        } else {
            item.classList.remove('ring-2', 'ring-primary', 'shadow', 'ring-offset-1');
        }
    });
}

carouselItems.forEach((item, index) => {
    item.addEventListener('mouseover', () => {
        picSelected = index;
        updateImageSelection();
        console.log(index);
    });
});

updateImageSelection();

imageContainers.forEach((container, index) => {
    container.addEventListener('mousemove', (e) => {
        console.log("entered")
        const zoomedImage = zoomedImageList[index]; // Assuming generatedId is accessible here
        const mainImage = mainImageList[index]; // Assuming generatedId is accessible here

        if (zoomedImage && mainImage) {
            let style = zoomedImage.style,
                x = e.clientX - e.currentTarget.getBoundingClientRect().left,
                y = e.clientY - e.currentTarget.getBoundingClientRect().top
            const { left, top, width, height } = mainImage.getBoundingClientRect()
            let xperc = (e.clientX - left) / width * 100,
                yperc = (e.clientY - top) / height * 100

            //lets user scroll past right edge of image
            if (x > (.01 * width)) {
                xperc += (.15 * xperc);
            };

            //lets user scroll past bottom edge of image
            if (y >= (.01 * height)) {
                yperc += (.15 * yperc);
            };

            style.backgroundPositionX = (xperc - 9) + '%';
            style.backgroundPositionY = (yperc - 9) + '%';

            style.left = (e.clientX - left - 170) + 'px';
            style.top = (e.clientY - top - 170) + 'px';
        }
    });
});



// main.js

const worker = new Worker('/imageCacheWorker.js');

const imagesToCache = JSON.parse(imagesInputHidden.value);

worker.postMessage({ images: imagesToCache });

worker.addEventListener('message', (event) => {
    const { status, imageUrl, error } = event.data;
    if (status === 'success') {
        console.log(`Successfully cached: ${imageUrl}`);
    } else if (status === 'error') {
        console.error(`Error caching ${imageUrl}: ${error}`);
    }
});


