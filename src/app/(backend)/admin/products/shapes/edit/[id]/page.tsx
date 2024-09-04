import getShapeWithId from '@/lib/actions/getShapeWithId'
import ShapeForm from '@/ui/backend/Forms/ShapeForm'
import React from 'react'

const NewColorModal = async ({ params }: { params: { id: string } }) => {
    const shapeData = await getShapeWithId(params.id)
    return (
        <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white max-w-xl mx-auto'>
            <div className='card-body'>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Enter Shape Details
                </h3>
                <ShapeForm shapeData={shapeData} />
            </div>
        </div>
    )
}

export default NewColorModal