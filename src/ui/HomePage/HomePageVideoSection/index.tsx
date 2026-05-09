import React from "react";
import { getLocale } from "next-intl/server";
import { type Locale } from "@/i18n/routing";
import { resolveLocalizedString } from "@/lib/resolveLocalized";
import { getHomePageVideoSection } from "@/backend/serverActions/getHomePageVideoSection";

const HomePageVideoSection = async () => {
    const [data, loc] = await Promise.all([
        getHomePageVideoSection(),
        getLocale(),
    ]);
    const locale = loc as Locale;

    if (!data?.videoUrl) return null;

    const heading = resolveLocalizedString(data.heading, locale);
    const description = resolveLocalizedString(data.description, locale);
    const autoplay = data.autoplay ?? false;

    return (
        <section className="relative w-full overflow-hidden bg-black">
            <video
                className="w-full max-h-[50vh] sm:max-h-[70vh] lg:max-h-[85vh] object-cover"
                src={data.videoUrl}
                poster={data.posterImage || undefined}
                autoPlay={autoplay}
                muted={data.muted ?? true}
                loop={data.loop ?? false}
                playsInline
                controls={!autoplay}
            />

            {heading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 px-6 text-center pointer-events-none">
                    <h2 className="text-white text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight drop-shadow-lg max-w-3xl">
                        {heading}
                    </h2>
                    {description && (
                        <p className="mt-4 text-white/80 text-sm sm:text-base max-w-xl leading-relaxed drop-shadow">
                            {description}
                        </p>
                    )}
                </div>
            )}
        </section>
    );
};

export default HomePageVideoSection;
