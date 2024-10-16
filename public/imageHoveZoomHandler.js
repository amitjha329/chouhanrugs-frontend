let picSelected = 0;

const imageContainers = document.querySelectorAll('[data-image-container]');
const carouselItems = document.querySelectorAll('[data-carousel-item]');
const zoomedImageList = document.querySelectorAll('[data-zoomed-image]');
const mainImageList = document.querySelectorAll('[data-main-image]');

function updateImageSelection() {
    imageContainers.forEach((container, index) => {
        if (index === picSelected) {
            container.classList.remove('hidden');
        } else {
            container.classList.add('hidden');
        }
    });

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