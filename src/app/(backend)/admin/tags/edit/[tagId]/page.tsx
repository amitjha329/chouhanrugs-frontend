import getTagWithId from '@/lib/actions/getTagWithId'
import TagForm from '@/ui/backend/Forms/TagForm'
import React from 'react'

const NewCategory = async ({ params }: { params: { tagId: string } }) => {
    const tagData = await getTagWithId(params.tagId)
    return (
        <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white max-w-xl mx-auto'>
            <div className='card-body'>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Enter Tag Details
                </h3>
                <TagForm tagData={tagData} />
            </div>
        </div>
    )
}

export default NewCategory