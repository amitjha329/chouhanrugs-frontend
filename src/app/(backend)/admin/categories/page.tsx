import CategoriesList from '@/ui/backend/Tables/CategoriesList'
import React from 'react'

const CategoriesPage = () => {
    return (
        <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white'>
            <div className='card-body'>
                <CategoriesList />
            </div>
        </div>
    )
}

export default CategoriesPage