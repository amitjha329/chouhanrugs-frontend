import getCategoriesWithId from '@/lib/actions/getCategoriesWithId'
import CategoryForm from '@/ui/backend/Forms/CategoryForm'
import React from 'react'

const NewCategory = async ({ params }: { params: { catId: string } }) => {
    const categoryData = await getCategoriesWithId(params.catId)
    return (
        <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white max-w-xl mx-auto'>
            <div className='card-body'>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Enter Category Details
                </h3>
                <CategoryForm category={categoryData} />
            </div>
        </div>
    )
}

export default NewCategory