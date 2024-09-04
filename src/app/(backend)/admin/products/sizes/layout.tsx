import React from 'react'

const layout = ({ children, newSizeModal }: { children: React.ReactNode, newSizeModal: React.ReactNode }) => {
    return (
        <>
            {children}
            {newSizeModal}
        </>
    )
}

export default layout