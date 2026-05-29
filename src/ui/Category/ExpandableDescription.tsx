'use client'

import { useId, useState } from 'react'

type ExpandableDescriptionProps = {
    text: string
    className?: string
}

const ExpandableDescription = ({ text, className = '' }: ExpandableDescriptionProps) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const descriptionId = useId()
    const shouldShowToggle = text.trim().length > 140

    return (
        <div>
            <p
                id={descriptionId}
                className={`${className} ${isExpanded ? '' : 'line-clamp-3'}`}
            >
                {text}
            </p>
            {shouldShowToggle && (
                <button
                    type="button"
                    aria-controls={descriptionId}
                    aria-expanded={isExpanded}
                    onClick={() => setIsExpanded((current) => !current)}
                    className="mt-2 inline-flex text-[11px] font-bold uppercase tracking-wide text-[#6c4624] underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6c4624]/30"
                >
                    {isExpanded ? 'Read less' : 'Read more'}
                </button>
            )}
        </div>
    )
}

export default ExpandableDescription
