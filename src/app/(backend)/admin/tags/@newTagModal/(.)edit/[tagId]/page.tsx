import getTagWithId from '@/lib/actions/getTagWithId'
import TagForm from '@/ui/backend/Forms/TagForm'
import RouteModal from '@/ui/frontend/RouteModal'
import React from 'react'

const NewCategoryModal = async ({ params }: { params: { tagId: string } }) => {
    const tagData = await getTagWithId(params.tagId)
    return (
        <RouteModal>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
                Enter Tag Details
            </h3>
            <TagForm tagData={tagData} />
        </RouteModal>
    )
}

export default NewCategoryModal