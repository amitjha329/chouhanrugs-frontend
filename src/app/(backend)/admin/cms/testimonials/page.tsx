import getTestimonials from '@/lib/actions/getTestimonials'
import TestimonialsTable from '@/ui/backend/Tables/TestimonialsTable'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
    title: 'Testimonial Settings',
}

const TestimonialsSettings = async () => {
    const testimonials = await getTestimonials()
    return <TestimonialsTable testimonialsList={testimonials} />
}

export default TestimonialsSettings