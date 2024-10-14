import { MouseEvent } from 'react'
export default function imageHoverZoomHandler(e: MouseEvent, magnified: HTMLDivElement, original: HTMLImageElement) {
    let style = magnified.style,
        x = e.clientX - e.currentTarget.getBoundingClientRect().left,
        y = e.clientY - e.currentTarget.getBoundingClientRect().top
    const { left, top, width, height } = original.getBoundingClientRect()
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