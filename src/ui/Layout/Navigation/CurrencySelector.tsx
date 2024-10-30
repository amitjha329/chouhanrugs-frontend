"use client"
import Currency from '@/types/Currency'
import { storeSelectedCurrency } from '@/utils/updateCurrency'
import React from 'react'

const CurrencySelector = ({ children, currency }: { children: React.ReactNode, currency: Currency[] }) => {

    return (
        <div className='dropdown dropdown-hover'>
            <div tabIndex={0} role="button">
                {
                    children
                }
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[60] w-52 p-2 shadow">
                {
                    currency.map(cur => {
                        return <li key={cur.ISO} onClick={e => storeSelectedCurrency(cur)}><a>{cur.currency}</a></li>
                    })
                }
            </ul>
        </div>
    )
}

export default CurrencySelector