import getPatternWithId from '@/lib/actions/getPatternWithId'
import PatternForm from '@/ui/backend/Forms/PatternForm'
import React from 'react'

const NewColorModal = async ({ params }: { params: { id: string } }) => {
    const patternData = await getPatternWithId(params.id)
    return (
        <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white max-w-xl mx-auto'>
            <div className='card-body'>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Enter Pattern Details
                </h3>
                <PatternForm patternData={patternData} />
            </div>
        </div>
    )
}

export default NewColorModal