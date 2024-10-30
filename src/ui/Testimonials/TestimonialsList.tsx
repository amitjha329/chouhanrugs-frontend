import { getTestimonials } from '@/backend/serverActions/getTestimonials'
import React from 'react'
import TestimonialItem from './TestimonialItem'
import SectionTitle from '@/ui/SectionTitle'

const TestimonialsList = async () => {
    const testimonials = await getTestimonials()
    return (
        <div className='fluid_container ~py-5/14 ~px-5/0'>
            <SectionTitle title='Testimonials' className='text-center py-5' />
            <div className='columns-2 md:columns-3 lg:columns-4 fluid_container break-inside-avoid-page'>
                {
                    testimonials.map(t => {
                        return <TestimonialItem key={t._id} {...t} />
                    })
                }
            </div>
        </div>
    )
}

const TestimonialsListMobile = async () => {
    const testimonials = await getTestimonials()
    return (
        <div className='fluid_container ~py-5/14'>
            <SectionTitle title='Testimonials' className='text-center py-5' />
            <div className="carousel carousel-center max-w-full space-x-4 p-4 z-30">
                {
                    testimonials.map(testimonial => {
                        return <TestimonialItem key={testimonial._id} {...testimonial} />
                    })
                }
            </div>
        </div>
    )
}

export { TestimonialsList, TestimonialsListMobile }