type PageMetaDataModel = {
    _id: string;
    page: string;
    videoBanner?: boolean;
    sliderId?: number;
    pageDescription: string;
    pageKeywords: string;
    pageTitle: string;
    videoPath?: string;
}

export default PageMetaDataModel