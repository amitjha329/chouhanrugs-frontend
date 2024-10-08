import clsx from 'clsx'
import { Reem_Kufi_Ink } from 'next/font/google'
import React from 'react'


const reem_kufi_ink = Reem_Kufi_Ink({
    weight: ["400"],
    subsets: ["latin"],
    variable: "--reem-kufi-ink"
})

const Logo = ({ className, logoClass, taglineClass }: { logoClass?: string, taglineClass?: string, className?: string }) => {
    return (
        <div className={clsx(reem_kufi_ink.className, "uppercase", className)}>
            <p className={clsx('~md/lg:~text-xl/4xl tracking-widest', logoClass)}>Chouhan Rugs</p>
            <p className={clsx(taglineClass)}>Home Decor | Handloom</p>
        </div>
    )
}

export default Logo