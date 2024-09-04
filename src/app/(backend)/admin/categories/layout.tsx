import React from 'react'

const CurrenciesLayout = ({ children, newCategoryModal }: { children: React.ReactNode, newCategoryModal: React.ReactNode }) => {
    return (
        <>
            {children}
            {newCategoryModal}
        </>
    )
}

export default CurrenciesLayout