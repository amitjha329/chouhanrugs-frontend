import getBrandWithId from '@/lib/actions/getBrandWithId'
import BrandForm from '@/ui/backend/Forms/BrandForm'
import RouteModal from '@/ui/frontend/RouteModal'
import React from 'react'

const NewCategoryModal = async ({ params }: { params: { brandId: string } }) => {
    const brandData = await getBrandWithId(params.brandId)
    return (
        <RouteModal>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
                Enter Brand Details
            </h3>
            <BrandForm brandData={brandData} />
        </RouteModal>
    )
}

export default NewCategoryModal