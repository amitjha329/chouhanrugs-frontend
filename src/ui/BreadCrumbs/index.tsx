import Link from 'next/link'
import React from 'react'

const BreadCrumbs = ({ crumbs }: { crumbs: { name: string, link: string }[] }) => {
    return (
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-medium py-4 text-[#82766d]">
            {crumbs.map((cr, i) => {
                const isLast = i === crumbs.length - 1
                return (
                    <React.Fragment key={cr.link}>
                        {isLast ? (
                            <span className="text-[#6c4624] font-semibold">{cr.name}</span>
                        ) : (
                            <Link href={cr.link} className="hover:text-[#6c4624] transition-colors">
                                {cr.name}
                            </Link>
                        )}
                        {!isLast && <span className="text-gray-400 font-normal mx-1">&gt;</span>}
                    </React.Fragment>
                )
            })}
        </nav>
    )
}

export default BreadCrumbs