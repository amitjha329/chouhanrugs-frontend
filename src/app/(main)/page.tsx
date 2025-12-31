import React, { Suspense } from 'react'
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
import {
  HeroSkeleton,
  ProductGridSkeleton,
  SectionTitleSkeleton,
  CategorySkeleton
} from './loading'

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

// Wrapper component for Best Sellers section with its own data fetching
async function BestSellersSection({ isMobile }: { isMobile: boolean }) {
  const products = await getNewProductsTopSelling({ limit: 10 })
  return <ProductCarouselBasic products={products} sectionHeading='Best Sellers' isMobile={isMobile} />
}

// Wrapper component for Hero with slider data
async function HeroWithSlider({ sliderId }: { sliderId: number }) {
  const sliderData = await getSlider(sliderId)
  return <HeroSection slider={sliderData} />
}

// Wrapper component for footer SEO content
async function FooterSEOContent() {
  const footerContent = await getPageFooterContent("home")
  return (
    <div className="container mx-auto pb-5 text-xs">
      <DynamicAboveFooterSEOContet data={footerContent} />
    </div>
  )
}

const HomePage = async () => {
  // Single headers() call for device detection - passed down to children
  const header = await headers()
  const isMobile = getDevice({ headers: header }) == "mobile"
  
  // Fetch only what's needed for initial render
  const homePageData = await getPageData("home")
  
  return (
    <>
      {/* Hero Section - Critical above-fold content */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroWithSlider sliderId={homePageData.sliderId ?? 1} />
      </Suspense>
      
      {/* New Products Section */}
      <Suspense fallback={<><SectionTitleSkeleton /><ProductGridSkeleton /></>}>
        <NewProductsSection />
      </Suspense>
      
      {/* Featured Products */}
      <Suspense fallback={<><SectionTitleSkeleton /><ProductGridSkeleton /></>}>
        <FeaturedProducts />
      </Suspense>
      
      {/* Order Process - Static content, no Suspense needed */}
      <OrderProcessSection />
      
      {/* Popular Categories */}
      <Suspense fallback={<><SectionTitleSkeleton /><CategorySkeleton /></>}>
        <OurPopularCategories />
      </Suspense>
      
      {/* Trending Products */}
      <Suspense fallback={<><SectionTitleSkeleton /><ProductGridSkeleton /></>}>
        <TrendingProducts />
      </Suspense>
      
      {/* Shop by Size */}
      <Suspense fallback={<><SectionTitleSkeleton /><CategorySkeleton /></>}>
        <ShopBySize />
      </Suspense>
      
      {/* Shop by Color */}
      <Suspense fallback={<><SectionTitleSkeleton /><CategorySkeleton /></>}>
        <ShopByColor />
      </Suspense>
      
      {/* Shop by Room */}
      <Suspense fallback={<><SectionTitleSkeleton /><CategorySkeleton /></>}>
        <ShopByRoom />
      </Suspense>
      
      {/* Best Sellers Carousel */}
      <Suspense fallback={<><SectionTitleSkeleton /><ProductGridSkeleton /></>}>
        <BestSellersSection isMobile={isMobile} />
      </Suspense>
      
      {/* Testimonials */}
      <DynamicTestimonials />
      
      {/* SEO Footer Content */}
      <Suspense fallback={<div className="container mx-auto pb-5 animate-pulse"><div className="h-20 bg-gray-200 rounded" /></div>}>
        <FooterSEOContent />
      </Suspense>
    </>
  )
}

export default HomePage