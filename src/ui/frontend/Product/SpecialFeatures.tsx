'use client'
import React from 'react'
import { BsTruck } from 'react-icons/bs'
import { GiSewingNeedle } from 'react-icons/gi'
import { RiCustomerService2Fill } from 'react-icons/ri'
import { TbTruckReturn } from 'react-icons/tb'
import { useProductContext } from '../Contexts/ProductContext'

const SpecialFeatures = () => {
    const { product: productObj } = useProductContext()
    return (
        <div className='my-5 p-4'>
            <div className='grid grid-cols-2 mb-4 gap-5'>
                {
                    productObj?.productFreeDel && <div className='flex items-center'>
                        <BsTruck className='mr-4 h-6 w-6' strokeWidth={0.5} /> Free Deliveries
                    </div>
                }
                {
                    productObj?.productHandCrafted && <div className='flex items-center'>
                        <GiSewingNeedle className='mr-4 h-6 w-6' /> Hand Crafted
                    </div>
                }
                {
                    productObj?.productReturns && <div className='flex items-center'>
                        <TbTruckReturn className='mr-4 h-6 w-6' /> Returns &amp; Replacements
                    </div>
                }
                {
                    productObj?.productCustomizable && <div className='flex items-center'>
                        <RiCustomerService2Fill className='mr-4 h-6 w-6' /> Customizable
                    </div>
                }
            </div>
        </div>
    )
}

export default SpecialFeatures