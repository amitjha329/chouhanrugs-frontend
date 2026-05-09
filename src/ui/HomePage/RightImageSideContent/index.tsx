import React from "react";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { type Locale } from "@/i18n/routing";
import { resolveLocalizedString } from "@/lib/resolveLocalized";
import { getHomePageBannerSection } from "@/backend/serverActions/getHomePageBannerSection";

const RightImageSideContent = async () => {
    const [data, loc] = await Promise.all([
        getHomePageBannerSection(),
        getLocale(),
    ]);
    const locale = loc as Locale;

    if (!data?.backgroundImage) return null;

    const heading = resolveLocalizedString(data.heading, locale);
    if (!heading) return null;

    const tagLine = resolveLocalizedString(data.tagLine, locale);
    const buttonText = resolveLocalizedString(data.buttonText, locale) || "Shop Now";
    const buttonLink = data.buttonLink || "/products";

    return (
        <div
            className="~h-[30rem]/[40rem] relative max-md:bg-scroll md:bg-fixed bg-cover bg-center overflow-hidden"
            style={{ backgroundImage: `url(${data.backgroundImage})` }}
        >
            <div className="flex flex-row justify-center pt-44 w-[calc(100%-2rem)] max-w-5xl absolute -top-40 left-1/2 -translate-x-1/2 rounded-full bg-secondary/80 pb-6">
                <div className="flex flex-col items-center justify-center gap-y-2 gap-x-5 px-6 text-center">
                    <span className="~text-xl/2xl font-bold">{heading}</span>
                    {tagLine && <span className="text-sm text-neutral-700">{tagLine}</span>}
                    <Link href={buttonLink} className="btn btn-primary mt-1">
                        {buttonText}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RightImageSideContent;
