const isElementOverflowing = (element: HTMLDivElement) => {
    const overflowX = element.offsetWidth < element.scrollWidth,
        overflowY = element.offsetHeight < element.scrollHeight;
    return (overflowX || overflowY);
}

function makeTextMarquee(element: HTMLElement) {
    element.classList.add("marquee")
}

const textOverflowMarqueeHelper = (element: HTMLCollection) => {
    for (let i = 0; i < element.length; i++) {
        if (isElementOverflowing(element.item(i) as HTMLDivElement)) {
            makeTextMarquee(element.item(i) as HTMLDivElement);
        }
    }
}

export default textOverflowMarqueeHelper