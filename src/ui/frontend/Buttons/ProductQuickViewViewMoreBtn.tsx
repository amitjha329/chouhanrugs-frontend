'use client'
import clsx from 'clsx'
import React from 'react'

const ProductQuickViewViewMoreBtn = ({ className, children }: { className: string, children: React.ReactNode }) => {
    return (
        <button className={clsx('btn', className)} onClick={_ => window.location.reload()}>{children}</button>
    )
}

export default ProductQuickViewViewMoreBtn