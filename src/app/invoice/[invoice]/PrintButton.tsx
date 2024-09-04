'use client'
import React from 'react'
import { FaPrint } from 'react-icons/fa'

export default function PrintButton({className}:{className:string}) {
    return (
        <button onClick={() => print()} className={className}>
            <FaPrint /> Print Invoice
        </button>
    )
}
