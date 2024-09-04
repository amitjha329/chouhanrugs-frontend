const imageParallaxHelper = (element: HTMLCollectionOf<HTMLImageElement>) => {
    Array.from(element).forEach(function (item) {
        let img = item;
        let imgParent = item.parentElement;
        function parallaxImg() {
            let speed = Number(img.getAttribute('data-speed')) ?? 0;
            let imgY = imgParent?.offsetTop ?? 0;
            let winY = item.scrollTop ?? 0;
            let winH = item.clientHeight ?? 0;
            let parentH = imgParent?.clientHeight ?? 0;



            let winBottom = winY + winH;


            if (winBottom > imgY && winY < imgY + parentH) {

                let imgBottom = ((winBottom - imgY) * speed);

                let imgTop = winH + parentH;

                let imgPercent = ((imgBottom / imgTop) * 100) + (50 - (speed * 50));
                img.style.top = imgPercent + '%'
                img.style.transform = 'translate(-50%, -' + imgPercent + '%)'
            }
        }
        document.onscroll = (_) => {
            parallaxImg()
        };
    });
}

export default imageParallaxHelper