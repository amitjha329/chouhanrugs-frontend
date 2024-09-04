import getBrandWithId from '@/lib/actions/getBrandWithId'
import BrandForm from '@/ui/backend/Forms/BrandForm'
import React from 'react'

const NewCategory = async ({ params }: { params: { brandId: string } }) => {
    const branddata = await getBrandWithId(params.brandId)
    return (
        <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white max-w-xl mx-auto'>
            <div className='card-body'>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Enter Brand Details
                </h3>
                <BrandForm brandData={branddata} />
            </div>
        </div>
    )
}

export default NewCategory