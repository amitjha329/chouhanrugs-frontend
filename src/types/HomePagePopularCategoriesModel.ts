import { type LocalizedField } from "@/lib/resolveLocalized";

export type HomePagePopularCategoryItem = {
    title?: LocalizedField<string>;
    desc?: LocalizedField<string>;
    link?: string;
    image?: string;
    lgspan?: number;
    span?: number;
};

export type HomePagePopularCategoriesModel = {
    _id?: string;
    page: "home";
    dataType: "popular_categories";
    items?: HomePagePopularCategoryItem[];
};
