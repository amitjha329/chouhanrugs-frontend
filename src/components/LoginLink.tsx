'use client'
import React from 'react'
import { Link } from '@/i18n/navigation'

export default function LoginLink({ 
    href = '/signin', 
    className, 
    children 
}: { 
    href?: string; 
    className?: string; 
    children: React.ReactNode 
}) {
    const [cbUrl, setCbUrl] = React.useState('/')

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            // Capture full pathname including locale prefix
            setCbUrl(window.location.pathname)
        }
    }, [])

    const finalHref = `${href}?cb=${encodeURIComponent(cbUrl)}`
    return (
        <Link href={finalHref} className={className}>
            {children}
        </Link>
    )
}
