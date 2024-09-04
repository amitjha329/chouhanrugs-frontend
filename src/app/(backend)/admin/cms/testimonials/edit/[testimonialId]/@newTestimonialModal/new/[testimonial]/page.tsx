import RouteModal from '@/ui/frontend/RouteModal'
import React from 'react'
import TestimonialForm from '../../../../../../../../../../ui/backend/Forms/TestimonialForm'
import getTestimonialWithId from '@/lib/actions/getTestimonialWithId'

const NewSlideModal = async ({ params }: { params: { testimonial: string } }) => {
    const testimonial = await getTestimonialWithId(params.testimonial)
    return (
        <RouteModal>
            <TestimonialForm testimonial={testimonial} />
        </RouteModal>
    )
}

export default NewSlideModal