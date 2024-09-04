import getShapeWithId from '@/lib/actions/getShapeWithId'
import ShapeForm from '@/ui/backend/Forms/ShapeForm'
import RouteModal from '@/ui/frontend/RouteModal'
import React from 'react'

const NewColorModal = async ({ params }: { params: { id: string } }) => {
    const shapeData = await getShapeWithId(params.id)
    return (
        <RouteModal>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
                Enter Shape Details
            </h3>
            <ShapeForm shapeData={shapeData} />
        </RouteModal>
    )
}

export default NewColorModal