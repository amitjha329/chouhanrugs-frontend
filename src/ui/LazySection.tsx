'use client'
import React, { ReactNode } from 'react'

interface LazySectionProps {
    children: ReactNode
    minHeight?: string
    className?: string
}

/**
 * LazySection - Uses CSS content-visibility to defer rendering work for off-screen content
 * This helps reduce initial rendering cost without affecting SEO (content is still in DOM)
 * Browser will skip style/layout calculations for hidden content until it's about to become visible
 */
const LazySection = ({ 
    children, 
    minHeight = '400px',
    className = ''
}: LazySectionProps) => {
    return (
        <div 
            className={className}
            style={{ 
                contentVisibility: 'auto',
                containIntrinsicSize: `auto ${minHeight}` 
            }}
        >
            {children}
        </div>
    )
}

export default LazySection
