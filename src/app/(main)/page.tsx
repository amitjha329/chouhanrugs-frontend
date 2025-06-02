import React from 'react'
import dynamic from 'next/dynamic'
import HeroSection from '@/ui/HomePage/HeroSection'
import NewProductsSection from '@/ui/HomePage/NewProductsSection'
import OrderProcessSection from '@/ui/HomePage/OrderProcessSection'
import ShopByRoom from '@/ui/HomePage/ShopByRoom'
import ShopByColor from '@/ui/HomePage/ShopByColor'
import TrendingProducts from '@/ui/HomePage/TrendingProducts'
import OurPopularCategories from '@/ui/HomePage/OurPopularCategories'
import ShopBySize from '@/ui/HomePage/ShopBySize'
import ProductCarouselBasic from '@/ui/ProductCarouselBasic'
import { getNewProductsTopSelling } from '@/backend/serverActions/getNewProductsTopSelling'
import stringEmptyOrNull from '@/lib/stringEmptyOrNull'
import { Metadata } from 'next'
import getPageData from '@/backend/serverActions/getPageData'
import getSiteData from '@/backend/serverActions/getSiteData'
import getAnalyticsData from '@/backend/serverActions/getAnalyticsData'
import { getPageFooterContent } from '@/backend/serverActions/getFooterContent'
import getSlider from '@/backend/serverActions/getSlider'
import { headers } from 'next/headers'
import getDevice from '@/utils/getDevice'
import FeaturedProducts from '@/ui/HomePage/FeaturedProducts'

const DynamicTestimonials = dynamic(() => import('@/ui/Testimonials'), { loading: () => <div className="min-h-[200px] flex items-center justify-center">Loading testimonials...</div> })
const DynamicAboveFooterSEOContet = dynamic(() => import('@/ui/HomePage/AboveFooterSEOContet'))

export async function generateMetadata(): Promise<Metadata> {
  const [data, dataAdditional, bingVerification, googleVerification] = await Promise.all([getPageData("home"), getSiteData(), getAnalyticsData("BING"), getAnalyticsData("GOOGLE_VER")])
  return {
    title: data.pageTitle,
    description: data.pageDescription,
    keywords: data.pageKeywords,
    openGraph: {
      title: data.pageTitle,
      description: data.pageDescription,
      type: "website",
      siteName: "Chouhan Rugs",
      phoneNumbers: dataAdditional.contact_details.phone,
      emails: dataAdditional.contact_details.email,
      images: dataAdditional.logoSrc
    },
    twitter: {
      title: data.pageTitle,
      card: "summary",
      description: data.pageDescription,
      images: dataAdditional.logoSrc,
    },
    verification: {
      other: {
        ...(!stringEmptyOrNull(bingVerification.code)) && { "msvalidate.01": bingVerification.code },
      },
      ...(!stringEmptyOrNull(googleVerification.code)) && { google: googleVerification.code },
    },
    alternates: {
      canonical: dataAdditional.url
    }
  }
}

const HomePage = async () => {
  const footerContentPromise = getPageFooterContent("home")
  const homePageDataPromise = getPageData("home")
  const productsPromise = getNewProductsTopSelling({ limit: 10 });
  const siteDataPromise = getSiteData();
  const header = await headers()
  const isMobile = getDevice({ headers: header }) == "mobile"
  const [footerContent, homePageData, products, siteData] = await Promise.all([
    footerContentPromise,
    homePageDataPromise,
    productsPromise,
    siteDataPromise
  ])
  const sliderData = await getSlider(homePageData.sliderId ?? 1)
  return (
    <>
      <HeroSection slider={sliderData} />
      <NewProductsSection />
      <FeaturedProducts />
      <OrderProcessSection />
      <OurPopularCategories />
      <TrendingProducts />
      <ShopBySize />
      <ShopByColor />
      <ShopByRoom />
      <ProductCarouselBasic products={products} sectionHeading='Best Sellers' isMobile={isMobile} />
      <DynamicTestimonials />
      <div className="container mx-auto pb-5 text-xs">
        <DynamicAboveFooterSEOContet data={footerContent} />
      </div>
    </>
  )
}

export default HomePage