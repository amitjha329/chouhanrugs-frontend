import SliderSlideForm from '@/ui/backend/Forms/SliderSlideForm'
import RouteModal from '@/ui/frontend/RouteModal'
import React from 'react'

const NewSlideModal = ({ params }: { params: { slide: string } }) => {
    return (
        <RouteModal>
            <SliderSlideForm slideId={params.slide} />
        </RouteModal>
    )
}

export default NewSlideModal