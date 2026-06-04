import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import HeroSection from '@/ui/HomePage/HeroSection'
import NewProductsSection from '@/ui/HomePage/NewProductsSection'
import OrderProcessSection from '@/ui/HomePage/OrderProcessSection'
import ProductCarouselBasic from '@/ui/ProductCarouselBasic'
import { getNewProductsTopSelling } from '@/backend/serverActions/getNewProductsTopSelling'
import stringEmptyOrNull from '@/lib/stringEmptyOrNull'
import { Metadata } from 'next'
import getPageData from '@/backend/serverActions/getPageData'
import getSiteData from '@/backend/serverActions/getSiteData'
import getAnalyticsData from '@/backend/serverActions/getAnalyticsData'
import { getPageFooterContent } from '@/backend/serverActions/getFooterContent'
import getSlider from '@/backend/serverActions/getSlider'
import { serializeForClient } from '@/utils/serializeForClient'
import FeaturedProducts from '@/ui/HomePage/FeaturedProducts'
import LazySection from '@/ui/LazySection'
import { resolveLocalizedString } from '@/lib/resolveLocalized'
import { type Locale } from '@/i18n/routing'
import { localizedAbsoluteUrl, localizedLanguages } from '@/lib/seoCatalog'
import { getLocale } from "next-intl/server";

// Lazy load below-the-fold sections to reduce initial DOM size
const ShopByRoom = dynamic(() => import('@/ui/HomePage/ShopByRoom'), { ssr: true })
const ShopByColor = dynamic(() => import('@/ui/HomePage/ShopByColor'), { ssr: true })
const TrendingProducts = dynamic(() => import('@/ui/HomePage/TrendingProducts'), { ssr: true })
const JuteHandBagsShowcase = dynamic(() => import('@/ui/HomePage/JuteHandBagsShowcase'), { ssr: true })
const RightImageSideContent = dynamic(() => import('@/ui/HomePage/RightImageSideContent'), { ssr: true })
const DynamicProductShowcase = dynamic(() => import('@/ui/HomePage/DynamicProductShowcase'), { ssr: true })
const HomePageVideoSection = dynamic(() => import('@/ui/HomePage/HomePageVideoSection'), { ssr: true })
const OurPopularCategories = dynamic(() => import('@/ui/HomePage/OurPopularCategories'), { ssr: true })
const ShopBySize = dynamic(() => import('@/ui/HomePage/ShopBySize'), { ssr: true })

const DynamicTestimonials = dynamic(() => import('@/ui/Testimonials'), { loading: () => null })
const DynamicAboveFooterSEOContet = dynamic(() => import('@/ui/HomePage/AboveFooterSEOContet'))

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: loc } = await props.params
  const locale = loc as Locale
  const [data, dataAdditional, bingVerification, googleVerification] = await Promise.all([getPageData("home"), getSiteData(), getAnalyticsData("BING"), getAnalyticsData("GOOGLE_VER")])
  const title = resolveLocalizedString(data.pageTitle, locale)
  const description = resolveLocalizedString(data.pageDescription, locale)
  const keywords = resolveLocalizedString(data.pageKeywords, locale)
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Chouhan Rugs",
      phoneNumbers: dataAdditional.contact_details.phone,
      emails: dataAdditional.contact_details.email,
      images: dataAdditional.logoSrc
    },
    twitter: {
      title,
      card: "summary",
      description,
      images: dataAdditional.logoSrc,
    },
    verification: {
      other: {
        ...(!stringEmptyOrNull(bingVerification.code)) && { "msvalidate.01": bingVerification.code },
      },
      ...(!stringEmptyOrNull(googleVerification.code)) && { google: googleVerification.code },
    },
    alternates: {
      canonical: localizedAbsoluteUrl(dataAdditional.url, "/", locale),
      languages: localizedLanguages(dataAdditional.url, () => "/"),
    }
  }
}

// Wrapper component for Best Sellers section with its own data fetching
async function BestSellersSection({ isMobile }: { isMobile: boolean }) {
  const products = serializeForClient(await getNewProductsTopSelling({ limit: 10 }))
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
  const locale = await getLocale() as Locale
  return (
    <div className="container mx-auto pb-5 text-xs">
      <DynamicAboveFooterSEOContet data={footerContent} locale={locale} />
    </div>
  )
}

const HomePage = async () => {
  // Fetch only what's needed for initial render
  const homePageData = await getPageData("home")
  
  return (
    <>
      {/* Hero Section - Critical above-fold content */}
      <Suspense fallback={null}>
        <HeroWithSlider sliderId={homePageData.sliderId ?? 1} />
      </Suspense>
      
      {/* New Products Section */}
      <Suspense fallback={null}>
        <NewProductsSection />
      </Suspense>

      {/* Shop by Color - Uses content-visibility for perf */}
      <LazySection minHeight="300px">
        <Suspense fallback={null}>
          <ShopByColor />
        </Suspense>
      </LazySection>
      
      {/* Featured Products */}
      <Suspense fallback={null}>
        <FeaturedProducts />
      </Suspense>

      {/* Right-image banner - DB-backed optional section */}
      <Suspense fallback={null}>
        <RightImageSideContent />
      </Suspense>
      
      {/* Order Process - Static content, no Suspense needed */}
      <OrderProcessSection />
      
      {/* Popular Categories - Uses content-visibility for perf */}
      <LazySection minHeight="300px">
        <Suspense fallback={null}>
          <OurPopularCategories />
        </Suspense>
      </LazySection>
      
      {/* Trending Products - Uses content-visibility for perf */}
      <LazySection minHeight="500px">
        <Suspense fallback={null}>
          <TrendingProducts />
        </Suspense>
      </LazySection>
      
      {/* Jute Hand Bags Showcase - Below trending products */}
      <LazySection minHeight="500px">
        <Suspense fallback={null}>
          <JuteHandBagsShowcase />
        </Suspense>
      </LazySection>

      {/* Dynamic product showcase - DB-backed optional section */}
      <LazySection minHeight="500px">
        <Suspense fallback={null}>
          <DynamicProductShowcase />
        </Suspense>
      </LazySection>

      {/* Home video banner - DB-backed optional section */}
      <LazySection minHeight="400px">
        <Suspense fallback={null}>
          <HomePageVideoSection />
        </Suspense>
      </LazySection>
      
      {/* Shop by Size - Uses content-visibility for perf */}
      <LazySection minHeight="600px">
        <Suspense fallback={null}>
          <ShopBySize />
        </Suspense>
      </LazySection>

      
      {/* Shop by Room - Uses content-visibility for perf */}
      <LazySection minHeight="500px">
        <Suspense fallback={null}>
          <ShopByRoom />
        </Suspense>
      </LazySection>
      
      {/* Best Sellers Carousel - Uses content-visibility for perf */}
      <LazySection minHeight="400px">
        <Suspense fallback={null}>
          <BestSellersSection isMobile={false} />
        </Suspense>
      </LazySection>
      
      {/* Testimonials */}
      <DynamicTestimonials />
      
      {/* SEO Footer Content */}
      <Suspense fallback={null}>
        <FooterSEOContent />
      </Suspense>
    </>
  )
}

export default HomePage
