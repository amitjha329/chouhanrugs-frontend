import getSizeWithId from '@/lib/actions/getSizeWithId'
import SizeForm from '@/ui/backend/Forms/SizeForm'
import RouteModal from '@/ui/frontend/RouteModal'
import React from 'react'

const NewColorModal = async ({ params }: { params: { sizeId: string } }) => {
    const sizeData = await getSizeWithId(params.sizeId)
    return (
        <RouteModal>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
                Enter Size Details
            </h3>
            <SizeForm sizeData={sizeData} />
        </RouteModal>
    )
}

export default NewColorModal