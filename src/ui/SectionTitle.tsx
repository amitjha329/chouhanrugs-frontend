import clsx from 'clsx'
import React from 'react'

const SectionTitle = ({ className, title, headingTag = 'div' }: { className?: string, title: string, headingTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' }) => {
    const Tag = headingTag
    return (
        <Tag className={clsx('~text-lg/3xl max-w-xl mx-auto font-semibold', className)}>{title}</Tag>
    )
}

export default SectionTitle