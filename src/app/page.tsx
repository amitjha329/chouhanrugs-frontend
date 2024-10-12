import React from 'react'
import HeroSection from '@/ui/HomePage/HeroSection'
import NewProductsSection from '@/ui/HomePage/NewProductsSection'
import OrderProcessSection from '@/ui/HomePage/OrderProcessSection'
import ShopByRoom from '@/ui/HomePage/ShopByRoom'
import ShopByColor from '@/ui/HomePage/ShopByColor'
import TrendingProducts from '@/ui/HomePage/TrendingProducts'
import OurPopularCategories from '@/ui/HomePage/OurPopularCategories'
import ShopBySize from '@/ui/HomePage/ShopBySize'
import Testimonials from '@/ui/HomePage/Testimonials'

const HomePage = () => {
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
      <Testimonials />
    </>
  )
}

export default HomePage