import getSliderWithId from '@/lib/actions/getSliderWithId'
import SliderForm from '@/ui/backend/Forms/SliderForm'
import React from 'react'

const SliderAdd = async ({ params }: { params: { sliderId: string } }) => {
    const sliderData = await getSliderWithId(Number(params.sliderId))
    return (
        <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white'>
            <SliderForm slider={sliderData} />
        </div>
    )
}

export default SliderAdd