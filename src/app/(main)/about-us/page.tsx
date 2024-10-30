import AboutHeader from '@/ui/AboutUs/AboutHeader'
import SomeMoreDetails from '@/ui/AboutUs/SomeMoreDetails'
import StatusCounts from '@/ui/AboutUs/StatusCounts'
import WhatDoWeProvideSection from '@/ui/AboutUs/WhatDoWeProvideSection'
import Intro from '@/ui/AboutUs/WhatDoWeProvideSection/Intro'
import Testimonials from '@/ui/Testimonials'
import React from 'react'

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