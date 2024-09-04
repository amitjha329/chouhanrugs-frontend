import getCurrencyWithId from '@/lib/actions/getCurrencyWithId'
import CurrencyForm from '@/ui/backend/Forms/CurrencyForm'
import RouteModal from '@/ui/frontend/RouteModal'
import React from 'react'

const NewCategoryModal = async ({ params }: { params: { currencyId: string } }) => {
    const currency = await getCurrencyWithId(params.currencyId)
    return (
        <RouteModal>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
                Enter Category Details
            </h3>
            <CurrencyForm currency={currency} />
        </RouteModal>
    )
}

export default NewCategoryModal