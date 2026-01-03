import Image from 'next/image'
import React from 'react'
import about_header from '../../../../static_assets/about_header.webp'
import SectionTitle from '@/ui/SectionTitle'

const AboutHeader = () => {
  return (
    <div className='fluid_container ~py-5/14 ~px-5/0 flex flex-col items-center gap-5'>
      <div className='rounded-2xl overflow-hidden w-full h-96 relative'>
        <Image 
          src={about_header} 
          alt='About Us Header - Chouhan Rugs authentic jute products' 
          className='object-cover object-bottom' 
          fill 
          sizes="100vw"
          placeholder="blur"
          loading="lazy"
        />
      </div>
      <SectionTitle title='We Make Authentic Jute Products' className='text-primary text-center' />
      <div className='~text-xs/sm text-gray-500 text-center'>
        Here at Chouhan Rugs, we provide luxurious, environmentally conscious rugs for your home. Experience the elegance of our well produced jute products, which include hemp, cotton, and jute rugs. Discover our extensive selection of handbags, wall macramé, jute cushion coverings, and pillow covers. Our devotion to environmentally friendly production practices guarantees that every piece embodies our commitment to both style and environmental responsibility. With Chouhan Rugs, you can transform your environment and bring mindful living and timeless beauty together.
      </div>
    </div>
  )
}

export default AboutHeader