import clsx from 'clsx'
import React from 'react'

function ProductCardSkeleton({ className }: { className?: string }) {
    return (
        <div className={clsx("flex flex-col items-center cursor-pointer m-3", className)}>
            <div className="card card-compact glass min-h-[300px] md:min-h-[500px] overflow-hidden rounded-none shadow-md p-0">
                <div className="w-40 h-40 md:w-80 md:h-80 overflow-hidden relative skeleton rounded-none"></div>
                <div className="card-body items-center w-40 md:w-80">
                    <div className="skeleton h-7 w-full"></div>
                    <div className="skeleton h-4 w-full"></div>
                    <div className="skeleton h-4 w-full"></div>
                    <div className="skeleton h-4 w-1/3"></div>
                </div>
                <div className="card-actions w-full md:justify-end p-0 max-md:hidden skeleton rounded-none h-12"></div>
            </div>
        </div>
    )
}

export default ProductCardSkeleton