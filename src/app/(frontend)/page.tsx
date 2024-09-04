import getAnalyticsData from '@/lib/actions/getAnalyticsData';
import { getHomePageShopByRoomMobile, getPageFooterContent } from '@/lib/actions/getPageAdditionalData';
import getPageData from '@/lib/actions/getPageData';
import getSiteData from '@/lib/actions/getSiteData';
import generateOrganizationJsonLd from '@/lib/utilities/generateOrganizationJsonLd';
import generateWebsiteJsonLd from '@/lib/utilities/generateWebsiteJsonLd';
import stringEmptyOrNull from '@/lib/utilities/stringEmptyOrNull';
import AboveFooterSEOContet from '@/ui/frontend/Sections/Home/AboveFooterSEOContet';
import CategoriesSlider from '@/ui/frontend/Sections/Home/CategoriesSlider';
import CategoryTopSelling from '@/ui/frontend/Sections/Home/CategoryTopSelling';
import HomeContentBottomSection from '@/ui/frontend/Sections/Home/HomeContentBottomSection';
import OrderingProcess from '@/ui/frontend/Sections/Home/OrderingProcess';
import ProductSliderClient from '@/ui/frontend/Sections/Home/ProductSliderClient';
import ShopByCategoryClient from '@/ui/frontend/Sections/Home/ShopByCategoryClientSide';
import ShopByColor from '@/ui/frontend/Sections/Home/ShopByColor';
import ShopByRoom from '@/ui/frontend/Sections/Home/ShopByRoom';
import ShopByRoomMobile from '@/ui/frontend/Sections/Home/ShopByRoomMobile';
import ShopBySize from '@/ui/frontend/Sections/Home/ShopBySize';
import Testimonial from '@/ui/frontend/Sections/Home/Testimonial';
import HomeHeroSlider from '@/ui/frontend/Sliders/HomeHeroSlider'
import { Metadata } from 'next';
import { headers } from 'next/headers';
import getPopularCategoriesIdList from '@/lib/actions/getPopularCategoriesIdList';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageData("home")
  const dataAdditional = await getSiteData()
  const bingVerification = await getAnalyticsData("BING")
  const googleVerification = await getAnalyticsData("GOOGLE_VER")
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

export default async function HomePage() {
  const siteDataPromise = getSiteData()
  const pageData = await getPageData("home")
  const categoriesIdsPromise = getPopularCategoriesIdList()
  const footerContentPromise = getPageFooterContent("home")
  const showCategories = headers().get('user-agent')?.includes("Mobile")
  const getShopByRoomMobile = getHomePageShopByRoomMobile();
  const [categoriesIds, footerContent, siteData, shopByRoomMobile] = await Promise.all([categoriesIdsPromise, footerContentPromise, siteDataPromise, getShopByRoomMobile])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={generateWebsiteJsonLd(siteData)}>
      </script>
      <script type='application/ld+json' dangerouslySetInnerHTML={generateOrganizationJsonLd(siteData)}>
      </script>
      <div className="w-full h-auto relative sm:mb-72 lg:mb-60 ">
        <HomeHeroSlider pageMeta={pageData} />
        <ShopByCategoryClient className="transition-all rounded-lg container hidden md:block bg-white drop-shadow-lg absolute left-1/2 -translate-x-1/2 top-3/4 py-3" />
      </div>
      {showCategories && <CategoriesSlider />}
      <ProductSliderClient title="New Products" tagname="New Arrivals" />
      <OrderingProcess />
      {
        categoriesIds.map((cat, index) => {
          return index < 5 && <CategoryTopSelling key={cat._id} categoryId={cat} />
        })
      }
      <ShopBySize />
      <ProductSliderClient title="Hot & Trending" tagname="Hot" />
      <ShopByRoom />
      <ShopByRoomMobile slides={shopByRoomMobile?.content ?? []} />
      <ShopByColor />
      <HomeContentBottomSection />
      <ProductSliderClient title="Best Sellers" tagname="Top Selling" />
      <Testimonial />
      <div className="container mx-auto pb-5">
        <AboveFooterSEOContet data={footerContent} />
      </div>
    </>
  );
}

const slides = [
  {
    title: 'Living Room',
    heading: 'Shop for your',
    src: 'https://cdn.chouhanrugs.com/uploads/sliders/4bd7d0cc4867dd1821ef67201.jpg',
  },
  {
    title: 'Bed Room',
    heading: 'Shop for your',
    src: 'https://cdn.chouhanrugs.com/uploads/sliders/4bd7d0cc4867dd1821ef67201.jpg',
  },
  {
    title: 'Summer',
    heading: 'Refreshing',
    src: 'https://cdn.chouhanrugs.com/uploads/sliders/4bd7d0cc4867dd1821ef67201.jpg',
  }
]
