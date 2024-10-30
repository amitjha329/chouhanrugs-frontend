import clsx from 'clsx'
import React from 'react'

const SectionTitle = ({ className, title }: { className?: string, title: string }) => {
    return (
        <div className={clsx('~text-lg/3xl max-w-xl mx-auto font-semibold', className)}>{title}</div>
    )
}

export default SectionTitle