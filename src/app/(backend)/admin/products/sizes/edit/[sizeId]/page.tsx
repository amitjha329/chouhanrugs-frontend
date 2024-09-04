import getSizeWithId from '@/lib/actions/getSizeWithId'
import SizeForm from '@/ui/backend/Forms/SizeForm'
import React from 'react'

const NewColorModal = async ({ params }: { params: { sizeId: string } }) => {
    const sizeData = await getSizeWithId(params.sizeId)
    return (
        <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white max-w-xl mx-auto'>
            <div className='card-body'>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Enter Size Details
                </h3>
                <SizeForm sizeData={sizeData} />
            </div>
        </div>
    )
}

export default NewColorModal