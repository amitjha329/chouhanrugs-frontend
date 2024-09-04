import React from 'react'
import BulkMailForm from './BulkMailForm'

const BulkEmail = () => {
    return (
        <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white mt-4'>
            <div className='card-body'>
                <div className='card-title'>Bulk Email Form</div>
                <div className='card-body'>
                    <BulkMailForm />
                </div>
            </div>
        </div>
    )
}

export default BulkEmail