import Link from 'next/link'
import React from 'react'

const PageLinks = () => {
    return (
        <nav className='bg-secondary text-secondary-content font-[500] flex items-center justify-center gap-5 py-2 text-xs' id='page_links'>
            <Link href={'/'} >Home</Link>
            <Link href={'/about-us'} >About Us</Link>
            <Link href={'/contact-us'} >Contact Us</Link>
            <Link href={'/'} >FAQ</Link>
            <Link href={'/blog'} >Blogs</Link>
            <Link href={'/policies'} >Policies</Link>
            <Link href={'/terms'} >T&C</Link>
        </nav>
    )
}

export default PageLinks