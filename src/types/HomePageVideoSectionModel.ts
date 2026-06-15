import { type LocalizedField } from "@/lib/resolveLocalized";

export type HomePageVideoSectionModel = {
    _id?: string;
    page: "home";
    dataType: "home_video_banner";
    videoUrl?: string;
    posterImage?: string;
    heading?: LocalizedField<string>;
    description?: LocalizedField<string>;
    autoplay?: boolean;
    muted?: boolean;
    loop?: boolean;
    headingTag?: string;
};
