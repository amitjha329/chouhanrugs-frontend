import React from 'react'
import Link from 'next/link'
import { getHomePageBannerSection } from '@/backend/serverActions/getHomePageBannerSection'

const RightImageSideContent = async () => {
  const data = await getHomePageBannerSection()

  if (!data || !data.backgroundImage || !data.heading) return null

  const backgroundImage = data.backgroundImage
  const heading = data.heading
  const tagLine = data.tagLine ?? ''
  const buttonText = data.buttonText ?? 'Shop Now'
  const buttonLink = data.buttonLink ?? '/products'

  return (
    <div
      className="~h-[30rem]/[40rem] relative bg-fixed bg-cover overflow-hidden"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="flex flex-row justify-center pt-44 w-full max-w-5xl absolute -top-40 left-1/2 -translate-x-1/2 rounded-full bg-secondary/80 pb-6">
        <div className="flex flex-col items-center justify-center gap-y-2 gap-x-5 px-6 text-center">
          <span className="~text-xl/2xl font-bold">{heading}</span>
          {tagLine && (
            <span className="text-sm text-neutral-700">{tagLine}</span>
          )}
          <Link href={buttonLink} className="btn btn-primary mt-1">
            {buttonText}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RightImageSideContent