import clsx from 'clsx'
import { Reem_Kufi_Ink } from 'next/font/google'
import Link from 'next/link'
import React from 'react'


const reem_kufi_ink = Reem_Kufi_Ink({
    weight: ["400"],
    subsets: ["latin"],
    variable: "--reem-kufi-ink"
})

const Logo = ({ className, logoClass, taglineClass }: { logoClass?: string, taglineClass?: string, className?: string }) => {
    return (
        <a href={'/'} className={clsx(reem_kufi_ink.className, "uppercase", className)}>
            <p className={clsx('~text-lg/4xl tracking-widest', logoClass)}>Chouhan Rugs</p>
            <p className={clsx(taglineClass,'align-middle')}>Home&nbsp;&nbsp;Decor&nbsp;&nbsp;&nbsp;&nbsp;&#124;&nbsp;&nbsp;&nbsp;&nbsp;Handloom</p>
        </a>
    )
}

export default Logo