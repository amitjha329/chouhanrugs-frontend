import getColorsWithId from '@/lib/actions/getColorWithId'
import ColorForm from '@/ui/backend/Forms/ColorForm'
import RouteModal from '@/ui/frontend/RouteModal'
import React from 'react'

const NewColorModal = async ({ params }: { params: { colorId: string } }) => {
    const colorData = await getColorsWithId(params.colorId)
    return (
        <RouteModal>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
                Enter Color Details
            </h3>
            <ColorForm colorData={colorData} />
        </RouteModal>
    )
}

export default NewColorModal