import getCategoriesWithId from '@/lib/actions/getCategoriesWithId'
import CategoryForm from '@/ui/backend/Forms/CategoryForm'
import RouteModal from '@/ui/frontend/RouteModal'
import React from 'react'

const NewCategoryModal = async ({ params }: { params: { catId: string } }) => {
    const categoryData = await getCategoriesWithId(params.catId)
    return (
        <RouteModal>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
                Enter Category Details
            </h3>
            <CategoryForm category={categoryData} />
        </RouteModal>
    )
}

export default NewCategoryModal