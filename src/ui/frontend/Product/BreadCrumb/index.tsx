'use client'
import capitalize from '@/lib/utilities/capitalize'
import Link from 'next/link'
import React from 'react'
import { useProductContext } from '../../Contexts/ProductContext'

const BreadCrumb = () => {
    const { product } = useProductContext()
    return <div className="flex items-center space-x-2 text-gray-400 text-sm">{[
        { label: "Home", link: "/" },
        { label: product?.productCategory ?? "", link: "/products/category/" + product?.productCategory },
        { label: capitalize(product?.productName ?? ""), link: "#" }
    ].map((crumb, index) => <>
        {
            index > 0 && <span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-4 w-4 text-gray-300 stroke-current"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </span>
        }
        <Link href={crumb.link}><span className="hover:underline hover:text-gray-600 cursor-pointer">{capitalize(crumb.label)}</span></Link></>)}
    </div>
}

export default BreadCrumb