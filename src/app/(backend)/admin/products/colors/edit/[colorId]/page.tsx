import getColorsWithId from '@/lib/actions/getColorWithId'
import ColorForm from '@/ui/backend/Forms/ColorForm'
import React from 'react'

const NewColorModal = async ({ params }: { params: { colorId: string } }) => {
    const colorData = await getColorsWithId(params.colorId)
    return (
        <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white max-w-xl mx-auto'>
            <div className='card-body'>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Enter Color Details
                </h3>
                <ColorForm colorData={colorData} />
            </div>
        </div>
    )
}

export default NewColorModal