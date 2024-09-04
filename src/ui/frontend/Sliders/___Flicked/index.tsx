import FlickedOptions from '@/lib/types/FlickedOptions'
import clsx from 'clsx'
import React from 'react'

type propTypes = {
    initializer: FlickedOptions
    className?: string
    children: React.ReactNode
}

const Flicked = ({ initializer, children, className }: propTypes) => {
    return (
        <div className={clsx("main-carousel", className)} data-flickity={JSON.stringify(initializer)}>
            {children}
        </div>
    )
}

export default Flicked