import React from 'react'

const layout = ({ children, newTestimonialModal }: { children: React.ReactNode, newTestimonialModal: React.ReactNode }) => {
    return (
        <>
            {children}
            {newTestimonialModal}
        </>
    )
}

export default layout