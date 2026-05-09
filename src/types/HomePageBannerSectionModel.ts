import { type LocalizedField } from "@/lib/resolveLocalized";

export type HomePageBannerSectionModel = {
    _id?: string;
    page: "home";
    dataType: "right_image_banner";
    backgroundImage?: string;
    heading?: LocalizedField<string>;
    tagLine?: LocalizedField<string>;
    buttonText?: LocalizedField<string>;
    buttonLink?: string;
};
