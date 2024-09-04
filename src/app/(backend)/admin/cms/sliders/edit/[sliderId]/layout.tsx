import React from 'react'

const layout = ({ children, newSlideModal }: { children: React.ReactNode, newSlideModal: React.ReactNode }) => {
    return (
        <>
            {children}
            {newSlideModal}
        </>
    )
}

export default layout