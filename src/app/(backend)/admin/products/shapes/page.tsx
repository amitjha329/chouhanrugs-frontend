import ShapeList from '@/ui/backend/Tables/ShapeList'
import React from 'react'

const ColorsPage = () => {
    return (
        <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white'>
            <div className='card-body'>
                <ShapeList />
            </div>
        </div>
    )
}

export default ColorsPage