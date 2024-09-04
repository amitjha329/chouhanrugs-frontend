import PatternList from '@/ui/backend/Tables/PatternList'
import React from 'react'

const ColorsPage = () => {
    return (
        <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white'>
            <div className='card-body'>
                <PatternList />
            </div>
        </div>
    )
}

export default ColorsPage