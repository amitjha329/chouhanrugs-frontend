import React from 'react'
import './testimonialItem.scss';
import { headers } from 'next/headers';
import getDevice from '@/utils/getDevice';
import { TestimonialsList, TestimonialsListMobile } from './TestimonialsList';

const Testimonials = async () => {

    const header = headers()
    const isMobile = getDevice({ headers: header }) == "mobile"
    return isMobile ? <TestimonialsListMobile /> : <TestimonialsList />
}

export default Testimonials