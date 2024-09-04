import getPatternWithId from '@/lib/actions/getPatternWithId'
import PatternForm from '@/ui/backend/Forms/PatternForm'
import RouteModal from '@/ui/frontend/RouteModal'
import React from 'react'

const NewColorModal = async ({ params }: { params: { id: string } }) => {
    const patternData = await getPatternWithId(params.id)
    return (
        <RouteModal>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
                Enter Pattern Details
            </h3>
            <PatternForm patternData={patternData} />
        </RouteModal>
    )
}

export default NewColorModal