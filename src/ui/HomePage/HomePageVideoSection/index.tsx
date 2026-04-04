import React from "react"
import { getHomePageVideoSection } from "@/backend/serverActions/getHomePageVideoSection"

/* ------------------------------------------------------------------ */
/*  Full-width Video Section — data driven from backend                */
/* ------------------------------------------------------------------ */
const HomePageVideoSection = async () => {
    const data = await getHomePageVideoSection()

    if (!data || !data.videoUrl) return null

    const {
        videoUrl,
        posterImage,
        heading,
        description,
        autoplay,
        muted,
        loop,
    } = data

    return (
        <section className="relative w-full overflow-hidden bg-black">
            {/* Video */}
            <video
                className="w-full max-h-[50vh] sm:max-h-[70vh] lg:max-h-[85vh] object-cover"
                src={videoUrl}
                poster={posterImage || undefined}
                autoPlay={autoplay}
                muted={muted ?? true}
                loop={loop}
                playsInline
                controls={!autoplay}
            />

            {/* Overlay text — only shown when there is a heading */}
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
    )
}

export default HomePageVideoSection
