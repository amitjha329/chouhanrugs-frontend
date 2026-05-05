import AboutHeader from '@/ui/AboutUs/AboutHeader'
import SomeMoreDetails from '@/ui/AboutUs/SomeMoreDetails'
import StatusCounts from '@/ui/AboutUs/StatusCounts'
import WhatDoWeProvideSection from '@/ui/AboutUs/WhatDoWeProvideSection'
import Intro from '@/ui/AboutUs/WhatDoWeProvideSection/Intro'
import Testimonials from '@/ui/Testimonials'
import { type Locale } from '@/i18n/routing'
import { getStaticPageMetadata } from '@/lib/pageMetadata'
import type { Metadata } from 'next'
import React from 'react'

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: loc } = await props.params
  return getStaticPageMetadata({
    pageKey: "about us",
    locale: loc as Locale,
    path: "about-us",
    fallbackTitle: "About Chouhan Rugs | Handmade Rugs Manufacturer",
    fallbackDescription: "Learn about Chouhan Rugs, our handmade rug craftsmanship, natural materials, and commitment to quality.",
  })
}

const AboutUsPage = () => {
  return (
    <>
      <Intro />
      <AboutHeader />
      <StatusCounts />
      <WhatDoWeProvideSection />
      <SomeMoreDetails />
      <Testimonials />
    </>
  )
}

export default AboutUsPage
