import TagsList from '@/ui/backend/Tables/TagsList'
import React from 'react'

const TagsPage = () => {
    return (
        <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white'>
            <div className='card-body'>
                <TagsList />
            </div>
        </div>
    )
}

export default TagsPage