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