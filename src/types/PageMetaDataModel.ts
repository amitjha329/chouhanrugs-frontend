import { LocalizedField } from "@/lib/resolveLocalized"

type PageMetaDataModel = {
    _id: string;
    page: string;
    videoBanner?: boolean;
    sliderId?: number;
    pageDescription: LocalizedField<string>;
    pageKeywords: LocalizedField<string>;
    pageTitle: LocalizedField<string>;
    videoPath?: string;
}

export default PageMetaDataModel