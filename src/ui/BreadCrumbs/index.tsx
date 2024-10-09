import Link from 'next/link'
import React from 'react'

const BreadCrumbs = ({ crumbs }: { crumbs: { name: string, link: string }[] }) => {
    return (
        <div className='flex space-x-5 text-sm py-5'>
            {crumbs.map((cr, i) => {
                return <>
                    <Link key={cr.link} href={cr.link}>{cr.name}</Link>
                    <span>/</span>
                </>
            })}
        </div>
    )
}

export default BreadCrumbs