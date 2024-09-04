type SliderDataModel = {
    _id: string;
    slideId: number;
    images: Slides[];
    slideDescription: string;
    active: boolean;
}

export type Slides = {
    src: string | File;
    title: string;
    heading: string;
    desc: string;
}

export default SliderDataModel