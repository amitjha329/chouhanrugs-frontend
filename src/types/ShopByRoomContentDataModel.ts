import { type LocalizedField } from "@/lib/resolveLocalized";

export type ShopByRoomContentDataModel = {
    _id: string;
    bannerImage: string;
    content: ShopByRoomContent[];
    sectionHeadingTag?: string;
};

export type ShopByRoomContent = {
    id: number;
    title: LocalizedField<string>;
    content: LocalizedField<string>;
    image?: string;
};
