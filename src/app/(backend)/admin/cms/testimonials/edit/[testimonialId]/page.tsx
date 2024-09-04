import getTestimonialWithId from '@/lib/actions/getTestimonialWithId'
import TestimonialForm from '@/ui/backend/Forms/TestimonialForm'
import React from 'react'

const SliderAdd = async ({ params }: { params: { testimonialId: string } }) => {
    const testimonialData = await getTestimonialWithId(params.testimonialId)
    return (
        <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white card-body'>
            <TestimonialForm testimonial={testimonialData} />
        </div>
    )
}

export default SliderAdd