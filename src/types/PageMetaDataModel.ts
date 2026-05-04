import { LocalizedField } from "@/lib/resolveLocalized"
import type { Data } from "@measured/puck"

type PageMetaDataModel = {
    _id: string;
    page: string;
    slug?: string;
    isDynamic?: boolean;
    draft?: boolean;
    videoBanner?: boolean;
    sliderId?: number;
    pageDescription: LocalizedField<string>;
    pageKeywords: LocalizedField<string>;
    pageTitle: LocalizedField<string>;
    videoPath?: string;
    data?: Data;
    createdAt?: number;
    updatedAt?: number;
}

export default PageMetaDataModel
