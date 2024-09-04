import React from 'react'

const CurrenciesLayout = ({ children, newCurrenciesModal }: { children: React.ReactNode, newCurrenciesModal: React.ReactNode }) => {
    return (
        <>
            {children}
            {newCurrenciesModal}
        </>
    )
}

export default CurrenciesLayout