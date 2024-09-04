import getCurrencyWithId from '@/lib/actions/getCurrencyWithId'
import CurrencyForm from '@/ui/backend/Forms/CurrencyForm'
import React from 'react'

const NewCategory = async ({ params }: { params: { currencyId: string } }) => {
    const currency = await getCurrencyWithId(params.currencyId)
    return (
        <div className='card card-normal shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)] bg-white max-w-xl mx-auto'>
            <div className='card-body'>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Enter Category Details
                </h3>
                <CurrencyForm currency={currency} />
            </div>
        </div>
    )
}

export default NewCategory