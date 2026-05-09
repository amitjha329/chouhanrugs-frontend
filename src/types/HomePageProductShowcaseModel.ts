import { type LocalizedField } from "@/lib/resolveLocalized";

export type HomePageProductShowcaseModel = {
    _id?: string;
    page: "home";
    dataType: "product_showcase";
    heroImage?: string;
    heroImageAlt?: LocalizedField<string>;
    category?: string;
    limit?: number;
    sectionHeading?: LocalizedField<string>;
    productGridHeading?: LocalizedField<string>;
    description?: LocalizedField<string>;
    heroLinkHref?: string;
    knowMoreHref?: string;
    browseHref?: string;
};
