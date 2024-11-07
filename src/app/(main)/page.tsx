import React from 'react'
import HeroSection from '@/ui/HomePage/HeroSection'
import NewProductsSection from '@/ui/HomePage/NewProductsSection'
import OrderProcessSection from '@/ui/HomePage/OrderProcessSection'
import ShopByRoom from '@/ui/HomePage/ShopByRoom'
import ShopByColor from '@/ui/HomePage/ShopByColor'
import TrendingProducts from '@/ui/HomePage/TrendingProducts'
import OurPopularCategories from '@/ui/HomePage/OurPopularCategories'
import ShopBySize from '@/ui/HomePage/ShopBySize'
import Testimonials from '@/ui/Testimonials'
import ProductCarouselBasic from '@/ui/ProductCarouselBasic'
import { getNewProductsTopSelling } from '@/backend/serverActions/getNewProductsTopSelling'
import stringEmptyOrNull from '@/lib/stringEmptyOrNull'
import { Metadata } from 'next'
import getPageData from '@/backend/serverActions/getPageData'
import getSiteData from '@/backend/serverActions/getSiteData'
import getAnalyticsData from '@/backend/serverActions/getAnalyticsData'

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
  const products = await getNewProductsTopSelling({ limit: 10 });
  return (
    <>
      <HeroSection />
      <NewProductsSection />
      <OrderProcessSection />
      <OurPopularCategories />
      <TrendingProducts />
      <ShopBySize />
      <ShopByColor />
      <ShopByRoom />
      <ProductCarouselBasic products={products} sectionHeading='Best Sellers' />
      <Testimonials />
    </>
  )
}

export default HomePage